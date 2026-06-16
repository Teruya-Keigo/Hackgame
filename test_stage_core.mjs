import test from "node:test"
import assert from "node:assert/strict"

import {
  compileSearchScript,
  executeSearchProgram,
  createInitialSearchConsoleState,
  createInitialStageState,
  evaluateStage12Interrupt,
  evaluateStage13Selection,
  runChapter3Batch,
  runStageAction,
  simulateChapter3Scenario,
  simulateStage23Attempt,
  simulateStage14Turn,
} from "./static/stage_core.mjs"

test("stage 0-2 requires order before processing", () => {
  let state = createInitialStageState("0-2")
  state = runStageAction("0-2", state, "process_order")
  assert.equal(state.orderStatus, "未注文")
  state = runStageAction("0-2", state, "place_order")
  state = runStageAction("0-2", state, "process_order")
  assert.equal(state.orderStatus, "約定済み")
  assert.equal(state.assetA, 10)
  assert.equal(state.success, true)
})

test("stage 0-3 cancel restores balance and refunds once", () => {
  let state = createInitialStageState("0-3")
  state = runStageAction("0-3", state, "cancel_order")
  assert.equal(state.balance, 100)
  assert.equal(state.reserved, 0)
  assert.equal(state.refundCount, 1)
  assert.equal(state.success, true)
})

test("stage 0-4 unlocks next only after all three checks", () => {
  let state = createInitialStageState("0-4")
  assert.equal(state.currentFocusKey, "order")
  state = runStageAction("0-4", state, "confirm_focus", { focus: "order" })
  assert.equal(state.currentFocusKey, "status")
  assert.equal(state.success, false)
  state = runStageAction("0-4", state, "confirm_focus", { focus: "status" })
  state = runStageAction("0-4", state, "confirm_focus", { focus: "balance" })
  assert.equal(state.success, true)
  assert.equal(state.nextUnlocked, true)
  assert.equal(state.currentFocusKey, "")
})

test("stage 1-2 interrupt only succeeds in the narrow window", () => {
  const fail = evaluateStage12Interrupt(73)
  const success = evaluateStage12Interrupt(88)
  assert.equal(fail.success, false)
  assert.equal(success.success, true)
})

test("stage 1-3 unlocks hints after failures and succeeds near the target window", () => {
  let state = createInitialStageState("1-3")
  state.selectedTiming = 40
  state = runStageAction("1-3", state, "run_selection")
  assert.equal(state.unlockedHints, 1)
  state.selectedTiming = 55
  state = runStageAction("1-3", state, "run_selection")
  assert.equal(state.unlockedHints, 2)
  state.selectedTiming = 60
  state = runStageAction("1-3", state, "run_selection")
  assert.deepEqual(state.successWindow, { start: 72, end: 82 })
  const evaluation = evaluateStage13Selection(77)
  assert.equal(evaluation.success, true)
})

test("stage 1-4 rewards selective entries instead of every turn", () => {
  const lowImpact = simulateStage14Turn(
    { grossProfit: 1, orderCost: 3 },
    "order"
  )
  const highImpact = simulateStage14Turn(
    { grossProfit: 16, orderCost: 3 },
    "order"
  )
  assert.equal(lowImpact.netProfit, -2)
  assert.equal(highImpact.netProfit, 13)
})

test("stage 2-1 creates a single consistent refund baseline", () => {
  let state = createInitialStageState("2-1")
  state = runStageAction("2-1", state, "cancel_order")
  assert.equal(state.orderId, "ORD-01")
  assert.equal(state.refundCount, 1)
  assert.equal(state.balance, 100)
  assert.equal(state.flags.refunded, true)
  assert.equal(state.success, true)
})

test("stage 2-2 shows duplicate refund after reprocessing", () => {
  let state = createInitialStageState("2-2")
  state = runStageAction("2-2", state, "cancel_order")
  assert.equal(state.refundCount, 1)
  assert.equal(state.phase, "after_cancel")
  state = runStageAction("2-2", state, "continue_processing")
  assert.equal(state.refundCount, 2)
  assert.equal(state.balance, 120)
  assert.equal(state.referenceCount, 2)
  assert.equal(state.duplicateProcessing, true)
  assert.equal(state.success, true)
})

test("stage 2-3 only reproduces the anomaly for refund window plus rerun", () => {
  const fail = simulateStage23Attempt("before_refund", "on")
  const success = simulateStage23Attempt("refund_window", "on")
  assert.equal(fail.success, false)
  assert.equal(fail.refundCount, 1)
  assert.equal(success.success, true)
  assert.equal(success.refundCount, 2)
  assert.equal(success.flags.refundGuard, false)
})

test("stage 2-3 unlocks hints after failed attempts and succeeds with the right recipe", () => {
  let state = createInitialStageState("2-3")
  state = runStageAction("2-3", state, "set_replay_mode", { mode: "on" })
  state = runStageAction("2-3", state, "set_replay_timing", { timing: "before_refund" })
  state = runStageAction("2-3", state, "run_refund_repro")
  assert.equal(state.unlockedHints, 1)
  state = runStageAction("2-3", state, "set_replay_timing", { timing: "after_close" })
  state = runStageAction("2-3", state, "run_refund_repro")
  assert.equal(state.unlockedHints, 2)
  state = runStageAction("2-3", state, "set_replay_timing", { timing: "before_refund" })
  state = runStageAction("2-3", state, "run_refund_repro")
  assert.deepEqual(state.revealedRecipe, { timing: "refund_window", mode: "on" })
  state = runStageAction("2-3", state, "set_replay_timing", { timing: "refund_window" })
  state = runStageAction("2-3", state, "run_refund_repro")
  assert.equal(state.success, true)
  assert.equal(state.refundCount, 2)
})

test("stage 2-4 requires the anomalous order and the missing refund guard cause", () => {
  let state = createInitialStageState("2-4")
  state = runStageAction("2-4", state, "select_order", { orderId: "ORD-B" })
  state = runStageAction("2-4", state, "set_cause", { causeId: "missing_refund_guard" })
  state = runStageAction("2-4", state, "confirm_diagnosis")
  assert.equal(state.success, true)
  assert.equal(state.diagnosisResult, "特定成功")
})

test("stage 3-1 scenario shows a small rounding delta", () => {
  const scenario = simulateChapter3Scenario({ splitCount: 1, repeatCount: 1, amount: 3 })
  assert.equal(scenario.theoreticalSingle, 1.005)
  assert.equal(scenario.batchRoundedSingle, 1.01)
  assert.equal(scenario.roundingDeltaSingle, 0.005)
})

test("stage 3-2 split processing can beat the batch baseline", () => {
  const scenario = simulateChapter3Scenario({ splitCount: 4, repeatCount: 1, amount: 3 })
  assert.equal(scenario.batchRoundedSingle, 1.01)
  assert.equal(scenario.splitActualSingle, 1.04)
  assert.equal(scenario.splitGainSingle, 0.03)
})

test("stage 3-3 records trials and reaches the target with good split and repeat", () => {
  let state = createInitialStageState("3-3")
  state = runStageAction("3-3", state, "set_split_count", { splitCount: 5 })
  state = runStageAction("3-3", state, "set_repeat_count", { repeatCount: 3 })
  state = runStageAction("3-3", state, "run_optimization_trial")
  assert.equal(state.trialHistory.length, 1)
  assert.equal(state.bestTrial.splitCount, 5)
  assert.equal(state.success, true)
})

test("stage 3-4 batch search finds a best candidate", () => {
  const result = runChapter3Batch([
    { splitCount: 2, repeatCount: 2, amount: 3 },
    { splitCount: 5, repeatCount: 3, amount: 3 },
  ])
  assert.equal(result.rows.length, 2)
  assert.equal(result.bestTrial.splitCount, 5)
  assert.equal(result.bestTrial.cumulativeDelta >= 0.12, true)
})

test("search console compiles and executes a small exploration script", () => {
  const compiled = compileSearchScript("track best\nfor split in 2..4 {\n  set split split\n  set repeat 3\n  run\n}\nshow best")
  assert.equal(compiled.ok, true)
  const executed = executeSearchProgram(compiled.program, { split: 2, repeat: 1, amount: 3 })
  assert.equal(executed.trialHistory.length, 3)
  assert.equal(executed.bestTrial.splitCount, 4)
  assert.equal(executed.executionLog.some((line) => line.startsWith("show best")), true)
})

test("search console state starts with a sample script", () => {
  const state = createInitialSearchConsoleState()
  assert.equal(typeof state.sourceCode, "string")
  assert.equal(state.sourceCode.includes("set split"), true)
})
