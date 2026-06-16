import {
  STAGE_COUNT,
  STAGE_SEQUENCE,
  compileSearchScript,
  createInitialSearchConsoleState,
  createInitialStageState,
  executeSearchProgram,
  getStageMeta,
  getSearchConsoleSamples,
  runStageAction,
  simulateChapter3Scenario,
} from "./stage_core.mjs"

const STORAGE_KEY = "security_game_stage_journey_v8"
const GAUGE_CYCLE_MS = 2400

const VISUAL_TITLES = {
  "0-1": "注文状態を見る",
  "0-2": "受付から約定までを見る",
  "0-3": "キャンセル後の戻り方を見る",
  "0-4": "観察ポイントを覚える",
  "1-1": "受付順と実行順を比べる",
  "1-2": "タイミングを合わせる",
  "1-3": "結果を見ながら再現する",
  "1-4": "どこで入ると得かを選ぶ",
  "2-1": "注文IDごとの履歴を見る",
  "2-2": "正常と異常を比べる",
  "2-3": "条件を変えて再現する",
  "2-4": "状態破綻の原因を絞る",
  "3-1": "理論値と実際値を比べる",
  "3-2": "一括と分割を比べる",
  "3-3": "ベスト条件を探す",
  "3-4": "候補をまとめて探索する",
}

const RESULT_TITLES = {
  "0-4": "ガイドと確認状況",
  "1-4": "累積結果",
  "2-2": "正常との差分",
  "2-3": "再現結果",
  "2-4": "診断結果",
  "3-1": "差分と丸め",
  "3-2": "差分と累積",
  "3-3": "ベストと累積",
  "3-4": "探索結果",
}

const MISSION_TITLES = {
  "0-4": "観察のしかた",
  "1-4": "作戦と制約",
  "2-3": "条件を選ぶ",
  "2-4": "調査手順",
  "3-3": "探索条件",
  "3-4": "候補登録",
}

const HIDDEN_TIMELINE_STAGES = new Set(["0-4", "1-2", "1-3", "3-1", "3-2", "3-3", "3-4"])

const REPLAY_TIMING_LABELS = {
  before_refund: "返金前",
  refund_window: "返金直後",
  after_close: "終了後",
}

const REPLAY_MODE_LABELS = {
  off: "再実行しない",
  on: "再実行する",
}

const CAUSE_LABELS = {
  missing_refund_guard: "返金済み判定が欠けている",
  queue_leftover: "キャンセル済み注文が処理キューに残っている",
  rounding_bug: "価格の丸めで残高がずれた",
}

const el = {
  stagePath: document.getElementById("stage-path"),
  stageTitle: document.getElementById("stage-title"),
  stageGoal: document.getElementById("stage-goal"),
  progressLabel: document.getElementById("progress-label"),
  progressDots: document.getElementById("progress-dots"),
  chapterKicker: document.getElementById("chapter-kicker"),
  chapterNote: document.getElementById("chapter-note"),
  missionTitle: document.getElementById("mission-title"),
  missionCard: document.getElementById("mission-card"),
  inputRegion: document.getElementById("input-region"),
  visualTitle: document.getElementById("visual-title"),
  visualRegion: document.getElementById("visual-region"),
  timelineSection: document.getElementById("timeline-section"),
  timelineHeading: document.getElementById("timeline-heading"),
  timelineRegion: document.getElementById("timeline-region"),
  resultTitle: document.getElementById("result-title"),
  resultRegion: document.getElementById("result-region"),
  hintRegion: document.getElementById("hint-region"),
  detailRegion: document.getElementById("detail-region"),
  feedbackRegion: document.getElementById("feedback-region"),
  actionButtons: document.getElementById("action-buttons"),
  resetProgress: document.getElementById("reset-progress"),
}

const runtime = {
  gaugeStartMs: 0,
  gaugeRafId: 0,
}

const SEARCH_CONSOLE_SAMPLES = getSearchConsoleSamples()

const appState = loadProgress()

function loadProgress() {
  const fallback = {
    currentStageIndex: 0,
    stageStates: {},
    activeScreen: "stage",
    searchConsole: createInitialSearchConsoleState(),
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return {
      currentStageIndex: Number.isInteger(parsed.currentStageIndex)
        ? Math.max(0, Math.min(STAGE_SEQUENCE.length - 1, parsed.currentStageIndex))
        : 0,
      stageStates: parsed.stageStates && typeof parsed.stageStates === "object" ? parsed.stageStates : {},
      activeScreen: parsed.activeScreen === "search_console" ? "search_console" : "stage",
      searchConsole:
        parsed.searchConsole && typeof parsed.searchConsole === "object"
          ? {
              ...createInitialSearchConsoleState(),
              ...parsed.searchConsole,
            }
          : createInitialSearchConsoleState(),
    }
  } catch (_err) {
    return fallback
  }
}

function mergeStageState(stageId, existingState) {
  const initial = createInitialStageState(stageId)
  if (!existingState || typeof existingState !== "object") return initial

  const merged = {
    ...initial,
    ...existingState,
  }

  if (initial.checks) {
    merged.checks = {
      ...initial.checks,
      ...(existingState.checks || {}),
    }
  }

  if (Array.isArray(initial.turns)) {
    merged.turns = initial.turns.map((turn, index) => ({
      ...turn,
      ...((existingState.turns || [])[index] || {}),
    }))
  }

  if (Array.isArray(existingState.timeline)) merged.timeline = existingState.timeline
  if (Array.isArray(existingState.notes)) merged.notes = existingState.notes
  if (Array.isArray(existingState.turnLog)) merged.turnLog = existingState.turnLog

  return merged
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState))
}

function currentStage() {
  return STAGE_SEQUENCE[appState.currentStageIndex]
}

function ensureStageState(stageId) {
  appState.stageStates[stageId] = mergeStageState(stageId, appState.stageStates[stageId])
  return appState.stageStates[stageId]
}

function currentStageState() {
  return ensureStageState(currentStage().id)
}

function currentScreen() {
  return appState.activeScreen || "stage"
}

function searchConsoleState() {
  if (!appState.searchConsole) {
    appState.searchConsole = createInitialSearchConsoleState()
  }
  return appState.searchConsole
}

function openSearchConsole() {
  const stage = currentStage()
  const consoleState = searchConsoleState()
  consoleState.lastStageId = stage.id
  consoleState.appliedStageId = stage.id
  if (stage.id === "3-3") {
    const stageState = currentStageState()
    consoleState.initialParams = {
      split: stageState.splitCount,
      repeat: stageState.repeatCount,
      amount: stageState.amount,
    }
  }
  if (stage.id === "3-4") {
    const stageState = currentStageState()
    consoleState.initialParams = {
      split: stageState.searchSplit,
      repeat: stageState.searchRepeat,
      amount: stageState.amount,
    }
  }
  appState.activeScreen = "search_console"
  saveProgress()
  render()
}

function closeSearchConsole() {
  appState.activeScreen = "stage"
  saveProgress()
  render()
}

function resetJourney() {
  appState.currentStageIndex = 0
  appState.stageStates = {}
  appState.activeScreen = "stage"
  appState.searchConsole = createInitialSearchConsoleState()
  saveProgress()
  render()
}

function goNextStage() {
  const state = currentStageState()
  if (!state.success) return
  if (appState.currentStageIndex >= STAGE_SEQUENCE.length - 1) return
  appState.currentStageIndex += 1
  ensureStageState(currentStage().id)
  saveProgress()
  render()
}

function currentGaugePercent(now = performance.now()) {
  const elapsed = (now - runtime.gaugeStartMs) % GAUGE_CYCLE_MS
  const progress = elapsed / GAUGE_CYCLE_MS
  return progress < 0.5 ? progress * 200 : (1 - progress) * 200
}

function startGauge() {
  runtime.gaugeStartMs = performance.now()
  if (!runtime.gaugeRafId) {
    runtime.gaugeRafId = requestAnimationFrame(animateGauge)
  }
}

function stopGauge() {
  if (runtime.gaugeRafId) {
    cancelAnimationFrame(runtime.gaugeRafId)
    runtime.gaugeRafId = 0
  }
}

function animateGauge(now) {
  runtime.gaugeRafId = 0
  const stage = currentStage()
  const state = currentStageState()
  if (stage.id !== "1-2" || state.success) {
    return
  }

  const cursor = document.getElementById("gauge-cursor")
  const readout = document.getElementById("gauge-readout")
  const value = currentGaugePercent(now)
  if (cursor) cursor.style.left = `${value.toFixed(2)}%`
  if (readout) readout.textContent = `${value.toFixed(1)}%`
  runtime.gaugeRafId = requestAnimationFrame(animateGauge)
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function signNumber(value) {
  if (value > 0) return `+${value}`
  return String(value)
}

function percentNumber(current, total) {
  if (!total) return 0
  return Math.max(0, Math.min(100, (current / total) * 100))
}

function statCard(label, value, sub = "", accent = "normal") {
  return `
    <div class="stat-card ${accent}">
      <div class="stat-label">${escapeHtml(label)}</div>
      <div class="stat-value">${escapeHtml(String(value))}</div>
      ${sub ? `<div class="stat-sub">${escapeHtml(sub)}</div>` : ""}
    </div>
  `
}

function listCard(title, items, accent = "normal") {
  return `
    <div class="side-card ${accent}">
      <div class="side-card-title">${escapeHtml(title)}</div>
      <div class="side-list">
        ${items.map((item) => `<div class="side-list-item">${escapeHtml(item)}</div>`).join("")}
      </div>
    </div>
  `
}

function goalMeterCard(current, goal) {
  const progress = percentNumber(current, goal)
  return `
    <div class="side-card ${current >= goal ? "good" : "normal"}">
      <div class="side-card-title">目標達成率</div>
      <div class="goal-meter-head">
        <span>${escapeHtml(signNumber(current))} / ${escapeHtml(String(goal))}</span>
        <span>${Math.round(progress)}%</span>
      </div>
      <div class="goal-meter-bar">
        <div class="goal-meter-fill" style="width: ${progress.toFixed(1)}%"></div>
      </div>
    </div>
  `
}

function booleanText(value) {
  return value ? "true" : "false"
}

function orderIdBadge(orderId) {
  return `<span class="order-id-badge">${escapeHtml(orderId)}</span>`
}

function refundCountBadge(count, expected = 1) {
  const accent = count > expected ? "warn" : count === expected ? "good" : ""
  return `<span class="refund-count-badge ${accent}">返金回数 ${escapeHtml(String(count))}</span>`
}

function consistencyPanel(title, rows) {
  return `
    <div class="consistency-panel">
      <div class="consistency-panel-title">${escapeHtml(title)}</div>
      <div class="consistency-rows">
        ${rows
          .map(
            (row) => `
              <div class="consistency-row ${row.accent || ""}">
                <div class="consistency-key">${escapeHtml(row.label)}</div>
                <div class="consistency-value">${escapeHtml(String(row.value))}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `
}

function refundDiffPanel(normalCase, currentCase) {
  const metrics = [
    { label: "返金回数差", normal: normalCase.refundCount, current: currentCase.refundCount },
    { label: "残高差", normal: normalCase.balance, current: currentCase.balance },
    { label: "履歴件数差", normal: normalCase.eventCount, current: currentCase.eventCount },
  ]
  return `
    <div class="refund-diff-panel">
      <div class="refund-diff-title">正常との差分</div>
      <div class="refund-diff-grid">
        ${metrics
          .map(
            (metric) => `
              <div class="refund-diff-item ${metric.current > metric.normal ? "warn" : ""}">
                <div class="refund-diff-label">${escapeHtml(metric.label)}</div>
                <div class="refund-diff-values">
                  <span>正常 ${escapeHtml(String(metric.normal))}</span>
                  <span>今回 ${escapeHtml(String(metric.current))}</span>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `
}

function orderListWithStatus(orders, selectedOrderId) {
  return `
    <div class="order-list">
      ${orders
        .map(
          (order) => `
            <button
              class="order-list-row ${order.id === selectedOrderId ? "selected" : ""}"
              data-action="select_order"
              data-value="${escapeHtml(order.id)}"
            >
              <div class="order-list-main">
                ${orderIdBadge(order.id)}
                ${refundCountBadge(order.refundCount)}
              </div>
              <div class="order-list-meta">
                <span>${escapeHtml(order.status)}</span>
                <span>参照 ${escapeHtml(String(order.referenceCount))}</span>
              </div>
            </button>
          `
        )
        .join("")}
    </div>
  `
}

function chapter3ValueComparisonPanel(title, rows, accent = "") {
  return `
    <div class="value-compare-panel ${accent}">
      <div class="value-compare-title">${escapeHtml(title)}</div>
      <div class="value-compare-rows">
        ${rows
          .map(
            (row) => `
              <div class="value-compare-row ${row.accent || ""}">
                <div class="value-compare-key">${escapeHtml(row.label)}</div>
                <div class="value-compare-value">${escapeHtml(String(row.value))}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `
}

function roundingBreakdownCard(scenario, mode = "single") {
  const deltaValue = mode === "single" ? scenario.roundingDeltaSingle : scenario.splitGainSingle
  return `
    <div class="rounding-card">
      <div class="rounding-card-title">丸め内訳</div>
      <div class="rounding-grid">
        <div class="rounding-item">
          <div class="rounding-label">丸め前</div>
          <div class="rounding-value">${scenario.theoreticalSingle.toFixed(4)}</div>
        </div>
        <div class="rounding-item">
          <div class="rounding-label">丸め後</div>
          <div class="rounding-value">${scenario.batchRoundedSingle.toFixed(2)}</div>
        </div>
        <div class="rounding-item">
          <div class="rounding-label">${mode === "single" ? "単発差分" : "分割差分"}</div>
          <div class="rounding-value">${deltaValue >= 0 ? "+" : ""}${deltaValue.toFixed(4)}</div>
        </div>
      </div>
      <div class="rounding-rule">${escapeHtml(scenario.roundingRuleLabel)}</div>
      ${
        mode === "split"
          ? `<div class="rounding-rule">分割1回あたり: ${scenario.rawPartValue.toFixed(4)} → ${scenario.roundedPartValue.toFixed(2)}</div>`
          : ""
      }
    </div>
  `
}

function cumulativeDeltaMeter(currentDelta, targetDelta, bestDelta = 0) {
  const progress = Math.max(0, Math.min(100, (currentDelta / targetDelta) * 100))
  const bestProgress = Math.max(0, Math.min(100, (bestDelta / targetDelta) * 100))
  return `
    <div class="delta-meter ${currentDelta >= targetDelta ? "success" : ""}">
      <div class="delta-meter-head">
        <span>累積差分</span>
        <span>${currentDelta >= 0 ? "+" : ""}${currentDelta.toFixed(4)}</span>
      </div>
      <div class="delta-meter-bar">
        <div class="delta-meter-fill" style="width: ${progress.toFixed(1)}%"></div>
      </div>
      <div class="delta-meter-sub">
        <span>目標 ${targetDelta.toFixed(4)}</span>
        <span>ベスト ${bestDelta >= 0 ? "+" : ""}${bestDelta.toFixed(4)}</span>
      </div>
      <div class="delta-meter-ghost" style="width: ${bestProgress.toFixed(1)}%"></div>
    </div>
  `
}

function trialHistoryTable(rows, options = {}) {
  if (!rows.length) {
    return `<div class="history-empty">まだ試行履歴はありません。</div>`
  }
  return `
    <div class="trial-table-wrap">
      <table class="trial-table">
        <thead>
          <tr>
            <th>#</th>
            <th>split</th>
            <th>repeat</th>
            <th>理論値</th>
            <th>実際値</th>
            <th>単発差分</th>
            <th>累積差分</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row, index) => `
                <tr class="${options.bestId === row.id ? "best-row" : ""}">
                  <td>${index + 1}</td>
                  <td>${row.splitCount}</td>
                  <td>${row.repeatCount}</td>
                  <td>${row.expectedValue.toFixed(4)}</td>
                  <td>${row.actualValue.toFixed(4)}</td>
                  <td>${row.deltaSingle >= 0 ? "+" : ""}${row.deltaSingle.toFixed(4)}</td>
                  <td>${row.cumulativeDelta >= 0 ? "+" : ""}${row.cumulativeDelta.toFixed(4)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
}

function bestResultCard(bestTrial) {
  if (!bestTrial) {
    return `
      <div class="best-result-card empty">
        <div class="best-result-title">Best Result</div>
        <div class="best-result-empty">まだベスト結果はありません。</div>
      </div>
    `
  }

  return `
    <div class="best-result-card">
      <div class="best-result-title">Best Result</div>
      <div class="best-result-main">${bestTrial.cumulativeDelta >= 0 ? "+" : ""}${bestTrial.cumulativeDelta.toFixed(4)}</div>
      <div class="best-result-line">split ${bestTrial.splitCount}</div>
      <div class="best-result-line">repeat ${bestTrial.repeatCount}</div>
      <div class="best-result-line">理論値 ${bestTrial.expectedValue.toFixed(4)} / 実際値 ${bestTrial.actualValue.toFixed(4)}</div>
    </div>
  `
}

function searchRunnerPanel(state) {
  return `
    <div class="search-runner-panel">
      <div class="search-runner-title">候補条件</div>
      <div class="search-runner-list">
        ${state.candidates
          .map(
            (candidate) => `
              <div class="search-runner-row">
                <div class="search-runner-meta">split ${candidate.splitCount} / repeat ${candidate.repeatCount}</div>
                <button class="mini-action-btn" data-action="remove_candidate" data-value="${candidate.id}">削除</button>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `
}

function searchConsoleVisual(consoleState) {
  const errorBlock = consoleState.compileErrors.length
    ? `
      <div class="console-panel error">
        <div class="console-panel-title">Compiler Errors</div>
        ${consoleState.compileErrors.map((error) => `<div class="console-line">${escapeHtml(error)}</div>`).join("")}
      </div>
    `
    : `
      <div class="console-panel ${consoleState.compileState === "compiled" ? "good" : ""}">
        <div class="console-panel-title">Compile Status</div>
        <div class="console-line">${
          consoleState.compileState === "compiled"
            ? "コンパイル成功。実行可能です。"
            : consoleState.compileState === "runComplete"
              ? "実行済みです。結果を確認してください。"
              : "サンプルを読み込んで、コンパイルまたは実行できます。"
        }</div>
      </div>
    `

  return `
    <div class="console-layout">
      <div class="console-panel">
        <div class="console-panel-title">Script Examples</div>
        <div class="console-example-list">
          ${SEARCH_CONSOLE_SAMPLES.map(
            (sample) => `
              <button class="choice-chip" data-action="load_console_sample" data-value="${sample.id}">${escapeHtml(sample.label)}</button>
            `
          ).join("")}
        </div>
      </div>
      ${errorBlock}
      <div class="console-panel">
        <div class="console-panel-title">Execution Log</div>
        <div class="console-log">
          ${
            consoleState.executionLog.length
              ? consoleState.executionLog.map((line) => `<div class="console-line">${escapeHtml(line)}</div>`).join("")
              : `<div class="console-line">まだ実行ログはありません。</div>`
          }
        </div>
      </div>
    </div>
  `
}

function inlineChoiceButton(action, value, label, selected) {
  return `
    <button
      class="choice-chip ${selected ? "selected" : ""}"
      data-action="${escapeHtml(action)}"
      data-value="${escapeHtml(value)}"
    >
      ${escapeHtml(label)}
    </button>
  `
}

function selectedStage24Order(state) {
  return state.orders.find((order) => order.id === state.selectedOrderId) || state.orders[0]
}

function missionHtml(meta, state) {
  return `
    <div class="mission-chip">今回の目的</div>
    <h3>${escapeHtml(meta.title)}</h3>
    <p class="mission-text">${escapeHtml(meta.goal)}</p>
    <div class="mission-subtitle">やること</div>
    <div class="mission-list">
      ${meta.mission.map((item) => `<div class="mission-list-item">${escapeHtml(item)}</div>`).join("")}
    </div>
    <div class="mission-focus">注目: ${escapeHtml(meta.focus)}</div>
    ${
      state.success
        ? `<div class="mission-success">このステージは完了しました。次へ進めます。</div>`
        : ""
    }
  `
}

function inputHtml(stage, state) {
  if (stage.id === "0-4") {
    const activeLabels = {
      order: "順序を見る",
      status: "状態を見る",
      balance: "残高を見る",
    }
    return `
      <div class="control-card">
        <div class="control-title">確認の進め方</div>
        <div class="control-caption">中央のハイライトか、下の確認ボタンで順番に見ていきます。</div>
        <div class="control-fixed">
          <div>今見る場所: ${escapeHtml(activeLabels[state.currentFocusKey] || "全て確認済み")}</div>
          <div>確認済み: ${Object.values(state.checks).filter(Boolean).length} / 3</div>
        </div>
      </div>
    `
  }

  if (stage.id === "1-3") {
    return `
      <div class="control-card">
        <div class="control-title">タイミング設定</div>
        <div class="control-caption">変更できるのは注文タイミングだけです。</div>
        <input
          id="stage13-slider"
          class="timing-slider"
          data-role="stage13-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value="${state.selectedTiming}"
        />
        <div class="slider-readout">現在値: <span id="stage13-value">${state.selectedTiming}</span></div>
        <div class="control-fixed">
          <div>相手注文: 固定</div>
          <div>価格・数量: 固定</div>
          <div>処理周期: 固定</div>
        </div>
      </div>
    `
  }

  if (stage.id === "1-4") {
    return `
      <div class="control-card">
        <div class="control-title">ターン一覧</div>
        <div class="control-caption">3回のうち、影響が大きい場面だけを狙うのがコツです。</div>
        <div class="turn-ladder">
          ${state.turns
            .map(
              (turn, index) => `
                <div class="turn-ladder-item ${index === state.currentTurnIndex && !state.finished ? "active" : ""} ${turn.resolved ? "resolved" : ""}">
                  <div class="turn-ladder-head">${escapeHtml(turn.label)}</div>
                  <div class="turn-ladder-line">影響: ${escapeHtml(turn.visibleImpact)}</div>
                  <div class="turn-ladder-line">${
                    turn.resolved ? `結果 ${signNumber(turn.netProfit)}` : "未実行"
                  }</div>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="control-fixed">
          <div>目標利益: ${state.goalProfit}</div>
          <div>累積利益: ${signNumber(state.totalProfit)}</div>
          <div>選択中: ${state.pendingDecision === "order" ? "注文する" : state.pendingDecision === "skip" ? "見送る" : "未選択"}</div>
        </div>
      </div>
    `
  }

  if (stage.id === "2-3") {
    return `
      <div class="control-card">
        <div class="control-title">再現条件</div>
        <div class="control-caption">どのタイミングで再参照するかと、再実行するかだけを変えられます。</div>
        <div class="option-group">
          <div class="option-group-title">再参照タイミング</div>
          <div class="inline-choice-grid">
            ${Object.entries(REPLAY_TIMING_LABELS)
              .map(([value, label]) =>
                inlineChoiceButton("set_replay_timing", value, label, state.selectedReplayTiming === value)
              )
              .join("")}
          </div>
        </div>
        <div class="option-group">
          <div class="option-group-title">再実行</div>
          <div class="inline-choice-grid">
            ${Object.entries(REPLAY_MODE_LABELS)
              .map(([value, label]) =>
                inlineChoiceButton("set_replay_mode", value, label, state.selectedReplayMode === value)
              )
              .join("")}
          </div>
        </div>
        <div class="control-fixed">
          <div>対象注文ID: ${state.orderId}</div>
          <div>現在設定: ${REPLAY_TIMING_LABELS[state.selectedReplayTiming]} / ${REPLAY_MODE_LABELS[state.selectedReplayMode]}</div>
        </div>
      </div>
    `
  }

  if (stage.id === "2-4") {
    return `
      <div class="control-card">
        <div class="control-title">診断対象を選ぶ</div>
        <div class="control-caption">まず怪しい注文IDを選び、そのあと原因候補を絞ります。</div>
        <div class="option-group">
          <div class="option-group-title">注文ID</div>
          ${orderListWithStatus(state.orders, state.selectedOrderId)}
        </div>
        <div class="option-group">
          <div class="option-group-title">原因候補</div>
          <div class="inline-choice-stack">
            ${Object.entries(CAUSE_LABELS)
              .map(([value, label]) =>
                inlineChoiceButton("set_cause", value, label, state.selectedCauseId === value)
              )
              .join("")}
          </div>
        </div>
        <div class="control-fixed">
          <div>選択中注文: ${state.selectedOrderId}</div>
          <div>選択中原因: ${CAUSE_LABELS[state.selectedCauseId] || "未選択"}</div>
        </div>
      </div>
    `
  }

  if (stage.id === "3-2") {
    return `
      <div class="control-card">
        <div class="control-title">分割設定</div>
        <div class="control-caption">総量は固定です。変えられるのは split だけです。</div>
        <input
          class="timing-slider"
          data-role="stage32-split"
          type="range"
          min="2"
          max="5"
          step="1"
          value="${state.splitCount}"
        />
        <div class="slider-readout">split: <span id="stage32-value">${state.splitCount}</span></div>
        <div class="control-fixed">
          <div>総量 amount: ${state.amount}</div>
          <div>repeat: 1 固定</div>
        </div>
      </div>
    `
  }

  if (stage.id === "3-3") {
    return `
      <div class="control-card">
        <div class="control-title">探索条件</div>
        <div class="control-caption">split と repeat を変えながら、累積差分を増やします。</div>
        <div class="option-group">
          <div class="option-group-title">split</div>
          <input
            class="timing-slider"
            data-role="stage33-split"
            type="range"
            min="2"
            max="8"
            step="1"
            value="${state.splitCount}"
          />
          <div class="slider-readout">split: <span id="stage33-split-value">${state.splitCount}</span></div>
        </div>
        <div class="option-group">
          <div class="option-group-title">repeat</div>
          <input
            class="timing-slider"
            data-role="stage33-repeat"
            type="range"
            min="1"
            max="8"
            step="1"
            value="${state.repeatCount}"
          />
          <div class="slider-readout">repeat: <span id="stage33-repeat-value">${state.repeatCount}</span></div>
        </div>
        <div class="control-fixed">
          <div>amount: ${state.amount} 固定</div>
          <div>目標累積差分: ${state.targetDelta.toFixed(4)}</div>
        </div>
      </div>
    `
  }

  if (stage.id === "3-4") {
    return `
      <div class="control-card">
        <div class="control-title">候補作成</div>
        <div class="control-caption">候補を追加してから、まとめて比較します。</div>
        <div class="option-group">
          <div class="option-group-title">split</div>
          <input
            class="timing-slider"
            data-role="stage34-split"
            type="range"
            min="2"
            max="8"
            step="1"
            value="${state.searchSplit}"
          />
          <div class="slider-readout">split: <span id="stage34-split-value">${state.searchSplit}</span></div>
        </div>
        <div class="option-group">
          <div class="option-group-title">repeat</div>
          <input
            class="timing-slider"
            data-role="stage34-repeat"
            type="range"
            min="1"
            max="8"
            step="1"
            value="${state.searchRepeat}"
          />
          <div class="slider-readout">repeat: <span id="stage34-repeat-value">${state.searchRepeat}</span></div>
        </div>
        ${searchRunnerPanel(state)}
        <div class="control-fixed">
          <div>目標累積差分: ${state.targetDelta.toFixed(4)}</div>
          <div>候補数: ${state.candidates.length}</div>
        </div>
      </div>
    `
  }

  return `
    <div class="control-card">
      <div class="control-title">操作メモ</div>
      <div class="control-caption">${escapeHtml(state.nextFocus)}</div>
    </div>
  `
}

function processStripHtml(steps) {
  return `
    <div class="process-strip">
      ${steps
        .map(
          (step) => `
            <div class="process-step ${step.done ? "done" : ""}">
              <div class="process-step-main">${escapeHtml(step.label)}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `
}

function renderStage01Visual(state) {
  return `
    <div class="hero-status ${state.success ? "active" : ""}">
      <div class="hero-status-label">注文状態カード</div>
      <div class="hero-status-value">${escapeHtml(state.orderStatus)}</div>
      <div class="hero-status-sub">${state.success ? "注文が受け付けられ、状態が変わりました" : "まだ注文はありません"}</div>
    </div>
    <div class="summary-ribbon">
      <div class="summary-chip">プレイヤー操作: 買い注文</div>
      <div class="summary-chip ${state.success ? "good" : ""}">${state.success ? "タイムライン更新済み" : "未実行"}</div>
    </div>
  `
}

function renderStage02Visual(state) {
  const steps = [
    { label: "受付", done: state.hasOrder },
    { label: "処理", done: state.success },
    { label: "約定", done: state.success },
  ]
  return `
    ${processStripHtml(steps)}
    <div class="hero-status ${state.success || state.hasOrder ? "active" : ""}">
      <div class="hero-status-label">注文状態カード</div>
      <div class="hero-status-value">${escapeHtml(state.orderStatus)}</div>
      <div class="hero-status-sub">${state.success ? "受付と処理が別イベントだと確認できました" : "まずは受付、次に処理の順で進みます"}</div>
    </div>
  `
}

function renderStage03Visual(state) {
  const steps = [
    { label: "受付", done: true },
    { label: "取消", done: state.success },
    { label: "返金", done: state.success },
  ]
  return `
    ${processStripHtml(steps)}
    <div class="transition-card">
      <div class="transition-status">
        <span class="transition-pill before">受付済み</span>
        <span class="transition-arrow">→</span>
        <span class="transition-pill after ${state.success ? "active" : ""}">${escapeHtml(state.orderStatus)}</span>
      </div>
      <div class="refund-badge ${state.refundCount === 1 ? "active" : ""}">
        返金回数: ${state.refundCount}
      </div>
    </div>
    <div class="balance-shift">
      <div class="balance-shift-title">残高遷移</div>
      <div class="balance-shift-values">
        <span>80</span>
        <span class="transition-arrow">→</span>
        <span class="${state.success ? "balance-strong" : ""}">${state.balance}</span>
      </div>
    </div>
  `
}

function renderStage04Visual(state) {
  const focusFrames = [
    {
      key: "order",
      title: "受付順",
      value: "Player → Rival",
      text: "誰が先に受け付けられたかを追います。",
    },
    {
      key: "status",
      title: "状態カード",
      value: "受付済み → 約定済み",
      text: "未注文 / 受付済み / 約定済みの流れを見ます。",
    },
    {
      key: "balance",
      title: "残高パネル",
      value: "100 → 80 → 100",
      text: "拘束と返金が整合しているかを見ます。",
    },
  ]
  return `
    <div class="digest-scene">
      ${focusFrames
        .map((frame, index) => {
          const checked = state.checks[frame.key]
          const active = state.currentFocusKey === frame.key
          return `
            <button
              class="focus-frame ${checked ? "checked" : ""} ${active ? "active" : ""}"
              data-action="confirm_focus"
              data-value="${frame.key}"
            >
              <div class="focus-frame-head">
                <span class="focus-step">${index + 1}</span>
                <span class="focus-title">${escapeHtml(frame.title)}</span>
              </div>
              <div class="focus-value">${escapeHtml(frame.value)}</div>
              <div class="focus-text">${escapeHtml(frame.text)}</div>
              <div class="focus-state">${checked ? "確認済み" : active ? "今ここを見る" : "クリックで確認"}</div>
            </button>
          `
        })
        .join("")}
    </div>
  `
}

function orderPanel(title, items, accent = "") {
  return `
    <div class="order-panel ${accent}">
      <div class="order-panel-title">${escapeHtml(title)}</div>
      <div class="order-panel-list">
        ${items
          .map(
            (item, index) => `
              <div class="order-panel-row ${item === "?" ? "placeholder" : ""}">
                <span class="order-rank">${index + 1}.</span>
                <span>${escapeHtml(item)}</span>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `
}

function renderComparison(receptionOrder, executionOrder, resultLabel) {
  const executionAccent = executionOrder.some((item) => item !== "?") ? "alert" : ""
  return `
    <div class="compare-grid">
      ${orderPanel("受付順", receptionOrder)}
      ${orderPanel("実行順", executionOrder, executionAccent)}
    </div>
    <div class="compare-caption">${escapeHtml(resultLabel)}</div>
  `
}

function renderStage11Visual(state) {
  return `
    <div class="order-layout">
      ${orderPanel("受付順", state.receptionOrder)}
      ${orderPanel("実行順", state.executionOrder, state.success ? "alert" : "")}
      <div class="order-panel result ${state.success ? "alert" : ""}">
        <div class="order-panel-title">最終結果</div>
        <div class="result-chip ${state.success ? "alert" : ""}">${escapeHtml(state.resultLabel)}</div>
        <div class="result-impact">${state.success ? "Rival が Player より先に実行されました。" : "まだ処理していません。"}</div>
        <div class="result-metric">利益差 ${escapeHtml(signNumber(state.profitDelta))}</div>
      </div>
    </div>
  `
}

function renderStage12Visual(state) {
  const verdict = state.success ? "割り込み成功" : state.attempts > 0 ? "通常順序" : "未実行"
  return `
    <div class="timing-layout">
      <div class="gauge-panel focus">
        <div class="gauge-header">
          <div class="gauge-title">タイミングゲージ</div>
          <div class="gauge-readout" id="gauge-readout">${state.lastProgress === null ? "0.0%" : `${state.lastProgress.toFixed(1)}%`}</div>
        </div>
        <div class="gauge-track">
          <div class="gauge-danger-zone"></div>
          <div class="gauge-cursor" id="gauge-cursor"></div>
        </div>
        <div class="gauge-caption">処理直前の狭い帯だけが割り込みの成立ポイントです。</div>
        <div class="event-strip">
          <div class="event-node active">受付順固定</div>
          <div class="event-node ${state.attempts > 0 ? "active" : ""}">処理直前</div>
          <div class="event-node ${state.success ? "anomaly" : state.attempts > 0 ? "done" : ""}">${escapeHtml(verdict)}</div>
        </div>
      </div>
      <div class="compare-stack">
        ${renderComparison(state.receptionOrder, state.executionOrder, state.resultLabel)}
      </div>
    </div>
  `
}

function renderStage13Visual(state) {
  return `
    <div class="simulation-layout">
      ${renderComparison(state.receptionOrder, state.executionOrder, state.resultLabel)}
      <div class="sim-result-card ${state.success ? "success" : state.attempts > 0 ? "warn" : ""}">
        <div class="sim-result-title">シミュレーション結果</div>
        <div class="sim-result-row">現在タイミング: <strong>${state.selectedTiming}</strong></div>
        <div class="sim-result-row">判定: <strong>${escapeHtml(state.resultLabel)}</strong></div>
        <div class="sim-result-row">利益差: <strong>${escapeHtml(signNumber(state.profitDelta))}</strong></div>
      </div>
    </div>
    <div class="diff-banner ${state.success ? "success" : state.attempts > 0 ? "warn" : ""}">
      ${
        state.success
          ? "差分: Interrupt が Rival より前に入り、順序逆転を再現しました。"
          : state.attempts > 0
            ? `差分: タイミング ${state.selectedTiming} では順序は通常のままでした。`
            : "差分: まだ実行していません。"
      }
    </div>
  `
}

function renderStage14Visual(state) {
  const currentTurn = state.turns[state.currentTurnIndex]
  const latestResolved = [...state.turns].reverse().find((turn) => turn.resolved)
  return `
    <div class="strategy-layout">
      <div class="strategy-card ${currentTurn ? "active" : ""}">
        ${
          currentTurn
            ? `
              <div class="scenario-title">${escapeHtml(currentTurn.label)} の状況</div>
              <div class="scenario-line">相手注文情報: ${escapeHtml(currentTurn.marketHint)}</div>
              <div class="scenario-line">割り込み候補: ${escapeHtml(currentTurn.rivalWindow)}</div>
              <div class="scenario-line">期待影響: ${escapeHtml(currentTurn.visibleImpact)}</div>
              <div class="scenario-line">注文コスト: ${currentTurn.orderCost}</div>
            `
            : `
              <div class="scenario-title">第1章クリア判定</div>
              <div class="scenario-line">全ターンが終了しました。右側の累積結果を確認してください。</div>
            `
        }
      </div>
      <div class="strategy-card">
        <div class="scenario-title">${latestResolved ? `${latestResolved.label} の実行結果` : "実行結果"}</div>
        ${
          latestResolved
            ? `
              <div class="scenario-line">${escapeHtml(latestResolved.summary)}</div>
              <div class="execution-mini">実行順: ${escapeHtml(latestResolved.executionOrder.join(" → "))}</div>
            `
            : `
              <div class="scenario-line">まだターンを実行していません。</div>
            `
        }
      </div>
    </div>
  `
}

function renderStage21Visual(state) {
  return `
    <div class="case-layout">
      <div class="case-card ${state.success ? "good" : ""}">
        <div class="case-head">
          ${orderIdBadge(state.orderId)}
          ${refundCountBadge(state.refundCount)}
        </div>
        <div class="case-title">正常なキャンセルの基準</div>
        <div class="case-status-flow">
          <span class="transition-pill before">受付済み</span>
          <span class="transition-arrow">→</span>
          <span class="transition-pill after ${state.refundCount > 0 ? "active" : ""}">${escapeHtml(state.orderStatus)}</span>
        </div>
        <div class="case-meta-line">残高 80 → ${escapeHtml(String(state.balance))}</div>
        <div class="case-meta-line">参照回数 ${state.referenceCount}</div>
        <div class="case-note">同じ注文IDが一度だけ終了処理される、という第2章の基準ケースです。</div>
      </div>
      ${consistencyPanel("整合性チェック", [
        { label: "表示状態", value: state.orderStatus, accent: state.success ? "good" : "" },
        { label: "内部フラグ refunded", value: booleanText(state.flags.refunded), accent: state.success ? "good" : "" },
        { label: "履歴要約", value: state.historySummary, accent: state.success ? "good" : "" },
        { label: "closed フラグ", value: booleanText(state.flags.closed), accent: state.success ? "good" : "" },
      ])}
    </div>
  `
}

function renderStage22Visual(state) {
  const normalCase = {
    refundCount: state.expectedRefundCount,
    balance: state.expectedBalance,
    eventCount: state.expectedEventCount,
  }
  const currentCase = {
    refundCount: state.refundCount,
    balance: state.balance,
    eventCount: state.timeline.length,
  }
  return `
    <div class="duplicate-alert ${state.success ? "active" : ""}">
      ${
        state.success
          ? "注文 ORD-02 が再び処理され、返金が二度起きています"
          : state.phase === "after_cancel"
            ? "ここまでは正常です。処理を続けると異常が発生します"
            : "まずは ORD-02 をキャンセルして、正常な終了点を見てください"
      }
    </div>
    <div class="compare-case-grid">
      <div class="case-card">
        <div class="case-head">
          ${orderIdBadge(state.orderId)}
          ${refundCountBadge(state.expectedRefundCount)}
        </div>
        <div class="case-title">正常ケース</div>
        <div class="case-meta-line">状態: 返金済み</div>
        <div class="case-meta-line">残高: ${state.expectedBalance}</div>
        <div class="case-meta-line">履歴: 注文受付 → キャンセル → 返金 → 終了</div>
      </div>
      <div class="case-card ${state.success ? "warn" : ""}">
        <div class="case-head">
          ${orderIdBadge(state.orderId)}
          ${refundCountBadge(state.refundCount)}
        </div>
        <div class="case-title">今回の実際結果</div>
        <div class="case-meta-line">状態: ${escapeHtml(state.orderStatus)}</div>
        <div class="case-meta-line">残高: ${escapeHtml(String(state.balance))}</div>
        <div class="case-meta-line">参照回数: ${escapeHtml(String(state.referenceCount))}</div>
        <div class="case-meta-line">履歴要約: ${escapeHtml(state.historySummary)}</div>
      </div>
    </div>
    ${refundDiffPanel(normalCase, currentCase)}
    ${consistencyPanel("矛盾している点", [
      { label: "返金回数", value: `${state.expectedRefundCount} → ${state.refundCount}`, accent: state.success ? "warn" : state.phase === "after_cancel" ? "good" : "" },
      { label: "終了後の再処理", value: state.duplicateProcessing ? "発生" : state.phase === "after_cancel" ? "まだ起きていない" : "未発生", accent: state.success ? "warn" : state.phase === "after_cancel" ? "good" : "" },
      { label: "履歴件数", value: `${state.expectedEventCount} → ${state.timeline.length}`, accent: state.success ? "warn" : "" },
      { label: "同じ注文ID", value: state.orderId, accent: state.success ? "warn" : "" },
    ])}
  `
}

function renderStage23Visual(state) {
  return `
    <div class="case-layout">
      <div class="case-card ${state.success ? "warn" : ""}">
        <div class="case-head">
          ${orderIdBadge(state.orderId)}
          ${refundCountBadge(state.refundCount)}
        </div>
        <div class="case-title">今回の実行結果</div>
        <div class="case-meta-line">再参照タイミング: ${REPLAY_TIMING_LABELS[state.selectedReplayTiming]}</div>
        <div class="case-meta-line">再実行: ${REPLAY_MODE_LABELS[state.selectedReplayMode]}</div>
        <div class="case-meta-line">判定: ${escapeHtml(state.resultLabel)}</div>
        <div class="case-meta-line">残高: ${escapeHtml(String(state.balance))}</div>
        <div class="case-meta-line">履歴要約: ${escapeHtml(state.historySummary)}</div>
      </div>
      ${consistencyPanel("状態とフラグ", [
        { label: "表示状態", value: state.orderStatus, accent: state.success ? "warn" : "good" },
        { label: "refundCount", value: state.refundCount, accent: state.refundCount > 1 ? "warn" : "good" },
        { label: "refunded フラグ", value: booleanText(state.flags.refunded), accent: state.success ? "warn" : "good" },
        { label: "historySummary", value: state.historySummary, accent: state.success ? "warn" : "" },
        { label: "参照回数", value: state.referenceCount, accent: state.referenceCount > 1 ? "warn" : "" },
      ])}
    </div>
    <div class="diff-banner ${state.success ? "warn" : state.attempts > 0 ? "success" : ""}">
      ${
        state.success
          ? "差分: 返金済み判定が欠けたまま再参照され、返金が2回実行されました。"
          : state.attempts > 0
            ? "差分: まだ返金は1回だけで止まっています。再参照のタイミングを見直してください。"
            : "差分: まだ実行していません。"
      }
    </div>
  `
}

function renderStage24Visual(state) {
  const selectedOrder = selectedStage24Order(state)
  return `
    <div class="case-layout">
      <div class="case-card ${selectedOrder.anomaly ? "warn" : ""}">
        <div class="case-head">
          ${orderIdBadge(selectedOrder.id)}
          ${refundCountBadge(selectedOrder.refundCount)}
        </div>
        <div class="case-title">選択中の注文</div>
        <div class="case-meta-line">状態: ${escapeHtml(selectedOrder.status)}</div>
        <div class="case-meta-line">ケース残高: ${escapeHtml(String(selectedOrder.balance))}</div>
        <div class="case-meta-line">参照回数: ${escapeHtml(String(selectedOrder.referenceCount))}</div>
        <div class="case-note">${escapeHtml(selectedOrder.summary)}</div>
      </div>
      ${consistencyPanel("状態の整合性", [
        { label: "表示状態", value: selectedOrder.status, accent: selectedOrder.anomaly ? "warn" : "good" },
        { label: "refundCount", value: selectedOrder.refundCount, accent: selectedOrder.refundCount > 1 ? "warn" : "good" },
        { label: "internal refunded", value: booleanText(selectedOrder.flags.refunded), accent: selectedOrder.anomaly && !selectedOrder.flags.refunded ? "warn" : "good" },
        { label: "historySummary", value: selectedOrder.summary, accent: selectedOrder.anomaly ? "warn" : "" },
        { label: "requeued", value: booleanText(selectedOrder.flags.requeued), accent: selectedOrder.flags.requeued ? "warn" : "good" },
      ])}
    </div>
  `
}

function renderStage31Visual(state) {
  const scenario = state.scenario
  return `
    <div class="chapter3-visual-stack">
      ${chapter3ValueComparisonPanel(
        "Value Comparison",
        [
          { label: "理論値", value: scenario.theoreticalSingle.toFixed(4) },
          { label: "実際値", value: scenario.batchRoundedSingle.toFixed(2) },
          {
            label: "差分",
            value: `${scenario.roundingDeltaSingle >= 0 ? "+" : ""}${scenario.roundingDeltaSingle.toFixed(4)}`,
            accent: state.hasCalculated ? "good" : "",
          },
        ],
        state.hasCompared ? "good" : ""
      )}
      ${roundingBreakdownCard(scenario)}
    </div>
  `
}

function renderStage32Visual(state) {
  const scenario = state.scenario
  return `
    <div class="chapter3-visual-stack">
      ${chapter3ValueComparisonPanel(
        "一括 vs 分割",
        [
          { label: "一括結果", value: scenario.batchRoundedSingle.toFixed(2) },
          { label: "分割結果", value: scenario.splitActualSingle.toFixed(4) },
          {
            label: "差分",
            value: `${scenario.splitGainSingle >= 0 ? "+" : ""}${scenario.splitGainSingle.toFixed(4)}`,
            accent: scenario.splitGainSingle > 0 ? "good" : "",
          },
        ],
        scenario.splitGainSingle > 0 ? "good" : ""
      )}
      ${roundingBreakdownCard(scenario, "split")}
      ${cumulativeDeltaMeter(scenario.cumulativeDelta, 0.03, scenario.cumulativeDelta)}
    </div>
  `
}

function renderStage33Visual(state) {
  const latestTrial = state.latestTrial
  return `
    <div class="chapter3-visual-stack">
      ${
        latestTrial
          ? chapter3ValueComparisonPanel(
              "今回の試行",
              [
                { label: "split / repeat", value: `${latestTrial.splitCount} / ${latestTrial.repeatCount}` },
                { label: "単発差分", value: `${latestTrial.deltaSingle >= 0 ? "+" : ""}${latestTrial.deltaSingle.toFixed(4)}` },
                {
                  label: "累積差分",
                  value: `${latestTrial.cumulativeDelta >= 0 ? "+" : ""}${latestTrial.cumulativeDelta.toFixed(4)}`,
                  accent: latestTrial.cumulativeDelta >= state.targetDelta ? "good" : "",
                },
              ],
              latestTrial.cumulativeDelta >= state.targetDelta ? "good" : ""
            )
          : `<div class="history-empty">まだ試行していません。split と repeat を決めて実行してください。</div>`
      }
      ${trialHistoryTable(state.trialHistory, { bestId: state.bestTrial?.id || "" })}
    </div>
  `
}

function renderStage34Visual(state) {
  return `
    <div class="chapter3-visual-stack">
      ${chapter3ValueComparisonPanel(
        "探索サマリ",
        [
          { label: "候補数", value: state.candidates.length },
          { label: "探索回数", value: state.batchRunCount },
          {
            label: "現在ベスト",
            value: state.bestTrial ? `${state.bestTrial.cumulativeDelta >= 0 ? "+" : ""}${state.bestTrial.cumulativeDelta.toFixed(4)}` : "未実行",
            accent: state.bestTrial && state.bestTrial.cumulativeDelta >= state.targetDelta ? "good" : "",
          },
        ],
        state.success ? "good" : ""
      )}
      ${trialHistoryTable(state.trialHistory, { bestId: state.bestTrial?.id || "" })}
    </div>
  `
}

function visualHtml(stage, state) {
  switch (stage.id) {
    case "0-1":
      return renderStage01Visual(state)
    case "0-2":
      return renderStage02Visual(state)
    case "0-3":
      return renderStage03Visual(state)
    case "0-4":
      return renderStage04Visual(state)
    case "1-1":
      return renderStage11Visual(state)
    case "1-2":
      return renderStage12Visual(state)
    case "1-3":
      return renderStage13Visual(state)
    case "1-4":
      return renderStage14Visual(state)
    case "2-1":
      return renderStage21Visual(state)
    case "2-2":
      return renderStage22Visual(state)
    case "2-3":
      return renderStage23Visual(state)
    case "2-4":
      return renderStage24Visual(state)
    case "3-1":
      return renderStage31Visual(state)
    case "3-2":
      return renderStage32Visual(state)
    case "3-3":
      return renderStage33Visual(state)
    case "3-4":
      return renderStage34Visual(state)
    default:
      return ""
  }
}

function timelineEmptyLabel(stage) {
  if (stage.id === "1-4") return "まだ順序ログはありません。"
  if (stage.id === "2-4") return "選択中注文の履歴はありません。"
  if (stage.chapter === 2) return "この注文の履歴はまだありません。"
  return "まだイベントはありません。"
}

function timelineHtml(stage, state) {
  if (!state.timeline.length) {
    return `<div class="timeline-empty">${escapeHtml(timelineEmptyLabel(stage))}</div>`
  }
  return state.timeline
    .map(
      (item, index) => `
        <div class="timeline-item ${item.kind}">
          <div class="timeline-index">#${index + 1}</div>
          <div class="timeline-body">
            <div class="timeline-label">${escapeHtml(item.label)}</div>
            ${
              stage.chapter === 2
                ? `
                  <div class="timeline-meta">
                    ${item.orderId ? `<span class="timeline-tag">${escapeHtml(item.orderId)}</span>` : ""}
                    ${item.type ? `<span class="timeline-tag subtle">${escapeHtml(item.type)}</span>` : ""}
                  </div>
                `
                : ""
            }
            <div class="timeline-detail">${escapeHtml(item.detail)}</div>
          </div>
        </div>
      `
    )
    .join("")
}

function resultHtml(stage, state) {
  switch (stage.id) {
    case "0-1":
      return [
        statCard("注文状態", state.orderStatus, state.success ? "更新済み" : "待機中", state.success ? "good" : "normal"),
        statCard("現在残高", state.balance, state.success ? "20 が予約済みになりました" : "変化なし"),
        statCard("予約済み", state.reserved, "注文にひも付く拘束資金"),
      ].join("")
    case "0-2":
      return [
        statCard("注文状態", state.orderStatus, state.success ? "約定まで進行済み" : state.hasOrder ? "受付のみ完了" : "未注文", state.success ? "good" : "normal"),
        statCard("現在残高", state.balance, `予約済み ${state.reserved}`),
        statCard("保有 A", state.assetA, state.success ? "約定で増えました" : "まだ増えていません"),
      ].join("")
    case "0-3":
      return [
        statCard("注文状態", state.orderStatus, state.success ? "正常に復帰しました" : "キャンセル待ち", state.success ? "good" : "normal"),
        statCard("残高遷移", state.success ? "80→100" : "80→80", "拘束分が戻るかを見る"),
        statCard("返金回数", state.refundCount, "正常系では 1 回だけ", state.refundCount === 1 ? "good" : "normal"),
      ].join("")
    case "0-4": {
      const activeLabels = {
        order: "順序",
        status: "状態",
        balance: "残高",
      }
      return [
        statCard("確認状況", `${Object.values(state.checks).filter(Boolean).length}/3`, "順序 / 状態 / 残高", state.success ? "good" : "normal"),
        statCard("今見る場所", activeLabels[state.currentFocusKey] || "全て確認済み", state.success ? "次は第1章です" : "中央のハイライトを確認"),
      ].join("")
    }
    case "1-1":
      return [
        statCard("利益差", signNumber(state.profitDelta), state.anomalyLabel || state.resultLabel, state.success ? "warn" : "normal"),
        statCard("状態", state.resultLabel, state.success ? "受付順と実行順が逆転しました" : "まだ未実行"),
        statCard("先に実行された側", state.executionOrder[0], state.success ? "Rival が先行" : "まだ未確定"),
      ].join("")
    case "1-2":
      return [
        statCard("判定", state.resultLabel, state.success ? "順序逆転が発生" : state.attempts > 0 ? "通常順序のまま" : "まだ未実行", state.success ? "good" : state.attempts > 0 ? "warn" : "normal"),
        statCard("最後の位置", state.lastProgress === null ? "-" : `${state.lastProgress.toFixed(1)}%`, "割り込みボタンを押した位置"),
        statCard("利益差", signNumber(state.profitDelta), state.success ? "成功時のみプラス" : "失敗時は変化なし"),
      ].join("")
    case "1-3":
      return [
        statCard("試行回数", state.attempts, "失敗回数に応じてヒント解放"),
        statCard("現在タイミング", state.selectedTiming, state.successWindow ? "正解帯ヒントあり" : "探索中"),
        statCard("判定", state.resultLabel, state.success ? "再現に成功しました" : "まだ条件探索中", state.success ? "good" : state.attempts > 0 ? "warn" : "normal"),
      ].join("")
    case "1-4":
      return [
        statCard("累積利益", signNumber(state.totalProfit), `目標 ${state.goalProfit}`, state.totalProfit >= state.goalProfit ? "good" : "normal"),
        statCard("残り手数", state.remainingTurns, state.finished ? "終了" : "残りターン"),
        goalMeterCard(state.totalProfit, state.goalProfit),
      ].join("")
    case "2-1":
      return [
        statCard("注文ID", state.orderId, "同じ注文を追います"),
        statCard("返金回数", state.refundCount, "正常系では 1 回だけ", state.refundCount === 1 ? "good" : "normal"),
        statCard("現在残高", state.balance, `予約済み ${state.reserved}`),
      ].join("")
    case "2-2":
      return [
        statCard("返金回数", state.refundCount, `正常は ${state.expectedRefundCount}`, state.refundCount > state.expectedRefundCount ? "warn" : "good"),
        statCard("現在残高", state.balance, `正常は ${state.expectedBalance}`, state.balance > state.expectedBalance ? "warn" : "good"),
        statCard("参照回数", state.referenceCount, "同じ注文を何回読んだか", state.referenceCount > 1 ? "warn" : "normal"),
        statCard("進行段階", state.phase === "pre_cancel" ? "キャンセル前" : state.phase === "after_cancel" ? "返金1回確認中" : "二重返金観察中", "キャンセル後に処理を続けると異常が出ます"),
      ].join("")
    case "2-3":
      return [
        statCard("判定", state.resultLabel, state.success ? "二重返金を再現しました" : "まだ返金は1回だけです", state.success ? "warn" : state.attempts > 0 ? "good" : "normal"),
        statCard("返金回数", state.refundCount, `対象 ${state.orderId}`, state.refundCount > 1 ? "warn" : "good"),
        statCard("試行回数", state.attempts, state.revealedRecipe ? "正解条件ヒントあり" : "条件探索中"),
      ].join("")
    case "2-4": {
      const selectedOrder = selectedStage24Order(state)
      return [
        statCard("選択中注文", selectedOrder.id, `返金回数 ${selectedOrder.refundCount}`, selectedOrder.anomaly ? "warn" : "normal"),
        statCard("診断状態", state.diagnosisResult, state.success ? "注文と原因の両方を特定" : "まだ調査中", state.success ? "good" : "normal"),
        statCard("原因候補", CAUSE_LABELS[state.selectedCauseId] || "未選択", "原因を1つ選んで診断します"),
        statCard("一覧残高", selectedOrder.balance, "残高だけでは特定できません"),
      ].join("")
    }
    case "3-1":
      return [
        statCard("理論値", state.scenario.theoreticalSingle.toFixed(4), "丸め前の理論値"),
        statCard("実際値", state.scenario.batchRoundedSingle.toFixed(2), "実装上の丸め後"),
        statCard("差分", `${state.scenario.roundingDeltaSingle >= 0 ? "+" : ""}${state.scenario.roundingDeltaSingle.toFixed(4)}`, "丸めによる微差", state.hasCalculated ? "good" : "normal"),
      ].join("")
    case "3-2":
      return [
        statCard("一括結果", state.scenario.batchRoundedSingle.toFixed(2), "比較基準"),
        statCard("分割結果", state.scenario.splitActualSingle.toFixed(4), `split ${state.splitCount}`),
        statCard("累積差分", `${state.scenario.cumulativeDelta >= 0 ? "+" : ""}${state.scenario.cumulativeDelta.toFixed(4)}`, "1回だけなので単発差分と同じ", state.scenario.splitGainSingle > 0 ? "good" : "normal"),
      ].join("")
    case "3-3":
      return [
        statCard("試行回数", state.attempts, "手動探索の回数"),
        statCard("目標差分", state.targetDelta.toFixed(4), "これを超えるとクリア"),
        statCard(
          "現在ベスト",
          state.bestTrial ? `${state.bestTrial.cumulativeDelta >= 0 ? "+" : ""}${state.bestTrial.cumulativeDelta.toFixed(4)}` : "未登録",
          state.bestTrial ? `split ${state.bestTrial.splitCount} / repeat ${state.bestTrial.repeatCount}` : "まだ試行していません",
          state.success ? "good" : "normal"
        ),
      ].join("")
    case "3-4":
      return [
        statCard("候補数", state.candidates.length, "GUI でまとめて比較"),
        statCard("探索回数", state.batchRunCount, "まとめて試した回数"),
        statCard(
          "現在ベスト",
          state.bestTrial ? `${state.bestTrial.cumulativeDelta >= 0 ? "+" : ""}${state.bestTrial.cumulativeDelta.toFixed(4)}` : "未登録",
          state.bestTrial ? `split ${state.bestTrial.splitCount} / repeat ${state.bestTrial.repeatCount}` : "まだ探索していません",
          state.success ? "good" : "normal"
        ),
      ].join("")
    default:
      return ""
  }
}

function hintHtml(stage, state) {
  const blocks = [
    listCard("短いフィードバック", [state.feedback, state.nextFocus], state.success ? "good" : "normal"),
  ]

  if (stage.id === "0-4") {
    const guideItems = [
      `${state.checks.order ? "✓" : "□"} 1. 順序を見る`,
      `${state.checks.status ? "✓" : "□"} 2. 状態を見る`,
      `${state.checks.balance ? "✓" : "□"} 3. 残高を見る`,
    ]
    blocks.unshift(listCard("観察ガイド", guideItems, state.success ? "good" : "normal"))
  }

  if (stage.id === "1-2" && state.attempts > 0) {
    blocks.push(
      listCard(
        "今回の判定",
        [
          `ゲージ位置: ${state.lastProgress?.toFixed(1) ?? "0.0"}%`,
          state.success ? "Interrupt が Rival より前に入りました。" : "Rival が先のままでした。",
        ],
        state.success ? "good" : "warn"
      )
    )
  }

  if (stage.id === "1-3") {
    blocks.push(
      listCard(
        "探索メモ",
        [
          `試行回数: ${state.attempts}`,
          `現在タイミング: ${state.selectedTiming}`,
          state.successWindow ? `正解帯ヒント: ${state.successWindow.start}〜${state.successWindow.end}` : "正解帯ヒント: 未表示",
        ],
        state.success ? "good" : state.attempts > 0 ? "warn" : "normal"
      )
    )

    const hints = [
      "少し遅らせると変化が出るかもしれません。",
      "受付そのものより、処理直前の割り込みが重要です。",
      "正解帯は 72〜82 付近です。そこを中心に探してみましょう。",
    ].slice(0, state.shownHints)

    if (hints.length) {
      blocks.push(listCard("解放済みヒント", hints, "warn"))
    }
  }

  if (stage.id === "1-4") {
    blocks.push(
      listCard(
        "戦略メモ",
        state.turnLog.length ? state.turnLog : ["まだターンを実行していません。"],
        state.success ? "good" : "normal"
      )
    )
  }

  if (stage.id === "2-1") {
    blocks.push(
      listCard(
        "観察メモ",
        [
          `注文ID: ${state.orderId}`,
          `refundCount: ${state.refundCount}`,
          `refunded フラグ: ${booleanText(state.flags.refunded)}`,
        ],
        state.success ? "good" : "normal"
      )
    )
  }

  if (stage.id === "2-2") {
    blocks.push(
      listCard(
        "正常との差",
        [
          `正常: refundCount ${state.expectedRefundCount} / balance ${state.expectedBalance}`,
          `今回: refundCount ${state.refundCount} / balance ${state.balance}`,
          state.success
            ? "終了済みの注文が再び返金対象になっています。"
            : state.phase === "after_cancel"
              ? "ここまでは正常です。次に処理を続けると異常が見えます。"
              : "まずはキャンセルして、正常終了点を確認してください。",
        ],
        state.success ? "warn" : "normal"
      )
    )
  }

  if (stage.id === "2-3") {
    blocks.push(
      listCard(
        "探索メモ",
        [
          `再参照タイミング: ${REPLAY_TIMING_LABELS[state.selectedReplayTiming]}`,
          `再実行: ${REPLAY_MODE_LABELS[state.selectedReplayMode]}`,
          `参照回数: ${state.referenceCount}`,
        ],
        state.success ? "warn" : state.attempts > 0 ? "good" : "normal"
      )
    )

    const hints = [
      "返金の後に、同じ注文がもう一度参照される流れを探してください。",
      "キャンセルだけでは足りません。処理の再実行や再照会に注目してください。",
      "正解例に近い流れを表示します。",
    ].slice(0, state.shownHints)

    if (hints.length) {
      blocks.push(listCard("解放済みヒント", hints, "warn"))
    }

    if (state.revealedRecipe) {
      blocks.push(
        listCard(
          "正解条件",
          [`${REPLAY_TIMING_LABELS[state.revealedRecipe.timing]} / ${REPLAY_MODE_LABELS[state.revealedRecipe.mode]}`],
          "good"
        )
      )
    }
  }

  if (stage.id === "2-4") {
    const selectedOrder = selectedStage24Order(state)
    blocks.push(
      listCard(
        "選択中注文の観察",
        [
          `注文ID: ${selectedOrder.id}`,
          `refundCount: ${selectedOrder.refundCount}`,
          `requeued: ${booleanText(selectedOrder.flags.requeued)}`,
          selectedOrder.anomaly
            ? "返金済みなのに refunded フラグが立っていません。"
            : "この注文単体では大きな矛盾は見えません。",
        ],
        selectedOrder.anomaly ? "warn" : "normal"
      )
    )
  }

  if (stage.id === "3-1") {
    blocks.push(listCard("観察ポイント", ["理論値", "実際値", "差分"], state.hasCompared ? "good" : "normal"))
    blocks.push(listCard("丸め規則", [state.scenario.roundingRuleLabel], "normal"))
  }

  if (stage.id === "3-2") {
    blocks.push(
      listCard(
        "比較メモ",
        [
          `split ${state.splitCount}`,
          `一括 ${state.scenario.batchRoundedSingle.toFixed(2)} / 分割 ${state.scenario.splitActualSingle.toFixed(4)}`,
          state.scenario.splitGainSingle > 0 ? "分割結果が基準より増えています。" : "この split ではまだ有利差が出ていません。",
        ],
        state.success ? "good" : "normal"
      )
    )
    blocks.push(cumulativeDeltaMeter(state.scenario.cumulativeDelta, 0.03, state.scenario.cumulativeDelta))
  }

  if (stage.id === "3-3") {
    blocks.push(bestResultCard(state.bestTrial))
    blocks.push(cumulativeDeltaMeter(state.latestTrial?.cumulativeDelta || 0, state.targetDelta, state.bestTrial?.cumulativeDelta || 0))
    const hints = [
      "分割回数だけでなく、反復回数にも注目してください。",
      "単発差分より累積差分を見た方が有利な条件を見つけやすくなります。",
      "高い差分を出した試行例をヒントとして表示します。",
    ].slice(0, state.shownHints)
    if (hints.length) {
      blocks.push(listCard("解放済みヒント", hints, "warn"))
    }
    if (state.sampleBestHint) {
      blocks.push(
        listCard(
          "試行例",
          [`split ${state.sampleBestHint.splitCount} / repeat ${state.sampleBestHint.repeatCount} / 累積 ${state.sampleBestHint.cumulativeDelta.toFixed(4)}`],
          "good"
        )
      )
    }
  }

  if (stage.id === "3-4") {
    blocks.push(bestResultCard(state.bestTrial))
    blocks.push(cumulativeDeltaMeter(state.bestTrial?.cumulativeDelta || 0, state.targetDelta, state.bestTrial?.cumulativeDelta || 0))
    blocks.push(
      listCard(
        "探索メモ",
        [
          `候補数: ${state.candidates.length}`,
          `まとめて試した回数: ${state.batchRunCount}`,
          state.success ? "さらに細かく試すなら Search Console が使えます。" : "候補を増やしてから、まとめて試してください。",
        ],
        state.success ? "good" : "normal"
      )
    )
  }

  return blocks.join("")
}

function detailHtml(state) {
  return state.notes.map((note) => `<div class="detail-line">${escapeHtml(note)}</div>`).join("")
}

function actionConfig(stage, state) {
  const buttons = []
  switch (stage.id) {
    case "0-1":
      buttons.push({ action: "place_order", label: "買い注文を出す", kind: "primary", disabled: state.success })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "0-2":
      buttons.push({ action: "place_order", label: "買い注文を出す", kind: "primary", disabled: state.hasOrder })
      buttons.push({ action: "process_order", label: "処理を進める", kind: "secondary", disabled: !state.canProcess || state.success })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "0-3":
      buttons.push({ action: "cancel_order", label: "キャンセルする", kind: "primary", disabled: state.success })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "0-4":
      buttons.push({ action: "confirm_focus", value: "order", label: "順序を確認", kind: state.checks.order ? "selected" : "secondary" })
      buttons.push({ action: "confirm_focus", value: "status", label: "状態を確認", kind: state.checks.status ? "selected" : "secondary" })
      buttons.push({ action: "confirm_focus", value: "balance", label: "残高を確認", kind: state.checks.balance ? "selected" : "secondary" })
      if (state.success) buttons.push({ action: "next_stage", label: "第1章へ進む", kind: "success" })
      break
    case "1-1":
      buttons.push({ action: "run_sequence", label: "処理を実行", kind: "primary", disabled: state.success })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "1-2":
      buttons.push({ action: "interrupt", label: "割り込み", kind: "primary", disabled: state.success })
      buttons.push({ action: "retry", label: "リトライ", kind: "secondary" })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "1-3":
      buttons.push({ action: "run_selection", label: "実行", kind: "primary", disabled: state.success })
      buttons.push({ action: "show_hint", label: "ヒント", kind: "secondary" })
      buttons.push({ action: "retry", label: "リトライ", kind: "ghost" })
      if (state.success) buttons.push({ action: "next_stage", label: "応用ステージへ", kind: "success" })
      break
    case "1-4":
      if (!state.finished) {
        buttons.push({
          action: "set_decision",
          value: "order",
          label: "注文する",
          kind: state.pendingDecision === "order" ? "selected" : "primary",
        })
        buttons.push({
          action: "set_decision",
          value: "skip",
          label: "見送る",
          kind: state.pendingDecision === "skip" ? "selected" : "secondary",
        })
        buttons.push({
          action: "execute_turn",
          label: "実行",
          kind: "success",
          disabled: !state.pendingDecision,
        })
      }
      buttons.push({ action: "retry", label: "リトライ", kind: "ghost" })
      if (state.finished && state.success) {
        buttons.push({ action: "next_stage", label: "第2章へ進む", kind: "success" })
      }
      break
    case "2-1":
      buttons.push({ action: "cancel_order", label: "キャンセルする", kind: "primary", disabled: state.success })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "2-2":
      buttons.push({
        action: "cancel_order",
        label: "キャンセルする",
        kind: "primary",
        disabled: state.phase !== "pre_cancel",
      })
      buttons.push({
        action: "continue_processing",
        label: "処理を続ける",
        kind: "secondary",
        disabled: !state.canContinueProcessing || state.success,
      })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "2-3":
      buttons.push({ action: "run_refund_repro", label: "実行", kind: "primary", disabled: state.success })
      buttons.push({ action: "show_refund_hint", label: "ヒント", kind: "secondary" })
      buttons.push({ action: "retry", label: "リトライ", kind: "ghost" })
      if (state.success) buttons.push({ action: "next_stage", label: "応用へ進む", kind: "success" })
      break
    case "2-4":
      buttons.push({
        action: "confirm_diagnosis",
        label: "診断する",
        kind: "primary",
        disabled: !state.selectedCauseId || state.success,
      })
      buttons.push({ action: "retry", label: "リトライ", kind: "ghost" })
      if (state.success) {
        buttons.push({ action: "restart_journey", label: "最初から見直す", kind: "success" })
      }
      break
    case "3-1":
      buttons.push({ action: "calculate_rounding", label: "計算する", kind: "primary", disabled: state.hasCalculated })
      buttons.push({ action: "compare_values", label: "比較する", kind: "secondary", disabled: !state.hasCalculated || state.success })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "3-2":
      buttons.push({ action: "run_split_compare", label: "実行する", kind: "primary" })
      buttons.push({ action: "compare_batch", label: "一括と比較", kind: "secondary", disabled: !state.hasRun })
      buttons.push({ action: "retry", label: "リトライ", kind: "ghost" })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "3-3":
      buttons.push({ action: "run_optimization_trial", label: "実行する", kind: "primary" })
      buttons.push({ action: "save_trial", label: "結果を保存", kind: "secondary", disabled: !state.latestTrial })
      buttons.push({ action: "show_rounding_hint", label: "ヒント", kind: "secondary" })
      buttons.push({ action: "open_search_console", label: "Search Console へ", kind: state.searchConsoleSuggested ? "success" : "ghost" })
      buttons.push({ action: "retry", label: "リトライ", kind: "ghost" })
      if (state.success) buttons.push({ action: "next_stage", label: "次へ", kind: "success" })
      break
    case "3-4":
      buttons.push({ action: "add_candidate", label: "候補追加", kind: "secondary" })
      buttons.push({ action: "run_batch_search", label: "まとめて試す", kind: "primary" })
      buttons.push({ action: "clear_search_results", label: "履歴クリア", kind: "ghost" })
      buttons.push({ action: "open_search_console", label: "Search Console へ", kind: "success" })
      if (state.success) buttons.push({ action: "restart_journey", label: "最初から見直す", kind: "success" })
      break
    default:
      break
  }
  return buttons
}

function buttonsHtml(stage, state) {
  return actionConfig(stage, state)
    .map(
      (button) => `
        <button
          class="action-btn ${button.kind}"
          data-action="${button.action}"
          ${button.value ? `data-value="${button.value}"` : ""}
          ${button.disabled ? "disabled" : ""}
        >
          ${escapeHtml(button.label)}
        </button>
      `
    )
    .join("")
}

function searchConsoleMissionHtml(consoleState) {
  return `
    <div class="mission-chip">Search Console</div>
    <h3>条件探索を効率化する</h3>
    <p class="mission-text">簡易スクリプトで split / repeat をまとめて試し、ベスト条件を見つけます。</p>
    <div class="mission-subtitle">できること</div>
    <div class="mission-list">
      <div class="mission-list-item">スクリプトを入力する</div>
      <div class="mission-list-item">コンパイルしてエラーを確認する</div>
      <div class="mission-list-item">実行結果を本編へ反映する</div>
    </div>
    <div class="mission-focus">戻り先: ${escapeHtml(consoleState.lastStageId || "3-3")}</div>
  `
}

function searchConsoleInputHtml(consoleState) {
  return `
    <div class="control-card">
      <div class="control-title">Mini Script Editor</div>
      <textarea id="search-console-source" class="script-editor" data-role="search-console-source">${escapeHtml(consoleState.sourceCode)}</textarea>
      <div class="control-fixed">
        <div>対応命令: set / run / save / show / track / reset / repeat / for</div>
        <div>compile と run は別です</div>
      </div>
    </div>
  `
}

function searchConsoleResultHtml(consoleState) {
  return `
    ${bestResultCard(consoleState.bestTrial)}
    ${trialHistoryTable(consoleState.trialHistory, { bestId: consoleState.bestTrial?.id || "" })}
  `
}

function searchConsoleHintHtml(consoleState) {
  const lines = [
    consoleState.compileState === "compileError"
      ? "行番号付きエラーを見て修正できます。"
      : consoleState.compileState === "compiled"
        ? "コンパイル成功です。次は run で結果を増やせます。"
        : consoleState.compileState === "runComplete"
          ? "実行結果からベスト条件を本編へ持ち帰れます。"
          : "サンプルを読み込んでから compile -> run の順で試せます。",
    consoleState.bestTrial
      ? `現在ベスト: split ${consoleState.bestTrial.splitCount} / repeat ${consoleState.bestTrial.repeatCount}`
      : "まだ実行結果はありません。",
  ]
  return listCard("Console Guide", lines, consoleState.compileState === "compileError" ? "warn" : "normal")
}

function searchConsoleDetailHtml(consoleState) {
  return [
    `compileState: ${consoleState.compileState}`,
    `saved runs: ${consoleState.savedRuns.length}`,
    `applied stage: ${consoleState.appliedStageId || "-"}`,
  ]
    .map((line) => `<div class="detail-line">${escapeHtml(line)}</div>`)
    .join("")
}

function searchConsoleButtonsHtml() {
  return [
    { action: "load_console_sample", value: SEARCH_CONSOLE_SAMPLES[0].id, label: "サンプル読込", kind: "secondary" },
    { action: "compile_search_script", label: "コンパイル", kind: "primary" },
    { action: "run_search_script", label: "実行", kind: "success" },
    { action: "save_search_results", label: "保存", kind: "secondary" },
    { action: "apply_search_best", label: "本編へ反映", kind: "success" },
    { action: "close_search_console", label: "元のステージへ戻る", kind: "ghost" },
  ]
    .map(
      (button) => `
        <button class="action-btn ${button.kind}" data-action="${button.action}" ${button.value ? `data-value="${button.value}"` : ""}>
          ${escapeHtml(button.label)}
        </button>
      `
    )
    .join("")
}

function timelineConfig(stage) {
  return {
    visible: !HIDDEN_TIMELINE_STAGES.has(stage.id),
    title:
      stage.id === "1-4"
        ? "実行順ログ"
        : stage.id === "2-4"
          ? "選択中注文の履歴"
          : stage.chapter === 2
            ? "イベント履歴"
            : "タイムライン",
  }
}

function renderHeader(stage) {
  el.stagePath.textContent = `Chapter ${stage.chapter} / Stage ${stage.stageNumber}`
  el.stageTitle.textContent = stage.title
  el.stageGoal.textContent = stage.goal
  el.progressLabel.textContent = `進行 ${appState.currentStageIndex + 1} / ${STAGE_COUNT}`
  el.chapterKicker.textContent = stage.chapterTitle
  el.chapterNote.textContent = `注目ポイント: ${stage.focus}`
  el.progressDots.innerHTML = STAGE_SEQUENCE.map((item, index) => {
    const cls = index < appState.currentStageIndex ? "done" : index === appState.currentStageIndex ? "active" : ""
    return `<span class="progress-dot ${cls}"></span>`
  }).join("")
}

function renderSearchConsole() {
  const consoleState = searchConsoleState()
  el.stagePath.textContent = "Chapter 3 / Search Console"
  el.stageTitle.textContent = "Search Console"
  el.stageGoal.textContent = "スクリプトで条件探索を効率化する"
  el.progressLabel.textContent = `戻り先 ${consoleState.lastStageId || "3-3"}`
  el.chapterKicker.textContent = "第3章 Search Console"
  el.chapterNote.textContent = "コンパイルと実行を分けて、ベスト条件を本編へ持ち帰れます。"
  el.progressDots.innerHTML = STAGE_SEQUENCE.map((_, index) => {
    const cls = index < appState.currentStageIndex ? "done" : index === appState.currentStageIndex ? "active" : ""
    return `<span class="progress-dot ${cls}"></span>`
  }).join("")

  el.missionTitle.textContent = "Script Lab"
  el.visualTitle.textContent = "サンプルと実行ログ"
  el.resultTitle.textContent = "ベスト結果と履歴"
  el.missionCard.innerHTML = searchConsoleMissionHtml(consoleState)
  el.inputRegion.innerHTML = searchConsoleInputHtml(consoleState)
  el.visualRegion.innerHTML = searchConsoleVisual(consoleState)
  el.resultRegion.innerHTML = searchConsoleResultHtml(consoleState)
  el.hintRegion.innerHTML = searchConsoleHintHtml(consoleState)
  el.detailRegion.innerHTML = searchConsoleDetailHtml(consoleState)
  el.feedbackRegion.innerHTML = `
    <div class="feedback-main">${
      consoleState.compileState === "compileError"
        ? "コンパイルエラーがあります。"
        : consoleState.compileState === "compiled"
          ? "コンパイル成功です。"
        : consoleState.compileState === "runComplete"
          ? "実行結果を確認できます。"
          : "Search Console を使って探索できます。"
    }</div>
    <div class="feedback-sub">${
      consoleState.bestTrial
        ? `現在ベスト: split ${consoleState.bestTrial.splitCount} / repeat ${consoleState.bestTrial.repeatCount}`
        : "まずはサンプルを読み込むか、スクリプトを入力してください。"
    }</div>
  `
  el.actionButtons.innerHTML = searchConsoleButtonsHtml()
  el.timelineSection.hidden = true
  el.timelineRegion.innerHTML = ""
  stopGauge()
}

function applySearchBestToStage() {
  const consoleState = searchConsoleState()
  if (!consoleState.bestTrial) return
  const targetStageId = consoleState.appliedStageId || consoleState.lastStageId
  if (!targetStageId) return
  const targetState = ensureStageState(targetStageId)
  if (targetStageId === "3-3") {
    targetState.splitCount = consoleState.bestTrial.splitCount
    targetState.repeatCount = consoleState.bestTrial.repeatCount
    targetState.bestTrial = consoleState.bestTrial
    targetState.feedback = "Search Console で見つけたベスト条件を読み込みました。"
    targetState.nextFocus = "その条件で本編の試行履歴と見比べてください。"
  }
  if (targetStageId === "3-4") {
    targetState.searchSplit = consoleState.bestTrial.splitCount
    targetState.searchRepeat = consoleState.bestTrial.repeatCount
    targetState.bestTrial = consoleState.bestTrial
    targetState.feedback = "Search Console のベスト条件を本編候補として使えます。"
    targetState.nextFocus = "候補一覧と本編の探索結果を比較してください。"
  }
}

function render() {
  if (currentScreen() === "search_console") {
    renderSearchConsole()
    return
  }
  const stage = currentStage()
  const state = currentStageState()
  const meta = getStageMeta(stage.id)
  const timeline = timelineConfig(stage)

  renderHeader(stage)
  el.missionTitle.textContent = MISSION_TITLES[stage.id] || "今回やること"
  el.visualTitle.textContent = VISUAL_TITLES[stage.id] || "メイン表示"
  el.resultTitle.textContent = RESULT_TITLES[stage.id] || "結果と差分"
  el.missionCard.innerHTML = missionHtml(meta, state)
  el.inputRegion.innerHTML = inputHtml(stage, state)
  el.visualRegion.innerHTML = visualHtml(stage, state)
  el.resultRegion.innerHTML = resultHtml(stage, state)
  el.hintRegion.innerHTML = hintHtml(stage, state)
  el.detailRegion.innerHTML = detailHtml(state)
  el.feedbackRegion.innerHTML = `
    <div class="feedback-main">${escapeHtml(state.feedback)}</div>
    <div class="feedback-sub">${escapeHtml(state.nextFocus)}</div>
  `
  el.actionButtons.innerHTML = buttonsHtml(stage, state)

  el.timelineSection.hidden = !timeline.visible
  if (timeline.visible) {
    el.timelineHeading.textContent = timeline.title
    el.timelineRegion.innerHTML = timelineHtml(stage, state)
  } else {
    el.timelineRegion.innerHTML = ""
  }

  if (stage.id === "1-2" && !state.success) {
    startGauge()
  } else {
    stopGauge()
  }
}

function applyAction(action, value = "") {
  if (currentScreen() === "search_console") {
    const consoleState = searchConsoleState()
    if (action === "close_search_console") {
      closeSearchConsole()
      return
    }
    if (action === "load_console_sample") {
      const sample = SEARCH_CONSOLE_SAMPLES.find((item) => item.id === value) || SEARCH_CONSOLE_SAMPLES[0]
      consoleState.sourceCode = sample.source
      consoleState.compileState = "editing"
      consoleState.compileErrors = []
      consoleState.compiledProgram = null
      saveProgress()
      render()
      return
    }
    if (action === "compile_search_script") {
      const compiled = compileSearchScript(consoleState.sourceCode)
      consoleState.compiledProgram = compiled.program
      consoleState.compileErrors = compiled.errors
      consoleState.compileState = compiled.ok ? "compiled" : "compileError"
      saveProgress()
      render()
      return
    }
    if (action === "run_search_script") {
      if (!consoleState.compiledProgram) {
        const compiled = compileSearchScript(consoleState.sourceCode)
        consoleState.compiledProgram = compiled.program
        consoleState.compileErrors = compiled.errors
        consoleState.compileState = compiled.ok ? "compiled" : "compileError"
        if (!compiled.ok) {
          saveProgress()
          render()
          return
        }
      }
      try {
        const executed = executeSearchProgram(consoleState.compiledProgram, consoleState.initialParams || {})
        consoleState.trialHistory = executed.trialHistory
        consoleState.bestTrial = executed.bestTrial
        consoleState.executionLog = executed.executionLog
        consoleState.savedRuns = executed.savedRuns
        consoleState.compileErrors = []
        consoleState.compileState = "runComplete"
      } catch (error) {
        consoleState.compileErrors = [String(error.message || error)]
        consoleState.compileState = "compileError"
      }
      saveProgress()
      render()
      return
    }
    if (action === "save_search_results") {
      if (consoleState.bestTrial && !consoleState.savedRuns.includes(consoleState.bestTrial.id)) {
        consoleState.savedRuns = [...consoleState.savedRuns, consoleState.bestTrial.id]
        consoleState.executionLog = [...consoleState.executionLog, `save best -> ${consoleState.bestTrial.id}`]
      }
      saveProgress()
      render()
      return
    }
    if (action === "apply_search_best") {
      applySearchBestToStage()
      saveProgress()
      render()
      return
    }
    return
  }

  const stage = currentStage()
  const state = currentStageState()

  if (action === "next_stage") {
    goNextStage()
    return
  }
  if (action === "restart_journey") {
    resetJourney()
    return
  }
  if (action === "open_search_console") {
    openSearchConsole()
    return
  }

  let payload = {}
  if (action === "confirm_focus") payload = { focus: value }
  if (action === "set_decision") payload = { decision: value }
  if (action === "interrupt") payload = { progress: currentGaugePercent() }
  if (action === "set_replay_timing") payload = { timing: value }
  if (action === "set_replay_mode") payload = { mode: value }
  if (action === "select_order") payload = { orderId: value }
  if (action === "set_cause") payload = { causeId: value }
  if (action === "remove_candidate") payload = { candidateId: value }

  const nextState = runStageAction(stage.id, state, action, payload)
  appState.stageStates[stage.id] = mergeStageState(stage.id, nextState)
  saveProgress()

  if (stage.id === "1-2" && action === "interrupt" && !nextState.success) {
    runtime.gaugeStartMs = performance.now()
  }

  render()
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]")
  if (!button) return
  const action = button.getAttribute("data-action")
  const value = button.getAttribute("data-value") || ""
  applyAction(action, value)
})

document.addEventListener("input", (event) => {
  const target = event.target
  if (target instanceof HTMLTextAreaElement && target.dataset.role === "search-console-source") {
    const consoleState = searchConsoleState()
    consoleState.sourceCode = target.value
    consoleState.compileState = "editing"
    consoleState.compileErrors = []
    consoleState.compiledProgram = null
    saveProgress()
    return
  }

  if (!(target instanceof HTMLInputElement)) return
  const stage = currentStage()
  const current = currentStageState()
  const value = Number(target.value)

  if (target.dataset.role === "stage13-slider" && stage.id === "1-3") {
    current.selectedTiming = value
    saveProgress()
    const readout = document.getElementById("stage13-value")
    if (readout) readout.textContent = String(current.selectedTiming)
    return
  }

  if (target.dataset.role === "stage32-split" && stage.id === "3-2") {
    appState.stageStates[stage.id] = mergeStageState(stage.id, runStageAction(stage.id, current, "set_split_count", { splitCount: value }))
    saveProgress()
    render()
    return
  }

  if (target.dataset.role === "stage33-split" && stage.id === "3-3") {
    appState.stageStates[stage.id] = mergeStageState(stage.id, runStageAction(stage.id, current, "set_split_count", { splitCount: value }))
    saveProgress()
    render()
    return
  }

  if (target.dataset.role === "stage33-repeat" && stage.id === "3-3") {
    appState.stageStates[stage.id] = mergeStageState(stage.id, runStageAction(stage.id, current, "set_repeat_count", { repeatCount: value }))
    saveProgress()
    render()
    return
  }

  if (target.dataset.role === "stage34-split" && stage.id === "3-4") {
    appState.stageStates[stage.id] = mergeStageState(stage.id, runStageAction(stage.id, current, "set_search_split", { splitCount: value }))
    saveProgress()
    render()
    return
  }

  if (target.dataset.role === "stage34-repeat" && stage.id === "3-4") {
    appState.stageStates[stage.id] = mergeStageState(stage.id, runStageAction(stage.id, current, "set_search_repeat", { repeatCount: value }))
    saveProgress()
    render()
  }
})

el.resetProgress.addEventListener("click", () => {
  resetJourney()
})

render()
