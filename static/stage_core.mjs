export const STAGE_SEQUENCE = [
  {
    id: "0-1",
    chapter: 0,
    chapterTitle: "第0章 オリエンテーション",
    stageNumber: 1,
    stageCount: 4,
    title: "注文するとどうなる？",
    goal: "注文するとシステムの状態が変わることを知る",
    mission: ["買い注文を1回出す", "注文状態の変化を見る", "残高とタイムラインを確認する"],
    focus: "状態が未注文から受付済みに変わる瞬間",
  },
  {
    id: "0-2",
    chapter: 0,
    chapterTitle: "第0章 オリエンテーション",
    stageNumber: 2,
    stageCount: 4,
    title: "注文はどう処理される？",
    goal: "受付の後に処理が進み、結果が決まることを知る",
    mission: ["注文する", "処理を進める", "受付と約定が別イベントだと確認する"],
    focus: "受付 -> 処理 -> 約定の段階性",
  },
  {
    id: "0-3",
    chapter: 0,
    chapterTitle: "第0章 オリエンテーション",
    stageNumber: 3,
    stageCount: 4,
    title: "キャンセルすると何が戻る？",
    goal: "キャンセル時には状態と資金が整合的に戻ると知る",
    mission: ["未処理注文をキャンセルする", "返金回数が1回だけだと確認する"],
    focus: "状態復帰と返金回数 1 回",
  },
  {
    id: "0-4",
    chapter: 0,
    chapterTitle: "第0章 オリエンテーション",
    stageNumber: 4,
    stageCount: 4,
    title: "どこを見れば異常が分かる？",
    goal: "順序・状態・残高の3点を見れば異常を追いやすいと知る",
    mission: ["順序を確認する", "状態を確認する", "残高を確認する"],
    focus: "今後ずっと使う観察の型",
  },
  {
    id: "1-1",
    chapter: 1,
    chapterTitle: "第1章 順序のズレとタイミング",
    stageNumber: 1,
    stageCount: 4,
    title: "先に出したのに先に通らない？",
    goal: "受付順と実行順がずれると結果が変わることを観察する",
    mission: ["処理を実行する", "受付順と実行順を見比べる", "結果が変わった理由を確認する"],
    focus: "受付順と実行順のズレ",
  },
  {
    id: "1-2",
    chapter: 1,
    chapterTitle: "第1章 順序のズレとタイミング",
    stageNumber: 2,
    stageCount: 4,
    title: "どの瞬間に割り込める？",
    goal: "処理直前の操作が順序を変えることを理解する",
    mission: ["タイミングゲージを観察する", "処理直前で割り込む", "成功と失敗を比較する"],
    focus: "割り込みの成立タイミング",
  },
  {
    id: "1-3",
    chapter: 1,
    chapterTitle: "第1章 順序のズレとタイミング",
    stageNumber: 3,
    stageCount: 4,
    title: "自分で順序を崩してみる",
    goal: "順序逆転が起きるタイミングを自力で見つける",
    mission: ["タイミングを調整する", "順序逆転を自力で再現する", "ヒントを使って再挑戦する"],
    focus: "再現条件の探索",
  },
  {
    id: "1-4",
    chapter: 1,
    chapterTitle: "第1章 順序のズレとタイミング",
    stageNumber: 4,
    stageCount: 4,
    title: "限られた回数で最大利益を狙え",
    goal: "3回以内で目標利益を達成する",
    mission: ["各ターンで入るか見送るか決める", "影響が大きい場面を選ぶ", "目標利益18を超える"],
    focus: "順序異常を戦略として使うこと",
  },
  {
    id: "2-1",
    chapter: 2,
    chapterTitle: "第2章 キャンセルと返金の破綻",
    stageNumber: 1,
    stageCount: 4,
    title: "正常なキャンセルは1回だけ戻る",
    goal: "正常な返金は1回だけで、注文IDごとの履歴が一貫していると知る",
    mission: ["注文ID を確認する", "キャンセルして返金を受ける", "返金回数が 1 回だけだと確認する"],
    focus: "正常な返金は 1 回だけ",
  },
  {
    id: "2-2",
    chapter: 2,
    chapterTitle: "第2章 キャンセルと返金の破綻",
    stageNumber: 2,
    stageCount: 4,
    title: "消したはずの注文がもう一度お金を返す",
    goal: "同じ注文に返金が2回起きる異常を観察し、正常ケースとの差を見つける",
    mission: ["再処理を流す", "返金回数が 2 になることを見る", "状態と履歴の矛盾を確認する"],
    focus: "同じ注文IDに返金が2回起きること",
  },
  {
    id: "2-3",
    chapter: 2,
    chapterTitle: "第2章 キャンセルと返金の破綻",
    stageNumber: 3,
    stageCount: 4,
    title: "自分で二重返金を起こしてみる",
    goal: "再参照の条件をそろえて、二重返金を自力で再現する",
    mission: ["再参照タイミングを選ぶ", "再実行するか決める", "返金回数が 2 になる条件を見つける"],
    focus: "返金直後の再参照と返金済み判定",
  },
  {
    id: "2-4",
    chapter: 2,
    chapterTitle: "第2章 キャンセルと返金の破綻",
    stageNumber: 4,
    stageCount: 4,
    title: "どの注文で状態が壊れたか特定せよ",
    goal: "複数注文の中から、状態遷移が破綻した注文と原因を説明する",
    mission: ["怪しい注文IDを選ぶ", "原因候補を選ぶ", "返金回数・状態・履歴をそろえて診断する"],
    focus: "返金回数・状態・履歴の3点読み",
  },
  {
    id: "3-1",
    chapter: 3,
    chapterTitle: "第3章 数値の落とし穴と探索",
    stageNumber: 1,
    stageCount: 4,
    title: "同じはずなのに少しだけ違う",
    goal: "理論値と実際値の微差を確認する",
    mission: ["計算する", "理論値と実際値を比べる", "差分を確認する"],
    focus: "理論値と実際値の微差",
  },
  {
    id: "3-2",
    chapter: 3,
    chapterTitle: "第3章 数値の落とし穴と探索",
    stageNumber: 2,
    stageCount: 4,
    title: "分けると得する？",
    goal: "一括処理と分割処理の結果差を比較する",
    mission: ["分割回数を変える", "実行して比較する", "差分が正になる分割数を見つける"],
    focus: "一括 vs 分割の差",
  },
  {
    id: "3-3",
    chapter: 3,
    chapterTitle: "第3章 数値の落とし穴と探索",
    stageNumber: 3,
    stageCount: 4,
    title: "一番得する分け方を探せ",
    goal: "条件を変えながらベスト結果を見つける",
    mission: ["split と repeat を変える", "試行履歴を増やす", "目標累積差分を超える"],
    focus: "ベスト更新と累積差分",
  },
  {
    id: "3-4",
    chapter: 3,
    chapterTitle: "第3章 数値の落とし穴と探索",
    stageNumber: 4,
    stageCount: 4,
    title: "探索して最適パターンを見つけろ",
    goal: "複数候補をまとめて試し、最良条件を見つける",
    mission: ["候補条件を追加する", "まとめて試す", "目標差分を超えるベスト条件を見つける"],
    focus: "比較と半自動探索",
  },
]

export const STAGE_COUNT = STAGE_SEQUENCE.length

export const STAGE_14_TURNS = [
  {
    id: 1,
    label: "Turn 1",
    marketHint: "処理直前に注文が密集する",
    visibleImpact: "高",
    rivalWindow: "後半の直前",
    grossProfit: 9,
    orderCost: 3,
  },
  {
    id: 2,
    label: "Turn 2",
    marketHint: "板が薄く、通常処理の影響が小さい",
    visibleImpact: "低",
    rivalWindow: "中盤の通常処理",
    grossProfit: 1,
    orderCost: 3,
  },
  {
    id: 3,
    label: "Turn 3",
    marketHint: "大口注文が処理直前に入る",
    visibleImpact: "高",
    rivalWindow: "終盤の直前",
    grossProfit: 16,
    orderCost: 3,
  },
]

const STAGE_13_HINTS = [
  "少し遅らせると変化が出るかもしれません。",
  "受付そのものより、処理直前の割り込みが重要です。",
  "正解帯は 72〜82 付近です。そこを中心に探してみましょう。",
]

const STAGE_23_HINTS = [
  "返金の後に、同じ注文がもう一度参照される流れを探してください。",
  "キャンセルだけでは足りません。処理の再実行や再照会に注目してください。",
  "正解例に近い流れを表示します。",
]

const STAGE_33_HINTS = [
  "分割回数だけでなく、反復回数にも注目してください。",
  "単発差分より累積差分を見た方が有利な条件を見つけやすくなります。",
  "高い差分を出した試行例をヒントとして表示します。",
]

const CHAPTER3_BASE_AMOUNT = 3
const CHAPTER3_RATE = 0.335
const CHAPTER3_MIN_SPLIT = 1
const CHAPTER3_MAX_SPLIT = 12
const CHAPTER3_MIN_REPEAT = 1
const CHAPTER3_MAX_REPEAT = 8
const CHAPTER3_MIN_AMOUNT = 1
const CHAPTER3_MAX_AMOUNT = 6
const SEARCH_CONSOLE_SAMPLES = [
  {
    id: "sample-basic",
    label: "固定条件で実行",
    source: "set split 4\nset repeat 5\nrun\nshow best",
  },
  {
    id: "sample-split-search",
    label: "split を探索",
    source: "track best\nfor split in 2..8 {\n  set split split\n  run\n}\nshow best",
  },
  {
    id: "sample-grid-search",
    label: "split と repeat を探索",
    source: "track best\nfor split in 2..6 {\n  for repeat in 1..4 {\n    set split split\n    set repeat repeat\n    run\n  }\n}\nshow best",
  },
]

const STAGE_24_BASE_ORDERS = [
  {
    id: "ORD-A",
    status: "返金済み",
    refundCount: 1,
    balance: 100,
    reserved: 0,
    amount: 20,
    referenceCount: 1,
    flags: {
      cancelled: true,
      refunded: true,
      closed: true,
      requeued: false,
    },
    anomaly: false,
    causeId: "none",
    summary: "正常にキャンセルされ、返金は1回だけで終了しました。",
    history: [
      { label: "注文受付", detail: "ORD-A を受け付けました。", kind: "player", orderId: "ORD-A", type: "submit" },
      { label: "キャンセル", detail: "ORD-A を取り消しました。", kind: "player", orderId: "ORD-A", type: "cancel" },
      { label: "返金", detail: "20 が一度だけ戻りました。", kind: "refund", orderId: "ORD-A", type: "refund" },
    ],
  },
  {
    id: "ORD-B",
    status: "返金済み",
    refundCount: 2,
    balance: 120,
    reserved: 0,
    amount: 20,
    referenceCount: 2,
    flags: {
      cancelled: true,
      refunded: false,
      closed: true,
      requeued: true,
    },
    anomaly: true,
    causeId: "missing_refund_guard",
    summary: "返金済み判定が欠けたまま再参照され、同じ注文に返金が2回起きています。",
    history: [
      { label: "注文受付", detail: "ORD-B を受け付けました。", kind: "player", orderId: "ORD-B", type: "submit" },
      { label: "キャンセル", detail: "ORD-B を取り消しました。", kind: "player", orderId: "ORD-B", type: "cancel" },
      { label: "返金", detail: "20 が戻りました。", kind: "refund", orderId: "ORD-B", type: "refund" },
      { label: "再参照", detail: "終了済みのはずの ORD-B がもう一度処理対象になりました。", kind: "anomaly", orderId: "ORD-B", type: "reprocess" },
      { label: "返金", detail: "同じ ORD-B に対して 20 が再び戻りました。", kind: "anomaly", orderId: "ORD-B", type: "refund" },
    ],
  },
  {
    id: "ORD-C",
    status: "約定済み",
    refundCount: 0,
    balance: 80,
    reserved: 0,
    amount: 20,
    referenceCount: 1,
    flags: {
      cancelled: false,
      refunded: false,
      closed: true,
      requeued: false,
    },
    anomaly: false,
    causeId: "none",
    summary: "約定済みで終了しており、返金処理は一度も起きていません。",
    history: [
      { label: "注文受付", detail: "ORD-C を受け付けました。", kind: "player", orderId: "ORD-C", type: "submit" },
      { label: "処理開始", detail: "ORD-C のマッチング処理が始まりました。", kind: "system", orderId: "ORD-C", type: "match" },
      { label: "約定", detail: "ORD-C は約定済みとして終了しました。", kind: "system", orderId: "ORD-C", type: "close" },
    ],
  },
]

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value)))
}

function roundTo(value, digits) {
  const base = 10 ** digits
  return Math.round(value * base) / base
}

function ceilTo(value, digits) {
  const base = 10 ** digits
  return Math.ceil((value - Number.EPSILON) * base) / base
}

function createBaseState(extra = {}) {
  return {
    success: false,
    nextUnlocked: false,
    feedback: "",
    nextFocus: "",
    notes: [],
    timeline: [],
    ...extra,
  }
}

function event(label, detail, kind = "system", extra = {}) {
  return { label, detail, kind, ...extra }
}

function stageMeta(stageId) {
  return STAGE_SEQUENCE.find((stage) => stage.id === stageId)
}

function stage14TurnsWithRuntime() {
  return STAGE_14_TURNS.map((turn) => ({
    ...turn,
    decision: "",
    netProfit: null,
    resolved: false,
    summary: "",
    executionOrder: [],
  }))
}

function stage24OrdersWithRuntime() {
  return clone(STAGE_24_BASE_ORDERS)
}

function normalizeChapter3Amount(amount) {
  return clamp(amount, CHAPTER3_MIN_AMOUNT, CHAPTER3_MAX_AMOUNT)
}

function normalizeChapter3Split(splitCount) {
  return Math.round(clamp(splitCount, CHAPTER3_MIN_SPLIT, CHAPTER3_MAX_SPLIT))
}

function normalizeChapter3Repeat(repeatCount) {
  return Math.round(clamp(repeatCount, CHAPTER3_MIN_REPEAT, CHAPTER3_MAX_REPEAT))
}

function chapter3RunId(prefix = "trial") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function stage34DefaultCandidates() {
  return [
    { id: "cand-1", splitCount: 2, repeatCount: 2, amount: CHAPTER3_BASE_AMOUNT },
    { id: "cand-2", splitCount: 4, repeatCount: 3, amount: CHAPTER3_BASE_AMOUNT },
  ]
}

export function evaluateStage12Interrupt(progress) {
  const normalized = clamp(progress, 0, 100)
  return {
    progress: normalized,
    success: normalized >= 84 && normalized <= 92,
    windowStart: 84,
    windowEnd: 92,
  }
}

export function evaluateStage13Selection(selectedTiming) {
  const timing = clamp(selectedTiming, 0, 100)
  const success = timing >= 72 && timing <= 82
  const targetCenter = 77
  return {
    timing,
    success,
    targetCenter,
    distance: Math.abs(timing - targetCenter),
  }
}

export function simulateStage14Turn(turn, decision) {
  if (decision !== "order") {
    return {
      netProfit: 0,
      summary: "このターンは見送りました。順序は通常のままです。",
      executionOrder: ["Rival", "Market", "Close"],
      anomaly: false,
    }
  }

  const netProfit = turn.grossProfit - turn.orderCost
  const anomaly = netProfit > 0
  return {
    netProfit,
    summary: anomaly
      ? `割り込みに成功し、${netProfit} の利益差を作れました。`
      : `${Math.abs(netProfit)} のコスト負けになり、狙う価値が小さい場面でした。`,
    executionOrder: anomaly ? ["Player", "Interrupt", "Rival"] : ["Player", "Rival", "Interrupt"],
    anomaly,
  }
}

export function simulateStage23Attempt(replayTiming, replayMode) {
  const normalizedTiming =
    replayTiming === "refund_window" || replayTiming === "after_close" ? replayTiming : "before_refund"
  const normalizedMode = replayMode === "on" ? "on" : "off"
  const timeline = [
    event("注文受付", "ORD-03 を受け付けました。", "player", { orderId: "ORD-03", type: "submit" }),
    event("キャンセル", "ORD-03 を取り消しました。", "player", { orderId: "ORD-03", type: "cancel" }),
    event("返金", "20 が戻りました。", "refund", { orderId: "ORD-03", type: "refund" }),
  ]
  const flags = {
    cancelled: true,
    refunded: true,
    closed: true,
    replayRequested: normalizedMode === "on",
    refundGuard: true,
  }
  const outcome = {
    orderStatus: "返金済み",
    balance: 100,
    reserved: 0,
    refundCount: 1,
    referenceCount: normalizedMode === "on" ? 2 : 1,
    duplicateProcessing: false,
    resultLabel: normalizedMode === "on" ? "未再現" : "正常終了",
    anomalyLabel: "",
    summary: "返金は1回だけで終了しました。",
    timeline,
    flags,
    success: false,
    historySummary: "返金1回で終了",
  }

  if (normalizedMode !== "on") {
    return outcome
  }

  if (normalizedTiming === "before_refund") {
    outcome.timeline.splice(
      2,
      0,
      event("再参照予約", "返金前に同じ注文をもう一度参照しました。", "system", { orderId: "ORD-03", type: "requery" })
    )
    outcome.timeline.push(
      event("再処理スキップ", "再参照は同じ返金処理に吸収され、返金は1回で止まりました。", "system", {
        orderId: "ORD-03",
        type: "close",
      })
    )
    outcome.summary = "再参照は起きましたが、返金は1回のままでした。"
    outcome.historySummary = "返金前再参照は吸収される"
    return outcome
  }

  if (normalizedTiming === "refund_window") {
    outcome.timeline.push(
      event("再参照", "返金直後に同じ注文が再び処理対象になりました。", "anomaly", {
        orderId: "ORD-03",
        type: "reprocess",
      })
    )
    outcome.timeline.push(
      event("返金", "同じ ORD-03 に対して 20 が再び戻りました。", "anomaly", { orderId: "ORD-03", type: "refund" })
    )
    outcome.balance = 120
    outcome.refundCount = 2
    outcome.duplicateProcessing = true
    outcome.resultLabel = "二重返金再現"
    outcome.anomalyLabel = "返金済み判定の欠落"
    outcome.summary = "返金済み判定がないまま再参照され、二重返金になりました。"
    outcome.flags.refundGuard = false
    outcome.success = true
    outcome.historySummary = "返金後に再参照され、二度目の返金が発生"
    return outcome
  }

  outcome.timeline.push(
    event("再参照拒否", "終了後の再参照は無視され、追加返金は起きませんでした。", "system", {
      orderId: "ORD-03",
      type: "requery",
    })
  )
  outcome.summary = "返金後に時間が空きすぎると、注文は閉じたままで再処理されません。"
  outcome.historySummary = "終了後再参照は無視される"
  return outcome
}

export function simulateChapter3Scenario(config = {}) {
  const amount = normalizeChapter3Amount(config.amount ?? CHAPTER3_BASE_AMOUNT)
  const splitCount = normalizeChapter3Split(config.splitCount ?? 1)
  const repeatCount = normalizeChapter3Repeat(config.repeatCount ?? 1)
  const theoreticalSingle = amount * CHAPTER3_RATE
  const batchRoundedSingle = ceilTo(theoreticalSingle, 2)
  const partAmount = amount / splitCount
  const rawPartValue = partAmount * CHAPTER3_RATE
  const roundedPartValue = ceilTo(rawPartValue, 2)
  const splitActualSingle = roundTo(roundedPartValue * splitCount, 4)
  const roundingDeltaSingle = roundTo(batchRoundedSingle - theoreticalSingle, 4)
  const splitGainSingle = roundTo(splitActualSingle - batchRoundedSingle, 4)
  const theoreticalTotal = roundTo(theoreticalSingle * repeatCount, 4)
  const batchRoundedTotal = roundTo(batchRoundedSingle * repeatCount, 4)
  const splitActualTotal = roundTo(splitActualSingle * repeatCount, 4)
  const cumulativeDelta = roundTo(splitGainSingle * repeatCount, 4)

  return {
    amount,
    splitCount,
    repeatCount,
    theoreticalSingle: roundTo(theoreticalSingle, 4),
    batchRoundedSingle,
    splitActualSingle,
    rawPartValue: roundTo(rawPartValue, 4),
    roundedPartValue,
    roundingDeltaSingle,
    splitGainSingle,
    theoreticalTotal,
    batchRoundedTotal,
    splitActualTotal,
    cumulativeDelta,
    roundingRuleLabel: "各処理単位で小数第3位以下を切り上げ",
  }
}

function chapter3TrialRow(config = {}, index = 0, source = "manual") {
  const scenario = simulateChapter3Scenario(config)
  return {
    id: chapter3RunId(source),
    index,
    source,
    amount: scenario.amount,
    splitCount: scenario.splitCount,
    repeatCount: scenario.repeatCount,
    expectedValue: scenario.theoreticalTotal,
    actualValue: scenario.splitActualTotal,
    deltaSingle: scenario.splitGainSingle,
    cumulativeDelta: scenario.cumulativeDelta,
    batchValue: scenario.batchRoundedTotal,
  }
}

export function runChapter3Batch(candidates = []) {
  let bestTrial = null
  const rows = candidates.map((candidate, index) => {
    const row = chapter3TrialRow(candidate, index + 1, "batch")
    if (!bestTrial || row.cumulativeDelta > bestTrial.cumulativeDelta) {
      bestTrial = row
    }
    return row
  })
  return { rows, bestTrial }
}

export function createInitialSearchConsoleState() {
  return {
    sourceCode: SEARCH_CONSOLE_SAMPLES[0].source,
    compileState: "editing",
    compileErrors: [],
    compiledProgram: null,
    executionLog: [],
    trialHistory: [],
    bestTrial: null,
    savedRuns: [],
    trackBestEnabled: false,
    lastStageId: "3-3",
    appliedStageId: "",
  }
}

export function getSearchConsoleSamples() {
  return clone(SEARCH_CONSOLE_SAMPLES)
}

function createSearchToken(type, value, line) {
  return { type, value, line }
}

function lexSearchScript(sourceCode) {
  const tokens = []
  const lines = String(sourceCode ?? "").split("\n")
  const tokenPattern = /\.\.|[A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?|[{}]/g

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]
    let cursor = 0
    let match
    tokenPattern.lastIndex = 0
    while ((match = tokenPattern.exec(line))) {
      const between = line.slice(cursor, match.index)
      if (between.trim()) {
        throw new Error(`Line ${lineIndex + 1}: unexpected token '${between.trim()}'`)
      }
      const value = match[0]
      let type = "identifier"
      if (value === "{" || value === "}") type = value
      else if (value === "..") type = "range"
      else if (/^\d/.test(value)) type = "number"
      tokens.push(createSearchToken(type, value, lineIndex + 1))
      cursor = match.index + value.length
    }
    if (line.slice(cursor).trim()) {
      throw new Error(`Line ${lineIndex + 1}: unexpected token '${line.slice(cursor).trim()}'`)
    }
  }

  tokens.push(createSearchToken("eof", "", lines.length + 1))
  return tokens
}

function parseSearchProgram(tokens) {
  let cursor = 0

  function peek() {
    return tokens[cursor]
  }

  function advance() {
    const token = tokens[cursor]
    cursor += 1
    return token
  }

  function expectValue(expectedValue) {
    const token = advance()
    if (token.value !== expectedValue) {
      throw new Error(`Line ${token.line}: expected '${expectedValue}'`)
    }
    return token
  }

  function expectType(expectedType, label) {
    const token = advance()
    if (token.type !== expectedType) {
      throw new Error(`Line ${token.line}: expected ${label}`)
    }
    return token
  }

  function parseBlock() {
    expectValue("{")
    const body = []
    while (peek().value !== "}") {
      if (peek().type === "eof") {
        throw new Error(`Line ${peek().line}: expected '}'`)
      }
      body.push(parseStatement())
    }
    expectValue("}")
    return body
  }

  function parseStatement() {
    const token = peek()
    if (token.type === "eof") {
      throw new Error(`Line ${token.line}: unexpected end of input`)
    }
    if (token.value === "set") {
      advance()
      const target = expectType("identifier", "parameter name")
      const valueToken = advance()
      if (valueToken.type !== "number" && valueToken.type !== "identifier") {
        throw new Error(`Line ${valueToken.line}: expected number after 'set ${target.value}'`)
      }
      return { type: "set", line: token.line, target: target.value, value: valueToken.value, valueType: valueToken.type }
    }
    if (token.value === "run") {
      advance()
      return { type: "run", line: token.line }
    }
    if (token.value === "save") {
      advance()
      return { type: "save", line: token.line }
    }
    if (token.value === "show") {
      advance()
      const subject = expectType("identifier", "show target")
      return { type: "show", line: token.line, subject: subject.value }
    }
    if (token.value === "track") {
      advance()
      const subject = expectType("identifier", "track target")
      return { type: "track", line: token.line, subject: subject.value }
    }
    if (token.value === "reset") {
      advance()
      const subject = expectType("identifier", "reset target")
      return { type: "reset", line: token.line, subject: subject.value }
    }
    if (token.value === "repeat") {
      advance()
      const countToken = expectType("number", "repeat count")
      const body = parseBlock()
      return { type: "repeat_block", line: token.line, count: Number(countToken.value), body }
    }
    if (token.value === "for") {
      advance()
      const variable = expectType("identifier", "loop variable")
      expectValue("in")
      const startToken = expectType("number", "range start")
      expectType("range", "'..'")
      const endToken = expectType("number", "range end")
      const body = parseBlock()
      return {
        type: "for_block",
        line: token.line,
        variable: variable.value,
        start: Number(startToken.value),
        end: Number(endToken.value),
        body,
      }
    }
    throw new Error(`Line ${token.line}: unknown command '${token.value}'`)
  }

  const body = []
  while (peek().type !== "eof") {
    body.push(parseStatement())
  }
  return body
}

function validateSearchProgram(program) {
  const allowedSetTargets = new Set(["split", "repeat", "amount"])
  const allowedShowTargets = new Set(["best", "history"])
  const errors = []

  function validateStatements(statements, loopVars = new Set()) {
    statements.forEach((statement) => {
      if (statement.type === "set") {
        if (!allowedSetTargets.has(statement.target)) {
          errors.push(`Line ${statement.line}: unknown parameter '${statement.target}'`)
        }
        if (statement.valueType === "identifier" && !loopVars.has(statement.value)) {
          errors.push(`Line ${statement.line}: unknown variable '${statement.value}'`)
        }
      }
      if (statement.type === "show" && !allowedShowTargets.has(statement.subject)) {
        errors.push(`Line ${statement.line}: unknown show target '${statement.subject}'`)
      }
      if (statement.type === "track" && statement.subject !== "best") {
        errors.push(`Line ${statement.line}: only 'track best' is supported`)
      }
      if (statement.type === "reset" && statement.subject !== "results") {
        errors.push(`Line ${statement.line}: only 'reset results' is supported`)
      }
      if (statement.type === "repeat_block") {
        if (statement.count < 1 || statement.count > 20) {
          errors.push(`Line ${statement.line}: repeat count must be between 1 and 20`)
        }
        validateStatements(statement.body, new Set(loopVars))
      }
      if (statement.type === "for_block") {
        if (statement.start > statement.end) {
          errors.push(`Line ${statement.line}: range start must be <= range end`)
        }
        if (statement.variable !== "split" && statement.variable !== "repeat") {
          errors.push(`Line ${statement.line}: loop variable must be split or repeat`)
        }
        const nextLoopVars = new Set(loopVars)
        nextLoopVars.add(statement.variable)
        validateStatements(statement.body, nextLoopVars)
      }
    })
  }

  validateStatements(program)
  if (errors.length) {
    throw new Error(errors[0])
  }
}

export function compileSearchScript(sourceCode) {
  try {
    const tokens = lexSearchScript(sourceCode)
    const program = parseSearchProgram(tokens)
    validateSearchProgram(program)
    return {
      ok: true,
      program,
      errors: [],
    }
  } catch (error) {
    return {
      ok: false,
      program: null,
      errors: [String(error.message || error)],
    }
  }
}

function resolveSearchValue(statementValue, statementType, variables) {
  if (statementType === "number") return Number(statementValue)
  return variables[statementValue]
}

function validateSearchParam(param, value, line) {
  if (param === "split") {
    if (value < CHAPTER3_MIN_SPLIT || value > CHAPTER3_MAX_SPLIT) {
      throw new Error(`Line ${line}: split must be between ${CHAPTER3_MIN_SPLIT} and ${CHAPTER3_MAX_SPLIT}`)
    }
  }
  if (param === "repeat") {
    if (value < CHAPTER3_MIN_REPEAT || value > CHAPTER3_MAX_REPEAT) {
      throw new Error(`Line ${line}: repeat count must be between ${CHAPTER3_MIN_REPEAT} and ${CHAPTER3_MAX_REPEAT}`)
    }
  }
  if (param === "amount") {
    if (value < CHAPTER3_MIN_AMOUNT || value > CHAPTER3_MAX_AMOUNT) {
      throw new Error(`Line ${line}: amount must be between ${CHAPTER3_MIN_AMOUNT} and ${CHAPTER3_MAX_AMOUNT}`)
    }
  }
}

export function executeSearchProgram(program, initialParams = {}) {
  const params = {
    split: normalizeChapter3Split(initialParams.split ?? 2),
    repeat: normalizeChapter3Repeat(initialParams.repeat ?? 1),
    amount: normalizeChapter3Amount(initialParams.amount ?? CHAPTER3_BASE_AMOUNT),
  }
  const variables = {}
  const trialHistory = []
  const executionLog = []
  const savedRuns = []
  let bestTrial = null
  let lastTrial = null
  let trackBestEnabled = false
  let instructionCount = 0
  const MAX_INSTRUCTIONS = 400

  function bump(line) {
    instructionCount += 1
    if (instructionCount > MAX_INSTRUCTIONS) {
      throw new Error(`Line ${line}: execution limit exceeded`)
    }
  }

  function maybeUpdateBest(trial) {
    if (!bestTrial || trial.cumulativeDelta > bestTrial.cumulativeDelta) {
      bestTrial = trial
      if (trackBestEnabled) {
        executionLog.push(`best updated -> split ${trial.splitCount}, repeat ${trial.repeatCount}, delta ${trial.cumulativeDelta.toFixed(4)}`)
      }
    }
  }

  function executeStatements(statements) {
    for (const statement of statements) {
      bump(statement.line)
      if (statement.type === "set") {
        const resolvedValue = resolveSearchValue(statement.value, statement.valueType, variables)
        validateSearchParam(statement.target, resolvedValue, statement.line)
        params[statement.target] =
          statement.target === "split"
            ? normalizeChapter3Split(resolvedValue)
            : statement.target === "repeat"
              ? normalizeChapter3Repeat(resolvedValue)
              : normalizeChapter3Amount(resolvedValue)
        executionLog.push(`set ${statement.target} ${params[statement.target]}`)
      } else if (statement.type === "run") {
        const row = chapter3TrialRow(
          {
            splitCount: params.split,
            repeatCount: params.repeat,
            amount: params.amount,
          },
          trialHistory.length + 1,
          "script"
        )
        trialHistory.push(row)
        lastTrial = row
        maybeUpdateBest(row)
        executionLog.push(`run -> split ${row.splitCount}, repeat ${row.repeatCount}, delta ${row.cumulativeDelta.toFixed(4)}`)
      } else if (statement.type === "save") {
        if (lastTrial) {
          savedRuns.push(lastTrial.id)
          executionLog.push(`save -> ${lastTrial.id}`)
        }
      } else if (statement.type === "show") {
        if (statement.subject === "best") {
          executionLog.push(
            bestTrial
              ? `show best -> split ${bestTrial.splitCount}, repeat ${bestTrial.repeatCount}, delta ${bestTrial.cumulativeDelta.toFixed(4)}`
              : "show best -> no result"
          )
        }
        if (statement.subject === "history") {
          executionLog.push(`show history -> ${trialHistory.length} runs`)
        }
      } else if (statement.type === "track") {
        trackBestEnabled = true
        executionLog.push("track best enabled")
      } else if (statement.type === "reset") {
        trialHistory.length = 0
        bestTrial = null
        lastTrial = null
        executionLog.push("results reset")
      } else if (statement.type === "repeat_block") {
        for (let index = 0; index < statement.count; index += 1) {
          executeStatements(statement.body)
        }
      } else if (statement.type === "for_block") {
        for (let current = statement.start; current <= statement.end; current += 1) {
          variables[statement.variable] = current
          executeStatements(statement.body)
        }
        delete variables[statement.variable]
      }
    }
  }

  executeStatements(program)

  return {
    params,
    trialHistory,
    bestTrial,
    executionLog,
    savedRuns,
    trackBestEnabled,
  }
}

export function createInitialStageState(stageId) {
  switch (stageId) {
    case "0-1":
      return createBaseState({
        orderStatus: "未注文",
        balance: 100,
        reserved: 0,
        assetA: 0,
        feedback: "まずは注文を出してください。",
        nextFocus: "注文状態カードがどう変わるかを見ます。",
        notes: ["初回ステージなので失敗はありません。操作すると状態が変わることだけを見ます。"],
      })
    case "0-2":
      return createBaseState({
        orderStatus: "未注文",
        balance: 100,
        reserved: 0,
        assetA: 0,
        hasOrder: false,
        canProcess: false,
        feedback: "買い注文を出した後で、処理を進めてみましょう。",
        nextFocus: "受付イベントと約定イベントは別です。",
        notes: ["反対側の売り注文は既に板にあります。価格は一致済みです。"],
      })
    case "0-3":
      return createBaseState({
        orderStatus: "受付済み",
        balance: 80,
        reserved: 20,
        assetA: 0,
        refundCount: 0,
        feedback: "まだ約定していないので、今なら正常にキャンセルできます。",
        nextFocus: "返金が1回だけ起きることを確認します。",
        timeline: [event("注文受付", "Player の買い注文を受け付けました。", "player")],
        notes: ["第2章で二重返金と比較するため、このステージでは返金回数 1 回を強調します。"],
      })
    case "0-4":
      return createBaseState({
        checks: { order: false, status: false, balance: false },
        currentFocusKey: "order",
        feedback: "今後はこの3つを見ると異常を見つけやすくなります。",
        nextFocus: "順序 -> 状態 -> 残高の順に確認していきます。",
        notes: ["実行はせず、正常ケースの見方だけを整理します。"],
      })
    case "1-1":
      return createBaseState({
        receptionOrder: ["Player", "Rival"],
        executionOrder: ["?", "?"],
        resultLabel: "未実行",
        profitDelta: 0,
        anomalyLabel: "",
        feedback: "受付順と実行順を見比べてください。",
        nextFocus: "先に受け付けられても、実行順が変わると結果が変わります。",
        timeline: [event("受付順確定", "Player が先に受け付けられています。", "player")],
        notes: ["このステージでは異常を観察することが目的です。まだタイミング調整はできません。"],
      })
    case "1-2":
      return createBaseState({
        receptionOrder: ["Player", "Rival", "Interrupt"],
        executionOrder: ["?", "?", "?"],
        resultLabel: "未実行",
        profitDelta: 0,
        attempts: 0,
        lastProgress: null,
        feedback: "処理直前を狙って割り込んでください。",
        nextFocus: "成功すると Interrupt が Rival より前に実行されます。",
        timeline: [event("処理待機", "受付順は固定され、処理直前の割り込み待ちです。", "system")],
        notes: ["成功帯は視覚的に隠してあります。失敗してもすぐリトライできます。"],
      })
    case "1-3":
      return createBaseState({
        receptionOrder: ["Player", "Rival", "Interrupt"],
        executionOrder: ["?", "?", "?"],
        resultLabel: "未実行",
        profitDelta: 0,
        selectedTiming: 50,
        attempts: 0,
        unlockedHints: 0,
        shownHints: 0,
        successWindow: null,
        feedback: "順序が逆転するタイミングを探してください。",
        nextFocus: "調整できるのはタイミングだけです。",
        timeline: [event("探索開始", "処理直前のどこで入ると順序が崩れるかを探します。", "system")],
        notes: ["失敗回数に応じてヒントが段階的に解放されます。直前設定は保持されます。"],
      })
    case "1-4":
      return createBaseState({
        turns: stage14TurnsWithRuntime(),
        currentTurnIndex: 0,
        pendingDecision: "",
        totalProfit: 0,
        goalProfit: 18,
        remainingTurns: 3,
        finished: false,
        feedback: "各ターンで入るか見送るかを決め、実行してください。",
        nextFocus: "毎回入るより、影響が大きい場面を選ぶ方が重要です。",
        timeline: [],
        notes: ["注文には毎回コストがかかります。低影響ターンで無理に入ると利益が減ります。"],
        turnLog: [],
      })
    case "2-1":
      return createBaseState({
        orderId: "ORD-01",
        orderStatus: "受付済み",
        balance: 80,
        reserved: 20,
        refundCount: 0,
        referenceCount: 1,
        flags: {
          cancelled: false,
          refunded: false,
          closed: false,
        },
        historySummary: "注文受付まで表示済み",
        feedback: "注文ID と返金回数を見ながらキャンセルしてください。",
        nextFocus: "正常な返金は 1 回だけ、という基準を作ります。",
        timeline: [event("注文受付", "ORD-01 を受け付け、20 を拘束しました。", "player", { orderId: "ORD-01", type: "submit" })],
        notes: ["第2章では、同じ注文IDに対して何回処理が走ったかを意識します。"],
      })
    case "2-2":
      return createBaseState({
        orderId: "ORD-02",
        orderStatus: "受付済み",
        balance: 80,
        reserved: 20,
        refundCount: 0,
        referenceCount: 1,
        phase: "pre_cancel",
        canContinueProcessing: false,
        expectedBalance: 100,
        expectedRefundCount: 1,
        expectedEventCount: 3,
        duplicateProcessing: false,
        flags: {
          cancelled: false,
          refunded: false,
          closed: false,
          requeued: true,
        },
        historySummary: "キャンセル待ち",
        feedback: "まずはキャンセルして、正常ならどう終わるかを見てください。",
        nextFocus: "そのあと処理を続けると、同じ注文がもう一度返金されます。",
        timeline: [
          event("注文受付", "ORD-02 を受け付けました。", "player", { orderId: "ORD-02", type: "submit" }),
        ],
        notes: ["正常ケースでは、返金1回でこの注文の履歴は終了です。"],
      })
    case "2-3":
      return createBaseState({
        orderId: "ORD-03",
        orderStatus: "受付済み",
        balance: 80,
        reserved: 20,
        refundCount: 0,
        referenceCount: 1,
        flags: {
          cancelled: false,
          refunded: false,
          closed: false,
          replayRequested: false,
          refundGuard: true,
        },
        resultLabel: "未実行",
        anomalyLabel: "",
        duplicateProcessing: false,
        selectedReplayTiming: "before_refund",
        selectedReplayMode: "off",
        attempts: 0,
        unlockedHints: 0,
        shownHints: 0,
        revealedRecipe: null,
        historySummary: "まだ返金は起きていません",
        feedback: "二重返金になる条件を探してください。",
        nextFocus: "返金のあとに同じ注文が再参照される条件が鍵です。",
        timeline: [event("注文受付", "ORD-03 を受け付けました。", "player", { orderId: "ORD-03", type: "submit" })],
        notes: ["操作対象は1件だけです。返金回数が2になるかどうかを基準に比較します。"],
      })
    case "2-4": {
      const orders = stage24OrdersWithRuntime()
      return createBaseState({
        orders,
        selectedOrderId: orders[0].id,
        selectedCauseId: "",
        diagnosisResult: "未診断",
        attempts: 0,
        feedback: "怪しい注文IDと原因を選び、状態遷移の破綻を特定してください。",
        nextFocus: "返金回数・状態・履歴の3点をそろえて読みます。",
        timeline: clone(orders[0].history),
        notes: ["第2章の応用では、『何が起きたか』だけでなく『なぜ起きたか』まで説明するのが目標です。"],
      })
    }
    case "3-1": {
      const scenario = simulateChapter3Scenario({ splitCount: 1, repeatCount: 1, amount: CHAPTER3_BASE_AMOUNT })
      return createBaseState({
        amount: CHAPTER3_BASE_AMOUNT,
        scenario,
        hasCalculated: false,
        hasCompared: false,
        feedback: "理論値と実際値を比べてください。",
        nextFocus: "まずは1回分の丸め差分を確認します。",
        notes: ["第3章では、見た目に正常でも小さな数値差が生まれることを扱います。"],
      })
    }
    case "3-2": {
      const scenario = simulateChapter3Scenario({ splitCount: 2, repeatCount: 1, amount: CHAPTER3_BASE_AMOUNT })
      return createBaseState({
        amount: CHAPTER3_BASE_AMOUNT,
        splitCount: 2,
        repeatCount: 1,
        scenario,
        hasRun: false,
        hasCompared: false,
        feedback: "一括処理を基準にして、分割回数を変えてみましょう。",
        nextFocus: "分割結果が一括結果より増えるかを見ます。",
        notes: ["総量は同じでも、各処理単位で丸めると差分が広がります。"],
      })
    }
    case "3-3":
      return createBaseState({
        amount: CHAPTER3_BASE_AMOUNT,
        splitCount: 3,
        repeatCount: 2,
        targetDelta: 0.12,
        attempts: 0,
        trialHistory: [],
        bestTrial: null,
        latestTrial: null,
        savedTrialIds: [],
        unlockedHints: 0,
        shownHints: 0,
        sampleBestHint: null,
        searchConsoleSuggested: false,
        feedback: "条件を変えながら、累積差分が最も大きくなる組み合わせを探してください。",
        nextFocus: "split と repeat の両方が累積差分に効きます。",
        notes: ["単発差分だけでなく、累積差分とベスト更新に注目します。"],
      })
    case "3-4":
      return createBaseState({
        amount: CHAPTER3_BASE_AMOUNT,
        searchSplit: 3,
        searchRepeat: 2,
        targetDelta: 0.2,
        candidates: stage34DefaultCandidates(),
        trialHistory: [],
        bestTrial: null,
        batchRunCount: 0,
        feedback: "候補条件を追加して、まとめて試してください。",
        nextFocus: "比較する候補を増やすと、ベスト条件を見つけやすくなります。",
        notes: ["このステージでは GUI ベースの半自動探索を体験します。"],
      })
    default:
      throw new Error(`unknown stage: ${stageId}`)
  }
}

export function runStageAction(stageId, previousState, action, payload = {}) {
  const state = clone(previousState)

  switch (stageId) {
    case "0-1":
      if (action === "place_order" && state.orderStatus === "未注文") {
        state.orderStatus = "受付済み"
        state.balance = 80
        state.reserved = 20
        state.timeline.push(event("注文受付", "買い注文が受け付けられ、20 が拘束されました。", "player"))
        state.feedback = "注文が受け付けられました。"
        state.nextFocus = "このゲームでは、操作するとシステムの状態が変わります。"
        state.success = true
        state.nextUnlocked = true
        state.notes.push("状態は 未注文 -> 受付済み に変わり、残高の一部が予約済みになりました。")
      }
      return state

    case "0-2":
      if (action === "place_order" && !state.hasOrder) {
        state.orderStatus = "受付済み"
        state.balance = 80
        state.reserved = 20
        state.hasOrder = true
        state.canProcess = true
        state.timeline.push(event("注文受付", "買い注文が板に入りました。", "player"))
        state.feedback = "注文は受け付けられました。次は処理を進めてみましょう。"
        state.nextFocus = "受付された注文があとから処理されて約定します。"
      }
      if (action === "process_order" && state.canProcess && !state.success) {
        state.orderStatus = "約定済み"
        state.reserved = 0
        state.assetA = 10
        state.canProcess = false
        state.timeline.push(event("処理開始", "マッチング処理が始まりました。", "system"))
        state.timeline.push(event("約定", "売り注文と価格が一致し、約定しました。", "system"))
        state.feedback = "受付された注文が実際に処理されました。"
        state.nextFocus = "受付イベントと約定イベントは別だと分かれば成功です。"
        state.success = true
        state.nextUnlocked = true
        state.notes.push("受付済み -> 約定済み へ変わり、拘束資金は消費されて保有量 A が増えました。")
      }
      return state

    case "0-3":
      if (action === "cancel_order" && !state.success) {
        state.orderStatus = "キャンセル済み"
        state.balance = 100
        state.reserved = 0
        state.refundCount = 1
        state.timeline.push(event("キャンセル", "未処理注文を取り消しました。", "player"))
        state.timeline.push(event("返金", "拘束されていた 20 が一度だけ戻りました。", "refund"))
        state.feedback = "未処理の注文は正常に取り消され、資金が戻りました。"
        state.nextFocus = "正常系では、状態と資金が整合的に戻ります。"
        state.success = true
        state.nextUnlocked = true
        state.notes.push("返金回数は 1 回です。第2章ではこの基準が崩れるケースを扱います。")
      }
      return state

    case "0-4":
      if (action === "confirm_focus") {
        const focusKey = String(payload.focus || "")
        if (focusKey in state.checks) {
          state.checks[focusKey] = true
          const labelMap = {
            order: "順序",
            status: "状態",
            balance: "残高",
          }
          state.feedback = `${labelMap[focusKey]} を確認しました。`
          const nextKey = ["order", "status", "balance"].find((key) => !state.checks[key])
          state.currentFocusKey = nextKey || ""
          state.nextFocus = nextKey
            ? `次は ${labelMap[nextKey]} を見て、正常時の基準を覚えましょう。`
            : "3つとも確認できました。第1章では順番のズレを観察します。"
        }
        const allChecked = Object.values(state.checks).every(Boolean)
        if (allChecked) {
          state.success = true
          state.nextUnlocked = true
          state.feedback = "準備完了です。"
          state.nextFocus = "次の章からは、正常ではない挙動を観察します。"
          state.currentFocusKey = ""
          state.notes.push("観察ポイントは 順序 / 状態 / 残高 の3つです。")
        }
      }
      return state

    case "1-1":
      if (action === "run_sequence" && !state.success) {
        state.executionOrder = ["Rival", "Player"]
        state.resultLabel = "順序逆転"
        state.anomalyLabel = "受付順と実行順が逆転"
        state.profitDelta = -6
        state.timeline.push(event("実行開始", "処理順の決定に入りました。", "system"))
        state.timeline.push(event("割り込み発生", "Rival が Player より先に実行されました。", "anomaly"))
        state.feedback = "受付順と実行順がずれると結果が変わります。"
        state.nextFocus = "Player が先着でも、実行順が変われば不利になると分かれば成功です。"
        state.success = true
        state.nextUnlocked = true
        state.notes.push("左の受付順と中央の実行順を同じ視線で比べられるようにしてあります。")
      }
      return state

    case "1-2":
      if (action === "retry") {
        return createInitialStageState(stageId)
      }
      if (action === "interrupt" && !state.success) {
        const evaluation = evaluateStage12Interrupt(payload.progress)
        state.attempts += 1
        state.lastProgress = evaluation.progress
        state.timeline = [event("処理待機", "受付順は固定され、処理直前の割り込み待ちです。", "system")]
        if (evaluation.success) {
          state.executionOrder = ["Player", "Interrupt", "Rival"]
          state.resultLabel = "割り込み成功"
          state.anomalyLabel = "Interrupt が Rival を追い抜いた"
          state.profitDelta = 8
          state.timeline.push(
            event("割り込み成功", `進捗 ${evaluation.progress.toFixed(1)}% で割り込みが成立しました。`, "anomaly")
          )
          state.feedback = "このタイミングでは順序が崩れました。"
          state.nextFocus = "処理直前にだけ異常が開くことを覚えておきましょう。"
          state.success = true
          state.nextUnlocked = true
          state.notes.push("成功帯はかなり狭く、処理直前だけ順序比較パネルが崩れます。")
        } else {
          state.executionOrder = ["Player", "Rival", "Interrupt"]
          state.resultLabel = "通常順序"
          state.anomalyLabel = ""
          state.profitDelta = 0
          state.timeline.push(
            event("割り込み失敗", `進捗 ${evaluation.progress.toFixed(1)}% では順序は変わりませんでした。`, "system")
          )
          state.feedback = "順序は変わりませんでした。"
          state.nextFocus = "もう少し処理直前を狙ってみてください。"
        }
      }
      return state

    case "1-3":
      if (action === "set_timing") {
        state.selectedTiming = clamp(payload.timing, 0, 100)
        return state
      }
      if (action === "retry") {
        state.executionOrder = ["?", "?", "?"]
        state.resultLabel = "再挑戦待ち"
        state.anomalyLabel = ""
        state.profitDelta = 0
        state.feedback = "直前の設定を保持しました。もう一度試せます。"
        state.nextFocus = "必要ならヒントを使いながら、同じ条件でもう一度試してください。"
        return state
      }
      if (action === "show_hint") {
        if (state.shownHints < state.unlockedHints) {
          state.shownHints += 1
          state.feedback = "新しいヒントを表示しました。"
          state.nextFocus = STAGE_13_HINTS[state.shownHints - 1]
        } else {
          state.feedback = "まだ新しいヒントは解放されていません。"
          state.nextFocus = "まずは実行して結果を見ましょう。"
        }
        return state
      }
      if (action === "run_selection" && !state.success) {
        const evaluation = evaluateStage13Selection(state.selectedTiming)
        state.attempts += 1
        state.timeline = [event("探索開始", "処理直前のどこで入ると順序が崩れるかを探します。", "system")]
        if (evaluation.success) {
          state.executionOrder = ["Player", "Interrupt", "Rival"]
          state.resultLabel = "再現成功"
          state.anomalyLabel = "順序逆転を自力で再現"
          state.profitDelta = 10
          state.timeline.push(
            event("再現成功", `タイミング ${evaluation.timing} で割り込み条件が成立しました。`, "anomaly")
          )
          state.feedback = "条件を揃えることで異常を再現できました。"
          state.nextFocus = "この異常は偶然ではなく、条件が揃うと再現できます。"
          state.success = true
          state.nextUnlocked = true
          state.notes.push(`成功帯は ${evaluation.timing} を含む処理直前でした。`)
        } else {
          state.executionOrder = ["Player", "Rival", "Interrupt"]
          state.resultLabel = "未再現"
          state.anomalyLabel = ""
          state.profitDelta = 0
          state.unlockedHints = Math.min(STAGE_13_HINTS.length, state.attempts)
          if (state.attempts >= 3) {
            state.successWindow = { start: 72, end: 82 }
          }
          state.timeline.push(
            event("通常順序", `タイミング ${evaluation.timing} では順序は崩れませんでした。`, "system")
          )
          const failText =
            state.attempts === 1
              ? "少し遅らせると変化が出るかもしれません。"
              : state.attempts === 2
                ? "受付そのものより、処理直前の割り込みが重要です。"
                : "正解帯を表示しました。72〜82 の付近を狙ってください。"
          state.feedback = "まだ順序は崩れませんでした。"
          state.nextFocus = failText
        }
      }
      return state

    case "1-4":
      if (action === "retry") {
        return createInitialStageState(stageId)
      }
      if (action === "set_decision" && !state.finished) {
        const decision = payload.decision === "order" ? "order" : payload.decision === "skip" ? "skip" : ""
        state.pendingDecision = decision
        state.feedback = decision === "order" ? "このターンは割り込みを狙います。" : "このターンは見送ります。"
        state.nextFocus = "決めたら実行して、利益差がどう変わるかを見ましょう。"
        return state
      }
      if (action === "execute_turn" && !state.finished && state.pendingDecision) {
        const turn = state.turns[state.currentTurnIndex]
        if (!turn) return state

        const outcome = simulateStage14Turn(turn, state.pendingDecision)
        turn.decision = state.pendingDecision
        turn.netProfit = outcome.netProfit
        turn.summary = outcome.summary
        turn.executionOrder = outcome.executionOrder
        turn.resolved = true
        state.turnLog.push(`${turn.label}: ${state.pendingDecision === "order" ? "注文" : "見送り"} -> ${outcome.netProfit >= 0 ? "+" : ""}${outcome.netProfit}`)
        state.timeline.push(
          event(
            `${turn.label} 実行`,
            `${turn.marketHint} / ${state.pendingDecision === "order" ? "注文" : "見送り"} / 利益差 ${outcome.netProfit >= 0 ? "+" : ""}${outcome.netProfit}`,
            outcome.anomaly ? "anomaly" : "system"
          )
        )
        state.totalProfit += outcome.netProfit
        state.currentTurnIndex += 1
        state.remainingTurns = Math.max(0, state.remainingTurns - 1)
        state.pendingDecision = ""

        if (state.totalProfit >= state.goalProfit) {
          state.feedback = "目標利益に到達しました。"
          state.nextFocus = "順序のズレは、影響が大きい場面だけを狙うと強い戦略になります。"
          state.success = true
          state.nextUnlocked = true
          state.finished = true
          state.notes.push("低影響ターンを避けることで、3手以内でも目標利益を超えられます。")
          return state
        }

        if (state.currentTurnIndex >= state.turns.length) {
          state.finished = true
          if (state.totalProfit >= state.goalProfit) {
            state.feedback = "目標利益に到達しました。"
            state.nextFocus = "順序異常を戦略として使う感覚をつかめました。"
            state.success = true
            state.nextUnlocked = true
          } else {
            state.feedback = "操作回数を使い切りました。"
            state.nextFocus = "毎回入るのではなく、影響が大きいターンを選ぶ必要があります。"
          }
          return state
        }

        state.feedback = `${turn.label} を処理しました。`
        state.nextFocus = `次は ${state.turns[state.currentTurnIndex].label} です。影響 ${state.turns[state.currentTurnIndex].visibleImpact} を見て判断しましょう。`
      }
      return state

    case "2-1":
      if (action === "cancel_order" && !state.success) {
        state.orderStatus = "返金済み"
        state.balance = 100
        state.reserved = 0
        state.refundCount = 1
        state.historySummary = "1本の履歴で正常終了"
        state.flags = {
          cancelled: true,
          refunded: true,
          closed: true,
        }
        state.timeline.push(event("キャンセル", "ORD-01 を取り消しました。", "player", { orderId: "ORD-01", type: "cancel" }))
        state.timeline.push(
          event("返金", "ORD-01 にひもづく 20 が一度だけ戻りました。", "refund", { orderId: "ORD-01", type: "refund" })
        )
        state.feedback = "正常な返金は1回だけです。"
        state.nextFocus = "同じ注文IDに対して、履歴が1本で閉じていることを確認しましょう。"
        state.success = true
        state.nextUnlocked = true
        state.notes.push("ORD-01 は 受付済み -> キャンセル -> 返金済み と整合的に遷移しました。")
      }
      return state

    case "2-2":
      if (action === "cancel_order" && state.phase === "pre_cancel") {
        state.orderStatus = "返金済み"
        state.balance = 100
        state.reserved = 0
        state.refundCount = 1
        state.phase = "after_cancel"
        state.canContinueProcessing = true
        state.flags = {
          cancelled: true,
          refunded: true,
          closed: true,
          requeued: true,
        }
        state.historySummary = "正常ならここで終了"
        state.timeline.push(event("キャンセル", "ORD-02 を取り消しました。", "player", { orderId: "ORD-02", type: "cancel" }))
        state.timeline.push(
          event("返金", "ORD-02 に対して 20 が一度だけ戻りました。", "refund", { orderId: "ORD-02", type: "refund" })
        )
        state.feedback = "ここまでは正常です。"
        state.nextFocus = "処理を続けると、終了済みの注文が再び返金されます。"
        return state
      }
      if (action === "continue_processing" && state.canContinueProcessing && !state.success) {
        state.referenceCount = 2
        state.refundCount = 2
        state.balance = 120
        state.phase = "after_duplicate"
        state.canContinueProcessing = false
        state.duplicateProcessing = true
        state.historySummary = "返金後に再処理され、返金が重複"
        state.timeline.push(
          event("再処理", "終了済みの ORD-02 がもう一度処理対象として読み込まれました。", "anomaly", {
            orderId: "ORD-02",
            type: "reprocess",
          })
        )
        state.timeline.push(
          event("返金", "同じ ORD-02 に対して 20 が再び戻りました。", "anomaly", { orderId: "ORD-02", type: "refund" })
        )
        state.feedback = "同じ注文に対して二度お金が戻っています。"
        state.nextFocus = "返金済みのはずなのに、追加の返金イベントが起きている点が異常です。"
        state.success = true
        state.nextUnlocked = true
        state.notes.push("正常ケースとの差は、返金回数 1 -> 2、残高 100 -> 120、履歴件数 3 -> 5 です。")
      }
      return state

    case "2-3":
      if (action === "set_replay_timing") {
        const timing =
          payload.timing === "refund_window" || payload.timing === "after_close"
            ? payload.timing
            : "before_refund"
        state.selectedReplayTiming = timing
        return state
      }
      if (action === "set_replay_mode") {
        state.selectedReplayMode = payload.mode === "on" ? "on" : "off"
        return state
      }
      if (action === "retry") {
        state.orderStatus = "受付済み"
        state.balance = 80
        state.reserved = 20
        state.refundCount = 0
        state.referenceCount = 1
        state.flags = {
          cancelled: false,
          refunded: false,
          closed: false,
          replayRequested: false,
          refundGuard: true,
        }
        state.resultLabel = "再挑戦待ち"
        state.anomalyLabel = ""
        state.duplicateProcessing = false
        state.historySummary = "まだ返金は起きていません"
        state.feedback = "条件は保持したまま、もう一度試せます。"
        state.nextFocus = "返金回数が 2 になる条件を比べながら探してください。"
        state.timeline = [event("注文受付", "ORD-03 を受け付けました。", "player", { orderId: "ORD-03", type: "submit" })]
        return state
      }
      if (action === "show_refund_hint") {
        if (state.shownHints < state.unlockedHints) {
          state.shownHints += 1
          state.feedback = "新しいヒントを表示しました。"
          state.nextFocus = STAGE_23_HINTS[state.shownHints - 1]
        } else {
          state.feedback = "まだ新しいヒントは解放されていません。"
          state.nextFocus = "まずは条件を変えて実行し、返金回数を比べてください。"
        }
        return state
      }
      if (action === "run_refund_repro" && !state.success) {
        const outcome = simulateStage23Attempt(state.selectedReplayTiming, state.selectedReplayMode)
        state.attempts += 1
        state.orderStatus = outcome.orderStatus
        state.balance = outcome.balance
        state.reserved = outcome.reserved
        state.refundCount = outcome.refundCount
        state.referenceCount = outcome.referenceCount
        state.flags = outcome.flags
        state.resultLabel = outcome.resultLabel
        state.anomalyLabel = outcome.anomalyLabel
        state.duplicateProcessing = outcome.duplicateProcessing
        state.timeline = outcome.timeline
        state.historySummary = outcome.historySummary
        if (outcome.success) {
          state.feedback = "同じ注文を返金後に再参照させると、二重返金を再現できました。"
          state.nextFocus = "原因は返金条件だけでなく、返金済み判定の欠落にもあります。"
          state.success = true
          state.nextUnlocked = true
          state.notes.push("返金直後の再参照で、同じ ORD-03 が再び有効な対象として扱われました。")
        } else {
          state.unlockedHints = Math.min(STAGE_23_HINTS.length, state.attempts)
          if (state.attempts >= 3) {
            state.revealedRecipe = { timing: "refund_window", mode: "on" }
          }
          state.feedback = outcome.summary
          state.nextFocus = STAGE_23_HINTS[Math.min(STAGE_23_HINTS.length - 1, state.attempts - 1)]
        }
      }
      return state

    case "2-4":
      if (action === "select_order") {
        const found = state.orders.find((order) => order.id === payload.orderId)
        if (found) {
          state.selectedOrderId = found.id
          state.timeline = clone(found.history)
          state.feedback = `${found.id} を選択中です。`
          state.nextFocus = "返金回数、状態、内部フラグの3つを見比べてください。"
        }
        return state
      }
      if (action === "set_cause") {
        const causeId =
          payload.causeId === "missing_refund_guard" || payload.causeId === "queue_leftover" || payload.causeId === "rounding_bug"
            ? payload.causeId
            : ""
        state.selectedCauseId = causeId
        return state
      }
      if (action === "retry") {
        state.selectedCauseId = ""
        state.diagnosisResult = "未診断"
        state.feedback = "診断をやり直せます。"
        state.nextFocus = "別の注文IDや原因候補を見比べてください。"
        return state
      }
      if (action === "confirm_diagnosis" && !state.success) {
        const selectedOrder = state.orders.find((order) => order.id === state.selectedOrderId)
        state.attempts += 1
        if (!selectedOrder) return state

        const correctOrder = selectedOrder.anomaly
        const correctCause = state.selectedCauseId === "missing_refund_guard"

        if (correctOrder && correctCause) {
          state.diagnosisResult = "特定成功"
          state.feedback = "状態遷移が壊れた注文と原因を特定できました。"
          state.nextFocus = "返金回数・状態・履歴の矛盾をそろえて読むと原因まで説明できます。"
          state.success = true
          state.nextUnlocked = true
          state.notes.push("ORD-B は返金済みフラグが立たないまま再参照され、返金が2回実行されました。")
          return state
        }

        if (correctOrder && !correctCause) {
          state.diagnosisResult = "原因が違う"
          state.feedback = "怪しい注文は見つかりましたが、原因の説明がまだ足りません。"
          state.nextFocus = "返金済みなのに refunded フラグが立っていない点に注目してください。"
          return state
        }

        if (!correctOrder && correctCause) {
          state.diagnosisResult = "注文IDが違う"
          state.feedback = "考え方は近いですが、対象の注文IDが違います。"
          state.nextFocus = "返金回数が 2 の注文を優先して見直してください。"
          return state
        }

        state.diagnosisResult = "見直し中"
        state.feedback = "まだ特定できていません。"
        state.nextFocus = "返金回数 2、終了済みなのに再参照、という2点を同時に満たす注文を探しましょう。"
      }
      return state

    case "3-1":
      if (action === "calculate_rounding") {
        state.hasCalculated = true
        state.scenario = simulateChapter3Scenario({ splitCount: 1, repeatCount: 1, amount: state.amount })
        state.feedback = "小さな差ですが、理論値と一致していません。"
        state.nextFocus = "丸め前と丸め後を比べて、差分の大きさを見てください。"
        return state
      }
      if (action === "compare_values" && state.hasCalculated) {
        state.hasCompared = true
        state.success = true
        state.nextUnlocked = true
        state.feedback = "計算は正しそうに見えても、丸めにより差が出ることがあります。"
        state.nextFocus = "この差は小さいですが、ここから問題が始まります。"
        return state
      }
      return state

    case "3-2":
      if (action === "set_split_count") {
        state.splitCount = normalizeChapter3Split(payload.splitCount ?? state.splitCount)
        state.scenario = simulateChapter3Scenario({
          splitCount: state.splitCount,
          repeatCount: 1,
          amount: state.amount,
        })
        return state
      }
      if (action === "run_split_compare") {
        state.hasRun = true
        state.scenario = simulateChapter3Scenario({
          splitCount: state.splitCount,
          repeatCount: 1,
          amount: state.amount,
        })
        state.feedback =
          state.scenario.splitGainSingle > 0
            ? "同じ総量でも分け方によって結果が変わります。"
            : "この分割回数では差分は広がりませんでした。"
        state.nextFocus = "一括処理の基準値と、分割処理の結果を見比べてください。"
        return state
      }
      if (action === "compare_batch" && state.hasRun) {
        state.hasCompared = true
        if (state.scenario.splitGainSingle > 0) {
          state.success = true
          state.nextUnlocked = true
          state.feedback = "誤差は計算手順の選び方で有利にできます。"
          state.nextFocus = "次は split と repeat を変えながら、ベスト条件を探します。"
        } else {
          state.feedback = "一括結果と分割結果を見比べてください。総量は同じです。"
          state.nextFocus = "差分が正になる分割回数を探してみましょう。"
        }
        return state
      }
      if (action === "retry") {
        return createInitialStageState(stageId)
      }
      return state

    case "3-3":
      if (action === "set_split_count") {
        state.splitCount = normalizeChapter3Split(payload.splitCount ?? state.splitCount)
        return state
      }
      if (action === "set_repeat_count") {
        state.repeatCount = normalizeChapter3Repeat(payload.repeatCount ?? state.repeatCount)
        return state
      }
      if (action === "run_optimization_trial") {
        const trial = chapter3TrialRow(
          {
            splitCount: state.splitCount,
            repeatCount: state.repeatCount,
            amount: state.amount,
          },
          state.trialHistory.length + 1,
          "manual"
        )
        state.attempts += 1
        state.latestTrial = trial
        state.trialHistory.push(trial)
        if (!state.bestTrial || trial.cumulativeDelta > state.bestTrial.cumulativeDelta) {
          state.bestTrial = trial
          state.feedback = "新しいベスト条件を見つけました。"
          state.nextFocus = "ベスト差分と今回の累積差分を見比べてください。"
        } else {
          state.feedback = "試行を追加しました。"
          state.nextFocus = "単発差分より累積差分を比較すると、良い条件を見つけやすくなります。"
        }
        state.searchConsoleSuggested = state.attempts >= 2
        if (trial.cumulativeDelta >= state.targetDelta) {
          state.success = true
          state.nextUnlocked = true
          state.feedback = "最も有利な条件を探索できました。"
          state.nextFocus = "誤差は観察だけでなく、最適化の対象にもなります。"
        } else {
          state.unlockedHints = Math.min(STAGE_33_HINTS.length, state.attempts)
          if (state.attempts >= 3) {
            state.sampleBestHint = chapter3TrialRow(
              { splitCount: 5, repeatCount: 3, amount: state.amount },
              0,
              "hint"
            )
          }
        }
        return state
      }
      if (action === "save_trial" && state.latestTrial) {
        if (!state.savedTrialIds.includes(state.latestTrial.id)) {
          state.savedTrialIds.push(state.latestTrial.id)
        }
        state.feedback = "結果を保存しました。"
        state.nextFocus = "保存済みの試行とベスト結果を見比べられます。"
        return state
      }
      if (action === "show_rounding_hint") {
        if (state.shownHints < state.unlockedHints) {
          state.shownHints += 1
          state.feedback = "ヒントを表示しました。"
          state.nextFocus = STAGE_33_HINTS[state.shownHints - 1]
        } else {
          state.feedback = "まだ新しいヒントは解放されていません。"
          state.nextFocus = "まずは何回か実行して、累積差分の増え方を見てください。"
        }
        return state
      }
      if (action === "retry") {
        return createInitialStageState(stageId)
      }
      return state

    case "3-4":
      if (action === "set_search_split") {
        state.searchSplit = normalizeChapter3Split(payload.splitCount ?? state.searchSplit)
        return state
      }
      if (action === "set_search_repeat") {
        state.searchRepeat = normalizeChapter3Repeat(payload.repeatCount ?? state.searchRepeat)
        return state
      }
      if (action === "add_candidate") {
        state.candidates.push({
          id: chapter3RunId("cand"),
          splitCount: state.searchSplit,
          repeatCount: state.searchRepeat,
          amount: state.amount,
        })
        state.feedback = "候補条件を追加しました。"
        state.nextFocus = "候補がそろったら、まとめて試して比較します。"
        return state
      }
      if (action === "remove_candidate") {
        state.candidates = state.candidates.filter((candidate) => candidate.id !== payload.candidateId)
        state.feedback = "候補条件を削除しました。"
        state.nextFocus = state.candidates.length
          ? "残った候補をまとめて試せます。"
          : "比較する候補がありません。追加してください。"
        return state
      }
      if (action === "clear_search_results") {
        state.trialHistory = []
        state.bestTrial = null
        state.batchRunCount = 0
        state.feedback = "探索結果をクリアしました。"
        state.nextFocus = "候補条件は残したまま、もう一度比較できます。"
        return state
      }
      if (action === "run_batch_search") {
        if (!state.candidates.length) {
          state.feedback = "比較する候補が必要です。"
          state.nextFocus = "分割数や反復回数の異なる条件を追加してください。"
          return state
        }
        const batch = runChapter3Batch(state.candidates)
        state.trialHistory = batch.rows
        state.bestTrial = batch.bestTrial
        state.batchRunCount += 1
        if (batch.bestTrial && batch.bestTrial.cumulativeDelta >= state.targetDelta) {
          state.success = true
          state.nextUnlocked = true
          state.feedback = "複数条件を比較すると、有利なパターンを見つけやすくなります。"
          state.nextFocus = "さらに細かく試すなら Search Console が使えます。"
        } else {
          state.feedback = "まとめて試しました。"
          state.nextFocus = "ベスト条件と各候補の差分を見比べてください。"
        }
        return state
      }
      return state

    default:
      return state
  }
}

export function getStageMeta(stageId) {
  const meta = stageMeta(stageId)
  if (!meta) throw new Error(`unknown stage meta: ${stageId}`)
  return meta
}
