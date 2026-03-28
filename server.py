import asyncio
import json
import mimetypes
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict

from debug_dex_game import run_game


ROOT = Path(__file__).parent
STATIC_DIR = ROOT / "static"


def sample_orders() -> Dict[str, Any]:
    return {
        "orders": [
            {
                "order_id": "l1",
                "user_id": "player",
                "kind": "limit",
                "side": "buy",
                "pair": "A/B",
                "amount": 10,
                "price": 1.2,
                "timestamp": 1700000000000,
                "nonce": 1,
                "gas_price": 50,
            },
            {
                "order_id": "l2",
                "user_id": "maker",
                "kind": "limit",
                "side": "sell",
                "pair": "A/B",
                "amount": 10,
                "price": 1.1,
                "timestamp": 1700000000000,
                "nonce": 2,
                "gas_price": 49,
            },
            {
                "order_id": "c1",
                "kind": "cancel",
                "target_order_id": "l1",
                "timestamp": 1700000000000,
                "nonce": 3,
                "gas_price": 48,
                "amount": 0,
            },
            {
                "order_id": "m1",
                "user_id": "player",
                "kind": "market",
                "side": "sell",
                "pair": "A/B",
                "amount": 0.0000000013,
                "price": 1.0,
                "timestamp": 1700000000001,
                "nonce": 4,
                "gas_price": 51,
            },
            {
                "order_id": "m2",
                "user_id": "player",
                "kind": "market",
                "side": "sell",
                "pair": "B/C",
                "amount": 0.0000000013,
                "price": 1.0,
                "timestamp": 1700000000002,
                "nonce": 5,
                "gas_price": 51,
            },
            {
                "order_id": "m3",
                "user_id": "player",
                "kind": "market",
                "side": "sell",
                "pair": "C/A",
                "amount": 0.0000000013,
                "price": 1.0,
                "timestamp": 1700000000003,
                "nonce": 6,
                "gas_price": 51,
            },
        ]
    }


class GameHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload: Dict[str, Any], status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, file_path: Path) -> None:
        if not file_path.exists() or not file_path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return
        data = file_path.read_bytes()
        mime, _ = mimetypes.guess_type(str(file_path))
        self.send_response(200)
        self.send_header("Content-Type", mime or "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:
        if self.path == "/":
            self._send_file(STATIC_DIR / "index.html")
            return
        if self.path == "/api/sample":
            self._send_json(sample_orders())
            return
        if self.path.startswith("/static/"):
            rel = self.path[len("/static/") :]
            requested = (STATIC_DIR / rel).resolve()
            if STATIC_DIR.resolve() not in requested.parents and requested != STATIC_DIR.resolve():
                self.send_error(HTTPStatus.FORBIDDEN, "Forbidden")
                return
            self._send_file(requested)
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not found")

    def do_POST(self) -> None:
        if self.path != "/api/run":
            self.send_error(HTTPStatus.NOT_FOUND, "Not found")
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length > 0 else b"{}"
        try:
            payload = json.loads(raw.decode("utf-8"))
            orders = payload.get("orders", [])
            algo = str(payload.get("algo", "greedy"))
            leverage = float(payload.get("leverage", 1.0))
        except Exception as exc:
            self._send_json({"error": f"invalid payload: {exc}"}, status=400)
            return

        try:
            batch = json.dumps({"orders": orders}, ensure_ascii=False)
            result = asyncio.run(run_game(batch, algo=algo, leverage=leverage))
        except Exception as exc:
            self._send_json({"error": f"execution failed: {exc}"}, status=500)
            return

        self._send_json(result)

    def log_message(self, fmt: str, *args: Any) -> None:
        return


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 8080), GameHandler)
    print("Serving on http://127.0.0.1:8080")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
