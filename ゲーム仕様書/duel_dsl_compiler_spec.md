# Duel DSL Compiler 仕様書

## 1. 目的

本仕様書は、第10章以降で使用する **Duel DSL Compiler** の仕様を定義する。

Duel DSL Compiler は、プレイヤーがゲーム内で記述する攻撃計画DSLを解析し、ゲーム内仮想環境でのみ実行可能な安全な中間表現へ変換する専用コンパイラである。

本コンパイラは、現実のネットワーク、実在サービス、外部API、実サーバに対する操作を生成・実行しない。

---

## 2. 位置づけ

第3章の MiniScript Compiler は、丸め誤差探索や分割回数探索に特化した小型DSLだった。

第10章の Duel DSL Compiler は、より高い抽象度で以下を扱う。

- 攻撃計画
- 戦略テンプレート
- 条件分岐
- ラウンド単位の行動
- 観測結果の参照
- 防御反応を踏まえた計画修正
- ゲーム内資源消費
- スコアリング対象メタデータ

---

## 3. 安全設計原則

### 3.1 外部副作用禁止
Duel DSL は外部ネットワーク、ファイル、OS、ブラウザ外部API、実サービスへアクセスできない。

### 3.2 閉域実行
実行対象はゲーム内の仮想シミュレーションエンジンのみである。

### 3.3 任意コード実行禁止
JavaScript, Python, shell などの任意コードとして評価しない。

### 3.4 上限制御
- 最大命令数
- 最大ループ回数
- 最大ラウンド数
- 最大仮想リソース使用量
- 最大実行時間

を制限する。

### 3.5 静的検査
コンパイル段階で、危険または無効な命令を検出する。

---

## 4. コンパイラ全体構成

Duel DSL Compiler は以下の層で構成する。

1. Source Manager
2. Lexer
3. Parser
4. AST Builder
5. Semantic Analyzer
6. Safety Checker
7. IR Builder
8. Optimizer
9. Plan Verifier
10. Executor Interface
11. Diagnostic Reporter

---

## 5. 処理パイプライン

```text
Source Code
  ↓
Lexer
  ↓
Parser
  ↓
AST
  ↓
Semantic Analyzer
  ↓
Safety Checker
  ↓
IR Builder
  ↓
Plan Verifier
  ↓
Executable Duel Plan
  ↓
Game Simulation Engine
```

---

## 6. DSLの設計方針

### 6.1 目的
プレイヤーが攻撃計画を簡潔に記述できるようにする。

### 6.2 方針
- Python風の読みやすさを持つ
- 関数型的な map/filter/select の感覚を部分的に取り入れる
- ただし、実コードではなく専用DSLとする
- 命令はゲーム内アクションに限定する

### 6.3 非目標
- 汎用プログラミング言語を作ること
- 実ネットワーク操作を可能にすること
- 実システムへの攻撃自動化を可能にすること

---

## 7. 主な言語機能

### 7.1 plan 定義
```text
plan first_probe:
  use sequence_shift delay=2
  use refund_probe mode="safe"
  run
```

### 7.2 parameter 定義
```text
param delay in 1..5
param split in 2..8
```

### 7.3 repeat
```text
repeat 3:
  use low_noise_probe intensity=1
  run
```

### 7.4 for
```text
for delay in 1..5:
  use sequence_shift delay=delay
  run
```

### 7.5 choose
```text
choose best by score:
  candidate fast
  candidate quiet
  candidate balanced
```

### 7.6 observe
```text
observe defense.alert_level
observe round.last_block_reason
```

### 7.7 if
```text
if defense.alert_level > 2:
  use low_noise_probe intensity=1
else:
  use profit_route split=4
```

---

## 8. 文法案

```text
program       := topLevelDecl*
topLevelDecl  := planDecl | paramDecl | comment
planDecl      := 'plan' IDENT ':' block
paramDecl     := 'param' IDENT 'in' range
block         := INDENT statement+ DEDENT
statement     := useStmt | runStmt | repeatStmt | forStmt | ifStmt | observeStmt | chooseStmt | saveStmt
useStmt       := 'use' IDENT argList?
argList       := (IDENT '=' value)*
runStmt       := 'run'
repeatStmt    := 'repeat' NUMBER ':' block
forStmt       := 'for' IDENT 'in' range ':' block
ifStmt        := 'if' condition ':' block ('else' ':' block)?
observeStmt   := 'observe' IDENT ('.' IDENT)*
chooseStmt    := 'choose' IDENT 'by' IDENT ':' block
saveStmt      := 'save' IDENT?
range         := NUMBER '..' NUMBER
value         := NUMBER | STRING | IDENT | BOOLEAN
condition     := expr comparator expr
comparator    := '==' | '!=' | '>' | '>=' | '<' | '<='
```

---

## 9. 型システム

### 9.1 基本型
- Number
- String
- Boolean
- Range
- Action
- Plan
- Metric
- Observation

### 9.2 ドメイン型
- StrategyId
- ActionId
- RoundId
- DefenseSignal
- ResourceBudget
- Score

### 9.3 型検査
以下をコンパイル時に検査する。

- 存在しないアクションを use していないか
- 引数型が合っているか
- 範囲外パラメータがないか
- observe できない値を参照していないか
- if 条件が Boolean に評価可能か

---

## 10. 意味解析仕様

Semantic Analyzer は以下を検査する。

### 10.1 名前解決
- plan 名
- param 名
- loop 変数
- action 名
- metric 名
- observation path

### 10.2 スコープ
- plan 内の変数
- loop 内の変数
- param の参照可能範囲

### 10.3 ドメイン制約
- action の使用可能章
- action の必要条件
- 同時に使えない action
- resource budget を超えないか

---

## 11. Safety Checker 仕様

Safety Checker は、ゲーム外へ影響する構造や、ゲーム内でも過剰な実行を防ぐ。

### 11.1 禁止構造
- 任意コード呼び出し
- 外部URL
- ファイルパス
- OSコマンド
- ネットワーク命令
- 無制限ループ
- 未制限 repeat

### 11.2 上限
- maxStatements
- maxLoopIterations
- maxExpandedActions
- maxVirtualLoad
- maxRoundActions
- maxCompileTimeMs
- maxRunTimeMs

### 11.3 安全診断例
```text
Line 4: repeat count exceeds maximum allowed value.
Line 8: unknown action 'external_request' is not allowed in Duel DSL.
Line 10: virtual load exceeds round budget.
```

---

## 12. IR仕様

コンパイル成功後、ASTは Duel IR に変換される。

### 12.1 IRの目的
- GUI攻撃計画とDSL攻撃計画を同じ形式で扱う
- 実行エンジンが安全に評価できる
- 防御エージェントが計画メタデータを解析できる

### 12.2 IR構造例
```json
{
  "planId": "first_probe",
  "actions": [
    {
      "type": "sequence_shift",
      "params": { "delay": 2 },
      "estimatedCost": 3,
      "tags": ["sequence"]
    },
    {
      "type": "refund_probe",
      "params": { "mode": "safe" },
      "estimatedCost": 2,
      "tags": ["state"]
    }
  ],
  "metadata": {
    "estimatedLoad": 5,
    "riskTags": ["sequence", "state"],
    "usesObservation": false
  }
}
```

---

## 13. Optimizer 仕様

Optimizer はゲーム内実行を効率化するための軽量変換のみ行う。

### 13.1 許可する最適化
- 未到達ブロックの削除
- 定数値の展開
- 明らかな重複表示命令の統合
- 実行順に影響しないメタデータ整理

### 13.2 禁止する最適化
- プレイヤーの意図した順序を変える
- 攻撃アクションの意味を変える
- 安全制約を迂回する

---

## 14. Plan Verifier 仕様

Plan Verifier は、IRがゲーム内で実行可能かを最終確認する。

### 14.1 検査項目
- ラウンド予算以内か
- action 使用条件を満たすか
- 防御状態と矛盾しないか
- 無効なパラメータがないか
- plan が空でないか

### 14.2 失敗時
実行不可として、DuelScriptConsole にエラーを返す。

---

## 15. Executor Interface 仕様

Compiler 自体は直接シミュレーションを実行しない。Executor Interface を通してゲームエンジンへ渡す。

### 15.1 入力
- Executable Duel Plan
- currentRoundState
- defenderState
- resourceBudget

### 15.2 出力
- roundEvents
- roundResult
- defenseEvents
- updatedDefenderState
- scoreDelta

---

## 16. Diagnostics 仕様

### 16.1 エラー種別
- LexicalError
- SyntaxError
- NameError
- TypeError
- SemanticError
- SafetyError
- VerificationError

### 16.2 表示情報
- 行番号
- 列番号
- エラー種別
- 短い説明
- 修正ヒント

### 16.3 例
```text
Line 3, Col 12: TypeError
'action delay' expects Number, but got String.

Hint: use delay=2 instead of delay="fast".
```

---

## 17. GUI計画との相互変換

第10章では、GUIで作った攻撃計画とDSLで書いた攻撃計画を同じIRに変換する。

### 17.1 GUI → IR
AttackBuilderPanel の構成を Duel IR へ変換する。

### 17.2 DSL → IR
Duel DSL Compiler が Duel IR を生成する。

### 17.3 IR → GUI Summary
コンパイル済みIRを、プレイヤーが読める計画サマリへ戻す。

### 17.4 注意
完全な IR → DSL 復元は必須ではない。

---

## 18. コンポーネント構成案

```text
compiler/
  lexer/
    tokenize.ts
    tokenTypes.ts
  parser/
    parseProgram.ts
    ast.ts
  semantic/
    analyze.ts
    symbolTable.ts
    typeCheck.ts
  safety/
    safetyCheck.ts
    limits.ts
  ir/
    buildIr.ts
    duelIrTypes.ts
  verifier/
    verifyPlan.ts
  diagnostics/
    diagnostics.ts
    formatDiagnostic.ts
  executor-interface/
    executablePlan.ts
```

---

## 19. テスト観点

### 19.1 Lexer
- キーワード認識
- 数値認識
- インデント処理
- 不正文字検出

### 19.2 Parser
- plan 定義
- for / repeat / if
- ネスト
- 構文エラー

### 19.3 Semantic
- 未定義名
- 型不一致
- 範囲外値

### 19.4 Safety
- 上限超過
- 禁止命令
- 無制限構造

### 19.5 IR
- GUI計画とDSL計画の同一化
- action metadata
- resource estimate

---

## 20. 今後詰めるべき項目

- action catalog の詳細
- metric catalog の詳細
- observation path の詳細
- defenderState 参照制限
- Duel IR の完全スキーマ
- コンパイラエラー文言一覧
