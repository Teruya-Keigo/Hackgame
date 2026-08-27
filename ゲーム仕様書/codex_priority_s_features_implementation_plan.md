# Codex 実装指示書：優先度S機能の追加

## 0. 目的

itch.io 公開後の初見プレイヤー体験を改善するため、既存ゲームに **優先度Sの小規模機能** を追加する。

追加対象は以下の4機能である。

1. 初回導入モーダル
2. ステージ選択メニュー
3. 全ステージ共通の「ヒントを見る」ボタン
4. 「今どこを見ればいい？」ハイライト

この実装では、ゲームロジック本体を大きく作り替えない。既存の `STAGE_SEQUENCE`、`appState`、`localStorage`、`render()`、`applyAction()`、`hintHtml()`、`buttonsHtml()` の構造を活かして、UI補助機能として追加する。

---

## 1. 現在の前提構成

現在のプロジェクトは React ではなく、素の JavaScript module で DOM を更新する構成である。

主要ファイルは以下。

```text
static/
  index.html
  app.js
  stage_core.mjs
  styles.css
  hack_lab.html
  hack_lab.js
  hack_lab.css
server.py
package.json
```

既存の重要構造は以下。

### `static/index.html`

- `#stage-path`
- `#stage-title`
- `#stage-goal`
- `#progress-label`
- `#progress-dots`
- `#reset-progress`
- `#chapter-kicker`
- `#chapter-note`
- `#mission-title`
- `#mission-card`
- `#input-region`
- `#visual-title`
- `#visual-region`
- `#timeline-section`
- `#timeline-region`
- `#result-title`
- `#result-region`
- `#hint-region`
- `#detail-region`
- `#feedback-region`
- `#action-buttons`

が存在する。

### `static/app.js`

- `STAGE_SEQUENCE` を `./stage_core.mjs` から import している。
- `loadProgress()` で `localStorage` から進行状態を読む。
- `appState` に `currentStageIndex`, `stageStates`, `activeScreen`, `searchConsole` がある。
- `render()` が現在ステージの UI を描画する。
- `renderSearchConsole()` が Search Console 用 UI を描画する。
- `renderHeader(stage)` がヘッダーと進行表示を描画する。
- `hintHtml(stage, state)` が右側のヒント領域を描画する。
- `buttonsHtml(stage, state)` が下部アクションボタンを描画する。
- `applyAction(action, value)` が `data-action` に応じて処理を振り分ける。
- `document.addEventListener("click", ...)` で `data-action` を拾っている。
- 既に `escapeHtml()` があるため、動的テキストは必ずこれを使ってエスケープする。

### `static/stage_core.mjs`

- `STAGE_SEQUENCE` が全ステージの `id`, `chapter`, `chapterTitle`, `title`, `goal`, `mission`, `focus` を持っている。
- ステージごとのロジックは `runStageAction()` 側にある。

今回の追加は **できるだけ `static/app.js` と `static/styles.css` の変更で完結** させること。
`stage_core.mjs` のゲームロジックは原則変更しない。

---

## 2. 変更禁止・注意事項

以下を守ること。

- `server.py` の起動方式を壊さない。
- `npm run dev` の挙動を壊さない。
- `npm run test:js` を通す。
- itch.io 向けの `build:itch`, `verify:itch`, `serve:itch`, `zip:itch` が存在する場合は壊さない。
- 既存ステージの成功条件やゲームロジックを変更しない。
- `stage_core.mjs` は原則変更しない。
- DOM を更新するとき、ユーザーに見える動的文字列は `escapeHtml()` を使う。
- `localStorage` の既存キー `security_game_stage_journey_v9` の構造を破壊しない。
- overlay や modal の一時状態は、既存の `stageStates` とはできるだけ分離する。

---

## 3. 実装する機能一覧

# 3.1 初回導入モーダル

## 目的

初めてページを開いたプレイヤーに、ゲームの見方を短く伝える。

初回表示内容は以下のような短い説明にする。

```text
このゲームでは、注文・状態・残高の変化を見ながら、仮想システムの異常を学びます。
まずはボタンを押して、中央の状態変化と右側の結果を見てください。
迷ったら「ヒントを見る」や「今見る場所」を確認してください。
```

## 仕様

- 初回アクセス時のみ自動表示する。
- 閉じたら `localStorage` に保存し、次回以降は自動表示しない。
- 下部またはヘッダー付近に「遊び方」ボタンを置き、いつでも再表示できるようにする。
- モーダルには以下を表示する。
  - タイトル: `Security Learning Game へようこそ`
  - 説明3行程度
  - 見る場所:
    - 左: 今回やること
    - 中央: メイン表示
    - 右: 結果と差分
    - 下: 操作ボタン
  - ボタン:
    - `はじめる`
    - `ステージを選ぶ`

## 実装方針

`static/app.js` に以下を追加する。

```js
const INTRO_SEEN_KEY = "security_game_intro_seen_v1"
```

一時UI状態として `runtime.activeOverlay` を使う。
既存の `runtime` は gauge 用にあるため、そこに追加してよい。

```js
const runtime = {
  gaugeStartMs: 0,
  gaugeRafId: 0,
  activeOverlay: null, // null | "intro" | "stage_select"
}
```

初回表示判定関数を追加する。

```js
function shouldShowIntro() {
  return localStorage.getItem(INTRO_SEEN_KEY) !== "true"
}
```

初回表示は `render()` の最後、または初回 `render()` 前に設定する。
推奨は、最初の `render()` 呼び出し前に以下を入れること。

```js
if (shouldShowIntro()) {
  runtime.activeOverlay = "intro"
}

render()
```

ただし、既存コード末尾に `render()` があるため、その直前に入れる。

### 追加する action

`applyAction()` に以下を追加する。

```js
if (action === "open_intro") {
  runtime.activeOverlay = "intro"
  render()
  return
}

if (action === "dismiss_intro") {
  localStorage.setItem(INTRO_SEEN_KEY, "true")
  runtime.activeOverlay = null
  render()
  return
}

if (action === "intro_open_stage_select") {
  localStorage.setItem(INTRO_SEEN_KEY, "true")
  runtime.activeOverlay = "stage_select"
  render()
  return
}
```

---

# 3.2 ステージ選択メニュー

## 目的

公開後に、ユーザーが任意の章・ステージを直接開けるようにする。

特に以下の用途を想定する。

- 第2章の二重返金だけ見たい
- 第3章の Search Console だけ試したい
- 第10章の Duel Mode を見せたい
- 研究室や友人に特定ステージを案内したい

## 仕様

- 下部アクションバーまたはヘッダーに `ステージ選択` ボタンを追加する。
- クリックすると overlay/modal でステージ一覧を表示する。
- ステージは `STAGE_SEQUENCE` を chapter ごとにグルーピングして表示する。
- 各ステージカードには以下を表示する。
  - `0-1` などのID
  - タイトル
  - 章名
  - クリア済み / 現在 / 未クリア
  - 注目ポイント `stage.focus`
- クリックすると該当ステージへ移動する。
- Search Console 表示中にステージ選択した場合は、`activeScreen` を `stage` に戻す。

## 実装方針

`static/app.js` に以下を追加する。

```js
function stageCompletionLabel(stageId) {
  const state = appState.stageStates?.[stageId]
  if (state?.success) return "クリア済み"
  const current = currentStage()
  if (current.id === stageId && currentScreen() === "stage") return "現在"
  return "未クリア"
}
```

```js
function groupedStages() {
  const groups = []
  for (const stage of STAGE_SEQUENCE) {
    let group = groups.find((item) => item.chapter === stage.chapter)
    if (!group) {
      group = { chapter: stage.chapter, chapterTitle: stage.chapterTitle, stages: [] }
      groups.push(group)
    }
    group.stages.push(stage)
  }
  return groups
}
```

### 追加する action

`applyAction()` に以下を追加する。

```js
if (action === "open_stage_select") {
  runtime.activeOverlay = "stage_select"
  render()
  return
}

if (action === "close_overlay") {
  runtime.activeOverlay = null
  render()
  return
}

if (action === "jump_stage") {
  const index = STAGE_SEQUENCE.findIndex((item) => item.id === value)
  if (index >= 0) {
    appState.currentStageIndex = index
    appState.activeScreen = "stage"
    ensureStageState(STAGE_SEQUENCE[index].id)
    runtime.activeOverlay = null
    saveProgress()
    render()
  }
  return
}
```

## 注意

- `jump_stage` はゲーム進行をスキップ可能にするため、公開デモ向け機能として扱う。
- もし将来的にロック制を入れるなら、別途 `stage.locked` や `unlockPolicy` を導入する。
- 今回は実装を簡単にするため、全ステージへ移動可能でよい。

---

# 3.3 全ステージ共通の「ヒントを見る」ボタン

## 目的

初見ユーザーが詰まったときに、ステージごとの見るべきポイントをすぐ確認できるようにする。

既存の `hintHtml(stage, state)` はステージごとの情報を出しているが、最初から情報量が多い場合がある。そこで、共通の「短いヒント」を明示的に出す。

## 仕様

- 下部アクションバーに `ヒントを見る` ボタンを追加する。
- クリックすると、右側の `#hint-region` に「共通ヒント」カードを追加表示する。
- もう一度クリックすると非表示にする。
- ヒント表示状態はステージごとに `state.manualHintShown` に保存する。
- ヒント本文は `SIMPLE_HINTS` マップで定義する。
- `SIMPLE_HINTS` に該当ステージがなければ `stage.focus` を使う。

## 実装方針

`static/app.js` に以下を追加する。

```js
const SIMPLE_HINTS = {
  "0-1": "注文状態カードと残高の変化を見てください。",
  "0-2": "受付イベントと約定イベントが別々に出ているか見てください。",
  "0-3": "返金回数が1回だけで、残高が元に戻ることを確認してください。",
  "0-4": "順序・状態・残高の3か所を順番に確認してください。",

  "1-1": "受付順と実行順が同じかどうかを見比べてください。",
  "1-2": "処理が始まる直前のタイミングを狙ってください。",
  "1-3": "早すぎる入力ではなく、処理直前の入力を探してください。",
  "1-4": "すべてのターンで入るのではなく、影響が大きい場面を選んでください。",

  "2-1": "注文ID、返金回数、refundedフラグの3点を見てください。",
  "2-2": "同じ注文IDに対して返金が2回起きていないか確認してください。",
  "2-3": "返金直後に同じ注文が再参照される条件を探してください。",
  "2-4": "返金回数、状態、履歴が矛盾している注文を選んでください。",

  "3-1": "理論値、実際値、差分の3つを比べてください。",
  "3-2": "一括処理と分割処理の結果差を見てください。",
  "3-3": "分割回数だけでなく、反復回数による累積差分を見てください。",
  "3-4": "候補を複数登録し、ベスト結果が更新される条件を探してください。",
}
```

後半章は未実装・仕様先行の可能性があるため、汎用ヒントでもよい。

```js
function simpleHintForStage(stage) {
  return SIMPLE_HINTS[stage.id] || `注目ポイント: ${stage.focus}`
}
```

`applyAction()` に以下を追加する。

```js
if (action === "toggle_stage_hint") {
  const stage = currentStage()
  const current = currentStageState()
  current.manualHintShown = !current.manualHintShown
  appState.stageStates[stage.id] = mergeStageState(stage.id, current)
  saveProgress()
  render()
  return
}
```

`hintHtml(stage, state)` の先頭付近に以下を追加する。

```js
if (state.manualHintShown) {
  blocks.unshift(listCard("ヒント", [simpleHintForStage(stage)], "warn"))
}
```

## ボタン表示

`buttonsHtml(stage, state)` に共通ユーティリティボタンを追加する。
既存の `actionConfig(stage, state)` を壊さないため、以下のような合成にする。

```js
function utilityActionConfig(stage, state) {
  return [
    { action: "open_intro", label: "遊び方", kind: "ghost" },
    { action: "open_stage_select", label: "ステージ選択", kind: "secondary" },
    {
      action: "toggle_stage_hint",
      label: state.manualHintShown ? "ヒントを隠す" : "ヒントを見る",
      kind: state.manualHintShown ? "selected" : "secondary",
    },
  ]
}
```

`buttonsHtml()` は以下のようにする。

```js
function buttonsHtml(stage, state) {
  return [...actionConfig(stage, state), ...utilityActionConfig(stage, state)]
    .map(/* 既存のbutton生成 */)
    .join("")
}
```

Search Console 画面でも `遊び方` と `ステージ選択` は使えてよいが、`ヒントを見る` は本編ステージ向けなので不要。
Search Console の `searchConsoleButtonsHtml()` に `ステージ選択` だけ追加してもよい。

---

# 3.4 「今どこを見ればいい？」ハイライト

## 目的

初見プレイヤーが画面のどこを見ればよいか迷わないようにする。

既存の `stage.focus` は良い情報だが、テキストだけでは埋もれやすい。そこで、注目領域を視覚的に強調する。

## 仕様

- 現在ステージの `focus` を強調表示する。
- `#chapter-note` の表示を少し目立つ見た目にする。
- ステージごとに、主に見るべき領域へ CSS クラス `focus-target` を付与する。
- 対象領域は以下の4つを基本にする。
  - `.mission-panel`
  - `.visual-panel`
  - `.result-panel`
  - `.timeline-section`
- 1ステージにつき1〜2領域を強調してよい。

## 実装方針

`static/app.js` に以下を追加する。

```js
const FOCUS_REGION_BY_STAGE = {
  "0-1": ["visual", "result"],
  "0-2": ["visual", "timeline"],
  "0-3": ["result", "timeline"],
  "0-4": ["mission", "result"],

  "1-1": ["visual", "timeline"],
  "1-2": ["visual"],
  "1-3": ["mission", "result"],
  "1-4": ["mission", "result"],

  "2-1": ["result", "timeline"],
  "2-2": ["result", "timeline"],
  "2-3": ["mission", "result"],
  "2-4": ["mission", "result"],

  "3-1": ["result"],
  "3-2": ["result"],
  "3-3": ["mission", "result"],
  "3-4": ["mission", "result"],
}
```

対応関数を追加する。

```js
function clearFocusTargets() {
  document.querySelectorAll(".focus-target").forEach((node) => {
    node.classList.remove("focus-target")
  })
}

function applyFocusTargets(stage) {
  clearFocusTargets()
  const regions = FOCUS_REGION_BY_STAGE[stage.id] || ["visual"]
  const selectorByRegion = {
    mission: ".mission-panel",
    visual: ".visual-panel",
    result: ".result-panel",
    timeline: ".timeline-section",
  }
  for (const region of regions) {
    const selector = selectorByRegion[region]
    if (!selector) continue
    const node = document.querySelector(selector)
    if (node) node.classList.add("focus-target")
  }
}
```

`render()` の最後付近で呼ぶ。

```js
applyFocusTargets(stage)
renderOverlay()
```

`renderSearchConsole()` では `clearFocusTargets()` を呼ぶ。

また、`renderHeader(stage)` の `chapterNote` は以下のような文言にする。

```js
el.chapterNote.textContent = `今見る場所: ${stage.focus}`
```

または既存の `注目ポイント: ...` のままでもよいが、CSSで目立たせる。

---

## 4. Overlay / Modal 実装

`index.html` を変更せずに、`app.js` 側で overlay root を作る方式を推奨する。

```js
function ensureOverlayRoot() {
  let root = document.getElementById("ui-overlay-root")
  if (!root) {
    root = document.createElement("div")
    root.id = "ui-overlay-root"
    document.body.appendChild(root)
  }
  return root
}
```

```js
function renderOverlay() {
  const root = ensureOverlayRoot()
  if (!runtime.activeOverlay) {
    root.innerHTML = ""
    root.hidden = true
    return
  }
  root.hidden = false
  if (runtime.activeOverlay === "intro") {
    root.innerHTML = introOverlayHtml()
    return
  }
  if (runtime.activeOverlay === "stage_select") {
    root.innerHTML = stageSelectOverlayHtml()
    return
  }
}
```

`render()` と `renderSearchConsole()` の最後に必ず `renderOverlay()` を呼ぶ。

```js
renderOverlay()
```

## introOverlayHtml

```js
function introOverlayHtml() {
  return `
    <div class="ui-overlay-backdrop">
      <section class="ui-modal intro-modal" role="dialog" aria-modal="true" aria-labelledby="intro-title">
        <div class="modal-kicker">Educational Security Simulation</div>
        <h2 id="intro-title">Security Learning Game へようこそ</h2>
        <p>このゲームでは、注文・状態・残高の変化を見ながら、仮想システムの異常を学びます。</p>
        <p>まずはボタンを押して、中央の状態変化と右側の結果を見てください。</p>
        <div class="intro-guide-grid">
          <div><strong>左</strong><span>今回やること</span></div>
          <div><strong>中央</strong><span>メイン表示</span></div>
          <div><strong>右</strong><span>結果と差分</span></div>
          <div><strong>下</strong><span>操作ボタン</span></div>
        </div>
        <div class="modal-actions">
          <button class="action-btn success" data-action="dismiss_intro">はじめる</button>
          <button class="action-btn secondary" data-action="intro_open_stage_select">ステージを選ぶ</button>
        </div>
      </section>
    </div>
  `
}
```

## stageSelectOverlayHtml

```js
function stageSelectOverlayHtml() {
  const groups = groupedStages()
  return `
    <div class="ui-overlay-backdrop">
      <section class="ui-modal stage-select-modal" role="dialog" aria-modal="true" aria-labelledby="stage-select-title">
        <div class="modal-head">
          <div>
            <div class="modal-kicker">Stage Select</div>
            <h2 id="stage-select-title">ステージ選択</h2>
          </div>
          <button class="action-btn ghost" data-action="close_overlay">閉じる</button>
        </div>
        <div class="stage-select-groups">
          ${groups.map(stageGroupHtml).join("")}
        </div>
      </section>
    </div>
  `
}
```

```js
function stageGroupHtml(group) {
  return `
    <div class="stage-select-group">
      <h3>${escapeHtml(group.chapterTitle)}</h3>
      <div class="stage-select-grid">
        ${group.stages.map(stageSelectButtonHtml).join("")}
      </div>
    </div>
  `
}
```

```js
function stageSelectButtonHtml(stage) {
  const label = stageCompletionLabel(stage.id)
  const isCurrent = currentStage().id === stage.id && currentScreen() === "stage"
  return `
    <button class="stage-select-card ${isCurrent ? "current" : ""}" data-action="jump_stage" data-value="${escapeHtml(stage.id)}">
      <span class="stage-select-id">${escapeHtml(stage.id)}</span>
      <span class="stage-select-title">${escapeHtml(stage.title)}</span>
      <span class="stage-select-goal">${escapeHtml(stage.goal)}</span>
      <span class="stage-select-meta">${escapeHtml(label)}</span>
    </button>
  `
}
```

---

## 5. CSS 追加仕様

`static/styles.css` に以下のようなスタイルを追加する。
既存デザインに合わせ、暗色・シアン・アンバー系にする。

```css
.focus-target {
  position: relative;
  box-shadow:
    0 0 0 1px rgba(117, 240, 191, 0.42),
    0 0 28px rgba(117, 240, 191, 0.12);
  border-color: rgba(117, 240, 191, 0.72) !important;
}

.focus-target::before {
  content: "今見る場所";
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
  border: 1px solid rgba(255, 215, 155, 0.55);
  background: rgba(38, 29, 12, 0.9);
  color: var(--amber);
  font-size: 10px;
  padding: 3px 6px;
  pointer-events: none;
}

.ui-overlay-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0, 4, 8, 0.72);
  backdrop-filter: blur(8px);
}

.ui-modal {
  width: min(920px, 96vw);
  max-height: min(86vh, 760px);
  overflow: auto;
  border: 1px solid rgba(117, 240, 191, 0.45);
  background:
    radial-gradient(circle at top left, rgba(123, 195, 255, 0.16), transparent 32%),
    linear-gradient(180deg, rgba(12, 23, 32, 0.98), rgba(5, 10, 16, 0.98));
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
  padding: 20px;
  color: var(--text);
}

.modal-kicker {
  color: var(--mint);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ui-modal h2 {
  margin: 8px 0 12px;
  font-size: clamp(24px, 3.2vw, 38px);
}

.ui-modal p {
  color: var(--muted);
  line-height: 1.7;
  font-size: 13px;
}

.intro-guide-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin: 16px 0;
}

.intro-guide-grid div {
  border: 1px solid rgba(75, 107, 126, 0.55);
  background: rgba(7, 15, 23, 0.82);
  padding: 10px;
  display: grid;
  gap: 4px;
}

.intro-guide-grid strong {
  color: var(--amber);
  font-size: 12px;
}

.intro-guide-grid span {
  color: var(--text);
  font-size: 12px;
}

.modal-actions,
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.modal-actions {
  justify-content: flex-end;
  margin-top: 16px;
}

.stage-select-modal {
  width: min(1120px, 96vw);
}

.stage-select-groups {
  display: grid;
  gap: 16px;
  margin-top: 14px;
}

.stage-select-group h3 {
  margin: 0 0 8px;
  color: var(--amber);
  font-size: 14px;
}

.stage-select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
}

.stage-select-card {
  text-align: left;
  border: 1px solid rgba(75, 107, 126, 0.62);
  background: rgba(7, 15, 23, 0.9);
  color: var(--text);
  padding: 10px;
  cursor: pointer;
  display: grid;
  gap: 5px;
}

.stage-select-card:hover,
.stage-select-card.current {
  border-color: rgba(117, 240, 191, 0.72);
  background: rgba(12, 43, 34, 0.64);
}

.stage-select-id {
  color: var(--mint);
  font-size: 11px;
  font-weight: 700;
}

.stage-select-title {
  font-size: 13px;
  font-weight: 700;
}

.stage-select-goal,
.stage-select-meta {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .intro-guide-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

必要に応じて、既存CSSのトーンに合わせて微調整してよい。

---

## 6. README 追記

README が存在する場合は、以下を追記する。
README がない場合は、最小限作成する。

```md
## Added UI Support Features

The current prototype includes several beginner-support features:

- First-run introduction modal
- Stage selection menu
- Per-stage hint button
- Highlighted focus area for the current stage

These features are designed to improve the first 5 minutes of the game experience and make the prototype easier to test on itch.io.
```

日本語READMEなら以下でよい。

```md
## 追加された補助機能

初見プレイヤー向けに、以下の補助機能を追加しています。

- 初回導入モーダル
- ステージ選択メニュー
- 全ステージ共通のヒント表示
- 現在見るべき領域のハイライト

これらは、itch.io 公開版で最初の数分の理解を助けるための機能です。
```

---

## 7. テスト・検証

変更後、以下を実行する。

```bash
npm run test:js
```

もし itch.io 向けスクリプトが存在する場合は以下も実行する。

```bash
npm run build:itch
npm run verify:itch
npm run serve:itch
```

Python側も可能なら実行する。

```bash
npm run test:py
```

---

## 8. 手動確認項目

ブラウザで以下を確認する。

### ローカル開発版

```bash
npm run dev
```

`http://127.0.0.1:8080/` を開き、以下を確認する。

```text
[ ] 初回アクセス時に導入モーダルが表示される
[ ] 「はじめる」でモーダルが閉じる
[ ] 再読み込みしても導入モーダルが自動表示されない
[ ] 「遊び方」ボタンで導入モーダルを再表示できる
[ ] 「ステージ選択」でステージ一覧が開く
[ ] 任意ステージへ移動できる
[ ] Search Console 中でもステージ選択から本編に戻れる
[ ] 「ヒントを見る」で右側に短いヒントが表示される
[ ] 「ヒントを隠す」でヒントが消える
[ ] ステージごとに注目領域がハイライトされる
[ ] 既存のステージ操作ボタンが壊れていない
[ ] 第0章〜第3章の基本操作が以前通り動く
[ ] Chrome DevTools Console に赤エラーが出ない
```

### itch.io向け静的版

```bash
npm run build:itch
npm run verify:itch
npm run serve:itch
```

ブラウザで表示し、以下を確認する。

```text
[ ] 導入モーダルが表示される
[ ] ステージ選択が動く
[ ] ヒント表示が動く
[ ] フォーカスハイライトが動く
[ ] Hack Labへの遷移と戻るリンクが壊れていない
[ ] `/static/` パスエラーが出ない
```

---

## 9. 受け入れ条件

このタスクは以下を満たしたら完了とする。

```text
[ ] `static/app.js` に初回導入モーダルが実装されている
[ ] `localStorage` により初回表示済み状態が保存される
[ ] 「遊び方」ボタンで導入モーダルを再表示できる
[ ] ステージ選択メニューが実装されている
[ ] `STAGE_SEQUENCE` から一覧が自動生成される
[ ] 任意ステージに移動できる
[ ] 全ステージ共通の「ヒントを見る」ボタンがある
[ ] ヒント表示状態がステージごとに保存される
[ ] `stage.focus` または `SIMPLE_HINTS` に基づく短いヒントが表示される
[ ] 現在見るべき領域に `focus-target` が付く
[ ] `static/styles.css` にモーダル、ステージ選択、フォーカス強調のスタイルが追加されている
[ ] 既存の `server.py` 起動方式が壊れていない
[ ] `npm run test:js` が通る
[ ] itch.io向けビルドが存在する場合、`npm run build:itch` と `npm run verify:itch` が通る
[ ] README に追加機能の説明が追記されている
```

---

## 10. 実装時の落とし穴

### 10.1 `stage_core.mjs` に UI 状態を入れない

`manualHintShown` などのUI補助状態は `app.js` 側の `stageStates` に入れるだけでよい。
ゲームロジックの `runStageAction()` に新しい action を追加する必要はない。

### 10.2 `applyAction()` の順序に注意

`toggle_stage_hint`, `open_intro`, `open_stage_select`, `jump_stage`, `close_overlay` は、`runStageAction()` に渡す前に処理すること。
そうしないと未知 action としてステージロジック側に流れてしまう可能性がある。

### 10.3 Search Console 表示中の扱い

`currentScreen() === "search_console"` の分岐内でも、以下の action は共通処理として先に受けること。

- `open_intro`
- `open_stage_select`
- `close_overlay`
- `jump_stage`

したがって、`applyAction()` の最初の方で overlay 系 action を処理してから、Search Console 固有分岐に入るのが望ましい。

### 10.4 overlay root の再描画

`render()` だけでなく `renderSearchConsole()` の最後でも `renderOverlay()` を呼ぶこと。
Search Console 中にステージ選択や遊び方を開けるようにするため。

### 10.5 ハイライトの残り

ステージ移動時や Search Console 表示時に、古い `.focus-target` が残らないようにする。
必ず `clearFocusTargets()` してから新しい対象に付けること。

### 10.6 zipビルドへの影響

公開用コピー生成スクリプトが `static/` から `public_build/itch/` へコピーする構成なら、`app.js` と `styles.css` の変更はそのまま反映されるはず。
ただし、`index.html` を変更した場合は `/static/...` と `./...` の変換に影響しないか確認すること。

---

## 11. 完了報告に含める内容

実装後、最後に以下を報告すること。

```text
- 変更したファイル一覧
- 追加した機能一覧
- 実行したテストコマンド
- 通ったテスト
- 手動確認した項目
- 未確認または残課題
```

