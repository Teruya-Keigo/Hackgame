import json
import unittest

from debug_dex_game import run_game


class DebugDexGameTests(unittest.IsolatedAsyncioTestCase):
    async def test_double_refund_case_returns_timeline_and_diff(self):
        base_ts = 1700000001000
        payload = {
            "orders": [
                {
                    "order_id": "buy1",
                    "user_id": "player",
                    "kind": "limit",
                    "side": "buy",
                    "pair": "A/B",
                    "amount": 8,
                    "price": 1.2,
                    "timestamp": base_ts,
                    "nonce": 1,
                    "gas_price": 80,
                },
                {
                    "order_id": "cancel1",
                    "user_id": "player",
                    "kind": "cancel",
                    "side": "buy",
                    "pair": "A/B",
                    "amount": 0,
                    "price": 1,
                    "target_order_id": "buy1",
                    "timestamp": base_ts + 1,
                    "nonce": 2,
                    "gas_price": 79,
                },
                {
                    "order_id": "cancel2",
                    "user_id": "player",
                    "kind": "cancel",
                    "side": "buy",
                    "pair": "A/B",
                    "amount": 0,
                    "price": 1,
                    "target_order_id": "buy1",
                    "timestamp": base_ts + 1,
                    "nonce": 3,
                    "gas_price": 78,
                },
            ]
        }

        result = await run_game(json.dumps(payload))

        self.assertGreater(result["bugs"]["double_refund"], 0)
        self.assertTrue(result["timeline"])
        self.assertIn("state_diff", result)
        self.assertTrue(any(event["anomaly"] for event in result["timeline"]))
        self.assertTrue(
            any("player/B" in entry["label"] for entry in result["state_diff"]["reserved"])
        )

    async def test_queue_jump_case_marks_anomaly(self):
        base_ts = 1700000002000
        payload = {
            "orders": [
                {
                    "order_id": "old_buy",
                    "user_id": "player",
                    "kind": "limit",
                    "side": "buy",
                    "pair": "A/B",
                    "amount": 12,
                    "price": 1.2,
                    "timestamp": base_ts,
                    "nonce": 1,
                    "gas_price": 40,
                },
                {
                    "order_id": "new_buy",
                    "user_id": "player",
                    "kind": "limit",
                    "side": "buy",
                    "pair": "A/B",
                    "amount": 12,
                    "price": 1.2,
                    "timestamp": base_ts,
                    "nonce": 2,
                    "gas_price": 95,
                },
                {
                    "order_id": "sell1",
                    "user_id": "maker",
                    "kind": "limit",
                    "side": "sell",
                    "pair": "A/B",
                    "amount": 12,
                    "price": 1.1,
                    "timestamp": base_ts,
                    "nonce": 3,
                    "gas_price": 70,
                },
            ]
        }

        result = await run_game(json.dumps(payload))

        self.assertGreater(result["bugs"]["queue_jump"], 0)
        self.assertTrue(
            any("順番すり抜け" in event["summary"] for event in result["timeline"])
        )
        self.assertTrue(
            any(entry["label"] == "異常フラグ queue_jump" for entry in result["state_diff"]["bug_flags"])
        )

    async def test_penny_case_includes_actual_summary_and_balance_delta(self):
        base_ts = 1700000003000
        payload = {
            "orders": [
                {
                    "order_id": "m1",
                    "user_id": "player",
                    "kind": "market",
                    "side": "sell",
                    "pair": "A/B",
                    "amount": 1.0000000013,
                    "price": 1,
                    "timestamp": base_ts,
                    "nonce": 1,
                    "gas_price": 61,
                },
                {
                    "order_id": "m2",
                    "user_id": "player",
                    "kind": "market",
                    "side": "sell",
                    "pair": "B/C",
                    "amount": 1.0000000013,
                    "price": 1,
                    "timestamp": base_ts + 1,
                    "nonce": 2,
                    "gas_price": 61,
                },
                {
                    "order_id": "m3",
                    "user_id": "player",
                    "kind": "market",
                    "side": "sell",
                    "pair": "C/A",
                    "amount": 1.0000000013,
                    "price": 1,
                    "timestamp": base_ts + 2,
                    "nonce": 3,
                    "gas_price": 61,
                },
            ]
        }

        result = await run_game(json.dumps(payload))

        self.assertGreater(result["bugs"]["penny"], 0)
        self.assertTrue(any("小数スワップ" in line for line in result["actual_summary"]))
        self.assertTrue(
            any(entry["label"] == "残高 player/A" for entry in result["state_diff"]["balances"])
        )


if __name__ == "__main__":
    unittest.main()
