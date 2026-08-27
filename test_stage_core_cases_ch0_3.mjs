import test from "node:test"
import assert from "node:assert/strict"

import {
  compileSearchScript,
  createInitialStageState,
  evaluateStage12Interrupt,
  evaluateStage13Selection,
  executeSearchProgram,
  runChapter3Batch,
  runStageAction,
  simulateChapter3Scenario,
  simulateStage23Attempt,
} from "./static/stage_core.mjs"

function act(stageId, state, action, payload = {}) {
  return runStageAction(stageId, state, action, payload)
}

function runStage14(decisions) {
  let state = createInitialStageState("1-4")
  for (const decision of decisions) {
    state = act("1-4", state, "set_decision", { decision })
    state = act("1-4", state, "execute_turn")
  }
  return state
}

function diagnose(orderId, causeId) {
  let state = createInitialStageState("2-4")
  state = act("2-4", state, "select_order", { orderId })
  state = act("2-4", state, "set_cause", { causeId })
  return act("2-4", state, "confirm_diagnosis")
}

function compileOk(source) {
  const compiled = compileSearchScript(source)
  assert.equal(compiled.ok, true, compiled.errors.join("\n"))
  return compiled.program
}

function assertFiniteScenario(scenario) {
  const numericValues = Object.values(scenario).filter((value) => typeof value === "number")
  assert.equal(numericValues.every(Number.isFinite), true)
}

test("CH0-01-N01/CH0-01-A01/CH0-01-C01/CH0-01-S01: 注文は一度だけ受け付け、状態と履歴を整合させる", () => {
  let state = createInitialStageState("0-1")
  state = act("0-1", state, "place_order")

  assert.equal(state.orderStatus, "受付済み")
  assert.equal(state.balance, 80)
  assert.equal(state.reserved, 20)
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.timeline.length, 1)

  const once = structuredClone(state)
  state = act("0-1", state, "place_order")
  assert.deepEqual(state, once)
})

test("CH0-02-N01/CH0-02-A01/CH0-02-C01/CH0-02-S01: 注文前処理を拒否し、受付後は一度だけ約定する", () => {
  let state = createInitialStageState("0-2")
  const initial = structuredClone(state)

  state = act("0-2", state, "process_order")
  assert.deepEqual(state, initial)

  state = act("0-2", state, "place_order")
  state = act("0-2", state, "process_order")
  assert.equal(state.orderStatus, "約定済み")
  assert.equal(state.balance, 80)
  assert.equal(state.reserved, 0)
  assert.equal(state.assetA, 10)
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.deepEqual(state.timeline.map((item) => item.label), ["注文受付", "処理開始", "約定"])

  const once = structuredClone(state)
  state = act("0-2", state, "place_order")
  state = act("0-2", state, "process_order")
  assert.deepEqual(state, once)
})

test("CH0-03-N01/CH0-03-A01/CH0-03-C01/CH0-03-S01: キャンセル返金は一度だけ行う", () => {
  let state = createInitialStageState("0-3")
  state = act("0-3", state, "cancel_order")

  assert.equal(state.orderStatus, "キャンセル済み")
  assert.equal(state.balance, 100)
  assert.equal(state.reserved, 0)
  assert.equal(state.refundCount, 1)
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.deepEqual(state.timeline.map((item) => item.label), ["注文受付", "キャンセル", "返金"])

  const once = structuredClone(state)
  state = act("0-3", state, "cancel_order")
  assert.deepEqual(state, once)
})

test("CH0-04-N01/CH0-04-A01/CH0-04-C01/CH0-04-S01/CH0-04-B01/CH0-04-B02: 3種類の確認が揃った時だけ解放する", () => {
  let state = createInitialStageState("0-4")

  state = act("0-4", state, "confirm_focus", { focus: "order" })
  state = act("0-4", state, "confirm_focus", { focus: "order" })
  assert.deepEqual(state.checks, { order: true, status: false, balance: false })
  assert.equal(state.success, false)

  state = act("0-4", state, "confirm_focus", { focus: "status" })
  state = act("0-4", state, "confirm_focus", { focus: "status" })
  assert.equal(Object.values(state.checks).filter(Boolean).length, 2)
  assert.equal(state.success, false)

  state = act("0-4", state, "confirm_focus", { focus: "balance" })
  state = act("0-4", state, "confirm_focus", { focus: "balance" })
  assert.deepEqual(state.checks, { order: true, status: true, balance: true })
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.currentFocusKey, "")
})

test("CH1-11-N01/CH1-11-A01/CH1-11-C01/CH1-11-S01: 受付順と実行順の逆転を一度だけ記録する", () => {
  let state = createInitialStageState("1-1")
  state = act("1-1", state, "run_sequence")

  assert.deepEqual(state.receptionOrder, ["Player", "Rival"])
  assert.deepEqual(state.executionOrder, ["Rival", "Player"])
  assert.equal(state.resultLabel, "順序逆転")
  assert.equal(state.profitDelta, -6)
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.timeline.length, 3)

  const once = structuredClone(state)
  state = act("1-1", state, "run_sequence")
  assert.deepEqual(state, once)
})

test("CH1-12-N01/CH1-12-A01/CH1-12-C01/CH1-12-S01: 成功帯外は再試行でき、成功操作は二重計上しない", () => {
  let failed = createInitialStageState("1-2")
  failed = act("1-2", failed, "interrupt", { progress: 83 })
  assert.equal(failed.success, false)
  assert.equal(failed.attempts, 1)
  assert.deepEqual(failed.executionOrder, ["Player", "Rival", "Interrupt"])

  failed = act("1-2", failed, "retry")
  assert.equal(failed.success, false)
  assert.equal(failed.attempts, 0)

  let state = act("1-2", failed, "interrupt", { progress: 84 })
  assert.equal(state.lastProgress, 84)
  assert.deepEqual(state.executionOrder, ["Player", "Interrupt", "Rival"])
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.timeline.length, 2)

  const once = structuredClone(state)
  state = act("1-2", state, "interrupt", { progress: 92 })
  assert.deepEqual(state, once)
})

for (const [id, input, normalized, expected] of [
  ["CH1-12-B01", 83, 83, false],
  ["CH1-12-B02", 84, 84, true],
  ["CH1-12-B03", 92, 92, true],
  ["CH1-12-B04", 93, 93, false],
  ["CH1-12-B05", -1, 0, false],
  ["CH1-12-B06", 101, 100, false],
]) {
  test(`${id}: 1-2の割り込み境界 ${input}`, () => {
    const result = evaluateStage12Interrupt(input)
    assert.equal(result.progress, normalized)
    assert.equal(result.success, expected)
  })
}

test("CH1-13-N01/CH1-13-A01/CH1-13-C01/CH1-13-S01: 失敗はヒントだけを進め、成功後は再実行しない", () => {
  let failed = createInitialStageState("1-3")
  failed = act("1-3", failed, "set_timing", { timing: 71 })
  failed = act("1-3", failed, "run_selection")
  failed = act("1-3", failed, "run_selection")
  assert.equal(failed.success, false)
  assert.equal(failed.attempts, 2)
  assert.equal(failed.unlockedHints, 2)

  let state = act("1-3", failed, "set_timing", { timing: 72 })
  state = act("1-3", state, "run_selection")
  assert.deepEqual(state.executionOrder, ["Player", "Interrupt", "Rival"])
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.timeline.length, 2)

  const once = structuredClone(state)
  state = act("1-3", state, "run_selection")
  assert.deepEqual(state, once)
})

for (const [id, input, expected] of [
  ["CH1-13-B01", 71, false],
  ["CH1-13-B02", 72, true],
  ["CH1-13-B03", 82, true],
  ["CH1-13-B04", 83, false],
]) {
  test(`${id}: 1-3の選択境界 ${input}`, () => {
    assert.equal(evaluateStage13Selection(input).success, expected)
  })
}

test("CH1-14-N01/CH1-14-C01/CH1-14-S01: 高影響ターンだけを選び3ターン以内に成功する", () => {
  let state = createInitialStageState("1-4")
  for (const decision of ["order", "skip", "order"]) {
    state = act("1-4", state, "set_decision", { decision })
    state = act("1-4", state, "execute_turn")
    const once = structuredClone(state)
    state = act("1-4", state, "execute_turn")
    assert.deepEqual(state, once)
  }

  assert.equal(state.totalProfit, 19)
  assert.equal(state.remainingTurns, 0)
  assert.equal(state.turnLog.length, 3)
  assert.equal(state.timeline.length, 3)
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
})

test("CH1-14-A01: 低影響ターンだけの注文はコスト負けで未達になる", () => {
  const state = runStage14(["skip", "order", "skip"])
  assert.equal(state.totalProfit, -2)
  assert.equal(state.finished, true)
  assert.equal(state.success, false)
})

test("CH1-14-B01: totalProfit=17は目標未達になる", () => {
  const state = runStage14(["order", "order", "order"])
  assert.equal(state.totalProfit, 17)
  assert.equal(state.success, false)
})

test("CH1-14-B02: totalProfit=18ちょうどで成功する", () => {
  let state = createInitialStageState("1-4")
  state.totalProfit = 12
  state = act("1-4", state, "set_decision", { decision: "order" })
  state = act("1-4", state, "execute_turn")
  assert.equal(state.totalProfit, 18)
  assert.equal(state.success, true)
  assert.equal(state.finished, true)
})

test("CH1-14-B03: 3ターン後の4回目操作は結果を追加しない", () => {
  let state = runStage14(["skip", "skip", "skip"])
  const once = structuredClone(state)
  state = act("1-4", state, "set_decision", { decision: "order" })
  state = act("1-4", state, "execute_turn")
  assert.deepEqual(state, once)
  assert.equal(state.remainingTurns, 0)
  assert.equal(state.turnLog.length, 3)
})

test("CH2-21-N01/CH2-21-A01/CH2-21-C01/CH2-21-S01: 正常キャンセルはORD-01を一度だけ返金する", () => {
  let state = createInitialStageState("2-1")
  state = act("2-1", state, "cancel_order")

  assert.equal(state.orderId, "ORD-01")
  assert.equal(state.orderStatus, "返金済み")
  assert.equal(state.refundCount, 1)
  assert.equal(state.balance, 100)
  assert.equal(state.reserved, 0)
  assert.deepEqual(state.flags, { cancelled: true, refunded: true, closed: true })
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.timeline.length, 3)

  const once = structuredClone(state)
  state = act("2-1", state, "cancel_order")
  assert.deepEqual(state, once)
})

test("CH2-22-N01/CH2-22-A01/CH2-22-C01/CH2-22-S01: cancel後だけ再処理でき、二重返金は一度だけ再現する", () => {
  let state = createInitialStageState("2-2")
  const initial = structuredClone(state)
  state = act("2-2", state, "continue_processing")
  assert.deepEqual(state, initial)

  state = act("2-2", state, "cancel_order")
  state = act("2-2", state, "continue_processing")
  assert.equal(state.refundCount, 2)
  assert.equal(state.balance, 120)
  assert.equal(state.referenceCount, 2)
  assert.equal(state.duplicateProcessing, true)
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.timeline.length, 5)

  const once = structuredClone(state)
  state = act("2-2", state, "cancel_order")
  state = act("2-2", state, "continue_processing")
  assert.deepEqual(state, once)
})

test("CH2-23-N01/CH2-23-A01/CH2-23-C01/CH2-23-S01: refund_window×onだけが二重返金になり成功後は冪等", () => {
  let failed = createInitialStageState("2-3")
  failed = act("2-3", failed, "set_replay_timing", { timing: "before_refund" })
  failed = act("2-3", failed, "set_replay_mode", { mode: "on" })
  failed = act("2-3", failed, "run_refund_repro")
  assert.equal(failed.refundCount, 1)
  assert.equal(failed.success, false)

  let state = createInitialStageState("2-3")
  state = act("2-3", state, "set_replay_timing", { timing: "refund_window" })
  state = act("2-3", state, "set_replay_mode", { mode: "on" })
  state = act("2-3", state, "run_refund_repro")
  assert.equal(state.refundCount, 2)
  assert.equal(state.balance, 120)
  assert.equal(state.flags.refundGuard, false)
  assert.equal(state.duplicateProcessing, true)
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.timeline.length, 5)

  const once = structuredClone(state)
  state = act("2-3", state, "run_refund_repro")
  assert.deepEqual(state, once)
})

for (const [id, timing, mode, expectedSuccess] of [
  ["CH2-23-D01", "before_refund", "off", false],
  ["CH2-23-D02", "before_refund", "on", false],
  ["CH2-23-D03", "refund_window", "off", false],
  ["CH2-23-D04", "refund_window", "on", true],
  ["CH2-23-D05", "after_close", "off", false],
  ["CH2-23-D06", "after_close", "on", false],
]) {
  test(`${id}: ${timing}×${mode}の返金決定表`, () => {
    const result = simulateStage23Attempt(timing, mode)
    assert.equal(result.success, expectedSuccess)
    assert.equal(result.refundCount, expectedSuccess ? 2 : 1)
    assert.equal(result.flags.refundGuard, !expectedSuccess)
  })
}

test("CH2-24-N01/CH2-24-A01/CH2-24-C01/CH2-24-S01: 異常注文と原因が両方正しい時だけ診断成功する", () => {
  const failed = diagnose("ORD-A", "rounding_bug")
  assert.equal(failed.success, false)
  assert.equal(failed.nextUnlocked, false)
  assert.deepEqual(failed.orders, createInitialStageState("2-4").orders)

  let state = diagnose("ORD-B", "missing_refund_guard")
  assert.equal(state.diagnosisResult, "特定成功")
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)

  const once = structuredClone(state)
  state = act("2-4", state, "confirm_diagnosis")
  assert.deepEqual(state, once)
})

for (const [id, orderId, causeId, expectedSuccess, expectedResult] of [
  ["CH2-24-D01", "ORD-B", "missing_refund_guard", true, "特定成功"],
  ["CH2-24-D02", "ORD-A", "missing_refund_guard", false, "注文IDが違う"],
  ["CH2-24-D03", "ORD-C", "missing_refund_guard", false, "注文IDが違う"],
  ["CH2-24-D04", "ORD-B", "queue_leftover", false, "原因が違う"],
  ["CH2-24-D05", "ORD-B", "rounding_bug", false, "原因が違う"],
]) {
  test(`${id}: ${orderId}×${causeId}の診断決定表`, () => {
    const state = diagnose(orderId, causeId)
    assert.equal(state.success, expectedSuccess)
    assert.equal(state.diagnosisResult, expectedResult)
    assert.equal(state.orders.find((order) => order.id === orderId).id, orderId)
  })
}

test("CH3-31-N01/CH3-31-A01/CH3-31-C01/CH3-31-S01: 丸め差分を有限値で計算し、再計算しても結果を増やさない", () => {
  const scenario = simulateChapter3Scenario({ amount: 3, splitCount: 1, repeatCount: 1 })
  assert.equal(scenario.theoreticalSingle, 1.005)
  assert.equal(scenario.batchRoundedSingle, 1.01)
  assert.equal(scenario.roundingDeltaSingle, 0.005)

  const normalized = simulateChapter3Scenario({ amount: 7, splitCount: 0, repeatCount: 9 })
  assert.deepEqual(
    { amount: normalized.amount, splitCount: normalized.splitCount, repeatCount: normalized.repeatCount },
    { amount: 6, splitCount: 1, repeatCount: 8 }
  )
  assertFiniteScenario(normalized)

  let state = createInitialStageState("3-1")
  state = act("3-1", state, "calculate_rounding")
  const once = structuredClone(state.scenario)
  state = act("3-1", state, "calculate_rounding")
  assert.deepEqual(state.scenario, once)
  state = act("3-1", state, "compare_values")
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
})

test("CH3-32-N01/CH3-32-A01/CH3-32-C01/CH3-32-S01: split=4は利益差を生み、split=1は上乗せしない", () => {
  const noSplit = simulateChapter3Scenario({ amount: 3, splitCount: 1, repeatCount: 1 })
  assert.equal(noSplit.splitActualSingle, noSplit.batchRoundedSingle)
  assert.equal(noSplit.splitGainSingle, 0)

  let state = createInitialStageState("3-2")
  state = act("3-2", state, "set_split_count", { splitCount: 4 })
  state = act("3-2", state, "run_split_compare")
  const once = structuredClone(state.scenario)
  state = act("3-2", state, "run_split_compare")
  assert.deepEqual(state.scenario, once)
  assert.equal(state.scenario.splitActualSingle, 1.04)
  assert.equal(state.scenario.splitGainSingle, 0.03)

  state = act("3-2", state, "compare_batch")
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
})

test("CH3-33-N01/CH3-33-A01/CH3-33-C01/CH3-33-S01: 各クリックを別trialとして記録し、最大差分をbestにする", () => {
  let state = createInitialStageState("3-3")
  state = act("3-3", state, "set_split_count", { splitCount: 0 })
  state = act("3-3", state, "set_repeat_count", { repeatCount: 9 })
  assert.equal(state.splitCount, 1)
  assert.equal(state.repeatCount, 8)

  state = act("3-3", state, "run_optimization_trial")
  state = act("3-3", state, "run_optimization_trial")
  assert.equal(state.attempts, 2)
  assert.equal(state.trialHistory.length, 2)
  assert.deepEqual(
    state.trialHistory.map(({ splitCount, repeatCount, cumulativeDelta }) => ({ splitCount, repeatCount, cumulativeDelta })),
    [
      { splitCount: 1, repeatCount: 8, cumulativeDelta: 0 },
      { splitCount: 1, repeatCount: 8, cumulativeDelta: 0 },
    ]
  )

  state = act("3-3", state, "set_split_count", { splitCount: 12 })
  state = act("3-3", state, "run_optimization_trial")
  assert.equal(state.bestTrial.splitCount, 12)
  assert.equal(state.bestTrial.cumulativeDelta >= state.targetDelta, true)
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
})

test("CH3-34-N01/CH3-34-A01/CH3-34-C01/CH3-34-S01: batchは空・重複・範囲外候補を安全に扱い最大値を選ぶ", () => {
  const empty = runChapter3Batch([])
  assert.deepEqual(empty.rows, [])
  assert.equal(empty.bestTrial, null)

  const normalized = runChapter3Batch([
    { splitCount: 4, repeatCount: 3, amount: 3 },
    { splitCount: 4, repeatCount: 3, amount: 3 },
    { splitCount: 13, repeatCount: 9, amount: 7 },
  ])
  assert.equal(normalized.rows.length, 3)
  assert.deepEqual(
    normalized.rows.map(({ splitCount, repeatCount, amount }) => ({ splitCount, repeatCount, amount })),
    [
      { splitCount: 4, repeatCount: 3, amount: 3 },
      { splitCount: 4, repeatCount: 3, amount: 3 },
      { splitCount: 12, repeatCount: 8, amount: 6 },
    ]
  )
  assert.equal(
    normalized.bestTrial.cumulativeDelta,
    Math.max(...normalized.rows.map((row) => row.cumulativeDelta))
  )

  let state = createInitialStageState("3-4")
  state = act("3-4", state, "set_search_split", { splitCount: 12 })
  state = act("3-4", state, "set_search_repeat", { repeatCount: 8 })
  state = act("3-4", state, "add_candidate")
  state = act("3-4", state, "run_batch_search")
  assert.equal(state.bestTrial.cumulativeDelta, Math.max(...state.trialHistory.map((row) => row.cumulativeDelta)))
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)

  const firstBest = state.bestTrial.cumulativeDelta
  state = act("3-4", state, "run_batch_search")
  assert.equal(state.batchRunCount, 2)
  assert.equal(state.trialHistory.length, state.candidates.length)
  assert.equal(state.bestTrial.cumulativeDelta, firstBest)
})

for (const [id, field, input, normalized] of [
  ["CH3-NUM-SP01", "splitCount", 0, 1],
  ["CH3-NUM-SP02", "splitCount", 1, 1],
  ["CH3-NUM-SP03", "splitCount", 12, 12],
  ["CH3-NUM-SP04", "splitCount", 13, 12],
  ["CH3-NUM-RE01", "repeatCount", 0, 1],
  ["CH3-NUM-RE02", "repeatCount", 1, 1],
  ["CH3-NUM-RE03", "repeatCount", 8, 8],
  ["CH3-NUM-RE04", "repeatCount", 9, 8],
  ["CH3-NUM-AM01", "amount", 0, 1],
  ["CH3-NUM-AM02", "amount", 1, 1],
  ["CH3-NUM-AM03", "amount", 6, 6],
  ["CH3-NUM-AM04", "amount", 7, 6],
]) {
  test(`${id}: ${field}=${input}を有効範囲へ正規化する`, () => {
    const scenario = simulateChapter3Scenario({ [field]: input })
    assert.equal(scenario[field], normalized)
    assertFiniteScenario(scenario)
  })
}

for (const [id, param, value] of [
  ["CH3-SC-01", "split", 1],
  ["CH3-SC-02", "split", 12],
  ["CH3-SC-05", "repeat", 1],
  ["CH3-SC-06", "repeat", 8],
  ["CH3-SC-09", "amount", 1],
  ["CH3-SC-10", "amount", 6],
]) {
  test(`${id}: Search Consoleは${param}=${value}を実行できる`, () => {
    const result = executeSearchProgram(compileOk(`set ${param} ${value}\nrun`))
    assert.equal(result.params[param], value)
    assert.equal(result.trialHistory.length, 1)
  })
}

for (const [id, param, value, message] of [
  ["CH3-SC-03", "split", 0, /split must be between 1 and 12/],
  ["CH3-SC-04", "split", 13, /split must be between 1 and 12/],
  ["CH3-SC-07", "repeat", 0, /repeat count must be between 1 and 8/],
  ["CH3-SC-08", "repeat", 9, /repeat count must be between 1 and 8/],
  ["CH3-SC-11", "amount", 0, /amount must be between 1 and 6/],
  ["CH3-SC-12", "amount", 7, /amount must be between 1 and 6/],
]) {
  test(`${id}: Search Consoleは${param}=${value}を部分結果なしで拒否する`, () => {
    const program = compileOk(`set ${param} ${value}\nrun`)
    assert.throws(() => executeSearchProgram(program), message)
  })
}

test("CH3-SC-13: repeat blockは上限20回を実行できる", () => {
  const result = executeSearchProgram(compileOk("repeat 20 { run }"))
  assert.equal(result.trialHistory.length, 20)
})

for (const [id, source, message] of [
  ["CH3-SC-14", "repeat 21 { run }", /repeat count must be between 1 and 20/],
  ["CH3-SC-15", "for split in 5..2 { run }", /range start must be <= range end/],
  ["CH3-SC-16", "set foo 1", /unknown parameter 'foo'/],
  ["CH3-SC-17", "set split x", /unknown variable 'x'/],
]) {
  test(`${id}: Search Consoleは不正構文をコンパイル時に拒否する`, () => {
    const compiled = compileSearchScript(source)
    assert.equal(compiled.ok, false)
    assert.match(compiled.errors.join("\n"), message)
    assert.equal(compiled.program, null)
  })
}

test("CH3-SC-LIM01: 400命令は完走する", () => {
  const program = compileOk(Array.from({ length: 400 }, () => "run").join("\n"))
  const result = executeSearchProgram(program)
  assert.equal(result.trialHistory.length, 400)
})

test("CH3-SC-LIM02: 401命令目で停止する", () => {
  const program = compileOk(Array.from({ length: 401 }, () => "run").join("\n"))
  assert.throws(() => executeSearchProgram(program), /execution limit exceeded/)
})
