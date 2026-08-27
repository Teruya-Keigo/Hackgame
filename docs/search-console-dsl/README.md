# Search Console Mini Script DSL

Search Console Mini Script は、第3章の丸め差分探索にだけ使う小さなドメイン固有言語（DSL）です。`split`（分割数）、`repeat`（反復数）、`amount`（処理量）を設定し、複数条件をまとめて試せます。

この言語は JavaScript や Python ではありません。入力は専用の字句解析器・構文解析器で命令列に変換され、許可された第3章シミュレーションだけを実行します。`eval`、ファイル操作、ネットワークアクセス、任意の JavaScript 実行は行いません。

## 目次

- [クイックスタート](#クイックスタート)
- [パラメーター](#パラメーター)
- [構文の基本](#構文の基本)
- [命令リファレンス](#命令リファレンス)
- [探索結果の計算](#探索結果の計算)
- [実行モデル](#実行モデル)
- [サンプル](#サンプル)
- [エラー](#エラー)
- [制限と注意事項](#制限と注意事項)
- [実装箇所](#実装箇所)

## クイックスタート

固定条件を1回試す最小例です。

```text
set amount 3
set split 4
set repeat 5
run
show best
```

画面では次の順に操作します。

1. `Mini Script Editor` にスクリプトを入力します。
2. `コンパイル` で構文と静的な制約を検査します。
3. `実行` で探索を最初から実行します。
4. 必要なら `保存` で現在のベスト結果を保存し、`本編へ反映` で戻り先の Stage 3-3 または 3-4 に値を渡します。

`実行` を先に押しても、未コンパイルなら自動的にコンパイルされます。エディターを編集すると、以前のコンパイル結果は破棄されます。`コンパイル` だけでは試行は発生しません。

## パラメーター

| 名前 | 意味 | 実行時の許容範囲 | 正規化 |
| --- | --- | ---: | --- |
| `split` | 1回の処理を分ける数 | 1〜12 | `Math.round` で整数化 |
| `repeat` | 同じ条件を繰り返す数 | 1〜8 | `Math.round` で整数化 |
| `amount` | 元の処理量 | 1〜6 | 小数を保持 |

Search Console を Stage 3-3 または 3-4 から開くと、そのステージで選択中の値が初期パラメーターになります。値が渡されなかった場合のインタプリタ既定値は `split = 2`、`repeat = 1`、`amount = 3` です。

スクリプト内で設定しなかったパラメーターは、この初期値を引き継ぎます。たとえば標準サンプルの `split を探索` は `repeat` と `amount` を変更しません。

## 構文の基本

- キーワードと名前は大文字・小文字を区別し、すべて小文字で書きます。
- 空白と改行はトークンの区切りとして扱われます。改行自体に文の終端という意味はありませんが、読みやすさのため1命令1行を推奨します。
- セミコロンは使いません。
- ブロックは `{` と `}` で囲み、入れ子にできます。インデントは見た目だけで、構文上の意味はありません。
- コメント、文字列、真偽値、負数、四則演算、比較式、関数はありません。
- 識別子は英字または `_` で始め、以降に英数字と `_` を使えます。ただし、実際に許可されるパラメーター名・ループ変数名は後述のものだけです。
- 数値リテラルは `0`、`12`、`2.5` のような非負の10進数です。`.5`、`1.`、`-1`、`1e3` は受理されません。

実装に近い簡略文法は次のとおりです。

```ebnf
program       = { statement } ;
statement     = set_statement
              | "run"
              | "save"
              | show_statement
              | "track" "best"
              | "reset" "results"
              | repeat_block
              | for_block ;

set_statement = "set" parameter value ;
parameter     = "split" | "repeat" | "amount" ;
value         = number | loop_variable ;

show_statement = "show" ( "best" | "history" ) ;
repeat_block   = "repeat" number block ;
for_block      = "for" loop_variable "in" number ".." number block ;
loop_variable  = "split" | "repeat" ;
block          = "{" { statement } "}" ;
```

`set` の値に識別子を書けるのは、その位置を囲んでいる `for` が定義したループ変数だけです。パラメーターそのものを式として読み出す機能はありません。

## 命令リファレンス

### `set`

```text
set split 4
set repeat 5
set amount 3
```

現在のパラメーターを変更します。数値の範囲検査はコンパイル時ではなく実行時です。そのため `set split 13` はコンパイルに成功しますが、実行時にエラーになります。

`for` の中では、ループ変数を値として使えます。

```text
for split in 2..8 {
  set split split
  run
}
```

ループ変数は囲んでいるブロック内だけで参照できます。たとえば次はコンパイルエラーです。

```text
for split in 2..4 {
  run
}
set split split
```

### `run`

```text
run
```

現在の `amount`、`split`、`repeat` で第3章シミュレーションを1回評価し、試行履歴へ追加します。履歴上の1行が1つの `run` に対応します。

### `save`

```text
run
save
```

直前の `run` が作った試行IDを保存済みID一覧へ追加します。まだ `run` していない場合や、`reset results` の直後は何もしません。重複を除く処理はないため、同じ試行に対する複数回の `save` は複数件として記録されます。

DSL の `save` は「直前の試行」を保存します。画面下部の `保存` ボタンは「現在のベスト試行」を保存する別操作です。

### `show best`

```text
show best
```

現在のベスト試行を実行ログへ出力します。試行がなければ `show best -> no result` と記録します。Best Result カードは実行結果から常に描画されるため、`show best` を書かなくてもカードのベスト判定は行われます。

### `show history`

```text
show history
```

現在の試行数を `show history -> N runs` の形式で実行ログへ出力します。履歴テーブル自体は常に返された試行履歴を表示するため、この命令は表示のオン・オフではありません。

### `track best`

```text
track best
```

以降、ベスト値が更新されるたびに `best updated -> ...` を実行ログへ追加します。一度有効にすると、その実行中に無効へ戻す命令はありません。

ベスト試行そのものは `track best` の有無にかかわらず常に計算されます。`track best` が制御するのは更新ログです。

### `reset results`

```text
reset results
```

その実行内で蓄積した次の状態を消去します。

- 試行履歴
- ベスト試行
- 直前の試行

現在のパラメーター、保存済み試行ID、実行ログ、`track best` の有効状態は消去しません。したがって `reset results` 後の `run` は、直前に `set` した条件を引き続き使います。

### `repeat`

```text
repeat 3 {
  run
}
```

ブロックを繰り返します。カウントはコンパイル時に 1〜20 の範囲で検査されます。ループ変数は作りません。

現在の字句解析器は小数も数値として受理します。実行条件が整数インデックス `0, 1, 2, ... < count` であるため、たとえば `repeat 2.5` は実際には3回実行されます。意図を明確にするため、カウントには整数を使ってください。

### `for`

```text
for split in 2..8 {
  set split split
  run
}
```

許可されるループ変数は `split` と `repeat` だけです。開始値と終了値は両端を含み、現在値を1ずつ増やします。開始値は終了値以下でなければなりません。

```text
for repeat in 1..4 {
  set repeat repeat
  run
}
```

範囲の境界自体には 1〜12 や 1〜8 の制約がありません。ループ値を `set` した時点で、設定先パラメーターの範囲検査が行われます。範囲にも小数を書けますが、`2.5..4.5` は `2.5`、`3.5`、`4.5` と進み、`set split split` ではそれぞれ整数へ丸められます。通常は整数範囲を使ってください。

異なるループ変数は入れ子にできます。

```text
for split in 2..6 {
  for repeat in 1..4 {
    set split split
    set repeat repeat
    run
  }
}
```

同じ名前のループ変数を入れ子にするのは避けてください。現在の実行器は内側のループ終了時にその変数を削除し、外側の値を復元しません。

## 探索結果の計算

1回の `run` は固定レート `0.335` と「各処理単位で小数第3位以下を切り上げ」という規則で評価されます。概略は次のとおりです。

```text
理論単発値       = amount * 0.335
一括丸め単発値   = 理論単発値を小数第2位へ切り上げ
分割前の単位量   = amount / split
分割単位の値     = 分割前の単位量 * 0.335
分割丸め単位値   = 分割単位の値を小数第2位へ切り上げ
分割後の単発値   = 分割丸め単位値 * split
単発差分         = 分割後の単発値 - 一括丸め単発値
累積差分         = 単発差分 * repeat
```

履歴テーブルには `split`、`repeat`、理論値、実際値、単発差分、累積差分が表示されます。内部では主要な合計値と差分を小数第4位へ丸めています。

ベストは `cumulativeDelta`（累積差分）が最大の試行です。同値なら、履歴内で先に現れた試行が残ります。

## 実行モデル

処理は次の2段階です。

1. コンパイル: 字句解析、構文解析、命令名・対象名・ループ変数などの静的検査を行い、専用の命令オブジェクト列を作ります。
2. 実行: 命令列を先頭から同期的に解釈し、パラメーター、履歴、ベスト、ログ、保存済みIDを更新します。

画面の `実行` を押すたびに、インタプリタの履歴・ログ・ベスト・保存済みIDは新しく作られ、スクリプトを先頭から実行します。前回実行の途中から継続するものではありません。

実行時エラーが起きると、その実行は結果を返しません。画面はエラーを `Compiler Errors` 欄に表示します。エラー文には原因となった物理行の `Line N` が含まれます。

## サンプル

### `split` を総当たりする

```text
set amount 3
set repeat 3
track best

for split in 2..8 {
  set split split
  run
}

show history
show best
```

### `split` と `repeat` のグリッド探索

```text
set amount 3
track best

for split in 2..6 {
  for repeat in 1..4 {
    set split split
    set repeat repeat
    run
  }
}

show best
save
```

最後の `save` はベストではなく、ループの最後に実行された試行を保存する点に注意してください。ベストを保存したい場合は、実行後に画面の `保存` ボタンを使います。

### リセット前後を比較する

```text
set amount 3
set split 2
set repeat 2
run
show best

reset results

set split 8
run
show history
show best
```

返される履歴とベストには、`reset results` より後の試行だけが残ります。実行ログにはリセット前のログも残ります。

## エラー

コンパイラは最初に見つけたエラー1件を返します。修正して再コンパイルすると、次のエラーが表示される場合があります。

| 種類 | 例 | 主なメッセージ |
| --- | --- | --- |
| 未対応文字 | `run;` | `unexpected token ';'` |
| 未知の命令 | `execute` | `unknown command 'execute'` |
| 閉じ括弧不足 | `repeat 2 { run` | `expected '}'` |
| 未知の設定先 | `set speed 3` | `unknown parameter 'speed'` |
| スコープ外の変数 | `set split split` | `unknown variable 'split'` |
| 未対応の表示対象 | `show params` | `unknown show target 'params'` |
| 不正な追跡対象 | `track history` | `only 'track best' is supported` |
| 不正なリセット対象 | `reset best` | `only 'reset results' is supported` |
| 不正な反復数 | `repeat 21 { run }` | `repeat count must be between 1 and 20` |
| 逆順の範囲 | `for split in 8..2 { run }` | `range start must be <= range end` |
| 不正なループ変数 | `for amount in 1..3 { run }` | `loop variable must be split or repeat` |
| パラメーター範囲外 | `set split 13` | `split must be between 1 and 12` |
| 実行予算超過 | 大きな入れ子ループ | `execution limit exceeded` |

`set` の範囲外エラーと実行予算超過は実行時エラーで、それ以外の表内の例はコンパイル時に検出されます。

## 制限と注意事項

- 1回の実行で処理できる命令は最大400件です。401件目を実行しようとすると停止します。`for` や `repeat` では、ブロック命令自身と、各周回で実行される内側の各命令が数えられます。
- `for` の範囲長にはコンパイル時の上限がありません。特に空ブロックは周回ごとの命令カウントを増やさないため、極端に大きい範囲を指定するとブラウザーが長時間応答しなくなる可能性があります。小さな整数範囲を使ってください。
- スクリプトはブラウザーのメインスレッドで同期実行されます。停止ボタン、`break`、`continue`、タイムアウト機構はありません。
- `repeat` の上限は1ブロックあたり20ですが、入れ子にできるため、400命令の総上限が先に適用される場合があります。
- 空のスクリプトと空のブロックはコンパイル可能です。空のスクリプトを実行すると、試行なし・ベストなしの結果になります。
- 改行は文区切りではないため、`run show best` のように1行へ複数命令を書くことも技術上は可能です。ただし、エラー行を読みやすくするため1命令1行を推奨します。
- コメント構文はありません。`#`、`//`、`/* ... */` はエラーになります。

## 実装箇所

- DSL のサンプル、字句解析、構文解析、検証、実行器: [`static/stage_core.mjs`](../../static/stage_core.mjs)
- Search Console のエディター、ボタン操作、結果表示、本編への反映: [`static/app.js`](../../static/app.js)
- 基本的なコンパイル・実行テスト: [`test_stage_core.mjs`](../../test_stage_core.mjs)
