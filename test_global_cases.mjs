import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import vm from "node:vm"

import {
  calculateScore,
  compileDuelScript,
  compileSearchScript,
  createGameEvent,
  createInitialRuntimeState,
  createInitialStageState,
  executeSearchProgram,
  getScoreProfileForStage,
  reduceEvents,
  runStageAction,
  simulateDuelRound,
  validatePlanIR,
} from "./static/stage_core.mjs"

function duelPlan(lines, name = "p") {
  return [`plan ${name}:`, ...lines.map((line) => `  ${line}`), "  run"].join("\n")
}

function actionParam(compiled, paramName) {
  return compiled.ir.actions[0].params[paramName]?.value
}

test("DSL-N01: minimal Duel DSL plan compiles to one valid action", () => {
  const compiled = compileDuelScript(duelPlan(["use low_noise_probe intensity=1"]))

  assert.equal(compiled.ok, true, compiled.errors.join("\n"))
  assert.equal(compiled.ir.actions.length, 1)
  assert.equal(compiled.ir.actions[0].actionId, "low_noise_probe")
  assert.equal(compiled.ir.validation.status, "valid")
})

test("DSL-N02: omitted Duel DSL action arguments receive schema defaults", () => {
  const compiled = compileDuelScript(duelPlan(["use sequence_shift"]))

  assert.equal(compiled.ok, true, compiled.errors.join("\n"))
  assert.equal(actionParam(compiled, "delay"), 2)
})

test("DSL-N03: if/else emits only the branch selected by defender state", () => {
  const source = duelPlan([
    "if defense.alert_level > 2:",
    "  use low_noise_probe intensity=1",
    "else:",
    "  use profit_route split=4",
  ])
  const alerted = compileDuelScript(source, { defenderState: { alertLevel: 3 } })
  const quiet = compileDuelScript(source, { defenderState: { alertLevel: 2 } })

  assert.equal(alerted.ok, true, alerted.errors.join("\n"))
  assert.equal(quiet.ok, true, quiet.errors.join("\n"))
  assert.deepEqual(alerted.ir.actions.map((action) => action.actionId), ["low_noise_probe"])
  assert.deepEqual(quiet.ir.actions.map((action) => action.actionId), ["profit_route"])
})

test("DSL-N04: choose emits candidate metadata without adding candidate actions", () => {
  const compiled = compileDuelScript(
    duelPlan([
      "choose best by score:",
      "  candidate fast",
      "use low_noise_probe intensity=1",
    ])
  )

  assert.equal(compiled.ok, true, compiled.errors.join("\n"))
  assert.equal(compiled.ir.actions.length, 1)
  assert.deepEqual(compiled.ir.metadata.choices, [
    { target: "best", metric: "score", candidates: ["fast"] },
  ])
})

test("DSL-A02..A05 / GLOBAL-SAFE01..03: unsafe browser, network, OS, file, and JS tokens are rejected", async (t) => {
  const cases = [
    ["DSL-A01/GLOBAL-SAFE01", "external URL", "use external_request url=\"https://example.com\""],
    ["DSL-A02/GLOBAL-SAFE03", "fetch", "# fetch"],
    ["GLOBAL-SAFE01", "XMLHttpRequest", "# XMLHttpRequest"],
    ["GLOBAL-SAFE01", "WebSocket", "# WebSocket"],
    ["DSL-A03/GLOBAL-SAFE01", "curl", "# curl"],
    ["GLOBAL-SAFE01", "network", "# network"],
    ["DSL-A04/GLOBAL-SAFE02", "file path", "save /tmp/x"],
    ["GLOBAL-SAFE02", "shell", "# shell"],
    ["GLOBAL-SAFE02", "exec", "# exec"],
    ["GLOBAL-SAFE02", "spawn", "# spawn"],
    ["DSL-A05", "while", "while true:"],
    ["GLOBAL-SAFE03", "eval", "# eval"],
    ["GLOBAL-SAFE03", "Function", "# Function"],
    ["GLOBAL-SAFE03", "import", "# import"],
    ["GLOBAL-SAFE03", "document", "# document"],
    ["GLOBAL-SAFE03", "window", "# window"],
    ["GLOBAL-SAFE03", "localStorage", "# localStorage"],
  ]

  for (const [caseId, label, unsafeLine] of cases) {
    await t.test(`${caseId}: ${label}`, () => {
      const source = duelPlan(["use low_noise_probe intensity=1", unsafeLine])
      const compiled = compileDuelScript(source)
      assert.equal(compiled.ok, false)
      assert.equal(compiled.ir, null)
      assert.ok(compiled.errors.length > 0)
    })
  }
})

test("DSL-A06..A12: invalid structure, actions, arguments, observations, and choices fail without IR", async (t) => {
  const cases = [
    ["DSL-A06", "param delay in 1..3"],
    ["DSL-A07", "plan p:\n  run"],
    ["DSL-A08/GLOBAL-SAFE04", duelPlan(["use nope"])],
    ["DSL-A09", duelPlan(["use sequence_shift delay=\"fast\""])],
    ["DSL-A10", duelPlan(["use sequence_shift foo=1"])],
    ["DSL-A11", duelPlan(["observe defense.secret", "use low_noise_probe intensity=1"])],
    [
      "DSL-A12",
      duelPlan([
        "choose best by score:",
        "  save x",
        "use low_noise_probe intensity=1",
      ]),
    ],
  ]

  for (const [caseId, source] of cases) {
    await t.test(caseId, () => {
      const compiled = compileDuelScript(source)
      assert.equal(compiled.ok, false)
      assert.equal(compiled.ir, null)
      assert.ok(compiled.errors.length > 0)
    })
  }
})

test("DSL-PB: all numeric Duel DSL action parameters enforce min/max boundaries", async (t) => {
  const schemas = [
    { prefix: "seq", action: "sequence_shift", param: "delay", min: 1, max: 5 },
    { prefix: "rou", action: "rounding_split", param: "split", min: 2, max: 8 },
    { prefix: "low", action: "low_noise_probe", param: "intensity", min: 1, max: 3 },
    { prefix: "pro", action: "profit_route", param: "split", min: 2, max: 8 },
    { prefix: "res", action: "resource_probe", param: "intensity", min: 1, max: 3 },
    { prefix: "wai", action: "wait_interval", param: "ticks", min: 1, max: 5 },
  ]

  for (const schema of schemas) {
    const values = [
      { suffix: "min-1", value: schema.min - 1, valid: false },
      { suffix: "min", value: schema.min, valid: true },
      { suffix: "max", value: schema.max, valid: true },
      { suffix: "max+1", value: schema.max + 1, valid: false },
    ]
    for (const boundary of values) {
      const caseId = `DSL-PB-${schema.prefix}-${boundary.suffix}`
      await t.test(caseId, () => {
        const compiled = compileDuelScript(
          duelPlan([`use ${schema.action} ${schema.param}=${boundary.value}`])
        )
        assert.equal(compiled.ok, boundary.valid, compiled.errors.join("\n"))
        if (boundary.valid) {
          assert.equal(actionParam(compiled, schema.param), boundary.value)
        } else {
          assert.equal(compiled.ir, null)
          assert.match(compiled.errors[0], /between/)
        }
      })
    }
  }
})

test("DSL-LIM01/02: repeat accepts 12 and rejects 13 without partial IR", () => {
  const atLimit = compileDuelScript(
    duelPlan(["repeat 12:", "  use low_noise_probe intensity=1"])
  )
  const overLimit = compileDuelScript(
    duelPlan(["repeat 13:", "  use low_noise_probe intensity=1"])
  )

  assert.equal(atLimit.ok, true, atLimit.errors.join("\n"))
  assert.equal(atLimit.ir.actions.length, 12)
  assert.equal(overLimit.ok, false)
  assert.equal(overLimit.ir, null)
})

test("DSL-LIM03/04: parameter range span accepts 1..13 and rejects 1..14", () => {
  const plan = "plan p:\n  use low_noise_probe intensity=1\n  run"
  const atLimit = compileDuelScript(`param sweep in 1..13\n${plan}`)
  const overLimit = compileDuelScript(`param sweep in 1..14\n${plan}`)

  assert.equal(atLimit.ok, true, atLimit.errors.join("\n"))
  assert.deepEqual(atLimit.ir.parameters.sweep, { type: "range", from: 1, to: 13 })
  assert.equal(overLimit.ok, false)
  assert.equal(overLimit.ir, null)
})

test("DSL-LIM05/06: a round accepts 16 actions and rejects 17 without partial IR", () => {
  const action = "use wait_interval ticks=1"
  const atLimit = compileDuelScript(duelPlan(Array.from({ length: 16 }, () => action)))
  const overLimit = compileDuelScript(duelPlan(Array.from({ length: 17 }, () => action)))

  assert.equal(atLimit.ok, true, atLimit.errors.join("\n"))
  assert.equal(atLimit.ir.actions.length, 16)
  assert.equal(overLimit.ok, false)
  assert.equal(overLimit.ir, null)
})

test("DSL-LIM07/08 / GLOBAL-SAFE05: virtual load accepts 24 and rejects 25 before execution", () => {
  const load24 = Array.from({ length: 8 }, () => "use profit_route split=4")
  const atLimit = compileDuelScript(duelPlan(load24))
  const overLimit = compileDuelScript(
    duelPlan([...load24, "use low_noise_probe intensity=1"])
  )

  assert.equal(atLimit.ok, true, atLimit.errors.join("\n"))
  assert.equal(atLimit.ir.metadata.estimatedLoad, 24)
  assert.equal(overLimit.ok, false)
  assert.equal(overLimit.ir, null)
  assert.match(overLimit.errors[0], /virtual load/)
})

test("GLOBAL-SAFE04: validatePlanIR rejects a manually supplied non-allowlisted action", () => {
  const plan = {
    source: { sourceType: "runtime" },
    actions: [{ actionId: "spawn_process", params: {}, estimatedLoad: 0 }],
    metadata: { estimatedTotalLoad: 0, estimatedDetectionRisk: 0 },
  }

  const validation = validatePlanIR(plan)
  assert.equal(validation.status, "invalid")
  assert.equal(validation.diagnostics.some((item) => item.message.includes("Unknown action")), true)
})

test("GLOBAL-SAFE06: a blocked duel result contains only finite, nonnegative resource metrics", () => {
  const compiled = compileDuelScript(
    duelPlan(Array.from({ length: 4 }, () => "use sequence_shift delay=2"))
  )
  assert.equal(compiled.ok, true, compiled.errors.join("\n"))

  const result = simulateDuelRound(compiled.ir, { alertLevel: 1, memory: 0 }, 1)
  assert.equal(result.blocked, true)
  for (const field of ["rawGain", "estimatedLoad", "detectionScore", "queue", "latency", "scoreDelta"]) {
    assert.equal(Number.isFinite(result[field]), true, `${field} must be finite`)
  }
  assert.ok(result.queue >= 0)
  assert.ok(result.latency >= 0)
  assert.ok(result.scoreDelta >= 0)
})

test("GLOBAL-E2E04 core contract: Search Console honors inherited Stage 3 parameters without mutating them", () => {
  let stageState = createInitialStageState("3-3")
  stageState = runStageAction("3-3", stageState, "set_split_count", { splitCount: 5 })
  stageState = runStageAction("3-3", stageState, "set_repeat_count", { repeatCount: 3 })
  const inherited = {
    split: stageState.splitCount,
    repeat: stageState.repeatCount,
    amount: stageState.amount,
  }
  const before = structuredClone(inherited)
  const compiled = compileSearchScript("run\nshow best")

  assert.equal(compiled.ok, true, compiled.errors.join("\n"))
  const executed = executeSearchProgram(compiled.program, inherited)
  assert.deepEqual(inherited, before)
  assert.deepEqual(executed.params, before)
  assert.equal(executed.trialHistory[0].splitCount, 5)
  assert.equal(executed.trialHistory[0].repeatCount, 3)
})

test("GLOBAL-E2E13: Duel DSL error then fix clears diagnostics and installs only the new IR", () => {
  let state = createInitialStageState("10-2")
  state.duelSourceCode = duelPlan(["use nope"], "bad")
  state = runStageAction("10-2", state, "compile_duel_script")

  assert.equal(state.duelCompileState, "compileError")
  assert.equal(state.duelCompiledPlan, null)
  assert.ok(state.duelCompileErrors.length > 0)

  state.duelSourceCode = duelPlan(["use low_noise_probe intensity=1"], "fixed")
  state = runStageAction("10-2", state, "compile_duel_script")

  assert.equal(state.duelCompileState, "compiled")
  assert.deepEqual(state.duelCompileErrors, [])
  assert.equal(state.duelCompiledPlan.planId, "fixed")
  assert.equal(state.planSelection.dslPlan.planId, "fixed")
})

test("GLOBAL-E2E14: three-round campaign preserves round, score, and defender-memory ordering", () => {
  let state = createInitialStageState("10-4")
  for (const optionId of ["campaign_safe", "campaign_repeat", "campaign_adapt"]) {
    state = runStageAction("10-4", state, "select_advanced_option", { optionId })
    state = runStageAction("10-4", state, "run_advanced_option")
  }

  assert.equal(state.round, 3)
  assert.deepEqual(state.trialHistory.map((trial) => trial.index), [1, 2, 3])
  assert.equal(Number.isFinite(state.score), true)
  assert.ok(state.score >= 0)
  assert.equal(state.defenderState.memory, 3)
})

test("GLOBAL-E2E19: reducing and rescoring identical events is deterministic", () => {
  const initialA = createInitialRuntimeState("8-2")
  const initialB = createInitialRuntimeState("8-2")
  const events = [
    createGameEvent(
      {
        eventType: "strategy.executed",
        actor: "player",
        result: "success",
        stepIndex: 1,
        timestamp: 1,
        tags: ["strategy", "stealth"],
        metadata: { gain: 16, detection: 24, queue: 1, latency: 70, success: true, stealth: true },
      },
      initialA
    ),
    createGameEvent(
      {
        eventType: "stage.completed",
        actor: "runtime",
        result: "success",
        stepIndex: 2,
        timestamp: 2,
        metadata: { success: true },
      },
      initialA
    ),
  ]
  const reducedA = reduceEvents(initialA, events)
  const reducedB = reduceEvents(initialB, events)
  const profile = getScoreProfileForStage("8-2")
  const scoreA = calculateScore(events, reducedA, profile)
  const scoreB = calculateScore(events, reducedB, profile)

  assert.deepEqual(reducedA, reducedB)
  assert.deepEqual(scoreA, scoreB)
  assert.equal(initialA.historyState.events.length, 0)
  assert.equal(initialB.historyState.events.length, 0)
})

test("GLOBAL-E2E20: vulnerability state is isolated between fresh stage instances", () => {
  let vulnerable = createInitialStageState("2-2")
  vulnerable = runStageAction("2-2", vulnerable, "cancel_order")
  vulnerable = runStageAction("2-2", vulnerable, "continue_processing")

  const freshRefundStage = createInitialStageState("2-2")
  const unrelatedStage = createInitialStageState("3-1")
  assert.equal(vulnerable.refundCount, 2)
  assert.equal(freshRefundStage.refundCount, 0)
  assert.equal(freshRefundStage.duplicateProcessing, false)
  assert.equal(unrelatedStage.hasCalculated, false)
})

const HACK_LAB_SOURCE = fs.readFileSync(
  new URL("./static/hack_lab.js", import.meta.url),
  "utf8"
)

const HACK_KEYS = {
  plan: "vending_glitch_hack_plan_v1",
  settings: "vending_glitch_hack_settings_v1",
  secret: "vending_glitch_secret_map_v1",
  store: "vending_glitch_store_v1",
  progress: "vending_glitch_game_progress_v2",
}

const FIXED_SECRET = JSON.stringify({
  chapter1: { bonusCenter: 53, sideCenter: 34, phase: 40, mainSpan: 13.5 },
  chapter2: { bonusCenter: 74, sideCenter: 62, phase: 120, mainSpan: 11.5 },
  chapter3: { bonusCenter: 49, sideCenter: 37, phase: 220, mainSpan: 12 },
})

class FakeLocalStorage {
  constructor(entries = {}) {
    this.values = new Map(Object.entries(entries).map(([key, value]) => [key, String(value)]))
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null
  }

  setItem(key, value) {
    this.values.set(key, String(value))
  }

  removeItem(key) {
    this.values.delete(key)
  }
}

class FakeElement {
  constructor(id = "", attributes = {}) {
    this.id = id
    this.attributes = new Map(Object.entries(attributes))
    this.value = ""
    this.textContent = ""
    this.innerHTML = ""
    this.className = ""
    this.disabled = false
    this.listeners = new Map()
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || []
    listeners.push(listener)
    this.listeners.set(type, listeners)
  }

  emit(type, event = {}) {
    for (const listener of this.listeners.get(type) || []) {
      listener({ target: this, ...event })
    }
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }

  closest(selector) {
    return selector === "button[data-buy-id]" && this.attributes.has("data-buy-id") ? this : null
  }
}

function createHackLabHarness(initialStorage = {}) {
  const ids = [
    "hack-code",
    "load-template-btn",
    "validate-btn",
    "save-btn",
    "apply-safe-btn",
    "apply-rush-btn",
    "point-pill",
    "store-list",
    "owned-list",
    "hint-console",
    "preview-list",
    "editor-log",
    "status-banner",
  ]
  const elements = Object.fromEntries(ids.map((id) => [id, new FakeElement(id)]))
  const localStorage = new FakeLocalStorage({
    [HACK_KEYS.secret]: FIXED_SECRET,
    ...initialStorage,
  })
  const windowListeners = new Map()
  const window = {
    location: { href: "" },
    addEventListener(type, listener) {
      const listeners = windowListeners.get(type) || []
      listeners.push(listener)
      windowListeners.set(type, listeners)
    },
  }
  const document = {
    getElementById(id) {
      return elements[id] || null
    },
  }
  const context = vm.createContext({
    console,
    document,
    Element: FakeElement,
    localStorage,
    setTimeout(callback) {
      callback()
      return 1
    },
    clearTimeout() {},
    window,
  })

  vm.runInContext(HACK_LAB_SOURCE, context, { filename: "static/hack_lab.js" })

  return {
    elements,
    localStorage,
    validate(source) {
      elements["hack-code"].value = source
      elements["validate-btn"].emit("click")
      return {
        source: elements["hack-code"].value,
        status: elements["status-banner"].textContent,
        log: elements["editor-log"].textContent,
      }
    },
    buy(itemId) {
      const button = new FakeElement("buy", { "data-buy-id": itemId })
      elements["store-list"].emit("click", { target: button })
    },
    storageEvent(key) {
      for (const listener of windowListeners.get("storage") || []) listener({ key })
    },
  }
}

function chapterBlock(source, chapter = "chapter1") {
  const match = source.match(new RegExp(`chapter ${chapter} \\{([\\s\\S]*?)\\}`))
  assert.ok(match, `missing normalized ${chapter} block`)
  return match[1]
}

test("GLOBAL-H01/H02: Hack Lab preserves probeBudget endpoints 1 and 6", () => {
  for (const value of [1, 6]) {
    const harness = createHackLabHarness()
    const result = harness.validate(`chapter chapter1 { probeBudget(${value}); }`)
    assert.match(chapterBlock(result.source), new RegExp(`probeBudget\\(${value}\\);`))
    assert.match(result.status, /検証OK/)
  }
})

test("GLOBAL-H03: Hack Lab clamps probeBudget 0 to 1 and reports the boundary adjustment", () => {
  const harness = createHackLabHarness()
  const result = harness.validate("chapter chapter1 { probeBudget(0); }")

  assert.match(chapterBlock(result.source), /probeBudget\(1\);/)
  assert.match(`${result.status} ${result.log}`, /(clamp|境界|範囲|補正)/i)
})

test("GLOBAL-H04: Hack Lab clamps probeBudget 7 to 6 and reports the boundary adjustment", () => {
  const harness = createHackLabHarness()
  const result = harness.validate("chapter chapter1 { probeBudget(7); }")

  assert.match(chapterBlock(result.source), /probeBudget\(6\);/)
  assert.match(`${result.status} ${result.log}`, /(clamp|境界|範囲|補正)/i)
})

test("GLOBAL-H05/H06: Hack Lab preserves stabilityBias endpoints 0 and 100", () => {
  for (const value of [0, 100]) {
    const harness = createHackLabHarness()
    const result = harness.validate(`chapter chapter1 { stabilityBias(${value}); }`)
    assert.match(chapterBlock(result.source), new RegExp(`stabilityBias\\(${value}\\);`))
  }
})

test("GLOBAL-H07: Hack Lab preserves entropyGate endpoints 0 and 100", () => {
  for (const value of [0, 100]) {
    const harness = createHackLabHarness()
    const result = harness.validate(`chapter chapter1 { entropyGate(${value}); }`)
    assert.match(chapterBlock(result.source), new RegExp(`entropyGate\\(${value}\\);`))
  }
})

test("GLOBAL-H08: Hack Lab rejects an invalid focusMode", () => {
  const harness = createHackLabHarness()
  const result = harness.validate('chapter chapter1 { focusMode("turbo"); }')
  assert.match(result.status, /focusMode.*safe.*balanced.*greedy/)
})

test("GLOBAL-H09/H10: Hack Lab ignores direct sweetLeft/sweetWidth and logs both warnings", () => {
  for (const field of ["sweetLeft", "sweetWidth"]) {
    const harness = createHackLabHarness()
    const result = harness.validate(`chapter chapter1 { ${field}(10); }`)
    assert.doesNotMatch(result.source, new RegExp(field))
    assert.match(result.status, /無効化/)
    assert.match(result.log, new RegExp(`chapter1\\.${field}`))
  }
})

test("GLOBAL-H11: Hack Lab rejects duplicate normalized chapter declarations", () => {
  const harness = createHackLabHarness()
  const result = harness.validate(
    "chapter chapter1 { probeBudget(2); }\nprofile ch1 { probeBudget(3); }"
  )
  assert.match(result.status, /chapter1.*重複/)
})

test("GLOBAL-H12: Hack Lab reports line/column for an unclosed block comment", () => {
  const harness = createHackLabHarness()
  const result = harness.validate("/* block comment")
  assert.match(result.status, /ブロックコメントが閉じられていません/)
  assert.match(result.status, /line 1, col 1/)
})

test("GLOBAL-H13: Hack Lab reports line/column for an unclosed string", () => {
  const harness = createHackLabHarness()
  const result = harness.validate('chapter chapter1 {\n  focusMode("safe)')
  assert.match(result.status, /文字列リテラルが閉じられていません/)
  assert.match(result.status, /line 2, col/)
})

test("GLOBAL-H14: Hack Lab unknown command error lists the supported settings", () => {
  const harness = createHackLabHarness()
  const result = harness.validate("chapter chapter1 { explode(1); }")
  assert.match(result.status, /未対応の命令/)
  assert.match(result.status, /probeBudget.*stabilityBias.*entropyGate.*focusMode/)
})

test("GLOBAL-H15: Hack Lab permits a purchase when points equal cost and leaves zero", () => {
  const harness = createHackLabHarness({
    [HACK_KEYS.progress]: JSON.stringify({ score: 120 }),
  })
  harness.buy("hint_basics")

  const progress = JSON.parse(harness.localStorage.getItem(HACK_KEYS.progress))
  const store = JSON.parse(harness.localStorage.getItem(HACK_KEYS.store))
  assert.equal(progress.score, 0)
  assert.deepEqual(store.purchased, ["hint_basics"])
})

test("GLOBAL-H16: Hack Lab rejects a purchase when points are cost minus one", () => {
  const harness = createHackLabHarness({
    [HACK_KEYS.progress]: JSON.stringify({ score: 119 }),
  })
  harness.buy("hint_basics")

  assert.equal(JSON.parse(harness.localStorage.getItem(HACK_KEYS.progress)).score, 119)
  assert.equal(harness.localStorage.getItem(HACK_KEYS.store), null)
  assert.match(harness.elements["status-banner"].textContent, /ポイント不足/)
})

test("GLOBAL-H17: Hack Lab double purchase charges once and stores one owned ID", () => {
  const harness = createHackLabHarness({
    [HACK_KEYS.progress]: JSON.stringify({ score: 240 }),
  })
  harness.buy("hint_basics")
  harness.buy("hint_basics")

  const progress = JSON.parse(harness.localStorage.getItem(HACK_KEYS.progress))
  const store = JSON.parse(harness.localStorage.getItem(HACK_KEYS.store))
  assert.equal(progress.score, 120)
  assert.deepEqual(store.purchased, ["hint_basics"])
})

test("GLOBAL-H18: Hack Lab starts with defaults when all localStorage JSON is corrupt", () => {
  const harness = createHackLabHarness({
    [HACK_KEYS.plan]: "{broken",
    [HACK_KEYS.secret]: "{broken",
    [HACK_KEYS.store]: "{broken",
    [HACK_KEYS.progress]: "{broken",
  })

  assert.match(chapterBlock(harness.elements["hack-code"].value), /probeBudget\(2\);/)
  assert.match(harness.elements["point-pill"].textContent, /1000pt/)
  assert.match(harness.elements["owned-list"].innerHTML, /まだ購入済み機能はありません/)
  assert.doesNotThrow(() => JSON.parse(harness.localStorage.getItem(HACK_KEYS.secret)))
})

test("GLOBAL-R10: Hack Lab storage events safely reload corrupt progress, store, and secret values", () => {
  const harness = createHackLabHarness()
  harness.localStorage.setItem(HACK_KEYS.progress, "{broken")
  harness.storageEvent(HACK_KEYS.progress)
  assert.match(harness.elements["point-pill"].textContent, /1000pt/)

  harness.localStorage.setItem(HACK_KEYS.store, "{broken")
  harness.storageEvent(HACK_KEYS.store)
  assert.match(harness.elements["owned-list"].innerHTML, /まだ購入済み機能はありません/)

  harness.localStorage.setItem(HACK_KEYS.secret, "{broken")
  harness.storageEvent(HACK_KEYS.secret)
  assert.doesNotThrow(() => JSON.parse(harness.localStorage.getItem(HACK_KEYS.secret)))
  assert.notEqual(harness.elements["preview-list"].innerHTML, "")
})
