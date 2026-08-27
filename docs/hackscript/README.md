# HackScript

HackScript は、Hack Lab で Chapter ごとの目押し判定窓を間接的に調整するためのゲーム専用 DSL です。JavaScript、Python、JSON の別名ではなく、[hack_lab.js](../../static/hack_lab.js) に実装された専用の tokenizer / parser が解釈します。入力文字列を `eval` したり、ブラウザ上で任意コードとして実行したりはしません。

実装の中心は次の2ファイルです。

- [hack_lab.html](../../static/hack_lab.html): コード入力欄、テンプレート、検証・保存ボタン、ストア、プレビュー
- [hack_lab.js](../../static/hack_lab.js): 構文解析、設定の正規化、判定窓の算出、ストア効果、`localStorage` 保存

> **現状の重要な制限**
>
> Hack Lab の画面には「本編の目押し判定にすぐ反映」と表示されますが、現在の本編 [app.js](../../static/app.js) は Hack Lab の保存キーを読み取っていません。したがって、検証と保存、プレビュー生成までは動作するものの、保存した `sweetLeft` / `sweetWidth` は現在の本編ステージの判定には接続されていません。詳しくは「本編との接続状況」を参照してください。

## 目次

- [クイックスタート](#クイックスタート)
- [構文](#構文)
- [設定項目と値域](#設定項目と値域)
- [コンパイルとプレビュー](#コンパイルとプレビュー)
- [旧 JSON 互換](#旧-json-互換)
- [検証と保存](#検証と保存)
- [ストアの影響](#ストアの影響)
- [エラーと警告](#エラーと警告)
- [`localStorage` キー](#localstorage-キー)
- [本編との接続状況](#本編との接続状況)

## クイックスタート

現在の Python サーバーで Hack Lab を直接開く場合の URL は次です。

```text
http://127.0.0.1:8080/static/hack_lab.html
```

標準テンプレートは次の形です。

```hackscript
// HackScript v1
chapter chapter1 {
  probeBudget(2);
  stabilityBias(60);
  entropyGate(44);
  focusMode("safe");
}

chapter chapter2 {
  probeBudget(2);
  stabilityBias(56);
  entropyGate(55);
  focusMode("balanced");
}

chapter chapter3 {
  probeBudget(3);
  stabilityBias(50);
  entropyGate(62);
  focusMode("greedy");
}
```

「検証だけする」を押すと、コードを解析・正規化してプレビューを更新します。「検証して保存して戻る」は同じ検証をもう一度行い、成功した場合だけ設定を `localStorage` に保存して `/` へ戻ります。

## 構文

### 最小文法

実装上の文法を簡略化すると次のとおりです。

```text
program       := block*

block         := blockKeyword chapterName "{" statement* "}"
               | "class" chapterName ("extends" identifier)? "{" statement* "}"

blockKeyword  := "chapter" | "mission" | "profile"
chapterName   := chapter1 | chapter2 | chapter3
statement     := fieldName "(" value ")" ";"?
               | fieldName "=" value ";"?

value         := number | string | identifier
```

実際には空でない入力が必要です。ただし、コメントだけの入力は token 化後に空の program となり、デフォルト計画として通ります。ブロック自体も空で構文上は通り、その Chapter にはデフォルト値が残ります。3 Chapter をすべて記述する必要はなく、省略した Chapter もデフォルト値になります。

キーワード、Chapter 名、設定名は大文字・小文字を区別せずに正規化されます。

### ブロック形式

通常の `chapter` 形式です。

```hackscript
chapter chapter1 {
  probeBudget(3);
  stabilityBias(72);
  entropyGate(48);
  focusMode("safe");
}
```

`mission` と `profile` も `chapter` と同じブロック開始キーワードとして受理されます。

```hackscript
profile ch2 {
  budget = 4;
  bias = 58;
  gate = 61;
  mode = balanced;
}
```

`class` 風の形式も使えます。`extends` の後ろは識別子を1つ必要としますが、継承処理は行わず、親クラス名は構文として読み飛ばされます。

```hackscript
class Chapter3 extends ExploitProfile {
  probeBudget = 4;
  stabilityBias = 58;
  entropyGate = 61;
  focusMode = "greedy";
}
```

Chapter 名には次の別名を使えます。

| 正規名 | 受理される名前 |
| --- | --- |
| `chapter1` | `chapter1`, `ch1`, `c1` |
| `chapter2` | `chapter2`, `ch2`, `c2` |
| `chapter3` | `chapter3`, `ch3`, `c3` |

同じ Chapter を1つの入力内で複数回宣言するとエラーです。別形式・別名を使っていても、正規化後の Chapter が同じなら重複と判定されます。

### 設定文

関数呼び出し風と代入風の2形式があります。

```hackscript
probeBudget(3);
probeBudget = 3;
```

末尾のセミコロンは省略できます。改行も文の区切りとして必須ではありませんが、可読性とエラー位置の分かりやすさのため、1行1設定を推奨します。

引数は1つだけです。カンマを使った複数引数、算術式、メソッド呼び出し、配列、オブジェクトは対応していません。

設定名には次の別名があります。

| 正規名 | 受理される名前 |
| --- | --- |
| `probeBudget` | `probeBudget`, `probe`, `budget` |
| `stabilityBias` | `stabilityBias`, `stability`, `bias` |
| `entropyGate` | `entropyGate`, `entropy`, `gate` |
| `focusMode` | `focusMode`, `focus`, `mode` |
| 直接指定として検出 | `sweetLeft`, `sweetWidth`, `scanDepth` |

`sweetLeft`、`sweetWidth`、`scanDepth` は構文上は設定名として認識されますが、値は適用されません。検証自体は成功し、無効化された項目として警告ログに記録されます。

### 値とコメント

数値は整数、小数、負数を読めます。指数表記は未対応です。

```hackscript
probeBudget(3);
stabilityBias = 72.5;
entropyGate(-10); // 解析後に 0 へ clamp される
```

文字列はシングルクォートまたはダブルクォートを使えます。文字列内では `\n`、`\t`、クォート、バックスラッシュのエスケープを扱います。文字列リテラル内の実改行はエラーです。`focusMode(safe)` のようなクォートなしの識別子も値として受理されます。

コメントは3形式です。

```hackscript
// 行コメント
# 行コメント
/* ブロックコメント */
```

ブロックコメントは入れ子にできません。閉じていないブロックコメントは行・列付きのエラーになります。

## 設定項目と値域

### デフォルト値

| Chapter | `probeBudget` | `stabilityBias` | `entropyGate` | `focusMode` |
| --- | ---: | ---: | ---: | --- |
| `chapter1` | 2 | 60 | 44 | `safe` |
| `chapter2` | 2 | 56 | 55 | `balanced` |
| `chapter3` | 3 | 50 | 62 | `greedy` |

### 正規化ルール

| 設定 | 受理値 | 実際の処理 |
| --- | --- | --- |
| `probeBudget` | 数値 | `1`〜`6` に clamp。整数への丸めは行わない |
| `stabilityBias` | 数値 | `0`〜`100` に clamp |
| `entropyGate` | 数値 | `0`〜`100` に clamp |
| `focusMode` | `safe`, `balanced`, `greedy` | HackScript ではそれ以外をエラーにする |
| `sweetLeft` | 任意の単一値 | 適用せず警告対象にする |
| `sweetWidth` | 任意の単一値 | 適用せず警告対象にする |
| `scanDepth` | 任意の単一値 | 適用せず警告対象にする |

画面内の初心者向け説明は `probeBudget: 1〜5` としていますが、実装上の上限は `6` です。また、範囲外の数値はコンパイルエラーにはならず、範囲内に clamp されます。

3つの数値設定は値に `Number(...)` を適用してから検証します。そのため `probeBudget("4")` のような数値文字列も通り、空文字列は `0` として clamp されます。数値へ変換できない文字列や識別子はエラーです。`focusMode` はクォートの有無にかかわらず小文字化して検証するため、HackScript 内では `SAFE` なども受理されます。

### 各設定の算出上の意味

`compilePlan()` は設定をそのまま判定窓にせず、Chapter ごとの秘密値と購入済みモジュールを合わせて `sweetLeft` / `sweetWidth` を推定します。

- `probeBudget`
  - 秘密の中心値へ寄せる係数に、1ポイントあたり `0.05` を加えます。
  - 値が大きいほど中心推定のノイズと表示上のリスクを下げます。
  - 幅の式にも補正があります。`3.5` までは値を上げるほどこの補正分が小さくなります。
- `stabilityBias`
  - 中心に `(stabilityBias - 50) * 0.07` の補正を加えます。
  - 幅に `stabilityBias * 0.13` を加えます。
  - 値が大きいほど表示上のリスクを下げます。
- `entropyGate`
  - 中心に `(entropyGate - 50) * 0.11` の補正を加え、Chapter 固有の位相揺らぎにも使います。
  - `50` から離れるほどノイズと幅の補正が増えます。
- `focusMode`
  - `safe`: 中心 `-4`、幅 `+5.0`
  - `balanced`: 中心 `+1`、幅 `+2.0`
  - `greedy`: 中心 `+5`、幅 `-1.8`、表示上のリスク `+18`

最終的な幅はまず `8`〜`42` に clamp されます。その後、左端を `0`〜`95` に収め、幅へ `clamp(width, 4, 95 - left)` を適用します。通常は右端を `95` 以下へ収める処理ですが、`left > 91` では上限が最小値 `4` を下回ります。現在の `clamp()` はこの場合も `4` を返すため、極端に右寄りのケースでは右端が `95` を超える可能性があります。結果として保存される runtime 設定は、各 Chapter の `sweetLeft` と `sweetWidth` だけです。

Chapter ごとの秘密値は初回アクセス時に乱数を加えて生成し、`localStorage` に保存します。同じブラウザ・同じ保存データでは再利用されますが、保存領域が異なるブラウザでは同じ HackScript でもプレビューが異なる可能性があります。秘密データ内の `mainSpan` は生成・保存されますが、現在の `estimateChapterWindow()` では参照されていません。

## コンパイルとプレビュー

HackScript の処理は次の順序です。

1. `parsePlanSource()` が空入力を拒否し、先頭文字で HackScript と旧 JSON を振り分ける。
2. `tokenizeHackScript()` がコメントを読み飛ばし、識別子、数値、文字列、記号を token 化する。
3. `parseHackScript()` が Chapter ブロックと設定文を読み、デフォルト計画へ上書きする。
4. `sanitizePlan()` が数値の clamp、`focusMode` の正規化、直接指定項目の除外を行う。
5. `compilePlan()` が購入済みストア効果と秘密値を使い、Chapter ごとの判定窓とレポートを作る。
6. `renderPreview()` が判定窓、推定中心、信頼度、リスク、解析力を表示する。

生成される runtime 設定の形は次です。

```json
{
  "chapter1": {
    "sweetLeft": 40.25,
    "sweetWidth": 24.5
  },
  "chapter2": {
    "sweetLeft": 51.75,
    "sweetWidth": 20.25
  },
  "chapter3": {
    "sweetLeft": 37.5,
    "sweetWidth": 18.5
  }
}
```

数値は説明用の例であり、秘密値、入力設定、購入済みモジュールによって変わります。

`pull` と呼ばれる秘密中心への寄せ係数は、基本値 `0.08 + probeBudget * 0.05` にヒント・モジュール効果を足し、最終的に `0.05`〜`0.88` に clamp されます。画面の「解析力」は `pull * 100` の丸め値です。

## 旧 JSON 互換

空白を除いた入力の先頭が `{` の場合、HackScript ではなく旧 JSON 計画として扱います。

```json
{
  "chapter1": {
    "probeBudget": 3,
    "stabilityBias": 72,
    "entropyGate": 48,
    "focusMode": "safe",
    "sweetLeft": 10
  },
  "chapter2": {
    "probeBudget": "4"
  }
}
```

旧 JSON には次の互換処理があります。

- 欠けた Chapter と数値項目はデフォルト値で補う。
- Chapter オブジェクトは存在するが `focusMode` が欠けている、または falsey な場合は、Chapter 固有デフォルトではなく `balanced` にする。たとえば `chapter1` に `probeBudget` だけを書いた旧 JSON は、`focusMode: safe` ではなく `balanced` になる。
- 数値項目は `Number(...)` で変換できる値を受け入れ、同じ値域へ clamp する。
- `focusMode` が厳密に `safe` / `balanced` / `greedy` でなければ `balanced` にする。
- `sweetLeft`、`sweetWidth`、`scanDepth` は削除する。
- 未知のプロパティは無視する。
- 検証成功時にエディタ内容を標準の HackScript 形式へ書き換える。

JSON として解析できない場合は、`HackScript の構文が読めません。テンプレートを基準に書いてください。` という共通エラーになります。旧 JSON で直接指定項目も含んでいた場合、画面上では旧 JSON 変換の警告が優先されますが、直接指定項目も同時に削除されています。

## 検証と保存

### テンプレートを読み込む

デフォルト計画を標準 HackScript 形式でエディタに入れ、現在の秘密値とストア状態でプレビューを更新します。この時点では保存しません。

### 検証だけする

`validateEditor()` が次を行います。

1. エディタ内容を解析する。
2. 正規化済みの全3 Chapter を標準 HackScript 形式でエディタへ書き戻す。
3. 判定窓をコンパイルしてプレビューを更新する。
4. 成功、旧 JSON 変換、直接指定無効化、または構文エラーをステータスとログへ表示する。

つまり「検証だけする」でもエディタ内の表記は正規化されます。別名、代入形式、省略した Chapter、コメントは標準形式への書き換えにより失われます。

### 検証して保存して戻る

`saveAndBack()` は検証に成功した場合だけ次を保存します。

| キー | 保存内容 |
| --- | --- |
| `vending_glitch_hack_plan_v1` | 正規化済みの HackScript ソース |
| `vending_glitch_hack_settings_v1` | `sweetLeft` / `sweetWidth` を持つ runtime JSON |

保存後、700ms 後に `/` へ遷移します。検証エラー時は保存も遷移もしません。

画面の初期化時は保存済み計画を読み、再度 parse / sanitize / compile して表示します。保存済み計画が壊れている場合は、エラーを表示せずデフォルト計画へフォールバックします。

## ストアの影響

購入状態は `vending_glitch_store_v1` に保存されます。許可リストに存在しない購入 ID は読み込み時に除外されます。

### 商品とコンパイル効果

| ID | 価格 | 実装上の効果 |
| --- | ---: | --- |
| `hint_basics` | 120pt | 基本ヒントを表示し、`pull` に `+0.04` |
| `hint_pairmap` | 180pt | Chapter 別ヒントを表示し、`pull` に `+0.06` |
| `module_phase_lens` | 260pt | `pull` に `+0.24` |
| `module_side_trace` | 320pt | 秘密の目標中心を `bonusCenter` 78% + `sideCenter` 22% に変更 |
| `module_width_patch` | 240pt | 推定幅に `+4.8`、表示上の信頼度に `+6` |
| `module_deep_decoder` | 420pt | `pull` に `+0.26` |
| `snippet_safe` | 150pt | Safe コード断片ボタンを解放 |
| `snippet_rush` | 220pt | Rush コード断片ボタンを解放 |

ヒント商品は説明を表示するだけでなく、実装上は判定窓の中心推定にも影響します。モジュール効果は購入直後からプレビューの `compilePlan()` に入り、保存時の runtime 設定にも含まれます。

### Safe / Rush コード断片

購入済みコード断片は、現在の各 Chapter 設定を次のように一括変更し、標準 HackScript へ書き戻します。

Safe:

```text
probeBudget   = clamp(current + 1, 1, 6)
stabilityBias = clamp(current + 18, 0, 100)
entropyGate   = mix(current, 50, 0.45)
focusMode     = safe
```

Rush:

```text
probeBudget   = clamp(current + 2, 1, 6)
stabilityBias = clamp(current - 10, 0, 100)
entropyGate   = clamp(current + 14, 0, 100)
focusMode     = greedy
```

コード欄が構文エラーの場合、断片適用はデフォルト計画を出発点にします。

### ポイント

Hack Lab は `vending_glitch_game_progress_v2` の `score` を所持ポイントとして読みます。有限の数値は小数点以下を切り捨て、最低 `0` にします。値がない、壊れている、数値でない場合は `1000pt` から始めます。商品購入時は価格を差し引き、購入状態と進行データを保存します。

`HACK_COST` は `100pt` で、画面には「実行1回コスト 100pt」と表示されます。ただし現在の実装では、テンプレート読込、検証、コンパイル、保存のどの操作でもこの100ptは差し引かれません。`HACK_COST` は進行データの `gameOver` 判定と、100pt 未満の初期警告にだけ使われています。

購入直後には現在のコードを再検証します。コードが不正だった場合、エディタをデフォルトテンプレートへ戻してプレビューを更新します。

## エラーと警告

主なエラーは行番号・列番号付きで表示されます。

| 状況 | 挙動・代表メッセージ |
| --- | --- |
| 空入力 | `コード欄が空です。テンプレートを読み込んでください。` |
| 未対応文字 | `不正な文字 ... が見つかりました。 (line ..., col ...)` |
| 閉じていない文字列 | `文字列リテラルが閉じられていません。` |
| 文字列内の実改行 | `文字列リテラル内で改行は使えません。` |
| 閉じていないブロックコメント | `ブロックコメントが閉じられていません。` |
| 不正なトップレベル | `chapter ...` または `class ...` を使うよう案内 |
| 不正な Chapter 名 | `chapter1 / chapter2 / chapter3` のいずれかを要求 |
| Chapter 重複 | 1 Chapter につき1ブロックだけにするよう要求 |
| 未対応設定 | `probeBudget / stabilityBias / entropyGate / focusMode` を案内 |
| 数値項目に非数値 | 対象設定には数値が必要と表示 |
| 不正な `focusMode` | `safe / balanced / greedy` のいずれかを要求 |
| 閉じていない `{`, `}`, `)` | 必要な記号と行・列を表示 |
| `sweetLeft` 等の直接指定 | エラーにせず無効化し、警告ログを表示 |

範囲外の数値はエラーではなく clamp されます。未知の設定名はエラーですが、旧 JSON 内の未知プロパティは無視されます。

## `localStorage` キー

| キー | 用途 |
| --- | --- |
| `vending_glitch_hack_plan_v1` | 正規化済み HackScript または旧版から残った計画ソース |
| `vending_glitch_hack_settings_v1` | コンパイル済み判定窓 |
| `vending_glitch_secret_map_v1` | Chapter ごとの秘密値 |
| `vending_glitch_store_v1` | 購入済み商品 ID |
| `vending_glitch_game_progress_v2` | Hack Lab が参照するポイント・旧進行情報 |

別タブから更新された場合、`storage` イベントの反映先はキーごとに異なります。

- 進行キー: ポイントとストア表示を更新する。
- ストアキー: 購入済み表示、ヒント、断片ボタンを更新する。ただし判定窓のプレビューは再コンパイルしない。
- 秘密値キー: 秘密値を読み直し、現在のコードを再検証してプレビューを更新する。
- 計画キーとコンパイル済み設定キー: `storage` イベントでは再読込しない。

## 本編との接続状況

現在のソースでは Hack Lab と本編は未接続です。

- [server.py](../../server.py) は `/` を本編へ、`/static/*` を静的ファイルへ割り当てます。`/hack_lab` のような専用ルートはありません。
- [index.html](../../static/index.html) には Hack Lab へのリンクがなく、「Hack Lab は第4章以降で解放予定」と表示されます。
- 本編 [app.js](../../static/app.js) の進行キーは `security_game_stage_journey_v9` です。
- 本編コードは `vending_glitch_hack_settings_v1`、`vending_glitch_hack_plan_v1`、`vending_glitch_game_progress_v2` を参照していません。
- `saveAndBack()` は runtime 設定を保存して本編へ戻しますが、本編側に読み込み・判定反映処理がありません。

このため、現在確認できる動作範囲は次のとおりです。

```text
HackScript入力
  -> 構文解析・正規化
  -> ストア効果を含む判定窓の算出
  -> Hack Lab内プレビュー
  -> localStorage保存
  -> 本編へ遷移
  -X-> 本編ステージの目押し判定へ反映（未実装）
```

本編へ接続する際は、少なくとも本編起動時の `vending_glitch_hack_settings_v1` 読み込み、値の再検証、対象ステージへの Chapter 対応付け、進行データとポイントキーの統合が必要です。
