import test from "node:test"
import assert from "node:assert/strict"

import {
  STAGE_COUNT,
  calculateScore,
  compileDuelScript,
  compileSearchScript,
  createGameEvent,
  createInitialRuntimeState,
  executeSearchProgram,
  createInitialSearchConsoleState,
  createInitialStageState,
  evaluateStage12Interrupt,
  evaluateStage13Selection,
  getScoreProfileForStage,
  guiPlanToDuelIr,
  reduceEvents,
  resolveActivePlan,
  runChapter3Batch,
  runStageAction,
  simulateAdvancedOption,
  simulateChapter3Scenario,
  simulateDuelRound,
  simulateStage23Attempt,
  simulateStage14Turn,
  validatePlanIR,
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

test("journey includes chapters 4 through 10", () => {
  assert.equal(STAGE_COUNT, 44)
  const firstAdvanced = createInitialStageState("4-1")
  const lastAdvanced = createInitialStageState("10-4")
  assert.equal(firstAdvanced.mode, "advanced")
  assert.equal(lastAdvanced.mode, "advanced")
})

test("common runtime reduces events and calculates a cumulative score", () => {
  const runtimeState = createInitialRuntimeState("8-2")
  const executed = createGameEvent(
    {
      eventType: "strategy.executed",
      actor: "player",
      result: "success",
      tags: ["strategy", "stealth"],
      metadata: { gain: 16, detection: 24, queue: 1, latency: 70, success: true, stealth: true },
    },
    runtimeState
  )
  const completed = createGameEvent(
    {
      eventType: "stage.completed",
      actor: "runtime",
      result: "success",
      stepIndex: 2,
      metadata: { success: true },
    },
    runtimeState
  )
  const reduced = reduceEvents(runtimeState, [executed, completed])
  const score = calculateScore(reduced.historyState.events, reduced, getScoreProfileForStage("8-2"))
  assert.equal(reduced.stageStatus, "completed")
  assert.equal(score.stageId, "8-2")
  assert.equal(score.sourceEventIds.includes(executed.id), true)
  assert.equal(score.normalizedTotal >= 0, true)
  assert.equal(["S", "A", "B", "C", "D"].includes(score.grade), true)
})

test("active plan source rejects stale PlanIR and validates typed params", () => {
  const guiPlan = guiPlanToDuelIr({ id: "gui_balanced", label: "GUI Balanced", steps: [] }, { stageId: "10-2", chapterId: "chapter10" })
  const runtimeState = createInitialRuntimeState("10-2", {
    planSelection: {
      activePlanSource: "gui",
      guiPlan,
      dslPlan: guiPlan,
      staleSources: ["dsl"],
    },
  })
  assert.equal(validatePlanIR(guiPlan, runtimeState).status, "valid")
  assert.equal(guiPlan.actions[0].params.delay.type, "number")
  assert.equal(resolveActivePlan(runtimeState.planSelection).plan.planId, "gui_balanced")
  runtimeState.planSelection.activePlanSource = "dsl"
  const resolvedDsl = resolveActivePlan(runtimeState.planSelection)
  assert.equal(resolvedDsl.plan, null)
  assert.equal(resolvedDsl.diagnostics[0].message.includes("stale"), true)
})

test("stage 4-1 requires both compound cases before comparison succeeds", () => {
  let state = createInitialStageState("4-1")
  state = runStageAction("4-1", state, "run_advanced_option")
  state = runStageAction("4-1", state, "compare_advanced")
  assert.equal(state.success, false)
  state = runStageAction("4-1", state, "select_advanced_option", { optionId: "solo_shift" })
  state = runStageAction("4-1", state, "run_advanced_option")
  state = runStageAction("4-1", state, "select_advanced_option", { optionId: "chain_refund" })
  state = runStageAction("4-1", state, "run_advanced_option")
  state = runStageAction("4-1", state, "compare_advanced")
  assert.equal(state.success, true)
  assert.equal(state.runs.chain_refund.gain > state.runs.solo_shift.gain, true)
})

test("stage 5-2 succeeds after observing both pass and block conditions", () => {
  let state = createInitialStageState("5-2")
  state = runStageAction("5-2", state, "select_advanced_option", { optionId: "quiet_condition" })
  state = runStageAction("5-2", state, "run_advanced_option")
  assert.equal(state.success, false)
  state = runStageAction("5-2", state, "select_advanced_option", { optionId: "burst_condition" })
  state = runStageAction("5-2", state, "run_advanced_option")
  assert.equal(state.success, true)
})

test("stage 4-3 clears by gain inside the action constraint", () => {
  let state = createInitialStageState("4-3")
  state = runStageAction("4-3", state, "select_advanced_option", { optionId: "efficient_chain" })
  state = runStageAction("4-3", state, "run_advanced_option")
  assert.equal(state.success, true)
  assert.equal(state.bestTrial.gain >= 20, true)
  assert.equal(state.bestTrial.blocked, false)
})

test("stage 8-2 models threshold activation and non-activation", () => {
  const under = simulateAdvancedOption("8-2", "under_threshold")
  const over = simulateAdvancedOption("8-2", "over_threshold")
  assert.equal(under.blocked, false)
  assert.equal(over.blocked, true)
  assert.equal(over.detection > under.detection, true)
})

test("advanced stages emit common runtime events and scores", () => {
  let state = createInitialStageState("8-2")
  state = runStageAction("8-2", state, "select_advanced_option", { optionId: "under_threshold" })
  state = runStageAction("8-2", state, "run_advanced_option")
  state = runStageAction("8-2", state, "select_advanced_option", { optionId: "over_threshold" })
  state = runStageAction("8-2", state, "run_advanced_option")
  assert.equal(state.success, true)
  assert.equal(state.runtimeEvents.some((item) => item.eventType === "defense.blocked"), true)
  assert.equal(state.runtimeEvents.some((item) => item.eventType === "score.updated"), true)
  assert.equal(state.runtimeScore.stageId, "8-2")
})

test("stage 9-3 rewards hypothesis-aligned mutation", () => {
  let state = createInitialStageState("9-3")
  state = runStageAction("9-3", state, "select_advanced_option", { optionId: "same_again" })
  state = runStageAction("9-3", state, "run_advanced_option")
  assert.equal(state.success, false)
  state = runStageAction("9-3", state, "select_advanced_option", { optionId: "change_interval" })
  state = runStageAction("9-3", state, "run_advanced_option")
  assert.equal(state.success, true)
  assert.equal(state.bestTrial.optionId, "change_interval")
})

test("duel DSL compiler builds safe IR with loops and observations", () => {
  const source = [
    "param delay in 1..3",
    "plan first_probe:",
    "  observe defense.alert_level",
    "  for delay in 1..2:",
    "    use sequence_shift delay=delay",
    "  use refund_probe mode=\"safe\"",
    "  run",
  ].join("\n")
  const compiled = compileDuelScript(source)
  assert.equal(compiled.ok, true)
  assert.equal(compiled.ir.irVersion, "plan-ir-1")
  assert.equal(compiled.ir.planId, "first_probe")
  assert.equal(compiled.ir.source.sourceType, "dsl")
  assert.equal(compiled.ir.validation.status, "valid")
  assert.equal(compiled.ir.parameters.delay.type, "range")
  assert.equal(compiled.ir.actions.length, 3)
  assert.equal(compiled.ir.actions[0].params.delay.type, "number")
  assert.equal(compiled.ir.metadata.usesObservation, true)
})

test("duel DSL compiler rejects unsafe or unknown actions", () => {
  const unknown = compileDuelScript("plan bad:\n  use external_request url=\"https://example.com\"\n  run")
  assert.equal(unknown.ok, false)
  assert.equal(unknown.errors[0].includes("external URL") || unknown.errors[0].includes("unknown action"), true)

  const tooMany = compileDuelScript("plan too_many:\n  repeat 99:\n    use low_noise_probe intensity=1\n  run")
  assert.equal(tooMany.ok, false)
  assert.equal(tooMany.errors[0].includes("repeat count exceeds"), true)
})

test("duel round simulator returns bounded virtual results", () => {
  const compiled = compileDuelScript("plan first_probe:\n  use sequence_shift delay=2\n  use low_noise_probe intensity=1\n  run")
  assert.equal(compiled.ok, true)
  const result = simulateDuelRound(compiled.ir, { alertLevel: 1, memory: 0 }, 1)
  assert.equal(result.roundIndex, 1)
  assert.equal(result.scoreDelta >= 0, true)
  assert.equal(Array.isArray(result.defenseEvents), true)
})

test("stage 10-2 can complete the first duel round from DSL", () => {
  let state = createInitialStageState("10-2")
  state.duelSourceCode = "plan first_probe:\n  use sequence_shift delay=2\n  use refund_probe mode=\"safe\"\n  use low_noise_probe intensity=1\n  run"
  state = runStageAction("10-2", state, "compile_duel_script")
  assert.equal(state.duelCompileState, "compiled")
  assert.equal(state.activePlanSource, "dsl")
  assert.equal(state.planSelection.dslPlan.source.sourceType, "dsl")
  assert.equal(state.runtimeEvents.some((item) => item.eventType === "plan.compiled"), true)
  state = runStageAction("10-2", state, "run_duel_round")
  assert.equal(state.success, true)
  assert.equal(state.trialHistory.length, 1)
  assert.equal(state.runtimeEvents.some((item) => item.eventType === "stage.completed"), true)
  assert.equal(state.runtimeScore.stageId, "10-2")
})

test("stage 10-2 compiles DSL on run when no active DSL PlanIR exists", () => {
  let state = createInitialStageState("10-2")
  state.duelSourceCode = "plan quick_probe:\n  use low_noise_probe intensity=1\n  run"
  state = runStageAction("10-2", state, "run_duel_round")
  assert.equal(state.duelCompileState, "compiled")
  assert.equal(state.success, true)
  assert.equal(state.activePlanSource, "dsl")
  assert.equal(state.planSelection.dslPlan.planId, "quick_probe")
})

test("stage 10-2 can complete the first duel round from GUI PlanIR", () => {
  let state = createInitialStageState("10-2")
  state = runStageAction("10-2", state, "select_advanced_option", { optionId: "gui_balanced" })
  state = runStageAction("10-2", state, "run_advanced_option")
  assert.equal(state.success, true)
  assert.equal(state.activePlanSource, "gui")
  assert.equal(state.planSelection.guiPlan.source.sourceType, "gui")
  assert.equal(state.runtimeEvents.some((item) => item.eventType === "plan.created"), true)
  assert.equal(state.runtimeScore.stageId, "10-2")
})
