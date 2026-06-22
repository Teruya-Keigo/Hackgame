// 共通ランタイム型定義
// 本ファイルは common_runtime_spec.md の実装参照用 TypeScript 型である。
// 実装時はプロジェクトの型設計に合わせて import/export を調整する。

export type StageStatus =
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

export type EventActor =
  | "player"
  | "system"
  | "opponent"
  | "defender"
  | "compiler"
  | "runtime";

export type EventResult =
  | "normal"
  | "success"
  | "failure"
  | "abnormal"
  | "blocked"
  | "warning";

export type EventSeverity =
  | "info"
  | "notice"
  | "warning"
  | "error"
  | "critical";

export type EventType =
  | "order.accepted"
  | "order.queued"
  | "order.executed"
  | "order.matched"
  | "order.canceled"
  | "order.state.changed"
  | "sequence.reordered"
  | "refund.issued"
  | "refund.duplicated"
  | "refund.blocked"
  | "state.inconsistency.detected"
  | "rounding.calculated"
  | "rounding.diff.generated"
  | "split.executed"
  | "search.trial.started"
  | "search.trial.completed"
  | "search.best.updated"
  | "strategy.template.saved"
  | "strategy.template.loaded"
  | "strategy.generated"
  | "strategy.selected"
  | "strategy.executed"
  | "plan.created"
  | "plan.compiled"
  | "plan.validation.failed"
  | "plan.source.changed"
  | "resource.load.updated"
  | "resource.queue.updated"
  | "resource.latency.updated"
  | "defense.detected"
  | "defense.rate_limited"
  | "defense.blocked"
  | "defense.adapted"
  | "defense.alert.changed"
  | "score.updated"
  | "feedback.shown"
  | "hint.unlocked"
  | "stage.completed"
  | "stage.failed";

export type GameEvent = {
  id: string;
  chapterId: string;
  stageId: string;
  screenId?: string;
  roundId?: string;
  campaignId?: string;
  timestamp: number;
  stepIndex: number;
  actor: EventActor;
  eventType: EventType | string;
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

export type OrderStatus =
  | "none"
  | "accepted"
  | "queued"
  | "processing"
  | "matched"
  | "canceled"
  | "refunded"
  | "invalid";

export type OrderState = {
  orderId: string;
  ownerId: string;
  status: OrderStatus;
  amount: number;
  price?: number;
  createdStep: number;
  updatedStep: number;
  flags: string[];
};

export type BalanceState = {
  ownerId: string;
  amount: number;
  currency?: string;
};

export type RefundState = {
  orderId: string;
  refundCount: number;
  totalRefundAmount: number;
  refundedSteps: number[];
  isDuplicate: boolean;
};

export type NumericState = {
  theoreticalValue?: number;
  actualValue?: number;
  singleDelta?: number;
  cumulativeDelta?: number;
  splitCount?: number;
  trialCount?: number;
  bestTrialId?: string;
};

export type ResourceState = {
  capacity: number;
  usedCapacity: number;
  queueLength: number;
  averageLatency: number;
  virtualLoad: number;
  rateLimitActive: boolean;
};

export type DefenseState = {
  alertLevel: number;
  detectionScore: number;
  blocked: boolean;
  blockReason?: string;
  activeRules: string[];
  adaptationLevel?: number;
  lastReaction?: string;
};

export type StrategyState = {
  templates: Record<string, StrategyTemplate>;
  currentStrategyId?: string;
  strategyHistory: string[];
  hypothesis?: HypothesisState;
};

export type CampaignState = {
  campaignId: string;
  currentRound: number;
  maxRounds: number;
  roundHistory: RoundResult[];
  totalScore: number;
  status: "notStarted" | "active" | "completed" | "failed";
};

export type DomainState = {
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

export type UIState = {
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

export type HistoryState = {
  events: GameEvent[];
  trials: TrialRecord[];
  plans: PlanIR[];
  scoreHistory: ScoreResult[];
  diagnostics: Diagnostic[];
};

export type RuntimeState = {
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

export type ScoreComponents = {
  gain: number;
  success: number;
  stability: number;
  stealth: number;
  resourceEfficiency: number;
  learningProgress: number;
};

export type ScorePenalties = {
  detectionPenalty: number;
  failurePenalty: number;
  retryPenalty: number;
  resourcePenalty: number;
  invalidPlanPenalty: number;
};

export type ScoreResult = {
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

export type ScoreWeights = ScoreComponents & ScorePenalties;

export type ScoreProfile = {
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

export type PlanValue =
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "range"; from: number; to: number }
  | { type: "enum"; value: string }
  | { type: "observationRef"; path: string };

export type PlanSource = {
  sourceType: "gui" | "template" | "dsl" | "system";
  sourceId?: string;
  sourceLabel?: string;
  dslSourceHash?: string;
  templateId?: string;
  guiBuilderId?: string;
};

export type PlanActionType =
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

export type PlanCondition = {
  left: string;
  operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "in";
  right: PlanValue;
};

export type PlanEffect = {
  target: string;
  effectType: "stateChange" | "scoreChange" | "resourceChange" | "observation";
  description: string;
};

export type PlanAction = {
  actionId: string;
  actionType: PlanActionType | string;
  params: Record<string, PlanValue>;
  estimatedCost: number;
  estimatedLoad: number;
  estimatedRisk: number;
  tags: string[];
  preconditions?: PlanCondition[];
  effects?: PlanEffect[];
};

export type PlanMetadata = {
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

export type PlanValidationState = {
  status: "unchecked" | "valid" | "invalid";
  checkedAt?: number;
  diagnostics: Diagnostic[];
};

export type PlanIR = {
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

export type ActivePlanSource = "gui" | "template" | "dsl";

export type PlanSelectionState = {
  activePlanSource: ActivePlanSource;
  guiPlan?: PlanIR;
  templatePlan?: PlanIR;
  dslPlan?: PlanIR;
  executablePlan?: PlanIR;
  staleSources: ActivePlanSource[];
};

export type Diagnostic = {
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

export type StrategyTemplate = {
  templateId: string;
  name: string;
  plan: PlanIR;
};

export type HypothesisState = {
  hypothesisId: string;
  text: string;
  selectedEvidenceEventIds: string[];
};

export type RoundResult = {
  roundId: string;
  events: GameEvent[];
  score: ScoreResult;
};

export type TrialRecord = {
  trialId: string;
  planId?: string;
  parameterSnapshot: Record<string, unknown>;
  events: GameEvent[];
  score?: ScoreResult;
};

export type RuntimeInput = {
  runtimeState: RuntimeState;
  scoreProfile: ScoreProfile;
  command?: RuntimeCommand;
};

export type RuntimeCommand = {
  commandId: string;
  commandType: string;
  payload: Record<string, unknown>;
};

export type RuntimeResult = {
  events: GameEvent[];
  runtimeState: RuntimeState;
  scoreDelta: ScoreResult | null;
  diagnostics: Diagnostic[];
};
