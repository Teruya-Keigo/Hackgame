import test from "node:test"
import assert from "node:assert/strict"

import {
  createInitialStageState,
  runStageAction,
} from "./static/stage_core.mjs"

function selectOption(stageId, state, optionId) {
  return runStageAction(stageId, state, "select_advanced_option", { optionId })
}

function runOption(stageId, state) {
  return runStageAction(stageId, state, "run_advanced_option")
}

function completionEvents(state) {
  return (state.runtimeEvents || []).filter((event) => event.eventType === "stage.completed")
}

function runScenario(stageId) {
  let state = createInitialStageState(stageId)

  switch (stageId) {
    case "4-1":
      state = selectOption(stageId, state, "solo_shift")
      state = runOption(stageId, state)
      state = selectOption(stageId, state, "chain_refund")
      state = runOption(stageId, state)
      return runStageAction(stageId, state, "compare_advanced")
    case "4-2":
      state = selectOption(stageId, state, "route_b")
      return runOption(stageId, state)
    case "4-3":
      state = selectOption(stageId, state, "efficient_chain")
      return runOption(stageId, state)
    case "4-4":
      state = selectOption(stageId, state, "refund_guard")
      return runStageAction(stageId, state, "compare_advanced")
    case "5-1":
      state = selectOption(stageId, state, "part_shift")
      state = runStageAction(stageId, state, "add_route_part")
      return runOption(stageId, state)
    case "5-2":
      state = selectOption(stageId, state, "quiet_condition")
      state = runOption(stageId, state)
      state = selectOption(stageId, state, "burst_condition")
      return runOption(stageId, state)
    case "5-3":
      state = selectOption(stageId, state, "balanced_best")
      state = runOption(stageId, state)
      return runStageAction(stageId, state, "save_advanced")
    case "5-4":
      state = selectOption(stageId, state, "adaptive_quiet")
      state = runOption(stageId, state)
      return runStageAction(stageId, state, "save_advanced")
    case "6-1":
      state = runStageAction(stageId, state, "save_advanced")
      return runStageAction(stageId, state, "load_advanced")
    case "6-2":
      state = selectOption(stageId, state, "param_delay")
      return runOption(stageId, state)
    case "6-3":
      state = runOption(stageId, state)
      return runStageAction(stageId, state, "save_advanced")
    case "6-4":
      state = selectOption(stageId, state, "adaptive_assignment")
      state = runOption(stageId, state)
      return runStageAction(stageId, state, "save_advanced")
    case "7-1":
      return runOption(stageId, state)
    case "7-2":
      state = runOption(stageId, state)
      return runStageAction(stageId, state, "save_advanced")
    case "7-3":
      return runOption(stageId, state)
    case "7-4":
      state = selectOption(stageId, state, "split_adoption")
      state = runOption(stageId, state)
      return runStageAction(stageId, state, "save_advanced")
    case "8-1":
      state = selectOption(stageId, state, "pressure_low")
      state = runOption(stageId, state)
      assert.equal(state.success, false, "CH8-ADV-B07: 1種類だけでは成功しない")
      state = selectOption(stageId, state, "pressure_mid")
      return runOption(stageId, state)
    case "8-2":
      state = selectOption(stageId, state, "under_threshold")
      state = runOption(stageId, state)
      state = selectOption(stageId, state, "over_threshold")
      return runOption(stageId, state)
    case "8-3":
      state = selectOption(stageId, state, "low_noise_win")
      return runOption(stageId, state)
    case "8-4":
      state = selectOption(stageId, state, "resilient_balanced")
      state = runOption(stageId, state)
      return runStageAction(stageId, state, "save_advanced")
    case "9-1":
      state = selectOption(stageId, state, "same_strategy")
      state = runOption(stageId, state)
      return runOption(stageId, state)
    case "9-2":
      state = selectOption(stageId, state, "repeat_pattern")
      state = runStageAction(stageId, state, "review_advanced_log")
      return runStageAction(stageId, state, "submit_hypothesis")
    case "9-3":
      state = selectOption(stageId, state, "change_interval")
      return runOption(stageId, state)
    case "9-4":
      state = selectOption(stageId, state, "adapt_each_round")
      state = runOption(stageId, state)
      return runOption(stageId, state)
    case "10-1":
      state = selectOption(stageId, state, "start_duel")
      return runOption(stageId, state)
    case "10-2":
      state = selectOption(stageId, state, "gui_balanced")
      return runOption(stageId, state)
    case "10-3":
      state = selectOption(stageId, state, "revise_low_noise")
      return runOption(stageId, state)
    case "10-4":
      state = selectOption(stageId, state, "campaign_adapt")
      state = runOption(stageId, state)
      state = runOption(stageId, state)
      return runOption(stageId, state)
    default:
      throw new Error(`unsupported scenario stage: ${stageId}`)
  }
}

const uncoveredNormalCases = [
  {
    caseId: "CH4-42-N01",
    stageId: "4-2",
    verify(state) {
      assert.equal(state.bestTrial?.optionId, "route_b")
    },
  },
  {
    caseId: "CH4-44-N01",
    stageId: "4-4",
    verify(state) {
      assert.equal(state.bestTrial?.optionId, "refund_guard")
      assert.ok(state.bestTrial.afterGain <= 8)
    },
  },
  {
    caseId: "CH5-51-N01 / CH5-ADV-B06",
    stageId: "5-1",
    verify(state) {
      assert.equal(state.route.length, 1)
      assert.equal(state.trialHistory.length, 1)
    },
  },
  {
    caseId: "CH5-53-N01",
    stageId: "5-3",
    verify(state) {
      assert.equal(state.saved, true)
      assert.equal(state.bestTrial?.optionId, "balanced_best")
    },
  },
  {
    caseId: "CH5-54-N01",
    stageId: "5-4",
    verify(state) {
      assert.equal(state.saved, true)
      assert.equal(state.bestTrial?.optionId, "adaptive_quiet")
    },
  },
  {
    caseId: "CH6-61-N01",
    stageId: "6-1",
    verify(state) {
      assert.equal(state.saved, true)
      assert.equal(state.loaded, true)
    },
  },
  {
    caseId: "CH6-62-N01",
    stageId: "6-2",
    verify(state) {
      assert.equal(state.bestTrial?.optionId, "param_delay")
    },
  },
  {
    caseId: "CH6-63-N01",
    stageId: "6-3",
    verify(state) {
      assert.equal(state.saved, true)
      assert.equal(state.bestTrial?.optionId, "condition_balanced")
    },
  },
  {
    caseId: "CH6-64-N01",
    stageId: "6-4",
    verify(state) {
      assert.equal(state.saved, true)
      assert.equal(state.bestTrial?.optionId, "adaptive_assignment")
    },
  },
  {
    caseId: "CH7-71-N01",
    stageId: "7-1",
    verify(state) {
      assert.equal(state.trialHistory.length, 3)
      assert.equal(state.bestTrial?.optionId, "candidate_b")
    },
  },
  {
    caseId: "CH7-72-N01",
    stageId: "7-2",
    verify(state) {
      assert.equal(state.saved, true)
      assert.equal(state.bestTrial?.optionId, "search_profit")
    },
  },
  {
    caseId: "CH7-73-N01",
    stageId: "7-3",
    verify(state) {
      assert.equal(state.bestTrial?.optionId, "stable_candidate")
    },
  },
  {
    caseId: "CH7-74-N01",
    stageId: "7-4",
    verify(state) {
      assert.equal(state.saved, true)
      assert.equal(state.bestTrial?.optionId, "split_adoption")
    },
  },
  {
    caseId: "CH8-81-N01 / CH8-ADV-B07 / CH8-ADV-B08",
    stageId: "8-1",
    verify(state) {
      assert.equal(Object.keys(state.runs).length, 2)
    },
  },
  {
    caseId: "CH8-83-N01",
    stageId: "8-3",
    verify(state) {
      assert.equal(state.bestTrial?.optionId, "low_noise_win")
      assert.equal(state.bestTrial.blocked, false)
    },
  },
  {
    caseId: "CH8-84-N01",
    stageId: "8-4",
    verify(state) {
      assert.equal(state.saved, true)
      assert.equal(state.bestTrial?.optionId, "resilient_balanced")
    },
  },
  {
    caseId: "CH9-91-N01",
    stageId: "9-1",
    verify(state) {
      assert.equal(state.trialHistory.length, 2)
      const [first, second] = state.trialHistory
      assert.ok(
        second.detection > first.detection || second.blocked !== first.blocked,
        "CH9-91-N01: 同じ戦略の2回目で防御反応が変化する"
      )
    },
  },
  {
    caseId: "CH9-92-N01",
    stageId: "9-2",
    verify(state) {
      assert.equal(state.logReviewed, true)
      assert.equal(state.hypothesisSubmitted, true)
    },
  },
  {
    caseId: "CH9-94-N01",
    stageId: "9-4",
    verify(state) {
      assert.equal(state.round, 2)
    },
  },
  {
    caseId: "CH10-101-N01",
    stageId: "10-1",
    verify(state) {
      assert.equal(state.bestTrial?.optionId, "start_duel")
    },
  },
  {
    caseId: "CH10-103-N01",
    stageId: "10-3",
    verify(state) {
      assert.equal(state.bestTrial?.optionId, "revise_low_noise")
    },
  },
  {
    caseId: "CH10-104-N01",
    stageId: "10-4",
    verify(state) {
      assert.equal(state.round, 3)
      assert.ok(state.score >= 45, "CH10-104-N01: 3ラウンド以内に目標スコア45へ到達する")
    },
  },
]

for (const { caseId, stageId, verify } of uncoveredNormalCases) {
  test(`[${caseId}] ${stageId} normal stage flow`, () => {
    const state = runScenario(stageId)
    verify(state)
    assert.equal(state.success, true, `${caseId}: stage succeeds`)
    assert.equal(state.nextUnlocked, true, `${caseId}: next stage is unlocked`)
    assert.equal(completionEvents(state).length, 1, `${caseId}: stage.completed is emitted exactly once`)
  })
}

function stableStateSnapshot(state) {
  return JSON.parse(JSON.stringify({
    trialHistory: state.trialHistory,
    runs: state.runs,
    score: state.score,
    runtimeEvents: state.runtimeEvents,
    runtimeScore: state.runtimeScore,
    planSelection: state.planSelection,
    duelCompiledPlan: state.duelCompiledPlan,
  }))
}

const prerequisiteCases = [
  { caseId: "CH4-41-A01", stageId: "4-1", action: "compare_advanced" },
  { caseId: "CH5-51-A01 / CH5-ADV-B05", stageId: "5-1", action: "run_advanced_option" },
  { caseId: "CH5-53-A01", stageId: "5-3", action: "save_advanced" },
  { caseId: "CH5-54-A01", stageId: "5-4", action: "save_advanced" },
  { caseId: "CH6-61-A01", stageId: "6-1", action: "load_advanced" },
  { caseId: "CH6-63-A01", stageId: "6-3", action: "save_advanced" },
  { caseId: "CH6-64-A01", stageId: "6-4", action: "save_advanced" },
  { caseId: "CH7-72-A01", stageId: "7-2", action: "save_advanced" },
  { caseId: "CH7-74-A01", stageId: "7-4", action: "save_advanced" },
  { caseId: "CH8-84-A01", stageId: "8-4", action: "save_advanced" },
  { caseId: "CH9-92-A01", stageId: "9-2", action: "submit_hypothesis" },
  {
    caseId: "CH10-102-A01",
    stageId: "10-2",
    action: "run_advanced_option",
    prepare(state) {
      return selectOption("10-2", state, "gui_empty")
    },
  },
]

for (const { caseId, stageId, action, prepare } of prerequisiteCases) {
  test(`[${caseId}] ${stageId} rejects a premature action without corrupting state`, () => {
    let state = createInitialStageState(stageId)
    if (prepare) state = prepare(state)
    const before = stableStateSnapshot(state)
    state = runStageAction(stageId, state, action)

    assert.equal(state.success, false, `${caseId}: premature action must not complete the stage`)
    assert.equal(state.nextUnlocked, false, `${caseId}: premature action must not unlock the next stage`)
    assert.deepEqual(stableStateSnapshot(state), before, `${caseId}: history, score, and plan remain unchanged`)
  })
}

const idempotentPrimaryCases = [
  { caseId: "CH4-41-C01", stageId: "4-1", action: "run_advanced_option" },
  { caseId: "CH4-42-C01", stageId: "4-2", action: "run_advanced_option" },
  { caseId: "CH4-43-C01", stageId: "4-3", action: "run_advanced_option" },
  { caseId: "CH4-44-C01", stageId: "4-4", action: "compare_advanced" },
  {
    caseId: "CH5-51-C01",
    stageId: "5-1",
    action: "run_advanced_option",
    prepare(state) {
      return runStageAction("5-1", state, "add_route_part")
    },
  },
  { caseId: "CH5-52-C01", stageId: "5-2", action: "run_advanced_option" },
  { caseId: "CH5-53-C01", stageId: "5-3", action: "run_advanced_option" },
  { caseId: "CH5-54-C01", stageId: "5-4", action: "run_advanced_option" },
  { caseId: "CH6-61-C01", stageId: "6-1", action: "save_advanced" },
  { caseId: "CH6-62-C01", stageId: "6-2", action: "run_advanced_option" },
  { caseId: "CH6-63-C01", stageId: "6-3", action: "run_advanced_option" },
  { caseId: "CH6-64-C01", stageId: "6-4", action: "run_advanced_option" },
  { caseId: "CH7-71-C01", stageId: "7-1", action: "run_advanced_option" },
  { caseId: "CH7-72-C01", stageId: "7-2", action: "run_advanced_option" },
  { caseId: "CH7-73-C01", stageId: "7-3", action: "run_advanced_option" },
  { caseId: "CH7-74-C01", stageId: "7-4", action: "run_advanced_option" },
  { caseId: "CH8-81-C01", stageId: "8-1", action: "run_advanced_option" },
  { caseId: "CH8-82-C01", stageId: "8-2", action: "run_advanced_option" },
  { caseId: "CH8-83-C01", stageId: "8-3", action: "run_advanced_option" },
  { caseId: "CH8-84-C01", stageId: "8-4", action: "run_advanced_option" },
  { caseId: "CH9-92-C01", stageId: "9-2", action: "review_advanced_log" },
  { caseId: "CH9-93-C01", stageId: "9-3", action: "run_advanced_option" },
  { caseId: "CH10-101-C01", stageId: "10-1", action: "run_advanced_option" },
  { caseId: "CH10-102-C01", stageId: "10-2", action: "run_advanced_option" },
  { caseId: "CH10-103-C01", stageId: "10-3", action: "run_advanced_option" },
]

for (const { caseId, stageId, action, prepare } of idempotentPrimaryCases) {
  test(`[${caseId}] ${stageId} ignores a duplicate primary submission`, () => {
    let state = createInitialStageState(stageId)
    if (prepare) state = prepare(state)
    state = runStageAction(stageId, state, action)
    const afterFirst = JSON.parse(JSON.stringify(state))
    state = runStageAction(stageId, state, action)

    assert.deepEqual(JSON.parse(JSON.stringify(state)), afterFirst)
    assert.ok(completionEvents(state).length <= 1)
  })
}

for (const { caseId, stageId, expectedAfterTwo } of [
  { caseId: "CH9-91-C01", stageId: "9-1", expectedAfterTwo: 2 },
  { caseId: "CH9-94-C01", stageId: "9-4", expectedAfterTwo: 2 },
  { caseId: "CH10-104-C01", stageId: "10-4", expectedAfterTwo: 2 },
]) {
  test(`[${caseId}] ${stageId} records repeated clicks as explicit numbered rounds`, () => {
    let state = createInitialStageState(stageId)
    state = runStageAction(stageId, state, "run_advanced_option")
    state = runStageAction(stageId, state, "run_advanced_option")

    assert.equal(state.trialHistory.length, expectedAfterTwo)
    assert.deepEqual(state.trialHistory.map((trial) => trial.index), [1, 2])
    assert.ok(completionEvents(state).length <= 1)
  })
}

const runtimeCases = [
  ["CH4-41-R01", "4-1"], ["CH4-42-R01", "4-2"], ["CH4-43-R01", "4-3"], ["CH4-44-R01", "4-4"],
  ["CH5-51-R01", "5-1"], ["CH5-52-R01", "5-2"], ["CH5-53-R01", "5-3"], ["CH5-54-R01", "5-4"],
  ["CH6-61-R01", "6-1"], ["CH6-62-R01", "6-2"], ["CH6-63-R01", "6-3"], ["CH6-64-R01", "6-4"],
  ["CH7-71-R01", "7-1"], ["CH7-72-R01", "7-2"], ["CH7-73-R01", "7-3"], ["CH7-74-R01", "7-4"],
  ["CH8-81-R01", "8-1"], ["CH8-82-R01", "8-2"], ["CH8-83-R01", "8-3"], ["CH8-84-R01", "8-4"],
  ["CH9-91-R01", "9-1"], ["CH9-92-R01", "9-2"], ["CH9-93-R01", "9-3"], ["CH9-94-R01", "9-4"],
  ["CH10-101-R01", "10-1"], ["CH10-102-R01", "10-2"], ["CH10-103-R01", "10-3"], ["CH10-104-R01", "10-4"],
]

function assertRuntimeIntegrity(caseId, stageId, state) {
  const events = state.runtimeEvents || []
  assert.ok(events.length > 0, `${caseId}: runtime events exist`)

  events.forEach((event, index) => {
    assert.equal(event.stageId, stageId, `${caseId}: event ${event.id} has the correct stageId`)
    if (event.eventType !== "score.updated") {
      assert.equal(
        events[index + 1]?.eventType,
        "score.updated",
        `${caseId}: ${event.eventType} is immediately followed by score.updated`
      )
    }

    for (const key of ["gain", "detection", "queue", "latency", "scoreDelta"]) {
      const value = event.metadata?.[key]
      if (value !== undefined) {
        assert.ok(Number.isFinite(value), `${caseId}: ${key} is finite`)
        assert.ok(value >= 0, `${caseId}: ${key} is not an invalid negative value`)
      }
    }
  })

  assert.equal(events.at(-1)?.eventType, "score.updated", `${caseId}: score.updated closes the event sequence`)
  assert.equal(state.runtimeScore?.stageId, stageId, `${caseId}: runtime score has the correct stageId`)
  assert.ok(Number.isFinite(state.runtimeScore?.normalizedTotal), `${caseId}: normalized score is finite`)
  assert.ok(state.runtimeScore.normalizedTotal >= 0, `${caseId}: normalized score is non-negative`)
}

for (const [caseId, stageId] of runtimeCases) {
  test(`[${caseId}] ${stageId} runtime event and score integrity`, () => {
    assertRuntimeIntegrity(caseId, stageId, runScenario(stageId))
  })
}

test("[CH4-ADV-B02] 4-3 rejects the 4-step all_parts route", () => {
  let state = createInitialStageState("4-3")
  state = selectOption("4-3", state, "all_parts")
  state = runOption("4-3", state)

  assert.equal(state.bestTrial.steps.length, 4)
  assert.equal(state.bestTrial.blocked, true)
  assert.equal(state.success, false)
  assert.equal(state.nextUnlocked, false)
})

for (const boundary of [
  { caseId: "CH9-ADV-B09", stageId: "9-4", optionId: "repeat_same", score: 41, expectedSuccess: false },
  { caseId: "CH9-ADV-B10", stageId: "9-4", optionId: "repeat_same", score: 42, expectedSuccess: true },
  { caseId: "CH10-ADV-B12", stageId: "10-4", optionId: "campaign_repeat", score: 44, expectedSuccess: false },
  { caseId: "CH10-ADV-B13", stageId: "10-4", optionId: "campaign_repeat", score: 45, expectedSuccess: true },
]) {
  test(`[${boundary.caseId}] ${boundary.stageId} target score boundary ${boundary.score}`, () => {
    let state = createInitialStageState(boundary.stageId)
    state.score = boundary.score
    state = selectOption(boundary.stageId, state, boundary.optionId)
    state = runOption(boundary.stageId, state)

    assert.equal(state.score, boundary.score, `${boundary.caseId}: zero-score trial preserves the seeded boundary`)
    assert.equal(state.success, boundary.expectedSuccess)
    assert.equal(state.nextUnlocked, boundary.expectedSuccess)
    assert.equal(completionEvents(state).length, boundary.expectedSuccess ? 1 : 0)
  })
}

for (const boundary of [
  { caseId: "CH9-ADV-B11", stageId: "9-4", optionId: "repeat_same", targetScore: 42 },
  { caseId: "CH10-ADV-B14", stageId: "10-4", optionId: "campaign_repeat", targetScore: 45 },
]) {
  test(`[${boundary.caseId}] ${boundary.stageId} stops after three unsuccessful rounds`, () => {
    let state = createInitialStageState(boundary.stageId)
    state = selectOption(boundary.stageId, state, boundary.optionId)
    state = runOption(boundary.stageId, state)
    state = runOption(boundary.stageId, state)
    state = runOption(boundary.stageId, state)

    assert.equal(state.round, 3)
    assert.ok(state.score < boundary.targetScore)
    assert.equal(state.success, false)
    assert.equal(state.nextUnlocked, false)
    assert.match(state.feedback, /ラウンド上限/)

    const historyLength = state.trialHistory.length
    const eventLength = state.runtimeEvents.length
    state = runOption(boundary.stageId, state)
    assert.equal(state.round, 3, `${boundary.caseId}: a fourth round is rejected by the core runtime`)
    assert.equal(state.trialHistory.length, historyLength)
    assert.equal(state.runtimeEvents.length, eventLength)
  })
}
