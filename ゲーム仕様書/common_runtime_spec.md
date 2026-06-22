# 共通ランタイム仕様書

## 1. 目的

本仕様書は、教育用セキュリティゲーム全体で共通して使用するランタイム仕様を定義する。

対象は以下である。

- `GameEvent`: イベントログの共通形式
- `RuntimeState`: ステージ、ドメイン、UI、履歴を含む共通状態
- `ScoreResult` / `ScoreProfile`: スコア内訳と章別評価プロファイル
- `PlanIR`: GUI、テンプレート、DSLを統一して扱う中間表現
- `activePlanSource`: GUI / Template / DSL の実行対象選択規則
- 共通実行パイプライン
- 共通診断、検証、テスト観点

章別仕様書は、各章固有の学習目標、画面、ステージ、成功条件、章固有イベント種別を定義する。
本仕様書は、それらを実装上どの共通形式で扱うかを定義する。

---

## 2. 基本方針

### 2.1 章別仕様と共通仕様の責務分離

章別仕様書で定義するものは以下である。

- 章の教育目的
- 各ステージの学習目標
- プレイヤー操作
- 章固有UIコンポーネント
- 章固有の成功条件・失敗条件
- 章固有のイベント種別
- 章固有のスコア重み

本共通仕様書で定義するものは以下である。

- イベントログの構造
- 状態管理の構造
- スコア計算の共通形式
- Plan / IR の共通形式
- GUI / Template / DSL の実行選択ルール
- 実行、検証、ログ記録、状態更新、スコア更新の流れ

### 2.2 統一実行モデル

本ゲームでは、GUI操作、テンプレート選択、DSL記述のいずれも、最終的に `PlanIR` または `RuntimeCommand` へ変換する。

```text
GUI AttackBuilder
  -> PlanIR

StrategyTemplate
  -> PlanIR

Duel DSL Source
  -> Duel DSL Compiler
  -> PlanIR

単発UI操作
  -> RuntimeCommand
```

`PlanIR` は、ゲーム内仮想環境でのみ実行可能なアクション列であり、外部ネットワーク、実サービス、OS、ファイル、外部APIへの操作を含まない。

### 2.3 イベント中心設計

実行結果は必ず `GameEvent` として記録する。
画面表示、状態差分、リプレイ、スコアリング、デバッグ、シナリオテストは `GameEvent` を中心に構成する。

```text
User Operation
  -> Plan / Command
  -> Validation
  -> Simulation
  -> GameEvent[]
  -> RuntimeState
  -> ScoreResult
  -> UI Feedback
```

---

## 3. 共通用語

| 用語 | 意味 |
|---|---|
| Runtime | ステージ実行中の状態管理、検証、シミュレーション、ログ記録、スコア計算の全体 |
| RuntimeState | ステージ状態、ゲーム内状態、UI状態、履歴状態をまとめた状態オブジェクト |
| GameEvent | 実行中に起きた事象を構造化して記録するイベント |
| PlanIR | GUI、テンプレート、DSLから生成される共通実行計画 |
| RuntimeCommand | ボタン操作など、PlanIR化するほどではない単発操作 |
| ScoreProfile | 章やステージごとの評価重み |
| ScoreResult | 実行後のスコア内訳 |
| activePlanSource | 現在の実行対象として選ばれている計画入力源 |
| Diagnostic | コンパイル、検証、実行前チェックで返す診断情報 |

---

## 4. 共通状態仕様: RuntimeState

### 4.1 RuntimeState の目的

`RuntimeState` は、章ごとの実行状態を共通形式で保持する。
UI状態とゲーム内ドメイン状態を混在させないことを原則とする。

```ts
type RuntimeState = {
  runtimeVersion: string;

  chapterId: string;
  stageId: string;
  screenId?: string;

  stageStatus: StageStatus;

  domainState: DomainState;
  uiState: UIState;
  historyState: HistoryState;

  planSelection?: PlanSelectionState;
  activePlan?: PlanIR;

  score?: ScoreResult;

  diagnostics: Diagnostic[];
};
```

### 4.2 StageStatus

全章共通のステージ進行状態は以下とする。

```ts
type StageStatus =
  | "notStarted"
  | "ready"
  | "planning"
  | "validating"
  | "running"
  | "resolved"
  | "feedback"
  | "completed"
  | "failed"
  | "retryReady";
```

| 状態 | 意味 |
|---|---|
| `notStarted` | ステージ未開始 |
| `ready` | 初期表示完了、操作可能 |
| `planning` | 攻撃計画、条件、テンプレート、DSLを編集中 |
| `validating` | 実行前検証中 |
| `running` | シミュレーション実行中 |
| `resolved` | 実行結果確定、イベント生成済み |
| `feedback` | 成功・失敗・ヒントを表示中 |
| `completed` | ステージクリア |
| `failed` | 失敗条件を満たした状態 |
| `retryReady` | 再試行可能状態 |

### 4.3 DomainState

`DomainState` はゲーム内状態だけを持つ。ボタンの有効/無効、モーダル表示、選択中タブなどのUI状態は持たない。

```ts
type DomainState = {
  orders?: Record<string, OrderState>;
  balances?: Record<string, BalanceState>;
  refunds?: Record<string, RefundState>;
  numeric?: NumericState;
  resources?: ResourceState;
  defense?: DefenseState;
  strategies?: StrategyState;
  campaign?: CampaignState;
  custom?: Record<string, unknown>;
};
```

#### 4.3.1 OrderState

```ts
type OrderStatus =
  | "none"
  | "accepted"
  | "queued"
  | "processing"
  | "matched"
  | "canceled"
  | "refunded"
  | "invalid";

type OrderState = {
  orderId: string;
  ownerId: string;
  status: OrderStatus;
  amount: number;
  price?: number;
  createdStep: number;
  updatedStep: number;
  flags: string[];
};
```

#### 4.3.2 RefundState

```ts
type RefundState = {
  orderId: string;
  refundCount: number;
  totalRefundAmount: number;
  refundedSteps: number[];
  isDuplicate: boolean;
};
```

#### 4.3.3 NumericState

```ts
type NumericState = {
  theoreticalValue?: number;
  actualValue?: number;
  singleDelta?: number;
  cumulativeDelta?: number;
  splitCount?: number;
  trialCount?: number;
  bestTrialId?: string;
};
```

#### 4.3.4 ResourceState

```ts
type ResourceState = {
  capacity: number;
  usedCapacity: number;
  queueLength: number;
  averageLatency: number;
  virtualLoad: number;
  rateLimitActive: boolean;
};
```

#### 4.3.5 DefenseState

```ts
type DefenseState = {
  alertLevel: number;
  detectionScore: number;
  blocked: boolean;
  blockReason?: string;
  activeRules: string[];
  adaptationLevel?: number;
  lastReaction?: string;
};
```

#### 4.3.6 StrategyState

```ts
type StrategyState = {
  templates: Record<string, StrategyTemplate>;
  currentStrategyId?: string;
  strategyHistory: string[];
  hypothesis?: HypothesisState;
};
```

#### 4.3.7 CampaignState

```ts
type CampaignState = {
  campaignId: string;
  currentRound: number;
  maxRounds: number;
  roundHistory: RoundResult[];
  totalScore: number;
  status: "notStarted" | "active" | "completed" | "failed";
};
```

### 4.4 UIState

```ts
type UIState = {
  selectedTab?: string;
  selectedPanel?: string;
  selectedIds: string[];

  visibleModal?: string;
  visibleTooltip?: string;

  actionAvailability: Record<string, boolean>;

  hintLevel: number;
  highlightedTargets: string[];

  formDrafts: Record<string, unknown>;
};
```

UI状態は `DomainState` を直接変更してはならない。UI操作は `RuntimeCommand` または `PlanIR` を生成し、検証とシミュレーションを通じて `DomainState` を更新する。

### 4.5 HistoryState

```ts
type HistoryState = {
  events: GameEvent[];
  trials: TrialRecord[];
  plans: PlanIR[];
  scoreHistory: ScoreResult[];
  diagnostics: Diagnostic[];
};
```

---

## 5. イベントログ仕様: GameEvent

### 5.1 GameEvent の目的

`GameEvent` は、ゲーム中に発生した事象を、表示・検証・スコアリング・デバッグ・リプレイに使えるよう構造化して記録する。

### 5.2 GameEvent 型

```ts
type GameEvent = {
  id: string;

  chapterId: string;
  stageId: string;
  screenId?: string;
  roundId?: string;
  campaignId?: string;

  timestamp: number;
  stepIndex: number;

  actor: EventActor;
  eventType: EventType;

  targetId?: string;
  correlationId?: string;
  parentEventId?: string;

  before?: Record<string, unknown>;
  after?: Record<string, unknown>;

  result: EventResult;
  severity: EventSeverity;

  message: string;
  tags: string[];

  metadata?: Record<string, unknown>;
};
```

```ts
type EventActor =
  | "player"
  | "system"
  | "opponent"
  | "defender"
  | "compiler"
  | "runtime";

type EventResult =
  | "normal"
  | "success"
  | "failure"
  | "abnormal"
  | "blocked"
  | "warning";

type EventSeverity =
  | "info"
  | "notice"
  | "warning"
  | "error"
  | "critical";
```

### 5.3 EventType 命名規則

`eventType` は `領域.動詞` または `領域.対象.動詞` 形式とする。

```text
order.accepted
order.executed
order.canceled
refund.issued
refund.duplicated
sequence.reordered
rounding.diff.generated
split.executed
search.trial.completed
strategy.template.saved
strategy.executed
resource.queue.updated
defense.detected
defense.blocked
plan.compiled
plan.validation.failed
score.updated
```

### 5.4 共通イベント種別

#### 5.4.1 注文・状態系

| eventType | 用途 |
|---|---|
| `order.accepted` | 注文受付 |
| `order.queued` | 注文キュー投入 |
| `order.executed` | 注文実行 |
| `order.matched` | 約定 |
| `order.canceled` | キャンセル |
| `order.state.changed` | 状態変更 |
| `sequence.reordered` | 受付順と実行順のズレ |

#### 5.4.2 返金系

| eventType | 用途 |
|---|---|
| `refund.issued` | 返金実行 |
| `refund.duplicated` | 同一注文への重複返金 |
| `refund.blocked` | 返金防止 |
| `state.inconsistency.detected` | 表示状態・内部状態・履歴の不整合検出 |

#### 5.4.3 数値・探索系

| eventType | 用途 |
|---|---|
| `rounding.calculated` | 丸め計算実行 |
| `rounding.diff.generated` | 理論値と実際値の差分生成 |
| `split.executed` | 分割実行 |
| `search.trial.started` | 探索試行開始 |
| `search.trial.completed` | 探索試行完了 |
| `search.best.updated` | ベスト結果更新 |

#### 5.4.4 戦略・Plan系

| eventType | 用途 |
|---|---|
| `strategy.template.saved` | テンプレート保存 |
| `strategy.template.loaded` | テンプレート読込 |
| `strategy.generated` | 候補戦略生成 |
| `strategy.selected` | 戦略採用 |
| `strategy.executed` | 戦略実行 |
| `plan.created` | PlanIR生成 |
| `plan.compiled` | DSLコンパイル成功 |
| `plan.validation.failed` | PlanIR検証失敗 |
| `plan.source.changed` | activePlanSource変更 |

#### 5.4.5 資源・防御系

| eventType | 用途 |
|---|---|
| `resource.load.updated` | 仮想負荷更新 |
| `resource.queue.updated` | キュー更新 |
| `resource.latency.updated` | 遅延更新 |
| `defense.detected` | 防御検知 |
| `defense.rate_limited` | レート制限発動 |
| `defense.blocked` | 遮断 |
| `defense.adapted` | 防御状態変更 |
| `defense.alert.changed` | 警戒レベル変更 |

#### 5.4.6 スコア・UIフィードバック系

| eventType | 用途 |
|---|---|
| `score.updated` | スコア更新 |
| `feedback.shown` | フィードバック表示 |
| `hint.unlocked` | ヒント解放 |
| `stage.completed` | ステージ完了 |
| `stage.failed` | ステージ失敗 |

### 5.5 イベント生成ルール

- 1つのユーザー操作は、0個以上の `GameEvent` を生成する。
- `DomainState` を変更する処理は、原則として対応する `GameEvent` を生成する。
- スコアに影響する処理は、必ずスコア根拠となる `GameEvent` を残す。
- 異常、遮断、検証失敗、重複返金、防御発動は `severity` を `warning` 以上にする。
- `message` は表示用であり、判定ロジックは `eventType`、`result`、`tags`、`metadata` を用いる。

### 5.6 before / after の扱い

`before` と `after` は差分表示、リプレイ、テストに用いる。
巨大な状態全体ではなく、変化した対象の最小スナップショットを入れる。

```json
{
  "eventType": "refund.duplicated",
  "targetId": "order-12",
  "before": { "refundCount": 1, "balance": 100 },
  "after": { "refundCount": 2, "balance": 120 },
  "result": "abnormal",
  "severity": "critical",
  "tags": ["refund", "duplicate", "state-inconsistency"]
}
```

---

## 6. スコアリング仕様: ScoreResult / ScoreProfile

### 6.1 スコアリングの目的

スコアリングは、単純な利得だけでなく、成功率、安定性、検知されにくさ、資源効率、失敗回数、再試行回数を含めてプレイヤーの戦略を評価する。

### 6.2 ScoreResult

```ts
type ScoreResult = {
  scoreId: string;
  chapterId: string;
  stageId: string;
  roundId?: string;
  campaignId?: string;

  profileId: string;

  components: ScoreComponents;
  penalties: ScorePenalties;

  total: number;
  normalizedTotal: number;

  grade?: "S" | "A" | "B" | "C" | "D";

  sourceEventIds: string[];
  explanation: string;
};
```

```ts
type ScoreComponents = {
  gain: number;
  success: number;
  stability: number;
  stealth: number;
  resourceEfficiency: number;
  learningProgress: number;
};

type ScorePenalties = {
  detectionPenalty: number;
  failurePenalty: number;
  retryPenalty: number;
  resourcePenalty: number;
  invalidPlanPenalty: number;
};
```

### 6.3 ScoreProfile

```ts
type ScoreProfile = {
  profileId: string;
  chapterId: string;
  stageId?: string;

  weights: ScoreWeights;

  normalization: {
    min: number;
    max: number;
  };

  gradeThresholds?: {
    S: number;
    A: number;
    B: number;
    C: number;
  };
};
```

```ts
type ScoreWeights = {
  gain: number;
  success: number;
  stability: number;
  stealth: number;
  resourceEfficiency: number;
  learningProgress: number;

  detectionPenalty: number;
  failurePenalty: number;
  retryPenalty: number;
  resourcePenalty: number;
  invalidPlanPenalty: number;
};
```

### 6.4 共通計算式

```text
total =
    gain                 * weights.gain
  + success              * weights.success
  + stability            * weights.stability
  + stealth              * weights.stealth
  + resourceEfficiency   * weights.resourceEfficiency
  + learningProgress     * weights.learningProgress
  - detectionPenalty     * weights.detectionPenalty
  - failurePenalty       * weights.failurePenalty
  - retryPenalty         * weights.retryPenalty
  - resourcePenalty      * weights.resourcePenalty
  - invalidPlanPenalty   * weights.invalidPlanPenalty
```

`normalizedTotal` は `normalization.min` と `normalization.max` を用いて 0〜100 に正規化する。

```text
normalizedTotal = clamp(
  100 * (total - min) / (max - min),
  0,
  100
)
```

### 6.5 章別 ScoreProfile の初期値

#### 第0〜1章: 基本操作・観察重視

```ts
const chapter0_1ScoreProfile: ScoreProfile = {
  profileId: "ch0_1_basic_observation",
  chapterId: "chapter0_1",
  weights: {
    gain: 0.1,
    success: 1.0,
    stability: 0.2,
    stealth: 0.0,
    resourceEfficiency: 0.0,
    learningProgress: 1.0,
    detectionPenalty: 0.0,
    failurePenalty: 0.2,
    retryPenalty: 0.1,
    resourcePenalty: 0.0,
    invalidPlanPenalty: 0.0,
  },
  normalization: { min: 0, max: 100 },
};
```

#### 第2章: 状態一貫性・異常発見重視

```ts
const chapter2ScoreProfile: ScoreProfile = {
  profileId: "ch2_state_consistency",
  chapterId: "chapter2",
  weights: {
    gain: 0.4,
    success: 0.8,
    stability: 0.5,
    stealth: 0.0,
    resourceEfficiency: 0.0,
    learningProgress: 1.0,
    detectionPenalty: 0.0,
    failurePenalty: 0.4,
    retryPenalty: 0.2,
    resourcePenalty: 0.0,
    invalidPlanPenalty: 0.0,
  },
  normalization: { min: 0, max: 100 },
};
```

#### 第3章: 探索・差分最大化重視

```ts
const chapter3ScoreProfile: ScoreProfile = {
  profileId: "ch3_rounding_search",
  chapterId: "chapter3",
  weights: {
    gain: 1.0,
    success: 0.5,
    stability: 0.2,
    stealth: 0.0,
    resourceEfficiency: 0.2,
    learningProgress: 0.6,
    detectionPenalty: 0.0,
    failurePenalty: 0.2,
    retryPenalty: 0.1,
    resourcePenalty: 0.0,
    invalidPlanPenalty: 0.3,
  },
  normalization: { min: 0, max: 100 },
};
```

#### 第4〜7章: 戦略比較・採用重視

```ts
const chapter4_7ScoreProfile: ScoreProfile = {
  profileId: "ch4_7_strategy_comparison",
  chapterId: "chapter4_7",
  weights: {
    gain: 1.0,
    success: 0.8,
    stability: 0.7,
    stealth: 0.2,
    resourceEfficiency: 0.4,
    learningProgress: 0.5,
    detectionPenalty: 0.3,
    failurePenalty: 0.4,
    retryPenalty: 0.2,
    resourcePenalty: 0.2,
    invalidPlanPenalty: 0.4,
  },
  normalization: { min: 0, max: 100 },
};
```

#### 第8章: 資源圧力・検知リスク重視

```ts
const chapter8ScoreProfile: ScoreProfile = {
  profileId: "ch8_resource_resilience",
  chapterId: "chapter8",
  weights: {
    gain: 0.8,
    success: 0.8,
    stability: 0.7,
    stealth: 0.8,
    resourceEfficiency: 1.0,
    learningProgress: 0.5,
    detectionPenalty: 0.9,
    failurePenalty: 0.4,
    retryPenalty: 0.2,
    resourcePenalty: 1.0,
    invalidPlanPenalty: 0.5,
  },
  normalization: { min: 0, max: 100 },
};
```

#### 第9〜10章: 適応・動的攻防重視

```ts
const chapter9_10ScoreProfile: ScoreProfile = {
  profileId: "ch9_10_dynamic_adaptation",
  chapterId: "chapter9_10",
  weights: {
    gain: 1.0,
    success: 0.9,
    stability: 0.8,
    stealth: 0.9,
    resourceEfficiency: 0.8,
    learningProgress: 0.7,
    detectionPenalty: 1.0,
    failurePenalty: 0.6,
    retryPenalty: 0.3,
    resourcePenalty: 0.8,
    invalidPlanPenalty: 0.7,
  },
  normalization: { min: 0, max: 100 },
};
```

### 6.6 スコア根拠

`ScoreResult.sourceEventIds` には、スコア計算に使った `GameEvent.id` をすべて含める。
これにより、スコア表示からイベントログへ逆引きできるようにする。

---

## 7. Plan / IR 仕様: PlanIR

### 7.1 PlanIR の目的

`PlanIR` は、GUI、テンプレート、DSLから生成された攻撃計画を、ゲーム内仮想環境で実行できる共通形式に変換したものである。

`PlanIR` は以下を満たす。

- 実行対象はゲーム内シミュレーションのみ
- 外部ネットワーク、OS、ファイル、実サービスへの操作を含まない
- アクション、パラメータ、前提条件、メタデータ、診断状態を持つ
- Safety Checker と Plan Verifier の対象になる

### 7.2 PlanIR 型

```ts
type PlanIR = {
  irVersion: string;

  planId: string;
  displayName: string;

  source: PlanSource;

  chapterId?: string;
  stageId?: string;

  parameters: Record<string, PlanValue>;
  actions: PlanAction[];

  metadata: PlanMetadata;
  validation: PlanValidationState;

  createdAt: number;
  updatedAt: number;
};
```

### 7.3 PlanSource

```ts
type PlanSource = {
  sourceType: "gui" | "template" | "dsl" | "system";
  sourceId?: string;
  sourceLabel?: string;

  dslSourceHash?: string;
  templateId?: string;
  guiBuilderId?: string;
};
```

### 7.4 PlanValue

```ts
type PlanValue =
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "range"; from: number; to: number }
  | { type: "enum"; value: string }
  | { type: "observationRef"; path: string };
```

### 7.5 PlanAction

```ts
type PlanAction = {
  actionId: string;
  actionType: PlanActionType;

  params: Record<string, PlanValue>;

  estimatedCost: number;
  estimatedLoad: number;
  estimatedRisk: number;

  tags: string[];

  preconditions?: PlanCondition[];
  effects?: PlanEffect[];
};
```

```ts
type PlanActionType =
  | "order_submit"
  | "sequence_shift"
  | "cancel_request"
  | "refund_probe"
  | "rounding_split"
  | "search_trial"
  | "strategy_apply"
  | "batch_run"
  | "pressure_adjust"
  | "low_noise_probe"
  | "observe_defense"
  | "wait"
  | "run";
```

### 7.6 PlanCondition

```ts
type PlanCondition = {
  left: string;
  operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "in";
  right: PlanValue;
};
```

### 7.7 PlanEffect

```ts
type PlanEffect = {
  target: string;
  effectType: "stateChange" | "scoreChange" | "resourceChange" | "observation";
  description: string;
};
```

### 7.8 PlanMetadata

```ts
type PlanMetadata = {
  estimatedTotalCost: number;
  estimatedTotalLoad: number;
  estimatedDetectionRisk: number;

  usesObservation: boolean;
  usesLoop: boolean;
  usesBranch: boolean;
  usesTemplate: boolean;

  maxExpandedActions: number;

  riskTags: string[];
  strategyTags: string[];
};
```

### 7.9 PlanValidationState

```ts
type PlanValidationState = {
  status: "unchecked" | "valid" | "invalid";
  checkedAt?: number;
  diagnostics: Diagnostic[];
};
```

### 7.10 PlanIR 検証規則

`PlanIR` は実行前に必ず検証する。

検証項目は以下である。

- アクション種別が許可リスト内にある
- パラメータ型が正しい
- パラメータ範囲が正しい
- 章・ステージで許可されていないアクションを含まない
- 推定コスト、推定負荷、推定リスクが上限以内である
- 空の計画ではない
- 外部ネットワーク、実URL、OS、ファイル、任意コード実行に相当する構造を含まない
- DSL由来の場合、コンパイル済みかつ Safety Checker を通過している

---

## 8. activePlanSource 仕様

### 8.1 目的

第10章以降では、GUI構成、テンプレート、DSLが同じ画面に並ぶ。
複数の計画が存在する場合に、どれを実行するかを暗黙にすると誤実行が起きる。
そのため、実行対象は `activePlanSource` で明示する。

### 8.2 PlanSelectionState

```ts
type ActivePlanSource = "gui" | "template" | "dsl";

type PlanSelectionState = {
  activePlanSource: ActivePlanSource;

  guiPlan?: PlanIR;
  templatePlan?: PlanIR;
  dslPlan?: PlanIR;

  executablePlan?: PlanIR;

  staleSources: ActivePlanSource[];
};
```

### 8.3 実行対象決定規則

```text
ラウンド実行時は activePlanSource が指す PlanIR のみを実行する。

activePlanSource = gui:
  guiPlan が valid なら実行可能。

activePlanSource = template:
  templatePlan が valid なら実行可能。

activePlanSource = dsl:
  dslPlan が compiled かつ valid なら実行可能。

複数の Plan が存在しても、activePlanSource 以外は実行しない。
```

### 8.4 stale 判定

以下の場合、その入力源を stale とする。

- GUI編集後に `guiPlan` を再生成していない
- テンプレート選択後にパラメータ変更を反映していない
- DSL編集後に再コンパイルしていない
- RuntimeState の章・ステージ・防御状態が変化し、以前のPlanの前提条件が古くなった

stale な Plan は実行不可とし、`plan.validation.failed` を生成する。

### 8.5 UI表示規則

画面上では、現在の実行対象を常に表示する。

```text
現在の実行対象: DSL
状態: コンパイル済み / 検証OK
```

実行ボタンは、`activePlanSource` の Plan が `valid` の場合のみ有効にする。

---

## 9. 共通実行パイプライン

### 9.1 全体フロー

```text
1. User Operation
2. RuntimeCommand または PlanIR 生成
3. activePlanSource 解決
4. validatePlanIR / validateCommand
5. simulatePlan / executeCommand
6. GameEvent[] 生成
7. reduceEvents により RuntimeState 更新
8. calculateScore により ScoreResult 更新
9. UI Feedback 表示
```

### 9.2 疑似コード

```ts
function runStageAction(input: RuntimeInput): RuntimeResult {
  const planOrCommand = resolveExecutableInput(input);

  const validation = validateExecutableInput(
    planOrCommand,
    input.runtimeState
  );

  if (validation.status === "invalid") {
    const events = [createValidationFailedEvent(validation, input.runtimeState)];
    const nextState = reduceEvents(input.runtimeState, events);
    return {
      events,
      runtimeState: nextState,
      scoreDelta: null,
      diagnostics: validation.diagnostics,
    };
  }

  const simulationResult = simulate(
    planOrCommand,
    input.runtimeState.domainState
  );

  const events = simulationResult.events;

  const nextState = reduceEvents(
    input.runtimeState,
    events
  );

  const score = calculateScore(
    events,
    nextState,
    input.scoreProfile
  );

  return {
    events,
    runtimeState: {
      ...nextState,
      score,
    },
    scoreDelta: score,
    diagnostics: [],
  };
}
```

### 9.3 実行ルール

- UI操作は `DomainState` を直接変更しない。
- `DomainState` の変更は、`GameEvent` を通じて reducer が行う。
- 検証失敗時も `GameEvent` を生成する。
- シミュレーション実行後は、イベント、状態、スコアの順で更新する。
- スコア計算は、更新済み状態とイベント列の両方を参照できる。
- 章固有処理は、共通パイプライン内の `simulate` と `calculateChapterSpecificComponents` に閉じ込める。

### 9.4 Reducer 仕様

`reduceEvents` は `GameEvent[]` を入力として `RuntimeState` を更新する。

```ts
function reduceEvents(
  state: RuntimeState,
  events: GameEvent[]
): RuntimeState;
```

Reducer は以下を守る。

- イベントを `historyState.events` に追記する。
- `eventType` に応じて `domainState` を更新する。
- `stage.completed`、`stage.failed` に応じて `stageStatus` を更新する。
- UIの表示都合だけでドメイン状態を変えない。

---

## 10. Diagnostic 仕様

### 10.1 Diagnostic 型

```ts
type Diagnostic = {
  id: string;
  severity: "info" | "warning" | "error" | "fatal";
  category:
    | "LexicalError"
    | "SyntaxError"
    | "NameError"
    | "TypeError"
    | "SemanticError"
    | "SafetyError"
    | "VerificationError"
    | "RuntimeError"
    | "ScoreError";

  message: string;
  detail?: string;

  source?: {
    sourceType: "gui" | "template" | "dsl" | "runtime";
    line?: number;
    column?: number;
    actionId?: string;
    field?: string;
  };

  fixHint?: string;
};
```

### 10.2 診断表示規則

- `error` 以上の診断がある場合、実行不可とする。
- `warning` は実行可能だが、スコアやUI上で注意表示してよい。
- DSL診断では行番号・列番号を可能な限り表示する。
- GUI診断では対象UIコンポーネントと入力フィールドを強調する。

---

## 11. 安全境界仕様

### 11.1 共通安全制約

全章で以下を禁止する。

- 外部ネットワークへの通信
- 実URL、実IP、実API、実サービスへの操作
- OSコマンド実行
- ファイルアクセス
- ブラウザ外部APIへのアクセス
- 任意コード実行
- 無制限ループ
- 上限を超える仮想リソース消費

### 11.2 UI上の安全表示

第8章、第10章、DuelScriptConsole では、初回表示時に以下を短く表示する。

```text
この章の操作はゲーム内シミュレーションだけに作用します。
実在サービス・実ネットワーク・外部APIへの操作は行いません。
```

### 11.3 PlanIR 安全メタデータ

`PlanMetadata` は以下を含む。

- `estimatedTotalLoad`
- `estimatedDetectionRisk`
- `maxExpandedActions`
- `riskTags`

Safety Checker はこれらと章別上限を比較する。

---

## 12. 章別仕様書から共通仕様へ委譲する項目

章別仕様書では、以下を再定義しない。

| 共通項目 | 参照先 |
|---|---|
| イベントログ構造 | 本仕様書 5. イベントログ仕様 |
| スコア計算形式 | 本仕様書 6. スコアリング仕様 |
| 共通ステージ状態 | 本仕様書 4. 共通状態仕様 |
| GUI / Template / DSL 統一形式 | 本仕様書 7. Plan / IR 仕様 |
| 実行対象選択 | 本仕様書 8. activePlanSource 仕様 |
| 実行パイプライン | 本仕様書 9. 共通実行パイプライン |
| 診断形式 | 本仕様書 10. Diagnostic 仕様 |
| 安全境界 | 本仕様書 11. 安全境界仕様 |

章別仕様書は、以下のみを章固有仕様として追加する。

- 章固有イベント種別
- 章固有ドメイン状態
- 章固有 ScoreProfile 重み
- 章固有UI表示
- 章固有成功条件・失敗条件
- 章固有フィードバック文言

---

## 13. テスト観点

### 13.1 GameEvent テスト

- 主要操作ごとに期待する `GameEvent` が生成されること
- 異常系イベントの `result` が `abnormal` または `blocked` になること
- `before` / `after` が差分表示に必要な値を含むこと
- スコア根拠イベントが `sourceEventIds` に入ること

### 13.2 RuntimeState テスト

- UI操作が直接 `DomainState` を変更しないこと
- `reduceEvents` に同一イベント列を渡すと同一状態になること
- `stage.completed` により `stageStatus` が `completed` になること
- `stage.failed` により `stageStatus` が `failed` または `retryReady` になること

### 13.3 Score テスト

- 同じイベント列と状態から同じ `ScoreResult` が出ること
- 章別 `ScoreProfile` により評価傾向が変わること
- 防御検知やリソース過多がペナルティに反映されること
- 第3章では利得・探索結果、第8〜10章では検知・資源効率が反映されること

### 13.4 PlanIR テスト

- GUI、テンプレート、DSLから同等の `PlanIR` を生成できること
- 不正アクションが `plan.validation.failed` になること
- stale な Plan が実行不可になること
- `activePlanSource` 以外の Plan が実行されないこと

### 13.5 実行パイプライン テスト

- 検証失敗時にシミュレーションが実行されないこと
- 実行成功時にイベント、状態、スコアが順に更新されること
- 同一 seed / 同一入力で同一イベント列が再現されること
- リプレイ時にイベント列から状態を再構築できること

---

## 14. 移行方針

### 14.1 章別仕様書の更新方法

章別仕様書には冒頭に「共通ランタイム仕様への準拠」節を追加する。

章別仕様書内の以下の記述は、共通仕様への参照に置き換える。

- イベントログの共通データ構造
- スコアリングの共通計算形式
- 共通ステージ状態
- Plan / IR の共通構造
- GUI / Template / DSL の優先順位
- 実行パイプライン

### 14.2 既存仕様との互換方針

既存の章別仕様書にある章固有のイベント、UI、状態遷移は残す。
ただし、共通構造を再定義している箇所は、本仕様書への参照に置き換える。

### 14.3 実装開始時の優先順位

1. `GameEvent` 型とイベントカタログ
2. `RuntimeState` と `reduceEvents`
3. `PlanIR` と `validatePlanIR`
4. `ScoreProfile` と `calculateScore`
5. `activePlanSource` と実行ボタン制御
6. 共通パイプライン
7. 章別シミュレーション実装

---

## 15. 受け入れ条件

本共通仕様の受け入れ条件は以下である。

- すべての章別仕様書が本仕様書を参照している。
- `GameEvent`、`RuntimeState`、`ScoreResult`、`ScoreProfile`、`PlanIR`、`activePlanSource` が定義されている。
- GUI、テンプレート、DSLの実行対象選択が明示されている。
- 実行パイプラインが、検証、シミュレーション、イベント生成、状態更新、スコア更新の順に固定されている。
- 章別仕様書から、共通データ構造の再定義が排除されている。
