# Duel DSL

Duel DSL は、第10章のゲーム内仮想環境で行動計画を記述するための専用言語です。JavaScript、Python、シェルのコードではなく、許可された構文だけを自作パーサーで読み取り、安全な `PlanIR` に変換します。生成された計画が触れるのはゲーム内シミュレーターだけで、外部ネットワーク、ファイル、OS、ブラウザ API にはアクセスしません。

この README は、構想段階の仕様ではなく、現在の [`static/stage_core.mjs`](../../static/stage_core.mjs) と [`test_stage_core.mjs`](../../test_stage_core.mjs) の挙動を基準にしています。現在ゲーム画面で Duel DSL を使えるのは Stage 10-2 の Duel Script Console です。

## 目次

- [クイックスタート](#クイックスタート)
- [処理の流れ](#処理の流れ)
- [書式](#書式)
- [文法](#文法)
- [命令リファレンス](#命令リファレンス)
- [Action catalog](#action-catalog)
- [Observation catalog](#observation-catalog)
- [まとまった例](#まとまった例)
- [PlanIR](#planir)
- [ラウンド評価](#ラウンド評価)
- [エラーと診断](#エラーと診断)
- [安全制限](#安全制限)
- [現行実装の要点](#現行実装の要点)

## クイックスタート

最小構成は、`plan` の中に1つ以上の `use` を置く形です。

```text
plan first_probe:
  use sequence_shift delay=2
  use refund_probe mode="safe"
  use low_noise_probe intensity=1
  run
```

ゲーム画面では次の順で使います。

1. Duel Script Console にスクリプトを入力します。
2. 「DSLをコンパイル」で構文と安全性を検査し、`PlanIR` を生成します。
3. 「DSLでラウンド実行」で生成済みの計画を仮想シミュレーターへ渡します。まだ有効な DSL 計画がなければ、このボタンからも自動コンパイルされます。

入力を編集すると、以前のコンパイル結果は破棄され、状態が `editing` に戻ります。

## 処理の流れ

```text
Duel DSL source
  -> 禁止語・URL・パスの安全検査
  -> 行、コメント、インデントの正規化
  -> AST への構文解析
  -> ループ展開・条件評価・引数検査
  -> PlanIR の生成
  -> PlanIR の最終検証
  -> ゲーム内ラウンドシミュレーター
```

ソースを `eval` したり、JavaScript として実行したりはしません。コンパイラーの公開 API は `compileDuelScript(sourceCode, options)`、ラウンド評価の公開 API は `simulateDuelRound(planIr, defenderState, roundIndex)` です。

## 書式

### インデント

- ブロックは親より正確に2スペース深くします。
- タブは解析前に2スペースへ置換されますが、読み違いを防ぐためスペースの使用を推奨します。
- 空行とコメントだけの行は無視されます。
- トップレベルの `plan` と `param` はインデントできません。
- `else:` は対応する `if` と同じ深さに置きます。

```text
plan indentation_example:
  if defense.alert_level > 2:
    use low_noise_probe intensity=1
  else:
    use profit_route split=4
```

### コメント

`#` から行末までがコメントです。ダブルクォートで囲まれた文字列内の `#` は文字として扱われます。

```text
# 行全体のコメント
plan comment_example:
  use refund_probe mode="safe"  # 行末コメント
```

安全検査はコメント除去より先にソース全体へ適用されます。そのため、禁止された URL や API 名はコメントや文字列の中に書いただけでも拒否されることがあります。

### 識別子と値

識別子は `[A-Za-z_][A-Za-z0-9_]*`、つまり英字または `_` で始まり、その後に英数字または `_` を続けた名前です。

値として解析される形式は次のとおりです。

| 形式 | 例 | 扱い |
|---|---|---|
| 数値 | `2`, `-1`, `1.5` | JavaScript の `Number` |
| 文字列 | `"safe"` | ダブルクォート内の文字列。エスケープ構文はありません |
| 真偽値 | `true`, `false` | Boolean。ただし現行 action catalog に Boolean 引数はありません |
| 識別子 | `delay` | `for` 変数または `param` への参照 |

`use` の引数はカンマなしで、空白区切りの `name=value` として書きます。

```text
use sequence_shift delay=2
use refund_probe mode="safe"
```

## 文法

現行パーサーが受理する構文を簡略化して表すと次のようになります。

```text
program       := declaration*                    # 最低1つの planDecl が必要
declaration   := paramDecl | planDecl
paramDecl     := "param" IDENT "in" INTEGER ".." INTEGER
planDecl      := "plan" IDENT ":" planBlock
planBlock     := statement statement*            # plan 本体は空にできない
block         := statement*

statement     := useStmt
               | runStmt
               | observeStmt
               | saveStmt
               | repeatStmt
               | forStmt
               | ifStmt
               | chooseStmt
               | candidateStmt

useStmt       := "use" IDENT (IDENT "=" argumentValue)*
runStmt       := "run"
observeStmt   := "observe" PATH
saveStmt      := "save" IDENT?
repeatStmt    := "repeat" UNSIGNED_INTEGER ":" block
forStmt       := "for" IDENT "in" INTEGER ".." INTEGER ":" block
ifStmt        := "if" conditionValue COMPARATOR conditionValue ":" block ("else:" block)?
chooseStmt    := "choose" IDENT "by" IDENT ":" block
candidateStmt := "candidate" IDENT

argumentValue := NUMBER | STRING | BOOLEAN | IDENT
conditionValue := NUMBER | STRING | BOOLEAN | IDENT | PATH
COMPARATOR    := "==" | "!=" | ">" | ">=" | "<" | "<="
```

Observation path のように `.` を含む参照は条件式と `observe` でだけ使用できます。`use` の引数には、数値・文字列・真偽値・`param` または `for` の識別子だけを指定できます。

プログラムには最低1つの `plan` が必要です。パーサーは複数の `plan` を受理しますが、現行 IR Builder がコンパイルするのは最初の `plan` だけです。意図しない無視を避けるため、1ソースにつき1つの `plan` を使用してください。

## 命令リファレンス

### `plan`

計画の名前と本体を定義します。名前は `PlanIR.planId` と `displayName` になります。空の plan、および展開後に `use` が1件もない plan はエラーです。

```text
plan quiet_probe:
  use low_noise_probe
```

### `param`

トップレベルで整数範囲を宣言します。

```text
param delay in 1..5

plan parameter_example:
  use sequence_shift delay=delay
```

範囲は `PlanIR.parameters` に `{ type: "range", from, to }` として残ります。ただし現行実装は範囲を自動探索せず、`param` を action 引数として参照したときは常に範囲の開始値を使います。探索したい場合は `for` を使って明示的に展開してください。

### `use`

action catalog の行動を計画へ追加します。省略した引数には既定値が入ります。未知の action、未知の引数、型不一致、範囲外の値はコンパイルエラーです。

```text
use sequence_shift          # delay=2
use refund_probe mode="aggressive"
```

### `run`

`PlanIR.metadata.runCount` を1増やすマーカーです。

現行実装では、`run` 自体は action を実行せず、action の区切りにもなりません。`run` が0件でもコンパイルでき、複数書いても複数ラウンドにはなりません。実際の1ラウンドはゲーム画面の「DSLでラウンド実行」により、展開済みの全 action をまとめて評価します。

### `repeat`

本体をコンパイル時に指定回数展開します。回数は `1..12` です。

```text
plan repeat_example:
  repeat 3:
    use low_noise_probe intensity=1
  run
```

この例の `PlanIR.actions` には `low_noise_probe` が3件入ります。`repeat` 内の `run` も展開されますが、増えるのは `runCount` だけです。

### `for`

整数範囲を両端を含めて展開し、ループ変数を本体から参照できます。反復数は最大12です。

```text
plan sweep_delay:
  for delay in 1..3:
    use sequence_shift delay=delay
  run
```

この例は `delay=1`, `delay=2`, `delay=3` の3 action になります。ループ変数と同名の `param` がある場合、ループ変数が優先されます。

### `if` / `else`

条件をコンパイル時に評価し、成立した側だけを `PlanIR.actions` へ展開します。

```text
plan conditional_probe:
  if defense.alert_level > 2:
    use low_noise_probe intensity=1
  else:
    use profit_route split=4
  run
```

比較演算子は `==`, `!=`, `>`, `>=`, `<`, `<=` です。`==` と `!=` は型を変換しない厳密比較、大小比較は両辺を数値へ変換して評価します。

これはラウンド実行時に毎回評価される動的分岐ではありません。ライブラリから `compileDuelScript` を呼ぶ場合は `options.defenderState` が参照されます。一方、現在の Stage 10-2 UI はコンパイル時に `defenderState` を渡していないため、下記 observation の既定値で分岐が確定します。

現行実装は、`if` の未知の識別子を NameError にしません。比較結果が意図せず `false` などになる可能性があるため、条件の参照には宣言済みの `param`、有効な `for` 変数、または下記 catalog の observation path だけを使用してください。

### `observe`

利用する observation path を検証し、`PlanIR.metadata.observations` に記録します。

```text
observe defense.alert_level
```

`observe` は値を変数へ代入せず、それ単独で action も追加しません。条件式は事前の `observe` なしでも observation path を直接参照でき、その path は自動的にメタデータへ記録されます。

### `choose` / `candidate`

候補名を `PlanIR.metadata.choices` に記録します。

```text
choose best by score:
  candidate fast
  candidate quiet
  candidate balanced
```

生成される情報は次の形です。

```json
{
  "target": "best",
  "metric": "score",
  "candidates": ["fast", "quiet", "balanced"]
}
```

現行実装では metric の妥当性検査、候補の採点、候補 action の選択は行いません。`choose` 直下の `candidate` だけをメタデータ化し、`choose` 本体に書いたそれ以外の命令は展開しません。`candidate` を `choose` の外へ書いても action にはならないため、必ず上記の形で使用してください。

### `save`

保存名を `PlanIR.metadata.savedName` に記録します。

```text
save tuned_probe
```

名前を省略すると plan 名が使われ、複数ある場合は最後の `save` が優先されます。現行実装ではこれはメタデータだけであり、テンプレートやファイルを実際に永続化する命令ではありません。

## Action catalog

すべての action 引数は1個で、省略時は表の既定値が使われます。

| Action ID | 表示名 | 引数 | Cost | Load | Risk | Gain | Tags |
|---|---|---:|---:|---:|---:|---:|---|
| `sequence_shift` | 順序シフト | `delay`: Number `1..5`、既定 `2` | 3 | 2 | 18 | 7 | `sequence` |
| `refund_probe` | 返金プローブ | `mode`: `"safe"` / `"aggressive"`、既定 `"safe"` | 2 | 2 | 16 | 6 | `state` |
| `rounding_split` | 分割丸め | `split`: Number `2..8`、既定 `4` | 2 | 1 | 10 | 5 | `numeric` |
| `low_noise_probe` | 低ノイズ確認 | `intensity`: Number `1..3`、既定 `1` | 2 | 1 | 6 | 4 | `stealth`, `resource` |
| `profit_route` | 利得ルート | `split`: Number `2..8`、既定 `4` | 4 | 3 | 22 | 9 | `numeric`, `sequence` |
| `resource_probe` | 資源プローブ | `intensity`: Number `1..3`、既定 `2` | 2 | 3 | 20 | 5 | `resource` |
| `wait_interval` | 間隔調整 | `ticks`: Number `1..5`、既定 `2` | 1 | 0 | -8 | 1 | `stealth` |
| `defense_read` | 防御観測 | `detail`: `"summary"` / `"score"` / `"reason"`、既定 `"summary"` | 1 | 0 | -4 | 2 | `observe` |
| `template_switch` | テンプレート切替 | `variant`: `"quiet"` / `"balanced"` / `"profit"`、既定 `"balanced"` | 2 | 1 | 4 | 5 | `strategy` |

Cost、Load、Risk、Gain、Tags は action ID ごとの固定値です。現在のシミュレーターでは、検証済み引数の値そのもの、たとえば `delay=1` と `delay=5` の違いはスコア計算を変えません。Cost は IR の集計値、引数は計画内容とラウンドイベントに残ります。

Risk の集計とシミュレーターの基礎リスクでは負値を `0` として扱います。そのうえで `stealth` タグを持つ action 1件につき検知スコアから10を引きます。このため `wait_interval` は負の Risk を直接加算するのではなく、主に `stealth` タグで検知を下げます。

## Observation catalog

| Path | `defenderState` の参照先 | 未指定時の値 | 値の形 |
|---|---|---:|---|
| `defense.alert_level` | `alertLevel` | `1` | Number |
| `defense.rate_limit` | `rateLimit` | `0` | 有効なら `1`、無効なら `0` |
| `round.last_block_reason` | `lastBlockReason` | `"none"` | String |
| `round.score_delta` | `lastScoreDelta` | `0` | Number |
| `resource.queue` | `queue` | `0` | Number |
| `score.current` | `score` | `0` | Number |

文字列との比較では右辺もクォートしてください。

```text
plan reason_aware:
  if round.last_block_reason == "detection_threshold":
    use wait_interval ticks=3
  else:
    use defense_read detail="reason"
  run
```

`defense.rate_limit` は Boolean ではなく `0` または `1` に変換されるため、`if defense.rate_limit == 1:` のように比較します。catalog にない path を `observe` するとエラーです。

## まとまった例

次の例は、2つの delay を展開し、観測値に応じて1 action を追加し、選択候補と保存名をメタデータへ残します。

```text
param allowed_delay in 1..3

plan adaptive_probe:
  observe defense.alert_level

  for delay in 1..2:
    use sequence_shift delay=delay

  if defense.alert_level > 2:
    use low_noise_probe intensity=1
  else:
    use refund_probe mode="safe"

  choose best by score:
    candidate fast
    candidate quiet

  save tuned_probe
  run
```

Stage 10-2 UI でコンパイルすると `defense.alert_level` は既定値 `1` なので `else` 側が選ばれ、actions は `sequence_shift(delay=1)`, `sequence_shift(delay=2)`, `refund_probe(mode="safe")` の3件になります。`allowed_delay` は PlanIR に範囲情報として残りますが、この例では action 展開に使っていません。

## PlanIR

コンパイル成功時の IR は共通形式 `plan-ir-1` です。主要フィールドは次のとおりです。

| フィールド | 内容 |
|---|---|
| `irVersion` | 現在は `"plan-ir-1"` |
| `planId`, `displayName` | 最初の `plan` の名前 |
| `source` | `sourceType: "dsl"` などの生成元情報 |
| `chapterId`, `stageId` | コンパイル option から渡された識別子 |
| `parameters` | `param` の範囲を型付き `PlanValue` として保持 |
| `actions` | ループと条件を展開した action の配列 |
| `metadata` | 合計値、利用機能、observation、choice、安全上限など |
| `validation` | `valid` / `invalid` と診断結果 |
| `createdAt`, `updatedAt` | `options.now`。未指定時は `0` |

action 引数は生の値ではなく、次のような型付き `PlanValue` に正規化されます。

```json
{
  "delay": { "type": "number", "value": 2 },
  "mode": { "type": "string", "value": "safe" }
}
```

クイックスタート例から生成される IR の主要部は次のようになります。読みやすさのため、action の互換フィールドや空配列は省略しています。

```json
{
  "irVersion": "plan-ir-1",
  "planId": "first_probe",
  "displayName": "first_probe",
  "source": {
    "sourceType": "dsl",
    "sourceId": "first_probe",
    "sourceLabel": "Duel DSL",
    "dslSourceHash": "4"
  },
  "parameters": {},
  "actions": [
    {
      "actionId": "sequence_shift",
      "params": { "delay": { "type": "number", "value": 2 } },
      "estimatedCost": 3,
      "estimatedLoad": 2,
      "estimatedRisk": 18,
      "gain": 7,
      "tags": ["sequence"],
      "line": 2
    },
    {
      "actionId": "refund_probe",
      "params": { "mode": { "type": "string", "value": "safe" } },
      "estimatedCost": 2,
      "estimatedLoad": 2,
      "estimatedRisk": 16,
      "gain": 6,
      "tags": ["state"],
      "line": 3
    },
    {
      "actionId": "low_noise_probe",
      "params": { "intensity": { "type": "number", "value": 1 } },
      "estimatedCost": 2,
      "estimatedLoad": 1,
      "estimatedRisk": 6,
      "gain": 4,
      "tags": ["stealth", "resource"],
      "line": 4
    }
  ],
  "metadata": {
    "estimatedTotalCost": 7,
    "estimatedTotalLoad": 5,
    "estimatedDetectionRisk": 40,
    "estimatedGain": 17,
    "estimatedLoad": 5,
    "estimatedRisk": 40,
    "maxExpandedActions": 3,
    "riskTags": ["sequence", "state", "stealth", "resource"],
    "observations": [],
    "choices": [],
    "runCount": 1,
    "savedName": "",
    "statementCount": 4
  },
  "validation": {
    "status": "valid",
    "checkedAt": 1,
    "diagnostics": []
  }
}
```

`dslSourceHash` という名前ですが、現行値は展開時の `statementCount` を文字列化したもので、ソース内容の暗号学的ハッシュではありません。

メタデータフラグにも現行実装固有の注意があります。

- `usesObservation` は `observe`、または条件式で認識された observation があると `true` です。
- `usesBranch` は現在 `choose` の有無を示します。`if` だけでは `true` になりません。
- `usesLoop` は厳密な AST 判定ではなく、`param` の有無または展開時の statement/action/run 件数差による判定です。`observe` や `save` などによっても `true` になる場合があります。
- `usesTemplate` は Duel DSL からの生成では常に `false` です。

## ラウンド評価

コンパイル済み actions は1回の仮想ラウンドとしてまとめて評価されます。現在の計算は次のとおりです。

```text
rawGain       = action の Gain 合計
load          = action の Load 合計
actionRisk    = max(0, action.Risk) の合計
repeatPenalty = defenderState.memory > 0
                ? min(24, memory * 8)
                : 0
stealthCount  = tags に stealth を含む action 数

detectionScore = max(0, round(
  actionRisk
  + alertLevel * 6
  + repeatPenalty
  - stealthCount * 10
))

queue      = max(0, load + floor(detectionScore / 24))
latency    = 45 + queue * 22
blocked    = detectionScore >= 72 または load > 24
scoreDelta = max(0, round(
  rawGain
  - detectionScore / 9
  - (blocked ? 8 : 0)
  - latency / 90
))
```

実行後は `memory` が1増え、遮断時は `alertLevel` が1、非遮断でも検知スコアが50以上なら0.5増えます。`alertLevel` の上限は5です。遮断理由、キュー、直前スコア、累積スコアも次の defender state に保存されます。

## エラーと診断

`compileDuelScript` は成功時に次の形を返します。

```js
{
  ok: true,
  ast,
  ir,
  errors: [],
  diagnostics: []
}
```

構文解析、安全検査、意味解析、IR 構築中の最初のエラーで停止し、通常は次の形になります。

```js
{
  ok: false,
  ast: null,
  ir: null,
  errors: ["Line 3: ..."],
  diagnostics: []
}
```

行番号は1始まりです。現行コンパイラーは通常、列番号や修正ヒントを返しません。また Stage 10-2 の UI は、内部原因にかかわらずコンパイル失敗を共通の `SyntaxError` カテゴリとしてランタイムイベントへ記録します。

よくあるエラーは次のとおりです。

| メッセージ例 | 主な原因 | 修正 |
|---|---|---|
| `top-level declarations must not be indented` | `plan` / `param` にインデントがある | 行頭へ戻す |
| `unexpected indentation` | ブロックが2スペースより深い、または深さが揃っていない | 親から正確に2スペースずつ下げる |
| `expected plan or param declaration` | トップレベルに別の命令を書いた | 命令を `plan` 内へ移す |
| `at least one plan is required` | `plan` がない | plan を1つ追加する |
| `invalid argument syntax` | カンマ、シングルクォート、不正な `name=value` | カンマなし・ダブルクォートで書く |
| `unknown command '...'` | 未対応の命令 | 命令リファレンス内の構文へ直す |
| `unknown action '...' is not allowed` | catalog にない action | Action catalog の ID を使う |
| `does not accept argument '...'` | action にない引数名 | 対応する1引数だけを使う |
| `'...' must be a number/string` | 引数の型不一致 | catalog の型に合わせる |
| `'...' must be between ...` | 数値引数が範囲外 | 許容範囲へ収める |
| `'...' must be one of ...` | 列挙文字列が不正 | 表示された候補をダブルクォートで指定する |
| `unknown variable '...'` | `use` が未定義の参照を使った | `param` または `for` で宣言する |
| `observation '...' is not available` | `observe` の path が catalog 外 | Observation catalog の path を使う |
| `range start must be <= range end` | 範囲が降順 | 開始値を終了値以下にする |
| `repeat count exceeds maximum allowed value` | `repeat` が0または13以上 | `1..12` にする |
| `loop range exceeds maximum allowed value` | `for` が13回以上 | 両端込み12回以内にする |
| `round action count exceeds maximum allowed value` | 展開後 action が17件以上 | action 数を16以下にする |
| `virtual load exceeds round budget` | Load 合計が24超 | 高 Load action や反復を減らす |

`PlanIR` の推定検知 Risk が140を超えた場合は `ir.validation.diagnostics` に warning が入りますが、`validation.status` は `valid` のままで、コンパイル自体は成功します。

## 安全制限

### 数量上限

| 制限 | 値 | 現行の数え方 |
|---|---:|---|
| `maxStatements` | 120 | IR Builder が実際にたどった statement 数。反復本体は展開回数分、`if` は選ばれた側だけを数える |
| `maxLoopIterations` | 12 | `repeat` 回数、および `for` の両端込み反復数 |
| `maxExpandedActions` | 32 | 展開中の action 数に対するコンパイラー上限 |
| `maxRoundActions` | 16 | 最終的な1ラウンドの action 数。実効上はこちらがより厳しい |
| `maxVirtualLoad` | 24 | action の Load 合計 |
| `maxEstimatedRisk` | 140 | 超過しても停止せず warning |

`param` の範囲検査は反復数ではなく `end - start <= 12` です。このため、たとえば `1..13` は範囲情報としては受理されます。ただし `param` 自体は反復を行いません。

構想仕様にあるコンパイル時間・実行時間の個別上限は、現在のコードにはまだ実装されていません。実行量は上記の statement、loop、action、load 上限で抑えています。

### 禁止される入力

安全検査は、次のような文字列をソースに検出するとコンパイルを中止します。

- ブラウザ・任意コード実行 API: `fetch`, `XMLHttpRequest`, `WebSocket`, `import`, `eval`, `Function`, `document`, `window`, `localStorage`
- `http://` または `https://` の外部 URL
- `/...`, `~/...`, `./...`, `../...` 形式のファイルパス
- OS・ネットワーク関連語: `curl`, `wget`, `rm`, `chmod`, `shell`, `exec`, `spawn`, `network`, `socket`
- 無制限ループを示す `while`

安全検査のエラーは、実際の出現行にかかわらず現在は `Line 1` として報告されます。Duel DSL に外部通信命令やファイル命令は存在せず、これらの文字列を通過させても実行能力が増えるわけではありません。

## 現行実装の要点

- Duel DSL は汎用言語ではなく、許可リスト方式の計画記述言語です。
- `repeat`, `for`, `if` は PlanIR を作る時点で展開・確定します。
- `observe`, `choose`, `save`, `run` は現在メタデータ中心の命令です。
- ラウンド実行の単位は、`run` の位置ではなくコンパイル済み PlanIR 全体です。
- Action 引数は検査・記録されますが、現行スコア計算は action ID ごとの固定 Gain / Load / Risk / Tags を使います。
- GUI 計画と DSL 計画は同じ `plan-ir-1` 形式を通して検証・実行されます。
