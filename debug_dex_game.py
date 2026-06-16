import asyncio
import json
import math
from dataclasses import dataclass, field
from decimal import Decimal, getcontext
from typing import Any, Dict, List, Optional, Set, Tuple


getcontext().prec = 40


TOKENS = ("A", "B", "C")
PAIRS = ("A/B", "B/C", "C/A")
EPSILON = 1e-12


def _round_number(value: float, digits: int = 12) -> float:
    value = float(value)
    if math.isnan(value) or math.isinf(value):
        return value
    return round(value, digits)


def _json_safe(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(k): _json_safe(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_json_safe(v) for v in value]
    if isinstance(value, tuple):
        return [_json_safe(v) for v in value]
    if isinstance(value, float):
        return _round_number(value)
    return value


def _snapshot_token_map(values: Dict[str, Dict[str, float]]) -> Dict[str, Dict[str, float]]:
    out: Dict[str, Dict[str, float]] = {}
    for user_id in sorted(values):
        out[user_id] = {}
        for token in sorted(values[user_id]):
            out[user_id][token] = _round_number(values[user_id][token])
    return out


def _snapshot_orderbook(orderbook: Dict[str, List["Order"]]) -> Dict[str, List[str]]:
    return {pair: [order.order_id for order in orderbook.get(pair, [])] for pair in PAIRS}


def _build_state_snapshot(engine: "DexEngine") -> Dict[str, Any]:
    return {
        "balances": _snapshot_token_map(engine.balances),
        "reserved": _snapshot_token_map(engine.reserved),
        "order_state": {order_id: engine.order_state[order_id] for order_id in sorted(engine.order_state)},
        "orderbook": _snapshot_orderbook(engine.orderbook),
        "orderbook_depth": {pair: len(engine.orderbook.get(pair, [])) for pair in PAIRS},
        "bug_flags": {key: int(engine.bug_flags[key]) for key in sorted(engine.bug_flags)},
    }


def _build_token_diff(
    category: str,
    title: str,
    before: Dict[str, Dict[str, float]],
    after: Dict[str, Dict[str, float]],
) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for user_id in sorted(set(before) | set(after)):
        before_user = before.get(user_id, {})
        after_user = after.get(user_id, {})
        for token in sorted(set(before_user) | set(after_user)):
            old_value = float(before_user.get(token, 0.0))
            new_value = float(after_user.get(token, 0.0))
            delta = new_value - old_value
            if abs(delta) <= EPSILON:
                continue
            out.append(
                {
                    "id": f"{category}:{user_id}:{token}",
                    "category": category,
                    "label": f"{title} {user_id}/{token}",
                    "before": _round_number(old_value),
                    "after": _round_number(new_value),
                    "delta": _round_number(delta),
                    "direction": "up" if delta > 0 else "down",
                }
            )
    return out


def _build_state_value_diff(
    category: str,
    title: str,
    before: Dict[str, Any],
    after: Dict[str, Any],
    *,
    default_before: Any,
    default_after: Any,
) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for key in sorted(set(before) | set(after)):
        old_value = before.get(key, default_before)
        new_value = after.get(key, default_after)
        if old_value == new_value:
            continue
        out.append(
            {
                "id": f"{category}:{key}",
                "category": category,
                "label": f"{title} {key}",
                "before": old_value,
                "after": new_value,
            }
        )
    return out


def _build_count_diff(
    category: str,
    title: str,
    before: Dict[str, int],
    after: Dict[str, int],
) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for key in sorted(set(before) | set(after)):
        old_value = int(before.get(key, 0))
        new_value = int(after.get(key, 0))
        delta = new_value - old_value
        if delta == 0:
            continue
        out.append(
            {
                "id": f"{category}:{key}",
                "category": category,
                "label": f"{title} {key}",
                "before": old_value,
                "after": new_value,
                "delta": delta,
                "direction": "up" if delta > 0 else "down",
            }
        )
    return out


def _build_orderbook_diff(before: Dict[str, List[str]], after: Dict[str, List[str]]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for pair in PAIRS:
        before_ids = before.get(pair, [])
        after_ids = after.get(pair, [])
        if before_ids == after_ids:
            continue
        out.append(
            {
                "id": f"orderbook:{pair}",
                "category": "orderbook",
                "label": f"板 {pair}",
                "before": before_ids,
                "after": after_ids,
            }
        )
    return out


def _summarize_actual_outcome(
    bug_flags: Dict[str, int],
    before_state: Dict[str, Any],
    after_state: Dict[str, Any],
) -> List[str]:
    lines: List[str] = []

    if bug_flags.get("double_refund", 0) > 0:
        player_reserved_b = after_state.get("reserved", {}).get("player", {}).get("B", 0.0)
        lines.append(
            f"返金が重なり、player/B の予約残高が {player_reserved_b} まで下がりました。"
        )
    if bug_flags.get("queue_jump", 0) > 0:
        lines.append("本来先着の注文より後続注文が優先され、処理順が入れ替わりました。")
    if bug_flags.get("penny", 0) > 0:
        player_a_before = before_state.get("balances", {}).get("player", {}).get("A", 0.0)
        player_a_after = after_state.get("balances", {}).get("player", {}).get("A", 0.0)
        lines.append(
            "小数スワップに微小ボーナスが混入し、反復後の資産が本来より増えました。"
            f" player/A は {player_a_before} -> {player_a_after}。"
        )
    if bug_flags.get("race", 0) > 0:
        lines.append("キャンセル済みの注文がなお約定に使われ、内部状態に競合が残りました。")
    if bug_flags.get("overflow", 0) > 0:
        lines.append("安全チェックで数値が壊れ、NaN/inf 経路が発火しました。")
    if lines:
        return lines

    player_before = before_state.get("balances", {}).get("player", {})
    player_after = after_state.get("balances", {}).get("player", {})
    deltas = []
    for token in TOKENS:
        delta = float(player_after.get(token, 0.0)) - float(player_before.get(token, 0.0))
        if abs(delta) <= EPSILON:
            continue
        sign = "+" if delta > 0 else ""
        deltas.append(f"{token} {sign}{_round_number(delta)}")

    if deltas:
        return [f"異常フラグは立たず、残高は通常処理の範囲で変化しました（{', '.join(deltas)}）。"]
    return ["異常フラグは立たず、見える状態差分もほぼありませんでした。"]


def _build_state_diff(
    before_state: Dict[str, Any],
    after_state: Dict[str, Any],
    score_value: str,
) -> Dict[str, Any]:
    balances = _build_token_diff(
        "balances",
        "残高",
        before_state.get("balances", {}),
        after_state.get("balances", {}),
    )
    reserved = _build_token_diff(
        "reserved",
        "予約残高",
        before_state.get("reserved", {}),
        after_state.get("reserved", {}),
    )
    order_state = _build_state_value_diff(
        "order_state",
        "注文状態",
        before_state.get("order_state", {}),
        after_state.get("order_state", {}),
        default_before="未作成",
        default_after="未作成",
    )
    orderbook = _build_orderbook_diff(
        before_state.get("orderbook", {}),
        after_state.get("orderbook", {}),
    )
    bug_flags = _build_count_diff(
        "bug_flags",
        "異常フラグ",
        before_state.get("bug_flags", {}),
        after_state.get("bug_flags", {}),
    )
    orderbook_depth = _build_count_diff(
        "orderbook_depth",
        "板件数",
        before_state.get("orderbook_depth", {}),
        after_state.get("orderbook_depth", {}),
    )

    return {
        "balances": balances,
        "reserved": reserved,
        "order_state": order_state,
        "orderbook": orderbook,
        "orderbook_depth": orderbook_depth,
        "bug_flags": bug_flags,
        "score": [
            {
                "id": "validator_score",
                "category": "score",
                "label": "脆弱性スコア",
                "before": "0",
                "after": score_value,
            }
        ],
        "changed_total": len(balances) + len(reserved) + len(order_state) + len(orderbook) + len(orderbook_depth) + len(bug_flags),
        "highlights": [],
    }


@dataclass
class Order:
    order_id: str
    user_id: str
    kind: str  # "limit" | "market" | "cancel"
    side: str  # "buy" | "sell"
    pair: str
    amount: float
    price: float
    timestamp: int
    nonce: int
    gas_price: float
    target_order_id: Optional[str] = None


@dataclass
class DexEngine:
    balances: Dict[str, Dict[str, float]] = field(default_factory=dict)
    orderbook: Dict[str, List[Order]] = field(default_factory=lambda: {p: [] for p in PAIRS})
    reserved: Dict[str, Dict[str, float]] = field(default_factory=dict)
    order_state: Dict[str, str] = field(default_factory=dict)
    order_by_id: Dict[str, Order] = field(default_factory=dict)
    cancelled_once: Set[str] = field(default_factory=set)
    queue_jump_marks: Set[str] = field(default_factory=set)
    debug_log: List[str] = field(default_factory=list)
    structured_events: List[Dict[str, Any]] = field(default_factory=list)
    submitted_orders: List[Dict[str, Any]] = field(default_factory=list)
    initial_state: Dict[str, Any] = field(default_factory=dict)
    final_state: Dict[str, Any] = field(default_factory=dict)
    event_seq: int = 0
    bug_flags: Dict[str, int] = field(
        default_factory=lambda: {
            "double_refund": 0,
            "queue_jump": 0,
            "penny": 0,
            # legacy counters kept for compatibility with older clients/logics
            "rounding": 0,
            "race": 0,
            "overflow": 0,
        }
    )

    def __post_init__(self) -> None:
        if not self.balances:
            self.balances = {
                "player": {"A": 1000.0, "B": 1000.0, "C": 1000.0},
                "maker": {"A": 100000.0, "B": 100000.0, "C": 100000.0},
            }
        if not self.reserved:
            self.reserved = {"player": {"A": 0.0, "B": 0.0, "C": 0.0}, "maker": {"A": 0.0, "B": 0.0, "C": 0.0}}

    def _log(self, msg: str) -> None:
        self.debug_log.append(msg)

    def _emit_event(
        self,
        *,
        phase: str,
        actor: str,
        action: str,
        target: str,
        result: str,
        order: Optional[Order] = None,
        summary: str,
        anomaly: bool = False,
        details: Optional[Dict[str, Any]] = None,
        timestamp: Optional[int] = None,
    ) -> None:
        self.event_seq += 1
        self.structured_events.append(
            {
                "step": self.event_seq,
                "phase": phase,
                "actor": actor,
                "action": action,
                "target": target,
                "result": result,
                "summary": summary,
                "anomaly": anomaly,
                "timestamp": order.timestamp if order is not None else timestamp,
                "order_id": order.order_id if order is not None else None,
                "pair": order.pair if order is not None else None,
                "details": _json_safe(details or {}),
            }
        )

    def _serialize_order(self, order: Order) -> Dict[str, Any]:
        return {
            "order_id": order.order_id,
            "user_id": order.user_id,
            "kind": order.kind,
            "side": order.side,
            "pair": order.pair,
            "amount": _round_number(order.amount),
            "price": _round_number(order.price),
            "timestamp": order.timestamp,
            "nonce": order.nonce,
            "gas_price": _round_number(order.gas_price),
            "target_order_id": order.target_order_id,
        }

    def _describe_submission(self, order: Order) -> str:
        if order.kind == "cancel":
            return f"{order.user_id} が {order.target_order_id or '不明注文'} のキャンセルを送信"
        if order.kind == "limit":
            side_text = "買い" if order.side == "buy" else "売り"
            return f"{order.user_id} が {order.pair} に {side_text}指値を送信"
        return f"{order.user_id} が {order.pair} に成行スワップを送信"

    def _split_pair(self, pair: str) -> Tuple[str, str]:
        base, quote = pair.split("/")
        return base, quote

    def _ensure_user(self, user_id: str) -> None:
        if user_id not in self.balances:
            self.balances[user_id] = {"A": 0.0, "B": 0.0, "C": 0.0}
            self.reserved[user_id] = {"A": 0.0, "B": 0.0, "C": 0.0}

    def _reserve_limit_funds(self, order: Order) -> bool:
        base, quote = self._split_pair(order.pair)
        if order.side == "buy":
            need = order.amount * order.price
            token = quote
        else:
            need = order.amount
            token = base

        bal = self.balances[order.user_id][token]
        if bal < need:
            self._log(
                f"[reserve] insufficient user={order.user_id} token={token} "
                f"have={bal:.18f} need={need:.18f} order={order.order_id}"
            )
            self._emit_event(
                phase="engine",
                actor=order.user_id,
                action="reserve",
                target=token,
                result="残高不足で拒否",
                order=order,
                summary=f"{order.order_id} の資金ロックに失敗しました。",
                details={"have": bal, "need": need},
            )
            return False

        self.balances[order.user_id][token] -= need
        self.reserved[order.user_id][token] += need
        self._log(
            f"[reserve] ok user={order.user_id} token={token} locked={need:.18f} "
            f"bal={self.balances[order.user_id][token]:.18f} res={self.reserved[order.user_id][token]:.18f}"
        )
        self._emit_event(
            phase="engine",
            actor=order.user_id,
            action="reserve",
            target=token,
            result=f"{_round_number(need)} をロック",
            order=order,
            summary=f"{order.order_id} 用に {token} を確保しました。",
            details={
                "locked": need,
                "balance_after": self.balances[order.user_id][token],
                "reserved_after": self.reserved[order.user_id][token],
            },
        )
        return True

    def _release_limit_funds(self, order: Order) -> None:
        base, quote = self._split_pair(order.pair)
        if order.side == "buy":
            amount = order.amount * order.price
            token = quote
        else:
            amount = order.amount
            token = base

        self.reserved[order.user_id][token] -= amount
        self.balances[order.user_id][token] += amount
        self._log(
            f"[refund] user={order.user_id} token={token} amount={amount:.18f} "
            f"bal={self.balances[order.user_id][token]:.18f} res={self.reserved[order.user_id][token]:.18f}"
        )
        self._emit_event(
            phase="engine",
            actor=order.user_id,
            action="refund",
            target=token,
            result=f"{_round_number(amount)} を返金",
            order=order,
            summary=f"{order.order_id} のロック資金を返金しました。",
            details={
                "refund": amount,
                "balance_after": self.balances[order.user_id][token],
                "reserved_after": self.reserved[order.user_id][token],
            },
        )

        # Deliberate bug detector: refund called twice for same reserve window.
        if self.reserved[order.user_id][token] < -1e-9:
            self.bug_flags["double_refund"] += 1
            self._log(
                f"[refund-bug] double refund detected user={order.user_id} token={token} "
                f"reserved_negative={self.reserved[order.user_id][token]:.18f}"
            )
            self._emit_event(
                phase="engine",
                actor=order.user_id,
                action="anomaly",
                target=token,
                result="二重返金",
                order=order,
                summary=f"{order.order_id} の返金が重なり、予約残高が負になりました。",
                anomaly=True,
                details={"reserved_after": self.reserved[order.user_id][token]},
            )

    def _unsafe_risk_check(self, amount: float, leverage: float) -> float:
        # Intentionally unstable boundary calculation.
        notional = amount * leverage * 1_000_000_000.0
        risk_value = math.log(max(notional, 1.0)) * (leverage ** 14)

        if amount > 1e150 and leverage >= 1e8:
            # Deliberate overflow-to-NaN bug path.
            risk_value = float("inf") - float("inf")
            self.bug_flags["overflow"] += 1
            self._log("[overflow-bug] inf-inf triggered, risk=NaN")
            self._emit_event(
                phase="engine",
                actor="risk-check",
                action="anomaly",
                target="risk",
                result="inf-inf",
                summary="安全チェックで overflow 経路が発火しました。",
                anomaly=True,
                details={"amount": amount, "leverage": leverage},
            )

        if math.isnan(risk_value):
            self._log("[overflow-bug] NaN detected, fallback to -1.0 (invalid sign flip)")
            return -1.0
        if math.isinf(risk_value):
            self._log("[overflow] +inf risk seen, clamping to huge number")
            return 1e309
        return risk_value

    def _swap_rate(self, pair: str) -> float:
        # Slightly inconsistent fixed rates to allow cumulative drift.
        rates = {"A/B": 1.0000000007, "B/C": 1.0000000005, "C/A": 1.0000000004}
        return rates[pair]

    def _market_swap(self, user_id: str, pair: str, amount: float, order: Order) -> float:
        base, quote = self._split_pair(pair)
        rate = self._swap_rate(pair)

        if self.balances[user_id][base] < amount:
            self._log(
                f"[market] insufficient base user={user_id} pair={pair} "
                f"amount={amount:.18f} have={self.balances[user_id][base]:.18f}"
            )
            self._emit_event(
                phase="engine",
                actor=user_id,
                action="market_swap",
                target=pair,
                result="残高不足",
                order=order,
                summary=f"{pair} の成行スワップは残高不足で不成立でした。",
                details={"have": self.balances[user_id][base], "need": amount},
            )
            return 0.0

        self.balances[user_id][base] -= amount
        out = amount * rate
        out = round(out, 12)  # Intentional precision loss.
        fee = out * 0.001
        out_after_fee = out - fee

        # Deliberate hidden exploit for exact tiny amount or human-friendly magic value.
        if abs(amount - 0.0000000013) < 1e-15 or abs(amount - 1.0000000013) < 1e-12:
            out_after_fee += 1e-10
            self.bug_flags["penny"] += 1
            self.bug_flags["rounding"] += 1
            self._log(
                f"[penny-bug] epsilon bonus injected pair={pair} amount={amount:.18f} bonus=1e-10"
            )
            self._emit_event(
                phase="engine",
                actor=user_id,
                action="anomaly",
                target=pair,
                result="小数ボーナス混入",
                order=order,
                summary=f"{pair} の成行スワップに 1e-10 のボーナスが混入しました。",
                anomaly=True,
                details={"amount": amount, "bonus": 1e-10},
            )

        self.balances[user_id][quote] += out_after_fee
        self._log(
            f"[market] user={user_id} {base}->{quote} in={amount:.18f} rate={rate:.12f} "
            f"out_raw={out:.18f} out_fee={out_after_fee:.18f}"
        )
        self._emit_event(
            phase="engine",
            actor=user_id,
            action="market_swap",
            target=pair,
            result=f"{base}->{quote} 交換",
            order=order,
            summary=f"{pair} を成行で交換しました。",
            details={
                "amount_in": amount,
                "amount_out": out_after_fee,
                "balance_after_base": self.balances[user_id][base],
                "balance_after_quote": self.balances[user_id][quote],
            },
        )
        return out_after_fee

    async def _place_limit(self, order: Order, leverage: float) -> None:
        self._ensure_user(order.user_id)
        risk = self._unsafe_risk_check(order.amount, leverage)
        self._log(f"[limit] risk_check order={order.order_id} risk={risk}")
        self._emit_event(
            phase="engine",
            actor=order.user_id,
            action="risk_check",
            target=order.order_id,
            result=f"risk={risk}",
            order=order,
            summary=f"{order.order_id} の安全チェックを実行しました。",
            details={"risk": risk},
        )

        if not self._reserve_limit_funds(order):
            self.order_state[order.order_id] = "rejected"
            self._emit_event(
                phase="engine",
                actor=order.user_id,
                action="limit_open",
                target=order.pair,
                result="拒否",
                order=order,
                summary=f"{order.order_id} は残高不足で板に入りませんでした。",
                details={"state": "rejected"},
            )
            return

        self.order_state[order.order_id] = "open"
        self.order_by_id[order.order_id] = order
        self.orderbook[order.pair].append(order)
        self._log(
            f"[limit] open order={order.order_id} pair={order.pair} side={order.side} "
            f"amount={order.amount:.18f} price={order.price:.18f}"
        )
        self._emit_event(
            phase="engine",
            actor=order.user_id,
            action="limit_open",
            target=order.pair,
            result="板に追加",
            order=order,
            summary=f"{order.order_id} が板に載りました。",
            details={"state": "open", "side": order.side, "amount": order.amount, "price": order.price},
        )

        # Intentionally race-prone: no lock, yields before match.
        await asyncio.sleep(0)
        await self._try_match(order.pair)

    async def _place_market(self, order: Order) -> None:
        self._ensure_user(order.user_id)
        risk = self._unsafe_risk_check(order.amount, leverage=1.0)
        self._log(f"[market] risk_check order={order.order_id} risk={risk}")
        self._emit_event(
            phase="engine",
            actor=order.user_id,
            action="risk_check",
            target=order.order_id,
            result=f"risk={risk}",
            order=order,
            summary=f"{order.order_id} の安全チェックを実行しました。",
            details={"risk": risk},
        )
        self._market_swap(order.user_id, order.pair, order.amount, order)

    async def _cancel(self, order: Order) -> None:
        target_id = order.target_order_id or ""
        target = self.order_by_id.get(target_id)
        if not target:
            self._log(f"[cancel] missing target={target_id} cancel_id={order.order_id}")
            self._emit_event(
                phase="engine",
                actor=order.user_id,
                action="cancel",
                target=target_id or "不明注文",
                result="対象なし",
                order=order,
                summary=f"{order.order_id} は存在しない注文をキャンセルしようとしました。",
            )
            return

        # Anti-pattern: stale check + yield creates race.
        current = self.order_state.get(target_id, "unknown")
        if current == "open":
            await asyncio.sleep(0)
            self.order_state[target_id] = "cancelled"
            self.cancelled_once.add(target_id)
            self._release_limit_funds(target)
            self._log(f"[cancel] done target={target_id}")
            self._emit_event(
                phase="engine",
                actor=order.user_id,
                action="cancel",
                target=target_id,
                result="キャンセル成立",
                order=order,
                summary=f"{target_id} のキャンセルが成立しました。",
                details={"state_after": "cancelled"},
            )
        else:
            self._log(f"[cancel] skipped target={target_id} state={current}")
            self._emit_event(
                phase="engine",
                actor=order.user_id,
                action="cancel",
                target=target_id,
                result=f"スキップ ({current})",
                order=order,
                summary=f"{target_id} は既に {current} のためキャンセルできませんでした。",
                details={"state": current},
            )

    async def _try_match(self, pair: str) -> None:
        orders = self.orderbook[pair]
        buys = [o for o in orders if o.side == "buy"]
        sells = [o for o in orders if o.side == "sell"]
        if not buys or not sells:
            return

        # Intentionally simplistic and unsafe: first-first match only.
        b = buys[0]
        s = sells[0]
        if b.price < s.price:
            self._emit_event(
                phase="engine",
                actor="matcher",
                action="match",
                target=pair,
                result="価格不一致で未約定",
                order=b,
                summary=f"{pair} は板が交差せず約定しませんでした。",
                details={"buy_price": b.price, "sell_price": s.price},
            )
            return

        # Deliberate queue-order bug: older nonce can be skipped by ordering/gas side-effects.
        buy_nonce_candidates = [o.nonce for o in buys if o.timestamp == b.timestamp]
        if len(buy_nonce_candidates) >= 2 and b.nonce > min(buy_nonce_candidates):
            marker = f"buy:{pair}:{b.timestamp}:{min(buy_nonce_candidates)}->{b.nonce}"
            if marker not in self.queue_jump_marks:
                self.queue_jump_marks.add(marker)
                self.bug_flags["queue_jump"] += 1
                self._log(
                    f"[queue-jump-bug] buy queue bypass detected pair={pair} chosen_nonce={b.nonce} "
                    f"expected_nonce={min(buy_nonce_candidates)}"
                )
                self._emit_event(
                    phase="engine",
                    actor="matcher",
                    action="anomaly",
                    target=pair,
                    result="queue jump",
                    order=b,
                    summary=f"{pair} の買い注文で順番すり抜けが起きました。",
                    anomaly=True,
                    details={"chosen_nonce": b.nonce, "expected_nonce": min(buy_nonce_candidates)},
                )
        sell_nonce_candidates = [o.nonce for o in sells if o.timestamp == s.timestamp]
        if len(sell_nonce_candidates) >= 2 and s.nonce > min(sell_nonce_candidates):
            marker = f"sell:{pair}:{s.timestamp}:{min(sell_nonce_candidates)}->{s.nonce}"
            if marker not in self.queue_jump_marks:
                self.queue_jump_marks.add(marker)
                self.bug_flags["queue_jump"] += 1
                self._log(
                    f"[queue-jump-bug] sell queue bypass detected pair={pair} chosen_nonce={s.nonce} "
                    f"expected_nonce={min(sell_nonce_candidates)}"
                )
                self._emit_event(
                    phase="engine",
                    actor="matcher",
                    action="anomaly",
                    target=pair,
                    result="queue jump",
                    order=s,
                    summary=f"{pair} の売り注文で順番すり抜けが起きました。",
                    anomaly=True,
                    details={"chosen_nonce": s.nonce, "expected_nonce": min(sell_nonce_candidates)},
                )

        qty = min(b.amount, s.amount)
        base, quote = self._split_pair(pair)
        trade_value = qty * s.price

        # Bug: does not re-check cancelled after yield.
        b_before = self.order_state.get(b.order_id, "unknown")
        s_before = self.order_state.get(s.order_id, "unknown")
        await asyncio.sleep(0)

        self.reserved[b.user_id][quote] -= trade_value
        self.balances[b.user_id][base] += qty
        self.reserved[s.user_id][base] -= qty
        self.balances[s.user_id][quote] += trade_value

        self.order_state[b.order_id] = "filled"
        self.order_state[s.order_id] = "filled"

        self._log(
            f"[match] pair={pair} buy={b.order_id} sell={s.order_id} qty={qty:.18f} "
            f"value={trade_value:.18f} b_state={self.order_state.get(b.order_id)} "
            f"s_state={self.order_state.get(s.order_id)}"
        )

        race_triggered = False
        if b_before == "cancelled" or s_before == "cancelled":
            race_triggered = True
            self.bug_flags["race"] += 1
            self._log(
                f"[race-bug] cancelled-before-match detected buy_before={b_before} sell_before={s_before}"
            )
        elif b.order_id in self.cancelled_once or s.order_id in self.cancelled_once:
            race_triggered = True
            self.bug_flags["race"] += 1
            self._log(
                f"[race-bug] cancel-history-match detected buy_cancelled={b.order_id in self.cancelled_once} "
                f"sell_cancelled={s.order_id in self.cancelled_once}"
            )

        self._emit_event(
            phase="engine",
            actor="matcher",
            action="match",
            target=pair,
            result="約定",
            order=b,
            summary=f"{pair} で {b.order_id} と {s.order_id} が約定しました。",
            anomaly=race_triggered,
            details={
                "buy_order_id": b.order_id,
                "sell_order_id": s.order_id,
                "qty": qty,
                "trade_value": trade_value,
                "buy_state_before": b_before,
                "sell_state_before": s_before,
            },
        )

        if race_triggered:
            self._emit_event(
                phase="engine",
                actor="matcher",
                action="anomaly",
                target=pair,
                result="cancel/race",
                order=b,
                summary=f"{pair} の約定時にキャンセル競合が残っていました。",
                anomaly=True,
                details={"buy_state_before": b_before, "sell_state_before": s_before},
            )

        # Remove matched orders if present.
        self.orderbook[pair] = [o for o in orders if o.order_id not in (b.order_id, s.order_id)]

    def _reorder_batch(self, batch: List[Order], algo: str) -> List[Order]:
        if algo == "greedy":
            # High gas first, then timestamp.
            return sorted(batch, key=lambda o: (-o.gas_price, o.timestamp, o.nonce))
        if algo == "pairwise":
            # Pair-cluster first, then nonce.
            return sorted(batch, key=lambda o: (o.pair, o.timestamp, o.nonce))
        if algo == "simulated_annealing":
            # Fake annealing: intentionally unstable ordering by sin(timestamp).
            return sorted(batch, key=lambda o: (math.sin(o.timestamp), -o.gas_price, o.nonce))
        return sorted(batch, key=lambda o: (o.timestamp, o.nonce))

    async def process_batch(
        self,
        batch_json: str,
        *,
        algo: str = "greedy",
        leverage: float = 1.0,
    ) -> Dict[str, Any]:
        self.structured_events = []
        self.submitted_orders = []
        self.event_seq = 0
        self.initial_state = _build_state_snapshot(self)

        raw = json.loads(batch_json)
        incoming = raw.get("orders", [])
        parsed: List[Order] = []

        for i, item in enumerate(incoming):
            parsed.append(
                Order(
                    order_id=item.get("order_id", f"o{i}"),
                    user_id=item.get("user_id", "player"),
                    kind=item.get("kind", "market"),
                    side=item.get("side", "buy"),
                    pair=item.get("pair", "A/B"),
                    amount=float(item.get("amount", 0.0)),
                    price=float(item.get("price", 1.0)),
                    timestamp=int(item.get("timestamp", 0)),
                    nonce=int(item.get("nonce", i)),
                    gas_price=float(item.get("gas_price", 0.0)),
                    target_order_id=item.get("target_order_id"),
                )
            )

        ordered = self._reorder_batch(parsed, algo)
        self.submitted_orders = [self._serialize_order(order) for order in ordered]
        self._log(f"[batch] size={len(ordered)} algo={algo} leverage={leverage}")
        self._emit_event(
            phase="engine",
            actor="dispatcher",
            action="batch_start",
            target=f"{len(ordered)} orders",
            result="処理開始",
            summary=f"バッチ処理を開始しました。algo={algo}, leverage={leverage}",
            details={"size": len(ordered), "algo": algo, "leverage": leverage},
        )

        # Group by same millisecond timestamp to provoke races.
        grouped: Dict[int, List[Order]] = {}
        for o in ordered:
            grouped.setdefault(o.timestamp, []).append(o)

        for ts in sorted(grouped):
            tasks = []
            same_ts_orders = grouped[ts]
            self._log(f"[batch] dispatch ts={ts} count={len(same_ts_orders)}")
            self._emit_event(
                phase="engine",
                actor="dispatcher",
                action="dispatch",
                target=f"ts={ts}",
                result=f"{len(same_ts_orders)} 件",
                summary=f"同時刻 {ts} の注文 {len(same_ts_orders)} 件を投入します。",
                details={"timestamp": ts, "count": len(same_ts_orders)},
                timestamp=ts,
            )

            for o in same_ts_orders:
                self._emit_event(
                    phase="external",
                    actor=o.user_id,
                    action=o.kind,
                    target=o.target_order_id or o.pair,
                    result="送信",
                    order=o,
                    summary=self._describe_submission(o),
                    details={"side": o.side, "amount": o.amount, "price": o.price, "gas_price": o.gas_price},
                )
                if o.kind == "limit":
                    tasks.append(asyncio.create_task(self._place_limit(o, leverage=leverage)))
                elif o.kind == "market":
                    tasks.append(asyncio.create_task(self._place_market(o)))
                elif o.kind == "cancel":
                    tasks.append(asyncio.create_task(self._cancel(o)))
                else:
                    self._log(f"[batch] unknown kind={o.kind} order={o.order_id}")
                    self._emit_event(
                        phase="engine",
                        actor="dispatcher",
                        action="unknown",
                        target=o.order_id,
                        result="未対応",
                        order=o,
                        summary=f"{o.order_id} は未知の kind={o.kind} でした。",
                    )
            if tasks:
                await asyncio.gather(*tasks)

        self.final_state = _build_state_snapshot(self)
        return {
            "balances": self.balances,
            "reserved": self.reserved,
            "order_state": self.order_state,
            "bug_flags": self.bug_flags,
            "debug_log": self.debug_log,
            "timeline": self.structured_events,
            "state_before": self.initial_state,
            "state_after": self.final_state,
        }


@dataclass
class Validator:
    engine: DexEngine

    def score(self) -> Dict[str, Any]:
        # Uses Decimal only in scoring output while engine remains float-based.
        bug_flags = self.engine.bug_flags
        score = Decimal(0)
        score += Decimal(bug_flags["double_refund"]) * Decimal("220")
        score += Decimal(bug_flags["queue_jump"]) * Decimal("150")
        score += Decimal(bug_flags["penny"]) * Decimal("35")

        hints: List[str] = []
        if bug_flags["double_refund"] > 0:
            hints.append("同じ注文IDに cancel を同時刻で重ねると、返金が二重化しやすい。")
        if bug_flags["queue_jump"] > 0:
            hints.append("同じ timestamp(ms) で nonce が若い注文と高gas注文を衝突させる。")
        if bug_flags["penny"] > 0:
            hints.append("数量 1.0000000013 の小数取引を繰り返すと小銭が増幅する。")
        if not hints:
            hints.append("同時刻注文・cancel重ね・小数量ループの3系統を順番に試す。")

        before_state = self.engine.initial_state or _build_state_snapshot(self.engine)
        after_state = self.engine.final_state or _build_state_snapshot(self.engine)
        actual_summary = _summarize_actual_outcome(bug_flags, before_state, after_state)
        state_diff = _build_state_diff(before_state, after_state, str(score))
        state_diff["highlights"] = actual_summary

        return {
            "score": str(score),
            "bugs": dict(bug_flags),
            "hints": hints,
            "log_tail": self.engine.debug_log[-25:],
            "timeline": self.engine.structured_events,
            "state_before": before_state,
            "state_after": after_state,
            "state_diff": state_diff,
            "actual_summary": actual_summary,
            "submitted_orders": self.engine.submitted_orders,
        }


async def run_game(batch_json: str, algo: str = "greedy", leverage: float = 1.0) -> Dict[str, Any]:
    engine = DexEngine()
    await engine.process_batch(batch_json, algo=algo, leverage=leverage)
    return Validator(engine).score()


if __name__ == "__main__":
    sample = {
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

    result = asyncio.run(run_game(json.dumps(sample), algo="greedy", leverage=1e8))
    print(json.dumps(result, indent=2, ensure_ascii=False))
