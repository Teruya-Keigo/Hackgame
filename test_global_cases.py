import concurrent.futures
import copy
import http.client
import json
import math
import threading
import unittest
from typing import Any, Dict, Optional, Tuple

from debug_dex_game import DexEngine, run_game
from server import GameHandler, MAX_REQUEST_BODY_BYTES, ThreadingHTTPServer


def order(
    order_id: str,
    *,
    kind: str = "market",
    user_id: str = "player",
    side: str = "sell",
    pair: str = "A/B",
    amount: Any = 1,
    price: Any = 1,
    timestamp: int = 1,
    nonce: int = 1,
    gas_price: Any = 1,
    target_order_id: Optional[str] = None,
) -> Dict[str, Any]:
    result = {
        "order_id": order_id,
        "user_id": user_id,
        "kind": kind,
        "side": side,
        "pair": pair,
        "amount": amount,
        "price": price,
        "timestamp": timestamp,
        "nonce": nonce,
        "gas_price": gas_price,
    }
    if target_order_id is not None:
        result["target_order_id"] = target_order_id
    return result


def double_refund_payload() -> Dict[str, Any]:
    timestamp = 1700000001000
    return {
        "orders": [
            order(
                "buy1",
                kind="limit",
                side="buy",
                amount=8,
                price=1.2,
                timestamp=timestamp,
                nonce=1,
                gas_price=80,
            ),
            order(
                "cancel1",
                kind="cancel",
                side="buy",
                amount=0,
                timestamp=timestamp + 1,
                nonce=2,
                gas_price=79,
                target_order_id="buy1",
            ),
            order(
                "cancel2",
                kind="cancel",
                side="buy",
                amount=0,
                timestamp=timestamp + 1,
                nonce=3,
                gas_price=78,
                target_order_id="buy1",
            ),
        ]
    }


def engine_accounting_state(engine: DexEngine) -> Dict[str, Any]:
    return copy.deepcopy(
        {
            "balances": engine.balances,
            "reserved": engine.reserved,
            "order_state": engine.order_state,
            "orderbook": engine.orderbook,
            "bug_flags": engine.bug_flags,
        }
    )


class GlobalDexEngineCases(unittest.IsolatedAsyncioTestCase):
    async def test_GLOBAL_R02_cancel_match_race_is_flagged_without_negative_accounting(self):
        timestamp = 1700000004000
        payload = {
            "orders": [
                order(
                    "buy",
                    kind="limit",
                    side="buy",
                    amount=10,
                    price=1.2,
                    timestamp=timestamp,
                    nonce=1,
                    gas_price=100,
                ),
                order(
                    "sell",
                    kind="limit",
                    user_id="maker",
                    side="sell",
                    amount=10,
                    price=1.1,
                    timestamp=timestamp,
                    nonce=2,
                    gas_price=90,
                ),
                order(
                    "cancel",
                    kind="cancel",
                    side="buy",
                    amount=0,
                    timestamp=timestamp,
                    nonce=3,
                    gas_price=80,
                    target_order_id="buy",
                ),
            ]
        }

        result = await run_game(json.dumps(payload), algo="greedy")

        self.assertGreater(result["bugs"]["race"], 0)
        self.assertTrue(
            any(
                event["anomaly"] and event["action"] in {"match", "anomaly"}
                for event in result["timeline"]
            )
        )
        for user_balances in result["state_after"]["reserved"].values():
            for token, value in user_balances.items():
                self.assertGreaterEqual(
                    value,
                    0,
                    f"GLOBAL-R02 reserved {token} must not become negative",
                )
        for user_balances in result["state_after"]["balances"].values():
            for token, value in user_balances.items():
                self.assertGreaterEqual(
                    value,
                    0,
                    f"GLOBAL-R02 balance {token} must not become negative",
                )

    async def test_GLOBAL_R04_same_timestamp_and_gas_uses_nonce_tiebreak(self):
        timestamp = 1700000005000
        payload = {
            "orders": [
                order("nonce2", amount=0, timestamp=timestamp, nonce=2, gas_price=50),
                order("nonce1", amount=0, timestamp=timestamp, nonce=1, gas_price=50),
            ]
        }

        first = await run_game(json.dumps(payload), algo="greedy")
        second = await run_game(json.dumps(payload), algo="greedy")

        expected = ["nonce1", "nonce2"]
        self.assertEqual([item["order_id"] for item in first["submitted_orders"]], expected)
        self.assertEqual([item["order_id"] for item in second["submitted_orders"]], expected)

    async def test_GLOBAL_ENG04_normal_orders_leave_all_bug_flags_zero(self):
        payload = {
            "orders": [
                order(
                    "normal-buy",
                    kind="limit",
                    side="buy",
                    amount=5,
                    price=1.1,
                    timestamp=1,
                    nonce=1,
                    gas_price=10,
                )
            ]
        }

        result = await run_game(json.dumps(payload), algo="fifo")
        self.assertTrue(all(value == 0 for value in result["bugs"].values()))

    async def test_GLOBAL_ENG05_empty_orders_are_safe_and_state_preserving(self):
        result = await run_game(json.dumps({"orders": []}))

        self.assertEqual(result["state_before"], result["state_after"])
        self.assertTrue(all(value == 0 for value in result["bugs"].values()))
        self.assertTrue(result["timeline"])

    async def test_GLOBAL_ENG06_duplicate_order_id_is_rejected_before_execution(self):
        payload = {
            "orders": [
                order(
                    "duplicate",
                    kind="limit",
                    side="buy",
                    amount=2,
                    price=1,
                    timestamp=1,
                    nonce=1,
                    gas_price=10,
                ),
                order(
                    "duplicate",
                    kind="limit",
                    side="buy",
                    amount=3,
                    price=1,
                    timestamp=2,
                    nonce=2,
                    gas_price=9,
                ),
            ]
        }

        engine = DexEngine()
        before = engine_accounting_state(engine)
        with self.assertRaisesRegex(ValueError, r"duplicate order_id: duplicate"):
            await engine.process_batch(json.dumps(payload), algo="fifo")
        self.assertEqual(engine_accounting_state(engine), before)

    async def test_GLOBAL_ENG07_missing_cancel_target_cannot_increase_balance(self):
        payload = {
            "orders": [
                order(
                    "missing-cancel",
                    kind="cancel",
                    amount=0,
                    target_order_id="not-found",
                )
            ]
        }

        result = await run_game(json.dumps(payload))
        self.assertEqual(result["state_before"]["balances"], result["state_after"]["balances"])
        self.assertEqual(result["state_before"]["reserved"], result["state_after"]["reserved"])
        self.assertTrue(
            any(event["action"] == "cancel" and event["result"] == "対象なし" for event in result["timeline"])
        )

    async def test_GLOBAL_ENG08_zero_amount_has_no_profit_or_bug_flag(self):
        payload = {"orders": [order("zero", amount=0)]}

        result = await run_game(json.dumps(payload))
        self.assertEqual(result["state_before"]["balances"], result["state_after"]["balances"])
        self.assertTrue(all(value == 0 for value in result["bugs"].values()))

    async def test_GLOBAL_ENG09_negative_amount_is_rejected_before_execution(self):
        payload = {"orders": [order("negative", amount=-5)]}

        engine = DexEngine()
        before = engine_accounting_state(engine)
        with self.assertRaisesRegex(ValueError, r"amount must be non-negative"):
            await engine.process_batch(json.dumps(payload))
        self.assertEqual(engine_accounting_state(engine), before)

    async def test_GLOBAL_ENG10_nonfinite_amount_is_rejected_before_execution(self):
        for label, value in [
            ("NaN token", math.nan),
            ("Infinity token", math.inf),
            ("NaN string", "NaN"),
            ("Infinity string", "Infinity"),
        ]:
            with self.subTest(input=label):
                engine = DexEngine()
                before = engine_accounting_state(engine)
                payload = {"orders": [order(f"bad-{label}", amount=value)]}
                with self.assertRaisesRegex(ValueError, r"non-finite|must be finite"):
                    await engine.process_batch(json.dumps(payload))
                self.assertEqual(engine_accounting_state(engine), before)


class GlobalHttpCases(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), GameHandler)
        cls.port = cls.server.server_address[1]
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=5)

    @classmethod
    def request(
        cls,
        method: str,
        path: str,
        body: Optional[bytes] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Tuple[int, Dict[str, str], bytes]:
        connection = http.client.HTTPConnection("127.0.0.1", cls.port, timeout=10)
        try:
            connection.request(method, path, body=body, headers=headers or {})
            response = connection.getresponse()
            response_body = response.read()
            return response.status, dict(response.getheaders()), response_body
        finally:
            connection.close()

    @classmethod
    def json_request(cls, method: str, path: str, payload: Any) -> Tuple[int, Any]:
        body = payload if isinstance(payload, bytes) else json.dumps(payload).encode("utf-8")
        status, _, response_body = cls.request(
            method,
            path,
            body,
            {"Content-Type": "application/json", "Content-Length": str(len(body))},
        )
        try:
            decoded = json.loads(response_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            decoded = response_body
        return status, decoded

    @classmethod
    def request_with_declared_length(cls, declared_length: str) -> Tuple[int, Any]:
        connection = http.client.HTTPConnection("127.0.0.1", cls.port, timeout=10)
        try:
            connection.putrequest("POST", "/api/run")
            connection.putheader("Content-Type", "application/json")
            connection.putheader("Content-Length", declared_length)
            connection.endheaders()
            response = connection.getresponse()
            body = response.read()
            return response.status, json.loads(body.decode("utf-8"))
        finally:
            connection.close()

    def test_GLOBAL_API01_get_root_returns_index_html(self):
        status, headers, body = self.request("GET", "/")
        self.assertEqual(status, 200)
        self.assertIn("text/html", headers.get("Content-Type", ""))
        self.assertIn(b'class="app-shell"', body)

    def test_GLOBAL_API02_get_sample_returns_valid_order_json(self):
        status, _, body = self.request("GET", "/api/sample")
        payload = json.loads(body.decode("utf-8"))
        self.assertEqual(status, 200)
        self.assertIsInstance(payload["orders"], list)
        self.assertGreater(len(payload["orders"]), 0)

    def test_GLOBAL_API03_get_unknown_returns_404(self):
        status, _, _ = self.request("GET", "/does-not-exist")
        self.assertEqual(status, 404)

    def test_GLOBAL_API04_static_path_traversal_returns_403(self):
        status, _, _ = self.request("GET", "/static/../server.py")
        self.assertEqual(status, 403)

    def test_GLOBAL_API05_post_run_valid_returns_result_timeline_and_diff(self):
        status, payload = self.json_request("POST", "/api/run", {"orders": []})
        self.assertEqual(status, 200)
        self.assertIn("score", payload)
        self.assertIsInstance(payload["timeline"], list)
        self.assertIsInstance(payload["state_diff"], dict)

    def test_GLOBAL_API06_invalid_json_returns_400_error_json(self):
        status, payload = self.json_request("POST", "/api/run", b"{broken")
        self.assertEqual(status, 400)
        self.assertIn("error", payload)

    def test_GLOBAL_API07_missing_orders_is_safe_and_never_500(self):
        status, payload = self.json_request("POST", "/api/run", {})
        self.assertNotEqual(status, 500)
        self.assertIn(status, range(200, 500))
        if status == 200:
            self.assertTrue(all(value == 0 for value in payload["bugs"].values()))

    def test_GLOBAL_API08_nonnumeric_leverage_returns_400(self):
        status, payload = self.json_request(
            "POST", "/api/run", {"orders": [], "leverage": "fast"}
        )
        self.assertEqual(status, 400)
        self.assertIn("error", payload)

    def test_GLOBAL_ENG09_10_invalid_engine_numbers_return_400_at_api_boundary(self):
        for label, amount in [("negative", -1), ("NaN", "NaN"), ("Infinity", "Infinity")]:
            with self.subTest(input=label):
                status, payload = self.json_request(
                    "POST", "/api/run", {"orders": [order(f"bad-{label}", amount=amount)]}
                )
                self.assertEqual(status, 400)
                self.assertIn("error", payload)

    def test_GLOBAL_API09_post_unknown_returns_404(self):
        status, _, _ = self.request("POST", "/unknown", body=b"{}")
        self.assertEqual(status, 404)

    def test_GLOBAL_API10_one_mib_boundary_and_content_length_validation(self):
        prefix = b'{"orders":[],"padding":"'
        suffix = b'"}'
        padding = b"x" * (MAX_REQUEST_BODY_BYTES - len(prefix) - len(suffix))
        at_limit = prefix + padding + suffix
        self.assertEqual(len(at_limit), MAX_REQUEST_BODY_BYTES)

        status, payload = self.json_request("POST", "/api/run", at_limit)
        self.assertEqual(status, 200)
        self.assertIn("timeline", payload)

        status, payload = self.request_with_declared_length(str(MAX_REQUEST_BODY_BYTES + 1))
        self.assertEqual(status, 413)
        self.assertEqual(payload["max_bytes"], MAX_REQUEST_BODY_BYTES)

        for invalid_length in ["not-a-number", "-1"]:
            with self.subTest(content_length=invalid_length):
                status, payload = self.request_with_declared_length(invalid_length)
                self.assertEqual(status, 400)
                self.assertIn("Content-Length", payload["error"])

    def test_GLOBAL_R05_concurrent_posts_do_not_leak_engine_state(self):
        requests = []
        for index in range(4):
            requests.append((f"empty-{index}", {"orders": []}))
            requests.append((f"vulnerable-{index}", double_refund_payload()))

        def send(item):
            label, payload = item
            status, result = self.json_request("POST", "/api/run", payload)
            return label, status, result

        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            results = list(executor.map(send, requests))

        for label, status, result in results:
            self.assertEqual(status, 200, label)
            if label.startswith("empty"):
                self.assertTrue(all(value == 0 for value in result["bugs"].values()), label)
                self.assertEqual(result["state_before"], result["state_after"], label)
            else:
                self.assertGreater(result["bugs"]["double_refund"], 0, label)


if __name__ == "__main__":
    unittest.main()
