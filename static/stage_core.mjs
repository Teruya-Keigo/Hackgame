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
  {
    id: "4-1",
    chapter: 4,
    chapterTitle: "第4章 複合攻撃と戦略化",
    stageNumber: 1,
    stageCount: 4,
    title: "1つずつなら小さいのに、組み合わせると大きい",
    goal: "単独利用と複合利用の影響差を比較する",
    mission: ["ケースAを実行する", "ケースBを実行する", "総利得の差を比較する"],
    focus: "先に作った有利状態が次の不整合を支えること",
  },
  {
    id: "4-2",
    chapter: 4,
    chapterTitle: "第4章 複合攻撃と戦略化",
    stageNumber: 2,
    stageCount: 4,
    title: "この順番で使うと一番伸びる",
    goal: "同じ要素でも順番で結果が変わることを理解する",
    mission: ["手順候補を選ぶ", "実行して結果を見る", "最も利得の高い候補を見つける"],
    focus: "順序設計と利得内訳",
  },
  {
    id: "4-3",
    chapter: 4,
    chapterTitle: "第4章 複合攻撃と戦略化",
    stageNumber: 3,
    stageCount: 4,
    title: "制限の中で最大利益を狙え",
    goal: "手数制限内で効果的な複合手順を選ぶ",
    mission: ["手順候補を選ぶ", "制約内で実行する", "目標利得を超える"],
    focus: "残り手数と利得効率",
  },
  {
    id: "4-4",
    chapter: 4,
    chapterTitle: "第4章 複合攻撃と戦略化",
    stageNumber: 4,
    stageCount: 4,
    title: "どこを塞げば全部止まる？",
    goal: "複合攻撃の依存関係を読み、効果的な対策箇所を選ぶ",
    mission: ["対策候補を選ぶ", "防御後の利得を比較する", "有効な対策で確定する"],
    focus: "連鎖のボトルネック",
  },
  {
    id: "5-1",
    chapter: 5,
    chapterTitle: "第5章 自由実験と適応防御への橋渡し",
    stageNumber: 1,
    stageCount: 4,
    title: "攻撃を組み立ててみよう",
    goal: "用意された部品を並べて1本のシナリオを作る",
    mission: ["攻撃部品を選ぶ", "ルートに追加する", "実行ログを見る"],
    focus: "攻撃部品の組み合わせ方",
  },
  {
    id: "5-2",
    chapter: 5,
    chapterTitle: "第5章 自由実験と適応防御への橋渡し",
    stageNumber: 2,
    stageCount: 4,
    title: "どの条件なら通る？",
    goal: "条件によって成功可否や利得が変わることを確認する",
    mission: ["条件を変える", "通る条件を実行する", "止まる条件も確認する"],
    focus: "条件差と防御反応",
  },
  {
    id: "5-3",
    chapter: 5,
    chapterTitle: "第5章 自由実験と適応防御への橋渡し",
    stageNumber: 3,
    stageCount: 4,
    title: "一番通りやすく、一番得する形を探せ",
    goal: "成功率と利得の両方を見て戦略を改善する",
    mission: ["複数候補を試す", "履歴を比較する", "ベスト結果を保存する"],
    focus: "通りやすさと利得の両立",
  },
  {
    id: "5-4",
    chapter: 5,
    chapterTitle: "第5章 自由実験と適応防御への橋渡し",
    stageNumber: 4,
    stageCount: 4,
    title: "防御が動く中で通る戦略を作れ",
    goal: "防御反応を見ながら戦略を調整する",
    mission: ["防御ログを見る", "別戦略を試す", "突破できる戦略を保存する"],
    focus: "動的反応と調整",
  },
  {
    id: "6-1",
    chapter: 6,
    chapterTitle: "第6章 戦略の自動化",
    stageNumber: 1,
    stageCount: 4,
    title: "いつもの手順を保存しよう",
    goal: "手動手順を再利用可能なテンプレートとして保存する",
    mission: ["テンプレートを保存する", "保存一覧を見る", "再読込する"],
    focus: "名前付き戦略と再利用",
  },
  {
    id: "6-2",
    chapter: 6,
    chapterTitle: "第6章 戦略の自動化",
    stageNumber: 2,
    stageCount: 4,
    title: "戦略に変数を入れてみよう",
    goal: "戦略の一部をパラメータ化する",
    mission: ["変数化する項目を選ぶ", "初期値を確認する", "更新して保存する"],
    focus: "固定値と変数の違い",
  },
  {
    id: "6-3",
    chapter: 6,
    chapterTitle: "第6章 戦略の自動化",
    stageNumber: 3,
    stageCount: 4,
    title: "まとめて試して比べよう",
    goal: "複数条件へ一括適用し、結果を比較する",
    mission: ["条件セットを選ぶ", "まとめて実行する", "ベスト条件を選ぶ"],
    focus: "一括適用とランキング",
  },
  {
    id: "6-4",
    chapter: 6,
    chapterTitle: "第6章 戦略の自動化",
    stageNumber: 4,
    stageCount: 4,
    title: "条件に応じて使い分ける戦略を作れ",
    goal: "条件ごとに異なる戦略を割り当てる",
    mission: ["割り当てルールを選ぶ", "まとめて評価する", "単一戦略より高い評価を出す"],
    focus: "条件付き戦略",
  },
  {
    id: "7-1",
    chapter: 7,
    chapterTitle: "第7章 戦略探索と選択",
    stageNumber: 1,
    stageCount: 4,
    title: "候補は1つじゃない",
    goal: "複数候補を比較し最良戦略を特定する",
    mission: ["候補を確認する", "比較実行する", "最良候補を読む"],
    focus: "候補集合としての戦略",
  },
  {
    id: "7-2",
    chapter: 7,
    chapterTitle: "第7章 戦略探索と選択",
    stageNumber: 2,
    stageCount: 4,
    title: "利得最大の戦略を探せ",
    goal: "利得を評価軸に候補を探索する",
    mission: ["探索条件を設定する", "探索する", "ベスト候補を保存する"],
    focus: "候補生成と利得最大化",
  },
  {
    id: "7-3",
    chapter: 7,
    chapterTitle: "第7章 戦略探索と選択",
    stageNumber: 3,
    stageCount: 4,
    title: "利得だけで決めていい？",
    goal: "成功率や安定性を含めて採用候補を比較する",
    mission: ["評価軸を切り替える", "2軸比較する", "別の有力候補を見つける"],
    focus: "多目的比較",
  },
  {
    id: "7-4",
    chapter: 7,
    chapterTitle: "第7章 戦略探索と選択",
    stageNumber: 4,
    stageCount: 4,
    title: "この条件ならこの戦略を採用せよ",
    goal: "条件群ごとに採用戦略を選択する",
    mission: ["条件ごとの候補を見る", "採用評価する", "分割採用を保存する"],
    focus: "探索結果から採用判断へ",
  },
  {
    id: "8-1",
    chapter: 8,
    chapterTitle: "第8章 資源圧力と防御耐性",
    stageNumber: 1,
    stageCount: 4,
    title: "押し込みすぎると何が起きる？",
    goal: "行動強度がキュー、遅延、検知に与える影響を見る",
    mission: ["強度を選ぶ", "2種類以上実行する", "差を比較する"],
    focus: "資源圧力の変化",
  },
  {
    id: "8-2",
    chapter: 8,
    chapterTitle: "第8章 資源圧力と防御耐性",
    stageNumber: 2,
    stageCount: 4,
    title: "閾値を超えると防御が動く",
    goal: "検知スコアが閾値を超えると制限が発動することを確認する",
    mission: ["未発動ケースを実行する", "発動ケースを実行する", "境界を読む"],
    focus: "防御閾値",
  },
  {
    id: "8-3",
    chapter: 8,
    chapterTitle: "第8章 資源圧力と防御耐性",
    stageNumber: 3,
    stageCount: 4,
    title: "強く押すより、静かに通す",
    goal: "高負荷戦略と低ノイズ戦略を比較する",
    mission: ["高負荷を試す", "低ノイズを試す", "総合的に有利な戦略を選ぶ"],
    focus: "利得と検知リスクのトレードオフ",
  },
  {
    id: "8-4",
    chapter: 8,
    chapterTitle: "第8章 資源圧力と防御耐性",
    stageNumber: 4,
    stageCount: 4,
    title: "防御込みで最良戦略を選べ",
    goal: "防御反応込みの総合評価で採用戦略を選ぶ",
    mission: ["候補を評価する", "総合スコアを比較する", "最良戦略を保存する"],
    focus: "耐性評価",
  },
  {
    id: "9-1",
    chapter: 9,
    chapterTitle: "第9章 適応戦略と読み合い",
    stageNumber: 1,
    stageCount: 4,
    title: "同じ戦略が通らなくなる",
    goal: "繰り返しで防御側の反応が変わることを確認する",
    mission: ["同じ戦略を実行する", "もう一度実行する", "防御ログの変化を見る"],
    focus: "履歴に応じた防御変化",
  },
  {
    id: "9-2",
    chapter: 9,
    chapterTitle: "第9章 適応戦略と読み合い",
    stageNumber: 2,
    stageCount: 4,
    title: "防御の変化を読め",
    goal: "ログから防御側が何に反応しているか推測する",
    mission: ["防御ログを確認する", "仮説を選ぶ", "根拠と一緒に提出する"],
    focus: "観測から仮説へ",
  },
  {
    id: "9-3",
    chapter: 9,
    chapterTitle: "第9章 適応戦略と読み合い",
    stageNumber: 3,
    stageCount: 4,
    title: "戦略を更新して再挑戦せよ",
    goal: "仮説に基づいて戦略を変更し前後を比較する",
    mission: ["変更方針を選ぶ", "再実行する", "前回より改善する"],
    focus: "仮説に対応した更新",
  },
  {
    id: "9-4",
    chapter: 9,
    chapterTitle: "第9章 適応戦略と読み合い",
    stageNumber: 4,
    stageCount: 4,
    title: "変化する防御を相手に数ラウンドで突破せよ",
    goal: "観測、仮説、更新を複数ラウンドで回す",
    mission: ["ラウンドを進める", "仮説を更新する", "突破条件を満たす"],
    focus: "適応ループ",
  },
  {
    id: "10-1",
    chapter: 10,
    chapterTitle: "第10章 動的攻防モード",
    stageNumber: 1,
    stageCount: 4,
    title: "ここからは対戦モード",
    goal: "固定誘導が減る動的攻防モードのルールを確認する",
    mission: ["ルールを確認する", "防御側の初期方針を見る", "対戦モードを開始する"],
    focus: "観測と修正が中心になること",
  },
  {
    id: "10-2",
    chapter: 10,
    chapterTitle: "第10章 動的攻防モード",
    stageNumber: 2,
    stageCount: 4,
    title: "自分の初回攻撃計画を組め",
    goal: "GUIまたはDuel DSLで初回の攻撃計画を作成し実行する",
    mission: ["攻撃計画を作る", "必要ならDSLをコンパイルする", "初回ラウンドを完了する"],
    focus: "有効な計画と初回防御反応",
  },
  {
    id: "10-3",
    chapter: 10,
    chapterTitle: "第10章 動的攻防モード",
    stageNumber: 3,
    stageCount: 4,
    title: "防御を読んで戦略を変えろ",
    goal: "防御ログを読んで戦略を修正する",
    mission: ["防御ログを読む", "仮説メモを作る", "修正後に改善する"],
    focus: "防御反応に基づく修正",
  },
  {
    id: "10-4",
    chapter: 10,
    chapterTitle: "第10章 動的攻防モード",
    stageNumber: 4,
    stageCount: 4,
    title: "動的防御キャンペーンを突破せよ",
    goal: "複数ラウンドで戦略更新とスコア管理を統合する",
    mission: ["各ラウンドを実行する", "防御状態を見る", "目標スコアを達成する"],
    focus: "動的防御キャンペーン",
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

export const RUNTIME_VERSION = "common-runtime-2026-06-22"

const COMMON_PLAN_LIMITS = {
  maxExpandedActions: 32,
  maxEstimatedLoad: 24,
  maxEstimatedRisk: 140,
}

const SCORE_COMPONENT_KEYS = [
  "gain",
  "success",
  "stability",
  "stealth",
  "resourceEfficiency",
  "learningProgress",
]

const SCORE_PENALTY_KEYS = [
  "detectionPenalty",
  "failurePenalty",
  "retryPenalty",
  "resourcePenalty",
  "invalidPlanPenalty",
]

const SCORE_PROFILES = {
  basic: {
    profileId: "ch0_1_basic_observation",
    chapterId: "chapter0_1",
    weights: {
      gain: 0.1,
      success: 1,
      stability: 0.2,
      stealth: 0,
      resourceEfficiency: 0,
      learningProgress: 1,
      detectionPenalty: 0,
      failurePenalty: 0.2,
      retryPenalty: 0.1,
      resourcePenalty: 0,
      invalidPlanPenalty: 0,
    },
    normalization: { min: 0, max: 100 },
    gradeThresholds: { S: 90, A: 75, B: 60, C: 40 },
  },
  state: {
    profileId: "ch2_state_consistency",
    chapterId: "chapter2",
    weights: {
      gain: 0.4,
      success: 0.8,
      stability: 0.5,
      stealth: 0,
      resourceEfficiency: 0,
      learningProgress: 1,
      detectionPenalty: 0,
      failurePenalty: 0.4,
      retryPenalty: 0.2,
      resourcePenalty: 0,
      invalidPlanPenalty: 0,
    },
    normalization: { min: 0, max: 100 },
    gradeThresholds: { S: 90, A: 75, B: 60, C: 40 },
  },
  search: {
    profileId: "ch3_rounding_search",
    chapterId: "chapter3",
    weights: {
      gain: 1,
      success: 0.5,
      stability: 0.2,
      stealth: 0,
      resourceEfficiency: 0.2,
      learningProgress: 0.6,
      detectionPenalty: 0,
      failurePenalty: 0.2,
      retryPenalty: 0.1,
      resourcePenalty: 0,
      invalidPlanPenalty: 0.3,
    },
    normalization: { min: 0, max: 100 },
    gradeThresholds: { S: 90, A: 75, B: 60, C: 40 },
  },
  strategy: {
    profileId: "ch4_7_strategy_comparison",
    chapterId: "chapter4_7",
    weights: {
      gain: 1,
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
    gradeThresholds: { S: 90, A: 75, B: 60, C: 40 },
  },
  resource: {
    profileId: "ch8_resource_resilience",
    chapterId: "chapter8",
    weights: {
      gain: 0.8,
      success: 0.8,
      stability: 0.7,
      stealth: 0.8,
      resourceEfficiency: 1,
      learningProgress: 0.5,
      detectionPenalty: 0.9,
      failurePenalty: 0.4,
      retryPenalty: 0.2,
      resourcePenalty: 1,
      invalidPlanPenalty: 0.5,
    },
    normalization: { min: 0, max: 100 },
    gradeThresholds: { S: 90, A: 75, B: 60, C: 40 },
  },
  dynamic: {
    profileId: "ch9_10_dynamic_adaptation",
    chapterId: "chapter9_10",
    weights: {
      gain: 1,
      success: 0.9,
      stability: 0.8,
      stealth: 0.9,
      resourceEfficiency: 0.8,
      learningProgress: 0.7,
      detectionPenalty: 1,
      failurePenalty: 0.6,
      retryPenalty: 0.3,
      resourcePenalty: 0.8,
      invalidPlanPenalty: 0.7,
    },
    normalization: { min: 0, max: 100 },
    gradeThresholds: { S: 90, A: 75, B: 60, C: 40 },
  },
}

function runtimeChapterId(chapter) {
  return `chapter${chapter}`
}

function scoreProfileKeyForChapter(chapter) {
  if (chapter <= 1) return "basic"
  if (chapter === 2) return "state"
  if (chapter === 3) return "search"
  if (chapter >= 4 && chapter <= 7) return "strategy"
  if (chapter === 8) return "resource"
  return "dynamic"
}

export function getScoreProfileForStage(stageId) {
  const meta = stageMeta(stageId)
  if (!meta) throw new Error(`unknown score profile stage: ${stageId}`)
  return clone(SCORE_PROFILES[scoreProfileKeyForChapter(meta.chapter)])
}

function emptyScoreComponents() {
  return Object.fromEntries(SCORE_COMPONENT_KEYS.map((key) => [key, 0]))
}

function emptyScorePenalties() {
  return Object.fromEntries(SCORE_PENALTY_KEYS.map((key) => [key, 0]))
}

function runtimeEventId(stageId, stepIndex, eventType) {
  return `${stageId}:${String(stepIndex).padStart(4, "0")}:${String(eventType).replace(/[^a-z0-9_.-]/gi, "_")}`
}

function normalizeDiagnostic(input = {}) {
  return {
    id: input.id || `diag:${input.category || "RuntimeError"}:${input.source?.line || 0}:${input.message || "diagnostic"}`,
    severity: input.severity || "error",
    category: input.category || "RuntimeError",
    message: input.message || "Runtime diagnostic",
    detail: input.detail || "",
    source: input.source || { sourceType: "runtime" },
    fixHint: input.fixHint || "",
  }
}

export function createGameEvent(input = {}, runtimeState = null) {
  const stageId = input.stageId || runtimeState?.stageId || "unknown-stage"
  const meta = stageMeta(stageId)
  const stepIndex = Number.isInteger(input.stepIndex)
    ? input.stepIndex
    : (runtimeState?.historyState?.events?.length || 0) + 1
  const eventType = input.eventType || "runtime.event"
  const result = input.result || "normal"
  const severity =
    input.severity ||
    (result === "abnormal" || result === "blocked" || result === "failure" ? "warning" : "info")
  return {
    id: input.id || runtimeEventId(stageId, stepIndex, eventType),
    chapterId: input.chapterId || runtimeState?.chapterId || runtimeChapterId(meta?.chapter ?? 0),
    stageId,
    screenId: input.screenId || runtimeState?.screenId || undefined,
    roundId: input.roundId || undefined,
    campaignId: input.campaignId || undefined,
    timestamp: Number.isFinite(input.timestamp) ? input.timestamp : stepIndex,
    stepIndex,
    actor: input.actor || "runtime",
    eventType,
    targetId: input.targetId || undefined,
    correlationId: input.correlationId || undefined,
    parentEventId: input.parentEventId || undefined,
    before: input.before || undefined,
    after: input.after || undefined,
    result,
    severity,
    message: input.message || "",
    tags: Array.isArray(input.tags) ? [...input.tags] : [],
    metadata: input.metadata || {},
  }
}

export function createInitialRuntimeState(stageId, extra = {}) {
  const meta = stageMeta(stageId)
  if (!meta) throw new Error(`unknown runtime stage: ${stageId}`)
  return {
    runtimeVersion: RUNTIME_VERSION,
    chapterId: runtimeChapterId(meta.chapter),
    stageId,
    screenId: extra.screenId || stageId,
    stageStatus: extra.stageStatus || "ready",
    domainState: {
      orders: {},
      balances: {},
      refunds: {},
      numeric: {},
      resources: {
        capacity: 10,
        usedCapacity: 0,
        queueLength: 0,
        averageLatency: 0,
        virtualLoad: 0,
        rateLimitActive: false,
      },
      defense: {
        alertLevel: 1,
        detectionScore: 0,
        blocked: false,
        activeRules: [],
      },
      strategies: {
        templates: {},
        strategyHistory: [],
      },
      custom: {},
      ...(extra.domainState || {}),
    },
    uiState: {
      selectedIds: [],
      actionAvailability: {},
      hintLevel: 0,
      highlightedTargets: [],
      formDrafts: {},
      ...(extra.uiState || {}),
    },
    historyState: {
      events: [],
      trials: [],
      plans: [],
      scoreHistory: [],
      diagnostics: [],
      ...(extra.historyState || {}),
    },
    planSelection: {
      activePlanSource: "gui",
      staleSources: [],
      ...(extra.planSelection || {}),
    },
    activePlan: extra.activePlan || null,
    score: extra.score || null,
    diagnostics: extra.diagnostics || [],
  }
}

function planValue(rawValue) {
  if (rawValue && typeof rawValue === "object" && "type" in rawValue) return rawValue
  if (typeof rawValue === "number") return { type: "number", value: rawValue }
  if (typeof rawValue === "boolean") return { type: "boolean", value: rawValue }
  if (typeof rawValue === "string") return { type: "string", value: rawValue }
  if (rawValue && typeof rawValue === "object" && "ref" in rawValue) {
    return { type: "observationRef", path: rawValue.ref }
  }
  return { type: "string", value: String(rawValue ?? "") }
}

function unwrapPlanValue(value) {
  if (!value || typeof value !== "object" || !("type" in value)) return value
  if (value.type === "range") return `${value.from}..${value.to}`
  if (value.type === "observationRef") return value.path
  return value.value
}

function normalizePlanAction(action, index = 0) {
  const actionId = action.actionId || action.type || action.actionType || `action-${index + 1}`
  const actionType = action.actionType || action.type || actionId
  const params = Object.fromEntries(
    Object.entries(action.params || {}).map(([key, value]) => [key, planValue(value)])
  )
  return {
    actionId,
    actionType,
    type: actionType,
    label: action.label || actionId,
    params,
    estimatedCost: Number(action.estimatedCost || action.estimatedTotalCost || 0),
    estimatedLoad: Number(action.estimatedLoad || action.estimatedTotalLoad || 0),
    estimatedRisk: Number(action.estimatedRisk ?? action.risk ?? 0),
    risk: Number(action.risk ?? action.estimatedRisk ?? 0),
    gain: Number(action.gain || 0),
    tags: Array.isArray(action.tags) ? [...action.tags] : [],
    preconditions: action.preconditions || [],
    effects: action.effects || [],
    line: action.line || 0,
  }
}

function createPlanIR(input = {}) {
  const now = Number.isFinite(input.now) ? input.now : 0
  const actions = (input.actions || []).map((action, index) => normalizePlanAction(action, index))
  const estimatedTotalCost = actions.reduce((sum, action) => sum + action.estimatedCost, 0)
  const estimatedTotalLoad = actions.reduce((sum, action) => sum + action.estimatedLoad, 0)
  const estimatedDetectionRisk = actions.reduce((sum, action) => sum + Math.max(0, action.estimatedRisk), 0)
  const riskTags = [...new Set(actions.flatMap((action) => action.tags))]
  const metadata = {
    estimatedTotalCost,
    estimatedTotalLoad,
    estimatedDetectionRisk,
    usesObservation: Boolean(input.metadata?.usesObservation),
    usesLoop: Boolean(input.metadata?.usesLoop),
    usesBranch: Boolean(input.metadata?.usesBranch),
    usesTemplate: Boolean(input.metadata?.usesTemplate),
    maxExpandedActions: actions.length,
    riskTags,
    strategyTags: riskTags.filter((tag) => tag !== "resource"),
    ...(input.metadata || {}),
    // Compatibility aliases for the existing stage runtime.
    estimatedLoad: estimatedTotalLoad,
    estimatedRisk: estimatedDetectionRisk,
    estimatedGain: actions.reduce((sum, action) => sum + action.gain, 0),
  }
  return {
    irVersion: "plan-ir-1",
    planId: input.planId || "plan",
    displayName: input.displayName || input.planId || "Plan",
    source: input.source || { sourceType: "system" },
    chapterId: input.chapterId || undefined,
    stageId: input.stageId || undefined,
    parameters: Object.fromEntries(
      Object.entries(input.parameters || {}).map(([key, value]) => [key, planValue(value)])
    ),
    actions,
    metadata,
    validation: input.validation || { status: "unchecked", diagnostics: [] },
    createdAt: Number.isFinite(input.createdAt) ? input.createdAt : now,
    updatedAt: Number.isFinite(input.updatedAt) ? input.updatedAt : now,
  }
}

export function validatePlanIR(plan, runtimeState = null, limits = COMMON_PLAN_LIMITS) {
  const diagnostics = []
  const actions = Array.isArray(plan?.actions) ? plan.actions : []
  if (!plan || typeof plan !== "object") {
    diagnostics.push(normalizeDiagnostic({ category: "VerificationError", message: "PlanIR is missing" }))
  }
  if (!actions.length) {
    diagnostics.push(normalizeDiagnostic({ category: "VerificationError", message: "PlanIR must contain at least one action" }))
  }
  if (actions.length > limits.maxExpandedActions) {
    diagnostics.push(
      normalizeDiagnostic({
        category: "VerificationError",
        message: "PlanIR expanded action count exceeds the limit",
        detail: `${actions.length} > ${limits.maxExpandedActions}`,
      })
    )
  }
  const estimatedLoad = plan?.metadata?.estimatedTotalLoad ?? plan?.metadata?.estimatedLoad ?? 0
  const estimatedRisk = plan?.metadata?.estimatedDetectionRisk ?? plan?.metadata?.estimatedRisk ?? 0
  if (estimatedLoad > limits.maxEstimatedLoad) {
    diagnostics.push(
      normalizeDiagnostic({
        category: "VerificationError",
        message: "PlanIR estimated load exceeds the stage budget",
        detail: `${estimatedLoad} > ${limits.maxEstimatedLoad}`,
      })
    )
  }
  if (estimatedRisk > limits.maxEstimatedRisk) {
    diagnostics.push(
      normalizeDiagnostic({
        severity: "warning",
        category: "VerificationError",
        message: "PlanIR estimated detection risk is high",
        detail: `${estimatedRisk} > ${limits.maxEstimatedRisk}`,
      })
    )
  }
  for (const action of actions) {
    const actionId = action.actionId || action.type
    if (!DUEL_ACTIONS[actionId] && !["run", "strategy_apply", "batch_run", "search_trial"].includes(actionId)) {
      diagnostics.push(
        normalizeDiagnostic({
          category: "SemanticError",
          message: `Unknown action '${actionId}' is not allowed`,
          source: { sourceType: plan?.source?.sourceType || "runtime", actionId },
        })
      )
    }
    for (const [paramName, param] of Object.entries(action.params || {})) {
      if (!param || typeof param !== "object" || !("type" in param)) {
        diagnostics.push(
          normalizeDiagnostic({
            category: "TypeError",
            message: `Parameter '${paramName}' is not a typed PlanValue`,
            source: { sourceType: plan?.source?.sourceType || "runtime", actionId, field: paramName },
          })
        )
      }
    }
  }
  const hasBlockingDiagnostic = diagnostics.some((diagnostic) => diagnostic.severity === "error" || diagnostic.severity === "fatal")
  return {
    status: hasBlockingDiagnostic ? "invalid" : "valid",
    checkedAt: (runtimeState?.historyState?.events?.length || 0) + 1,
    diagnostics,
  }
}

export function resolveActivePlan(planSelection = {}) {
  const activePlanSource = planSelection.activePlanSource || "gui"
  const plan = planSelection[`${activePlanSource}Plan`]
  const staleSources = new Set(planSelection.staleSources || [])
  const diagnostics = []
  if (!plan) {
    diagnostics.push(
      normalizeDiagnostic({
        category: "VerificationError",
        message: `No ${activePlanSource} PlanIR is available`,
        source: { sourceType: activePlanSource },
      })
    )
  }
  if (staleSources.has(activePlanSource)) {
    diagnostics.push(
      normalizeDiagnostic({
        category: "VerificationError",
        message: `${activePlanSource} PlanIR is stale`,
        source: { sourceType: activePlanSource },
      })
    )
  }
  return {
    activePlanSource,
    plan: diagnostics.length ? null : plan,
    diagnostics,
  }
}

export function reduceEvents(state, events = []) {
  const next = clone(state || createInitialRuntimeState("0-1"))
  const incomingEvents = events.map((item, index) =>
    item.id && item.eventType ? item : createGameEvent({ ...item, stepIndex: (next.historyState.events.length || 0) + index + 1 }, next)
  )
  next.historyState.events.push(...incomingEvents)

  for (const item of incomingEvents) {
    if (item.eventType === "stage.completed") next.stageStatus = "completed"
    if (item.eventType === "stage.failed") next.stageStatus = "failed"
    if (item.eventType === "plan.validation.failed") next.stageStatus = "retryReady"
    if (item.eventType === "plan.compiled" || item.eventType === "plan.created") {
      if (item.metadata?.plan) next.historyState.plans.push(item.metadata.plan)
      next.stageStatus = "planning"
    }
    if (item.eventType === "strategy.executed" || item.eventType === "search.trial.completed") {
      next.stageStatus = "resolved"
      if (item.metadata?.trial) next.historyState.trials.push(item.metadata.trial)
    }
    if (item.eventType === "score.updated" && item.metadata?.score) {
      next.score = item.metadata.score
      next.historyState.scoreHistory.push(item.metadata.score)
    }
    if (item.eventType === "resource.load.updated" || item.eventType === "resource.queue.updated" || item.eventType === "resource.latency.updated") {
      next.domainState.resources = {
        ...(next.domainState.resources || {}),
        ...(item.after || {}),
      }
    }
    if (item.eventType.startsWith("defense.")) {
      next.domainState.defense = {
        ...(next.domainState.defense || {}),
        ...(item.after || {}),
      }
    }
    if (item.eventType.startsWith("refund.") && item.targetId) {
      next.domainState.refunds[item.targetId] = {
        ...(next.domainState.refunds[item.targetId] || { orderId: item.targetId, refundCount: 0, totalRefundAmount: 0, refundedSteps: [], isDuplicate: false }),
        ...(item.after || {}),
      }
    }
    if (item.eventType.startsWith("rounding.") || item.eventType.startsWith("split.")) {
      next.domainState.numeric = {
        ...(next.domainState.numeric || {}),
        ...(item.after || {}),
      }
    }
    if (item.eventType === "plan.validation.failed" && item.metadata?.diagnostics) {
      const diagnostics = item.metadata.diagnostics.map((diagnostic) => normalizeDiagnostic(diagnostic))
      next.diagnostics.push(...diagnostics)
      next.historyState.diagnostics.push(...diagnostics)
    }
  }
  return next
}

function gradeForNormalizedScore(value, thresholds = { S: 90, A: 75, B: 60, C: 40 }) {
  if (value >= thresholds.S) return "S"
  if (value >= thresholds.A) return "A"
  if (value >= thresholds.B) return "B"
  if (value >= thresholds.C) return "C"
  return "D"
}

export function calculateScore(events = [], runtimeState = null, scoreProfile = null) {
  const profile = scoreProfile || getScoreProfileForStage(runtimeState?.stageId || "0-1")
  const components = emptyScoreComponents()
  const penalties = emptyScorePenalties()

  for (const item of events) {
    const metadata = item.metadata || {}
    const gain = Number(metadata.gain ?? metadata.scoreDelta ?? 0)
    const detection = Number(metadata.detection ?? metadata.detectionScore ?? 0)
    const queue = Number(metadata.queue ?? 0)
    const latency = Number(metadata.latency ?? 0)
    components.gain += Math.max(0, gain)
    if (item.result === "success" || metadata.success === true) components.success += 25
    if (item.result === "normal") components.stability += 8
    if (item.tags?.includes("stealth") || metadata.stealth === true) components.stealth += 12
    if (queue || latency) components.resourceEfficiency += Math.max(0, 20 - queue * 2 - latency / 60)
    if (item.eventType === "hint.unlocked" || item.eventType === "feedback.shown" || item.eventType === "stage.completed") {
      components.learningProgress += 15
    }
    if (item.result === "blocked" || item.eventType === "defense.blocked" || item.eventType === "defense.rate_limited") {
      penalties.failurePenalty += 12
    }
    if (item.eventType === "plan.validation.failed") {
      penalties.invalidPlanPenalty += 25
    }
    penalties.detectionPenalty += Math.max(0, detection / 3)
    penalties.resourcePenalty += Math.max(0, queue + latency / 120)
  }

  const total =
    SCORE_COMPONENT_KEYS.reduce((sum, key) => sum + components[key] * profile.weights[key], 0) -
    SCORE_PENALTY_KEYS.reduce((sum, key) => sum + penalties[key] * profile.weights[key], 0)
  const min = profile.normalization.min
  const max = profile.normalization.max
  const normalizedTotal = clamp(((total - min) / (max - min)) * 100, 0, 100)
  const score = {
    scoreId: `${runtimeState?.stageId || "stage"}:score:${(runtimeState?.historyState?.scoreHistory?.length || 0) + 1}`,
    chapterId: runtimeState?.chapterId || profile.chapterId,
    stageId: runtimeState?.stageId || "",
    profileId: profile.profileId,
    components: Object.fromEntries(Object.entries(components).map(([key, value]) => [key, roundTo(value, 3)])),
    penalties: Object.fromEntries(Object.entries(penalties).map(([key, value]) => [key, roundTo(value, 3)])),
    total: roundTo(total, 3),
    normalizedTotal: roundTo(normalizedTotal, 3),
    grade: gradeForNormalizedScore(normalizedTotal, profile.gradeThresholds),
    sourceEventIds: events.map((item) => item.id),
    explanation: `profile ${profile.profileId}: ${roundTo(normalizedTotal, 1)} / 100`,
  }
  return score
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

const DUEL_ACTIONS = {
  sequence_shift: {
    label: "順序シフト",
    tags: ["sequence"],
    estimatedCost: 3,
    estimatedLoad: 2,
    risk: 18,
    gain: 7,
    params: {
      delay: { type: "number", min: 1, max: 5, defaultValue: 2 },
    },
  },
  refund_probe: {
    label: "返金プローブ",
    tags: ["state"],
    estimatedCost: 2,
    estimatedLoad: 2,
    risk: 16,
    gain: 6,
    params: {
      mode: { type: "string", values: ["safe", "aggressive"], defaultValue: "safe" },
    },
  },
  rounding_split: {
    label: "分割丸め",
    tags: ["numeric"],
    estimatedCost: 2,
    estimatedLoad: 1,
    risk: 10,
    gain: 5,
    params: {
      split: { type: "number", min: 2, max: 8, defaultValue: 4 },
    },
  },
  low_noise_probe: {
    label: "低ノイズ確認",
    tags: ["stealth", "resource"],
    estimatedCost: 2,
    estimatedLoad: 1,
    risk: 6,
    gain: 4,
    params: {
      intensity: { type: "number", min: 1, max: 3, defaultValue: 1 },
    },
  },
  profit_route: {
    label: "利得ルート",
    tags: ["numeric", "sequence"],
    estimatedCost: 4,
    estimatedLoad: 3,
    risk: 22,
    gain: 9,
    params: {
      split: { type: "number", min: 2, max: 8, defaultValue: 4 },
    },
  },
  resource_probe: {
    label: "資源プローブ",
    tags: ["resource"],
    estimatedCost: 2,
    estimatedLoad: 3,
    risk: 20,
    gain: 5,
    params: {
      intensity: { type: "number", min: 1, max: 3, defaultValue: 2 },
    },
  },
  wait_interval: {
    label: "間隔調整",
    tags: ["stealth"],
    estimatedCost: 1,
    estimatedLoad: 0,
    risk: -8,
    gain: 1,
    params: {
      ticks: { type: "number", min: 1, max: 5, defaultValue: 2 },
    },
  },
  defense_read: {
    label: "防御観測",
    tags: ["observe"],
    estimatedCost: 1,
    estimatedLoad: 0,
    risk: -4,
    gain: 2,
    params: {
      detail: { type: "string", values: ["summary", "score", "reason"], defaultValue: "summary" },
    },
  },
  template_switch: {
    label: "テンプレート切替",
    tags: ["strategy"],
    estimatedCost: 2,
    estimatedLoad: 1,
    risk: 4,
    gain: 5,
    params: {
      variant: { type: "string", values: ["quiet", "balanced", "profit"], defaultValue: "balanced" },
    },
  },
}

const DUEL_OBSERVATIONS = new Set([
  "defense.alert_level",
  "defense.rate_limit",
  "round.last_block_reason",
  "round.score_delta",
  "resource.queue",
  "score.current",
])

const DUEL_COMPILER_LIMITS = {
  maxStatements: 120,
  maxLoopIterations: 12,
  maxExpandedActions: 32,
  maxVirtualLoad: 24,
  maxRoundActions: 16,
}

const DUEL_SCRIPT_SAMPLE =
  'plan first_probe:\n  use sequence_shift delay=2\n  use refund_probe mode="safe"\n  use low_noise_probe intensity=1\n  run'

const ADVANCED_STAGE_DEFINITIONS = {
  "4-1": {
    controlTitle: "ケース比較",
    controlCaption: "ケースAとBを両方実行して、最後に比較します。",
    optionLabel: "固定ケース",
    primaryLabel: "ケースを実行",
    secondaryLabel: "比較する",
    successMode: "runRequiredAndCompare",
    requiredOptionIds: ["solo_shift", "chain_refund"],
    options: [
      {
        id: "solo_shift",
        label: "ケースA: 順序のズレのみ",
        steps: ["受付順を固定", "処理直前に順序がズレる"],
        gain: 8,
        detection: 18,
        successRate: 0.8,
        summary: "順序差だけで小さな利得が出ます。",
      },
      {
        id: "chain_refund",
        label: "ケースB: 順序のズレ + 二重返金",
        steps: ["順序差で有利状態を作る", "返金直後に再参照が起きる", "同じ注文に二度目の返金"],
        gain: 23,
        detection: 36,
        successRate: 0.72,
        summary: "最初の有利状態が次の不整合を支え、総利得が伸びます。",
      },
    ],
  },
  "4-2": {
    controlTitle: "手順候補",
    controlCaption: "同じ要素でも、順番が違うと結果が変わります。",
    optionLabel: "ルート",
    primaryLabel: "実行する",
    successMode: "bestOption",
    bestOptionId: "route_b",
    targetScore: 18,
    options: [
      { id: "route_a", label: "A: 返金を先に狙う", steps: ["返金誘発", "順序操作"], gain: 12, detection: 32, successRate: 0.55, summary: "有利状態がまだ弱く、後続が伸びません。" },
      { id: "route_b", label: "B: 順序差から返金へつなぐ", steps: ["順序操作", "返金再参照", "差分確定"], gain: 22, detection: 34, successRate: 0.74, summary: "先に作った順序差が返金不整合の足場になります。" },
      { id: "route_c", label: "C: 数値差分を挟む", steps: ["数値分割", "順序操作", "返金誘発"], gain: 16, detection: 29, successRate: 0.62, summary: "安定しますが最大利得には届きません。" },
    ],
  },
  "4-3": {
    controlTitle: "制約内の戦略",
    controlCaption: "3手以内で目標利得 20 を超える候補を探します。",
    optionLabel: "候補",
    primaryLabel: "実行する",
    successMode: "targetScore",
    targetScore: 20,
    options: [
      { id: "all_parts", label: "全部使う", steps: ["順序操作", "返金誘発", "数値差分", "追加確認"], stepCount: 4, gain: 21, detection: 45, successRate: 0.5, blocked: true, summary: "利得は高いものの手数上限を超えます。" },
      { id: "efficient_chain", label: "効く2手に絞る", steps: ["順序操作", "返金再参照"], stepCount: 2, gain: 24, detection: 31, successRate: 0.75, summary: "制約内で最も利得効率が高い構成です。" },
      { id: "numeric_only", label: "数値差分中心", steps: ["分割丸め", "反復"], stepCount: 2, gain: 11, detection: 14, successRate: 0.86, summary: "安定しますが今回の目標には足りません。" },
    ],
  },
  "4-4": {
    controlTitle: "対策候補",
    controlCaption: "攻撃連鎖のどこを塞ぐと全体が止まるかを比べます。",
    optionLabel: "防御",
    primaryLabel: "比較する",
    secondaryLabel: "この対策で確定",
    successMode: "confirmBest",
    bestOptionId: "refund_guard",
    targetScore: 8,
    options: [
      { id: "rate_limit_only", label: "表面レート制限", steps: ["行動量だけを制限"], gain: 17, afterGain: 17, detection: 20, successRate: 0.58, summary: "一部の圧力は下がりますが連鎖は残ります。" },
      { id: "refund_guard", label: "返金済み判定を必須化", steps: ["返金済みフラグを検査", "再参照時に二度目の返金を拒否"], gain: 5, afterGain: 5, detection: 8, successRate: 0.92, summary: "連鎖の中心を止め、総利得を目標以下に抑えます。" },
      { id: "log_only", label: "ログ監視のみ", steps: ["異常ログを増やす"], gain: 21, afterGain: 21, detection: 28, successRate: 0.45, summary: "見つけやすくはなりますが成立自体は止まりません。" },
    ],
  },
  "5-1": {
    controlTitle: "Attack Builder",
    controlCaption: "部品を1つ以上追加して実行します。",
    optionLabel: "攻撃部品",
    primaryLabel: "部品を追加",
    secondaryLabel: "実行する",
    successMode: "builderRun",
    options: [
      { id: "part_shift", label: "順序操作", steps: ["処理直前の順序差を作る"], gain: 7, detection: 15, successRate: 0.8, summary: "後続手順の足場になります。" },
      { id: "part_refund", label: "返金再参照", steps: ["返金直後の再参照を見る"], gain: 9, detection: 22, successRate: 0.63, summary: "状態不整合を狙う部品です。" },
      { id: "part_rounding", label: "分割丸め", steps: ["分割処理で小さな差を積む"], gain: 5, detection: 8, successRate: 0.9, summary: "低リスクな利得部品です。" },
    ],
  },
  "5-2": {
    controlTitle: "条件調整",
    controlCaption: "同じルートで、通る条件と止まる条件を両方確認します。",
    optionLabel: "条件",
    primaryLabel: "条件で実行",
    successMode: "passAndBlock",
    options: [
      { id: "quiet_condition", label: "低強度・間隔あり", steps: ["強度1", "間隔2"], gain: 13, detection: 18, blocked: false, successRate: 0.84, summary: "防御反応は弱く、ルートが通ります。" },
      { id: "burst_condition", label: "高強度・連続実行", steps: ["強度3", "間隔0"], gain: 7, detection: 72, blocked: true, successRate: 0.24, summary: "検知閾値を超え、制限で利得が落ちます。" },
      { id: "middle_condition", label: "中強度・短い間隔", steps: ["強度2", "間隔1"], gain: 15, detection: 42, blocked: false, successRate: 0.66, summary: "通りますが検知スコアは上がります。" },
    ],
  },
  "5-3": {
    controlTitle: "最適化候補",
    controlCaption: "履歴を見ながら、通りやすく得な候補を保存します。",
    optionLabel: "候補",
    primaryLabel: "実験する",
    secondaryLabel: "ベストを保存",
    successMode: "saveBest",
    bestOptionId: "balanced_best",
    options: [
      { id: "profit_greedy", label: "利得重視", steps: ["高利得ルート", "短い間隔"], gain: 24, detection: 74, blocked: true, successRate: 0.32, summary: "止められやすく、総合評価は伸びません。" },
      { id: "safe_low", label: "安全重視", steps: ["低ノイズ", "丸め差分"], gain: 12, detection: 12, successRate: 0.9, summary: "通りやすい一方、利得は控えめです。" },
      { id: "balanced_best", label: "バランス型", steps: ["順序差", "低ノイズ間隔", "分割丸め"], gain: 21, detection: 33, successRate: 0.78, summary: "利得と成功率のバランスが最も良い候補です。" },
    ],
  },
  "5-4": {
    controlTitle: "動的防御下の実験",
    controlCaption: "防御ログを見ながら突破できる戦略を見つけます。",
    optionLabel: "戦略",
    primaryLabel: "実行する",
    secondaryLabel: "保存する",
    successMode: "saveBest",
    bestOptionId: "adaptive_quiet",
    options: [
      { id: "repeat_burst", label: "同じ高強度を繰り返す", steps: ["高強度", "連続実行"], gain: 6, detection: 80, blocked: true, successRate: 0.18, summary: "防御ログに繰り返し傾向が出ます。" },
      { id: "adaptive_quiet", label: "間隔を空けて低ノイズ化", steps: ["観測", "間隔調整", "低ノイズ実行"], gain: 19, detection: 29, successRate: 0.8, summary: "防御反応を見て通し方を調整しています。" },
      { id: "numeric_cover", label: "数値差分で薄く積む", steps: ["分割丸め", "低反復"], gain: 14, detection: 16, successRate: 0.87, summary: "安定していますが突破条件には少し足りません。" },
    ],
  },
  "6-1": {
    controlTitle: "Template Save",
    controlCaption: "固定手順をテンプレートとして保存し、再読込します。",
    optionLabel: "テンプレート",
    primaryLabel: "テンプレート保存",
    secondaryLabel: "読み込む",
    successMode: "saveAndLoad",
    options: [
      { id: "starter_template", label: "quiet-chain", steps: ["順序差", "低ノイズ", "分割丸め"], gain: 18, detection: 28, successRate: 0.78, summary: "第5章で作ったような手順を保存します。" },
    ],
  },
  "6-2": {
    controlTitle: "Parameter Mapping",
    controlCaption: "戦略の一部を変数化して保存します。",
    optionLabel: "変数化する項目",
    primaryLabel: "変数化して保存",
    successMode: "singleActionSuccess",
    options: [
      { id: "param_delay", label: "delay を変数化", steps: ["delay in 1..5", "default 2"], gain: 18, detection: 26, successRate: 0.8, summary: "間隔を条件ごとに変えられるようになります。" },
      { id: "param_split", label: "split を変数化", steps: ["split in 2..8", "default 4"], gain: 17, detection: 22, successRate: 0.84, summary: "分割数を条件ごとに変えられるようになります。" },
    ],
  },
  "6-3": {
    controlTitle: "Batch Run",
    controlCaption: "条件セットをまとめて実行してランキング化します。",
    optionLabel: "条件セット",
    primaryLabel: "まとめて実行",
    secondaryLabel: "ベストを選ぶ",
    successMode: "batchBest",
    bestOptionId: "condition_balanced",
    options: [
      { id: "condition_fast", label: "fast: delay 1 / split 3", steps: ["delay 1", "split 3"], gain: 18, detection: 50, successRate: 0.55, summary: "速いが検知されやすい条件です。" },
      { id: "condition_balanced", label: "balanced: delay 2 / split 5", steps: ["delay 2", "split 5"], gain: 22, detection: 32, successRate: 0.78, summary: "利得と通過率のバランスが高い条件です。" },
      { id: "condition_safe", label: "safe: delay 4 / split 4", steps: ["delay 4", "split 4"], gain: 15, detection: 12, successRate: 0.92, summary: "安定しますが最大評価ではありません。" },
    ],
  },
  "6-4": {
    controlTitle: "Rule Builder",
    controlCaption: "条件に応じた使い分けルールを評価します。",
    optionLabel: "割り当て",
    primaryLabel: "まとめて評価",
    secondaryLabel: "保存する",
    successMode: "saveBest",
    bestOptionId: "adaptive_assignment",
    options: [
      { id: "single_profit", label: "全条件で利得重視", steps: ["profit_route を固定"], gain: 20, detection: 64, successRate: 0.42, summary: "一部条件で止まりやすくなります。" },
      { id: "single_safe", label: "全条件で安全重視", steps: ["low_noise を固定"], gain: 14, detection: 12, successRate: 0.9, summary: "安定しますが伸びが小さいです。" },
      { id: "adaptive_assignment", label: "条件ごとに切替", steps: ["高圧条件は low_noise", "余裕条件は profit_route"], gain: 25, detection: 28, successRate: 0.82, summary: "条件差を使い分け、単一戦略より高い総評価です。" },
    ],
  },
  "7-1": {
    controlTitle: "Candidate Compare",
    controlCaption: "候補を並べ、利得で比較します。",
    optionLabel: "候補",
    primaryLabel: "比較実行",
    successMode: "compareAll",
    bestOptionId: "candidate_b",
    options: [
      { id: "candidate_a", label: "候補A", steps: ["安全寄り"], gain: 14, detection: 12, successRate: 0.88, summary: "安定しています。" },
      { id: "candidate_b", label: "候補B", steps: ["複合ルート"], gain: 24, detection: 35, successRate: 0.72, summary: "今回の条件では利得最大です。" },
      { id: "candidate_c", label: "候補C", steps: ["数値差分中心"], gain: 17, detection: 16, successRate: 0.86, summary: "中間的な候補です。" },
    ],
  },
  "7-2": {
    controlTitle: "Search Panel",
    controlCaption: "利得最大を目的に候補を生成します。",
    optionLabel: "探索条件",
    primaryLabel: "探索する",
    secondaryLabel: "ベストを保存",
    successMode: "searchAndSave",
    bestOptionId: "search_profit",
    options: [
      { id: "search_small", label: "候補数3", steps: ["狭い範囲"], gain: 18, detection: 22, successRate: 0.78, summary: "探索範囲が狭めです。" },
      { id: "search_profit", label: "候補数6 / 利得優先", steps: ["split 2..6", "delay 1..3"], gain: 28, detection: 44, successRate: 0.64, summary: "利得最大候補を見つけます。" },
      { id: "search_safe", label: "候補数6 / 安全寄り", steps: ["delay 3..5"], gain: 19, detection: 14, successRate: 0.9, summary: "安定候補が多くなります。" },
    ],
  },
  "7-3": {
    controlTitle: "Score Function",
    controlCaption: "利得だけでなく安定性も含めて比較します。",
    optionLabel: "評価軸",
    primaryLabel: "2軸比較",
    successMode: "multiAxis",
    bestOptionId: "stable_candidate",
    options: [
      { id: "profit_candidate", label: "利得最大候補", steps: ["gain を重視"], gain: 30, detection: 68, successRate: 0.38, summary: "儲かりますが止まりやすい候補です。" },
      { id: "stable_candidate", label: "安定候補", steps: ["successRate を重視"], gain: 21, detection: 22, successRate: 0.86, summary: "総合採用ではこちらが有力です。" },
      { id: "middle_candidate", label: "中間候補", steps: ["均等重み"], gain: 24, detection: 38, successRate: 0.7, summary: "バランス型の比較対象です。" },
    ],
  },
  "7-4": {
    controlTitle: "Adoption Board",
    controlCaption: "条件ごとに採用戦略を分けます。",
    optionLabel: "採用方針",
    primaryLabel: "採用評価",
    secondaryLabel: "採用して保存",
    successMode: "saveBest",
    bestOptionId: "split_adoption",
    options: [
      { id: "all_a", label: "全条件で候補A", steps: ["安全固定"], gain: 17, detection: 13, successRate: 0.9, summary: "安定しますが条件差を活かせません。" },
      { id: "all_b", label: "全条件で候補B", steps: ["利得固定"], gain: 19, detection: 58, successRate: 0.47, summary: "一部条件で大きく止まります。" },
      { id: "split_adoption", label: "条件ごとに採用を分ける", steps: ["薄い条件はB", "厳しい条件はA"], gain: 27, detection: 25, successRate: 0.82, summary: "条件ごとのランキング差を使った最良採用です。" },
    ],
  },
  "8-1": {
    controlTitle: "Pressure Level",
    controlCaption: "低・中・高のうち2種類以上を実行します。",
    optionLabel: "強度",
    primaryLabel: "実行する",
    successMode: "runAtLeast",
    requiredRunCount: 2,
    options: [
      { id: "pressure_low", label: "低", steps: ["強度1"], gain: 7, detection: 10, queue: 1, latency: 35, successRate: 0.95, summary: "キューと遅延は小さいです。" },
      { id: "pressure_mid", label: "中", steps: ["強度2"], gain: 13, detection: 36, queue: 4, latency: 90, successRate: 0.75, summary: "利得は伸びますが圧力も増えます。" },
      { id: "pressure_high", label: "高", steps: ["強度3"], gain: 16, detection: 68, queue: 9, latency: 180, successRate: 0.42, summary: "キュー・遅延・検知が大きく上がります。" },
    ],
  },
  "8-2": {
    controlTitle: "Threshold Lab",
    controlCaption: "防御発動と未発動の両方を見ます。",
    optionLabel: "条件",
    primaryLabel: "実行する",
    successMode: "passAndBlock",
    options: [
      { id: "under_threshold", label: "強度1 x 2", steps: ["score 24"], gain: 12, detection: 24, blocked: false, queue: 2, latency: 70, successRate: 0.86, summary: "閾値未満で防御はまだ動きません。" },
      { id: "over_threshold", label: "強度3 x 3", steps: ["score 78"], gain: 5, detection: 78, blocked: true, queue: 10, latency: 220, successRate: 0.18, summary: "閾値を超え、レート制限が発動します。" },
      { id: "near_threshold", label: "強度2 x 2", steps: ["score 48"], gain: 16, detection: 48, blocked: false, queue: 5, latency: 110, successRate: 0.62, summary: "境界に近く、次の反復で危険になります。" },
    ],
  },
  "8-3": {
    controlTitle: "Tradeoff",
    controlCaption: "高負荷と低ノイズを比較します。",
    optionLabel: "戦略",
    primaryLabel: "実行する",
    successMode: "bestOption",
    bestOptionId: "low_noise_win",
    options: [
      { id: "high_pressure", label: "高負荷で押す", steps: ["強度3", "短時間"], gain: 11, detection: 82, blocked: true, queue: 11, latency: 240, successRate: 0.22, summary: "短期利得は高いものの遮断されます。" },
      { id: "low_noise_win", label: "静かに通す", steps: ["強度1", "間隔2", "反復"], gain: 20, detection: 27, blocked: false, queue: 3, latency: 95, successRate: 0.82, summary: "防御込みではこちらが総合的に強くなります。" },
      { id: "middle_pressure", label: "中負荷で様子を見る", steps: ["強度2", "間隔1"], gain: 17, detection: 45, blocked: false, queue: 5, latency: 130, successRate: 0.66, summary: "比較用の中間案です。" },
    ],
  },
  "8-4": {
    controlTitle: "Resilience Evaluation",
    controlCaption: "防御込みの総合スコアで保存します。",
    optionLabel: "採用候補",
    primaryLabel: "総合評価",
    secondaryLabel: "保存する",
    successMode: "saveBest",
    bestOptionId: "resilient_balanced",
    options: [
      { id: "raw_gain", label: "高利得固定", steps: ["profit_route"], gain: 23, detection: 72, queue: 10, latency: 230, successRate: 0.35, summary: "防御込みでは安定しません。" },
      { id: "resilient_balanced", label: "耐性バランス", steps: ["観測", "低ノイズ", "必要時だけ利得ルート"], gain: 26, detection: 31, queue: 4, latency: 105, successRate: 0.84, summary: "利得、遅延、検知リスクの総合評価が最良です。" },
      { id: "safe_only", label: "低ノイズ固定", steps: ["low_noise"], gain: 15, detection: 10, queue: 1, latency: 55, successRate: 0.94, summary: "安全ですが目標スコアは伸びません。" },
    ],
  },
  "9-1": {
    controlTitle: "Replay",
    controlCaption: "同じ戦略を2回実行して、反応変化を見ます。",
    optionLabel: "固定戦略",
    primaryLabel: "実行する",
    successMode: "repeatSame",
    options: [
      { id: "same_strategy", label: "quiet-chain を繰り返す", steps: ["同じテンプレート", "同じ条件"], gain: 18, detection: 24, successRate: 0.8, summary: "1回目は通りやすく、2回目は繰り返し検知が上がります。" },
    ],
  },
  "9-2": {
    controlTitle: "Hypothesis",
    controlCaption: "ログを確認してから仮説を提出します。",
    optionLabel: "仮説",
    primaryLabel: "ログを確認",
    secondaryLabel: "仮説を提出",
    successMode: "hypothesis",
    bestOptionId: "repeat_pattern",
    options: [
      { id: "repeat_pattern", label: "同一戦略の繰り返しに反応", steps: ["2回目からスコア上昇"], gain: 18, detection: 30, successRate: 0.82, summary: "ログの上昇タイミングと合っています。" },
      { id: "rounding_only", label: "丸め差分だけに反応", steps: ["数値差分を見る"], gain: 12, detection: 18, successRate: 0.58, summary: "今回のログとは根拠が弱いです。" },
      { id: "random_block", label: "ランダムに遮断している", steps: ["偶発とみなす"], gain: 8, detection: 20, successRate: 0.3, summary: "ログに一貫した傾向があるため不適切です。" },
    ],
  },
  "9-3": {
    controlTitle: "Mutation",
    controlCaption: "仮説に対応する変更を選び、前回より改善します。",
    optionLabel: "変更",
    primaryLabel: "再実行する",
    successMode: "bestOption",
    bestOptionId: "change_interval",
    options: [
      { id: "same_again", label: "同じ戦略を繰り返す", steps: ["変更なし"], gain: 7, detection: 76, blocked: true, successRate: 0.18, summary: "仮説と対応せず、さらに検知されます。" },
      { id: "change_interval", label: "実行間隔を変える", steps: ["delay 2 -> 4", "低ノイズ"], gain: 20, detection: 28, successRate: 0.82, summary: "繰り返しパターンを崩し、前回より改善します。" },
      { id: "change_split_only", label: "split だけ変える", steps: ["数値条件だけ変更"], gain: 13, detection: 54, successRate: 0.44, summary: "原因との対応が弱く改善幅は小さいです。" },
    ],
  },
  "9-4": {
    controlTitle: "Adaptation Loop",
    controlCaption: "観測して戦略を更新し、3ラウンド以内に突破します。",
    optionLabel: "ラウンド方針",
    primaryLabel: "次ラウンド実行",
    successMode: "roundLoop",
    bestOptionId: "adapt_each_round",
    maxRounds: 3,
    targetScore: 42,
    options: [
      { id: "repeat_same", label: "同じ方針を維持", steps: ["変更なし"], gain: 8, detection: 74, blocked: true, successRate: 0.2, summary: "防御に読まれます。" },
      { id: "adapt_each_round", label: "観測ごとに更新", steps: ["観測", "仮説", "間隔調整"], gain: 18, detection: 26, successRate: 0.84, summary: "改善傾向を作れます。" },
      { id: "over_correct", label: "低ノイズだけに寄せる", steps: ["安全固定"], gain: 12, detection: 12, successRate: 0.92, summary: "安全ですが突破スコアに届きにくいです。" },
    ],
  },
  "10-1": {
    controlTitle: "Duel Mode",
    controlCaption: "ルールを確認して対戦モードを開始します。",
    optionLabel: "確認項目",
    primaryLabel: "対戦モードを開始",
    successMode: "singleActionSuccess",
    options: [
      { id: "start_duel", label: "動的防御ルールを確認", steps: ["仮想環境のみ", "履歴依存防御", "複数ラウンド"], gain: 0, detection: 0, successRate: 1, summary: "ここからは観測と修正が中心です。" },
    ],
  },
  "10-2": {
    controlTitle: "Duel Script Console",
    controlCaption: "GUI候補またはDuel DSLを有効な計画にして初回ラウンドを実行します。",
    optionLabel: "GUI計画",
    primaryLabel: "GUI計画で実行",
    secondaryLabel: "DSLをコンパイル",
    successMode: "duelFirstRound",
    bestOptionId: "gui_balanced",
    duelScript: true,
    options: [
      { id: "gui_empty", label: "空の計画", steps: [], gain: 0, detection: 0, successRate: 0, blocked: true, summary: "計画が空なので実行できません。" },
      { id: "gui_balanced", label: "GUI: balanced probe", steps: ["sequence_shift", "refund_probe safe", "low_noise_probe"], gain: 20, detection: 32, successRate: 0.8, summary: "初回ラウンドに向いたバランス計画です。" },
    ],
  },
  "10-3": {
    controlTitle: "Revision",
    controlCaption: "防御ログを読んで修正案を実行します。",
    optionLabel: "修正案",
    primaryLabel: "再実行",
    successMode: "bestOption",
    bestOptionId: "revise_low_noise",
    options: [
      { id: "repeat_plan", label: "同じ計画を再実行", steps: ["変更なし"], gain: 8, detection: 76, blocked: true, successRate: 0.18, summary: "防御側に読まれます。" },
      { id: "revise_low_noise", label: "低ノイズへ修正", steps: ["防御ログ確認", "間隔追加", "低ノイズ"], gain: 21, detection: 26, successRate: 0.84, summary: "前回より検知が下がり、評価が改善します。" },
      { id: "revise_profit", label: "利得ルートを追加", steps: ["profit_route"], gain: 24, detection: 70, blocked: true, successRate: 0.3, summary: "改善意図はありますが反応が強すぎます。" },
    ],
  },
  "10-4": {
    controlTitle: "Campaign",
    controlCaption: "3ラウンドのキャンペーンで目標スコア 45 を狙います。",
    optionLabel: "ラウンド方針",
    primaryLabel: "ラウンド実行",
    successMode: "campaign",
    bestOptionId: "campaign_adapt",
    maxRounds: 3,
    targetScore: 45,
    options: [
      { id: "campaign_repeat", label: "同じ計画を固定", steps: ["固定"], gain: 8, detection: 74, blocked: true, successRate: 0.2, summary: "履歴依存防御に捕まります。" },
      { id: "campaign_adapt", label: "防御状態ごとに更新", steps: ["観測", "低ノイズ", "必要時に利得"], gain: 19, detection: 28, successRate: 0.84, summary: "複数ラウンドで改善します。" },
      { id: "campaign_safe", label: "安全固定", steps: ["低ノイズのみ"], gain: 12, detection: 10, successRate: 0.94, summary: "安定しますが目標スコアは伸びにくいです。" },
    ],
  },
}

function advancedDefinition(stageId) {
  return ADVANCED_STAGE_DEFINITIONS[stageId] || null
}

export function getAdvancedStageDefinition(stageId) {
  const definition = advancedDefinition(stageId)
  return definition ? clone(definition) : null
}

function advancedOption(definition, optionId) {
  return definition.options.find((option) => option.id === optionId) || definition.options[0]
}

function advancedOptionScore(option) {
  if (option.score !== undefined) return option.score
  const gain = Number(option.gain || 0)
  const detection = Number(option.detection || 0)
  const successRate = Number(option.successRate ?? 0.5)
  const latencyPenalty = Number(option.latency || 0) / 60
  const blockPenalty = option.blocked ? 9 : 0
  const stepPenalty = option.stepCount && option.stepCount > 3 ? (option.stepCount - 3) * 5 : 0
  return roundTo(gain * successRate - detection * 0.08 - latencyPenalty - blockPenalty - stepPenalty, 2)
}

export function simulateAdvancedOption(stageId, optionId, context = {}) {
  const definition = advancedDefinition(stageId)
  if (!definition) throw new Error(`unknown advanced stage: ${stageId}`)
  const option = advancedOption(definition, optionId)
  const runIndex = Number(context.runIndex || 1)
  let detection = Number(option.detection || 0)
  let gain = Number(option.gain || 0)
  let blocked = Boolean(option.blocked)

  if ((stageId === "9-1" || stageId === "9-4" || stageId === "10-4") && runIndex > 1 && option.id.includes("repeat")) {
    detection += 22
    gain = Math.max(0, gain - 8)
    blocked = true
  }

  const queue = Number(option.queue ?? Math.max(0, Math.round(detection / 12)))
  const latency = Number(option.latency ?? 40 + queue * 18)
  const score = advancedOptionScore({ ...option, detection, gain, blocked, queue, latency })
  const afterGain = Number(option.afterGain ?? gain)
  return {
    optionId: option.id,
    label: option.label,
    steps: clone(option.steps || []),
    gain,
    afterGain,
    detection,
    queue,
    latency,
    successRate: Number(option.successRate ?? 0.5),
    blocked,
    score,
    summary: option.summary || "",
  }
}

function createAdvancedTrial(stageId, option, index, context = {}) {
  const definition = advancedDefinition(stageId)
  const knownOption = definition?.options.some((item) => item.id === option.id)
  const result = knownOption
    ? simulateAdvancedOption(stageId, option.id, { ...context, runIndex: index })
    : {
        optionId: option.id,
        label: option.label,
        steps: clone(option.steps || []),
        gain: Number(option.gain || 0),
        afterGain: Number(option.afterGain ?? option.gain ?? 0),
        detection: Number(option.detection || 0),
        queue: Number(option.queue ?? Math.max(0, Math.round(Number(option.detection || 0) / 12))),
        latency: Number(option.latency ?? 40),
        successRate: Number(option.successRate ?? 0.5),
        blocked: Boolean(option.blocked),
        score: advancedOptionScore(option),
        summary: option.summary || "",
      }
  return {
    id: `${stageId}-${option.id}-${index}`,
    index,
    ...result,
  }
}

function bestAdvancedTrial(trials) {
  return trials.reduce((best, trial) => (!best || trial.score > best.score ? trial : best), null)
}

function createInitialAdvancedState(stageId) {
  const definition = advancedDefinition(stageId)
  if (!definition) return null
  const selectedOptionId = definition.defaultOptionId || definition.bestOptionId || definition.options[0]?.id || ""
  const runtimeState = createInitialRuntimeState(stageId, {
    planSelection: {
      activePlanSource: "gui",
      staleSources: definition.duelScript ? ["dsl"] : [],
    },
  })
  return createBaseState({
    mode: "advanced",
    stageId,
    selectedOptionId,
    route: [],
    runs: {},
    trialHistory: [],
    bestTrial: null,
    compared: false,
    saved: false,
    loaded: false,
    logReviewed: false,
    hypothesisSubmitted: false,
    round: 0,
    maxRounds: definition.maxRounds || 0,
    score: 0,
    targetScore: definition.targetScore || 0,
    defenderState: { alertLevel: 1, memory: 0, rateLimit: false },
    duelSourceCode: definition.duelScript ? DUEL_SCRIPT_SAMPLE : "",
    duelCompileState: definition.duelScript ? "editing" : "",
    duelCompileErrors: [],
    duelCompiledPlan: null,
    duelLastRound: null,
    activePlanSource: "gui",
    planSelection: runtimeState.planSelection,
    runtimeState,
    runtimeEvents: runtimeState.historyState.events,
    runtimeScore: null,
    diagnostics: [],
    feedback: definition.initialFeedback || definition.controlCaption,
    nextFocus: definition.options[0]?.summary || "候補を選んで実行してください。",
    notes: [
      "この章以降の操作は、ゲーム内の抽象化された仮想システムだけを対象にします。",
      `${definition.controlTitle}: ${definition.controlCaption}`,
    ],
  })
}

function completeAdvancedStage(state, feedback, nextFocus) {
  const wasComplete = state.success
  state.success = true
  state.nextUnlocked = true
  state.feedback = feedback
  state.nextFocus = nextFocus
  if (!wasComplete) {
    appendRuntimeEvents(state, [
      {
        eventType: "stage.completed",
        actor: "runtime",
        result: "success",
        severity: "notice",
        message: feedback,
        tags: ["stage", "completion"],
        metadata: { success: true },
      },
    ])
  }
}

function advancedRuntimeState(state) {
  if (!state.runtimeState) {
    state.runtimeState = createInitialRuntimeState(state.stageId || "4-1")
  }
  return state.runtimeState
}

function syncRuntimeMirror(state) {
  const runtimeState = advancedRuntimeState(state)
  state.runtimeEvents = runtimeState.historyState.events
  state.runtimeScore = runtimeState.score || null
  state.planSelection = runtimeState.planSelection
  state.activePlanSource = runtimeState.planSelection?.activePlanSource || state.activePlanSource || "gui"
  state.diagnostics = runtimeState.diagnostics || []
}

function appendRuntimeEvents(state, events) {
  const runtimeState = advancedRuntimeState(state)
  const normalizedEvents = events.map((item, index) =>
    createGameEvent(
      {
        ...item,
        stepIndex: item.stepIndex || runtimeState.historyState.events.length + index + 1,
      },
      runtimeState
    )
  )
  const reducedState = reduceEvents(runtimeState, normalizedEvents)
  const sourceEvents = reducedState.historyState.events.filter((item) => item.eventType !== "score.updated")
  const score = calculateScore(sourceEvents, reducedState, getScoreProfileForStage(reducedState.stageId))
  const scoreEvent = createGameEvent(
    {
      eventType: "score.updated",
      actor: "runtime",
      result: "normal",
      severity: "info",
      message: score.explanation,
      tags: ["score"],
      metadata: { score },
    },
    reducedState
  )
  state.runtimeState = reduceEvents(reducedState, [scoreEvent])
  syncRuntimeMirror(state)
}

function addAdvancedTimeline(state, label, detail, kind = "system", runtimeInput = {}) {
  state.timeline.push(event(label, detail, kind))
  const eventType =
    runtimeInput.eventType ||
    (kind === "anomaly"
      ? "defense.blocked"
      : label.includes("保存")
        ? "strategy.template.saved"
        : label.includes("読込")
          ? "strategy.template.loaded"
          : label.includes("ログ")
            ? "feedback.shown"
            : "strategy.executed")
  appendRuntimeEvents(state, [
    {
      eventType,
      actor: runtimeInput.actor || (kind === "player" ? "player" : "system"),
      result: runtimeInput.result || (kind === "anomaly" ? "blocked" : "normal"),
      severity: runtimeInput.severity || (kind === "anomaly" ? "warning" : "info"),
      message: detail,
      tags: runtimeInput.tags || [kind === "anomaly" ? "defense" : "strategy"],
      targetId: runtimeInput.targetId,
      before: runtimeInput.before,
      after: runtimeInput.after,
      metadata: runtimeInput.metadata || {},
    },
  ])
}

function runSelectedAdvancedOption(stageId, state, definition) {
  const option = advancedOption(definition, state.selectedOptionId)
  const trial = createAdvancedTrial(stageId, option, state.trialHistory.length + 1)
  state.runs[option.id] = trial
  state.trialHistory.push(trial)
  state.bestTrial = bestAdvancedTrial(state.trialHistory)
  state.feedback = trial.blocked ? "防御反応により結果が抑えられました。" : "実行結果を記録しました。"
  state.nextFocus = trial.summary
  addAdvancedTimeline(state, option.label, `${trial.summary} / score ${trial.score}`, trial.blocked ? "anomaly" : "system", {
    eventType: trial.blocked ? "defense.blocked" : "strategy.executed",
    actor: "player",
    result: trial.blocked ? "blocked" : "success",
    severity: trial.blocked ? "warning" : "notice",
    tags: ["strategy", ...(trial.blocked ? ["defense"] : [])],
    targetId: trial.optionId,
    after: {
      gain: trial.gain,
      detectionScore: trial.detection,
      queueLength: trial.queue,
      averageLatency: trial.latency,
      blocked: trial.blocked,
    },
    metadata: {
      trial,
      gain: trial.gain,
      detection: trial.detection,
      queue: trial.queue,
      latency: trial.latency,
      success: !trial.blocked,
      stealth: trial.detection < 35,
    },
  })
  return trial
}

function runAdvancedBatch(stageId, state, definition) {
  state.trialHistory = definition.options.map((option, index) => createAdvancedTrial(stageId, option, index + 1))
  state.runs = Object.fromEntries(state.trialHistory.map((trial) => [trial.optionId, trial]))
  state.bestTrial = bestAdvancedTrial(state.trialHistory)
  state.compared = true
  state.feedback = "候補をまとめて比較しました。"
  state.nextFocus = state.bestTrial ? `${state.bestTrial.label} が現在のベストです。` : "候補を確認してください。"
  addAdvancedTimeline(state, "一括比較", `${state.trialHistory.length}件の候補を評価しました。`, "system", {
    eventType: "search.trial.completed",
    actor: "runtime",
    result: "success",
    severity: "notice",
    tags: ["search", "strategy"],
    metadata: {
      trial: state.bestTrial,
      gain: state.bestTrial?.gain || 0,
      detection: state.bestTrial?.detection || 0,
      queue: state.bestTrial?.queue || 0,
      latency: state.bestTrial?.latency || 0,
      success: true,
    },
  })
}

function runAdvancedStageAction(stageId, previousState, action, payload = {}) {
  const definition = advancedDefinition(stageId)
  if (!definition) return null
  const state = clone(previousState)

  if (action === "retry") {
    return createInitialAdvancedState(stageId)
  }

  if (action === "select_advanced_option") {
    const option = advancedOption(definition, payload.optionId)
    state.selectedOptionId = option.id
    state.feedback = `${option.label} を選択しました。`
    state.nextFocus = option.summary || "実行して結果を確認してください。"
    advancedRuntimeState(state).uiState.selectedIds = [option.id]
    syncRuntimeMirror(state)
    return state
  }

  if (action === "compile_duel_script" && definition.duelScript) {
    const compiled = compileDuelScript(state.duelSourceCode, { stageId, chapterId: advancedRuntimeState(state).chapterId })
    state.duelCompileState = compiled.ok ? "compiled" : "compileError"
    state.duelCompileErrors = compiled.errors
    state.duelCompiledPlan = compiled.ir
    const runtimeState = advancedRuntimeState(state)
    runtimeState.planSelection.activePlanSource = "dsl"
    runtimeState.planSelection.dslPlan = compiled.ir
    runtimeState.planSelection.executablePlan = compiled.ok ? compiled.ir : runtimeState.planSelection.executablePlan
    runtimeState.planSelection.staleSources = (runtimeState.planSelection.staleSources || []).filter((source) => source !== "dsl")
    state.activePlanSource = "dsl"
    state.feedback = compiled.ok ? "Duel DSL のコンパイルに成功しました。" : "Duel DSL にエラーがあります。"
    state.nextFocus = compiled.ok ? `推定負荷 ${compiled.ir.metadata.estimatedLoad} / actions ${compiled.ir.actions.length}` : compiled.errors[0] || "エラーを確認してください。"
    appendRuntimeEvents(state, [
      compiled.ok
        ? {
            eventType: "plan.compiled",
            actor: "compiler",
            result: "success",
            severity: "notice",
            message: state.feedback,
            tags: ["plan", "dsl"],
            metadata: { plan: compiled.ir, gain: compiled.ir.metadata.estimatedGain || 0, success: true },
          }
        : {
            eventType: "plan.validation.failed",
            actor: "compiler",
            result: "failure",
            severity: "error",
            message: state.feedback,
            tags: ["plan", "dsl", "diagnostic"],
            metadata: {
              diagnostics: compiled.errors.map((message) =>
                normalizeDiagnostic({
                  category: "SyntaxError",
                  message,
                  source: { sourceType: "dsl" },
                })
              ),
              invalidPlanPenalty: 1,
            },
          },
    ])
    return state
  }

  if (action === "run_duel_round" && definition.duelScript) {
    if (!state.duelSourceCode.trim()) {
      state.feedback = "有効なスクリプトを入力してください。"
      state.nextFocus = "空のスクリプトは実行できません。"
      appendRuntimeEvents(state, [
        {
          eventType: "plan.validation.failed",
          actor: "runtime",
          result: "failure",
          severity: "error",
          message: state.nextFocus,
          tags: ["plan", "dsl", "validation"],
          metadata: {
            diagnostics: [
              normalizeDiagnostic({
                category: "VerificationError",
                message: state.nextFocus,
                source: { sourceType: "dsl" },
              }),
            ],
          },
        },
      ])
      return state
    }

    const runtimeState = advancedRuntimeState(state)
    let resolved = resolveActivePlan(runtimeState.planSelection)
    let executablePlan = resolved.plan
    if (!executablePlan || runtimeState.planSelection.activePlanSource !== "dsl") {
      const compiled = compileDuelScript(state.duelSourceCode, { stageId, chapterId: runtimeState.chapterId })
      state.duelCompileState = compiled.ok ? "compiled" : "compileError"
      state.duelCompileErrors = compiled.errors
      state.duelCompiledPlan = compiled.ir
      runtimeState.planSelection.activePlanSource = "dsl"
      runtimeState.planSelection.dslPlan = compiled.ir
      runtimeState.planSelection.staleSources = (runtimeState.planSelection.staleSources || []).filter((source) => source !== "dsl")
      state.activePlanSource = "dsl"

      if (!compiled.ok) {
        appendRuntimeEvents(state, [
          {
            eventType: "plan.validation.failed",
            actor: "compiler",
            result: "failure",
            severity: "error",
            message: compiled.errors[0] || "コンパイルエラーがあります。",
            tags: ["plan", "dsl", "diagnostic"],
            metadata: {
              diagnostics: compiled.errors.map((message) =>
                normalizeDiagnostic({
                  category: "SyntaxError",
                  message,
                  source: { sourceType: "dsl" },
                })
              ),
              invalidPlanPenalty: 1,
            },
          },
        ])
        return state
      }

      runtimeState.planSelection.executablePlan = compiled.ir
      appendRuntimeEvents(state, [
        {
          eventType: "plan.compiled",
          actor: "compiler",
          result: "success",
          severity: "notice",
          message: "Duel DSL のコンパイルに成功しました。",
          tags: ["plan", "dsl"],
          metadata: { plan: compiled.ir, gain: compiled.ir.metadata.estimatedGain || 0, success: true },
        },
      ])
      resolved = resolveActivePlan(runtimeState.planSelection)
      executablePlan = resolved.plan
    }

      const validation = validatePlanIR(executablePlan, runtimeState, {
        maxExpandedActions: DUEL_COMPILER_LIMITS.maxExpandedActions,
        maxEstimatedLoad: DUEL_COMPILER_LIMITS.maxVirtualLoad,
        maxEstimatedRisk: COMMON_PLAN_LIMITS.maxEstimatedRisk,
      })
      if (!executablePlan || resolved.diagnostics.length || validation.status === "invalid") {
        const diagnostics = [...resolved.diagnostics, ...validation.diagnostics]
        state.feedback = "有効なスクリプトをコンパイルしてください。"
        state.nextFocus = diagnostics[0]?.message || "コンパイルエラーがあります。"
        appendRuntimeEvents(state, [
          {
            eventType: "plan.validation.failed",
            actor: "runtime",
            result: "failure",
            severity: "error",
            message: state.nextFocus,
            tags: ["plan", "validation"],
            metadata: { diagnostics },
          },
        ])
        return state
      }
      executablePlan.validation = validation
      runtimeState.planSelection.executablePlan = executablePlan
      const round = simulateDuelRound(executablePlan, state.defenderState, state.round + 1)
      state.round += 1
      state.duelLastRound = round
      state.defenderState = round.updatedDefenderState
      state.score += round.scoreDelta
      state.trialHistory.push({
        id: `${stageId}-duel-${state.round}`,
        index: state.round,
        optionId: executablePlan.planId,
        label: `${runtimeState.planSelection.activePlanSource.toUpperCase()}: ${executablePlan.planId}`,
        gain: round.rawGain,
        detection: round.detectionScore,
        queue: round.queue,
        latency: round.latency,
        successRate: round.blocked ? 0.2 : 0.82,
        blocked: round.blocked,
        score: round.scoreDelta,
        summary: round.summary,
      })
      state.bestTrial = bestAdvancedTrial(state.trialHistory)
      addAdvancedTimeline(state, "Duel round", round.summary, round.blocked ? "anomaly" : "system", {
        eventType: round.blocked ? "defense.blocked" : "strategy.executed",
        actor: "runtime",
        result: round.blocked ? "blocked" : "success",
        severity: round.blocked ? "warning" : "notice",
        tags: ["duel", "plan", ...(round.blocked ? ["defense"] : [])],
        after: {
          alertLevel: round.updatedDefenderState.alertLevel,
          detectionScore: round.detectionScore,
          blocked: round.blocked,
          blockReason: round.updatedDefenderState.lastBlockReason,
          activeRules: round.defenseEvents,
          queueLength: round.queue,
          averageLatency: round.latency,
          virtualLoad: round.estimatedLoad,
          rateLimitActive: round.blocked,
        },
        metadata: {
          plan: executablePlan,
          gain: round.rawGain,
          detection: round.detectionScore,
          queue: round.queue,
          latency: round.latency,
          success: !round.blocked,
          scoreDelta: round.scoreDelta,
        },
      })
      completeAdvancedStage(state, "初回ラウンドが完了しました。", "次は防御反応を読み、戦略を更新します。")
      return state
  }

  if (action === "run_advanced_option") {
    if (definition.successMode === "builderRun") {
      if (!state.route.length) {
        state.feedback = "少なくとも1つ以上の攻撃部品を追加してください。"
        state.nextFocus = "部品を選んでから追加します。"
        return state
      }
      const routeOptions = state.route.map((id) => advancedOption(definition, id))
      const merged = {
        id: "built_route",
        label: "組み立てたルート",
        steps: routeOptions.flatMap((option) => option.steps || [option.label]),
        gain: routeOptions.reduce((sum, option) => sum + Number(option.gain || 0), 0),
        detection: routeOptions.reduce((sum, option) => sum + Number(option.detection || 0), 0),
        successRate: routeOptions.reduce((sum, option) => sum + Number(option.successRate ?? 0.5), 0) / routeOptions.length,
        summary: "選んだ部品を1本のルートとして実行しました。",
      }
      const trial = createAdvancedTrial(stageId, merged, state.trialHistory.length + 1)
      state.trialHistory.push(trial)
      state.bestTrial = trial
      addAdvancedTimeline(state, "ルート実行", trial.summary, "system")
      completeAdvancedStage(state, "攻撃ルートを組み立てて実行できました。", "次は条件を変えて通るかを試します。")
      return state
    }

    if (definition.successMode === "compareAll" || definition.successMode === "batchBest" || definition.successMode === "searchAndSave" || definition.successMode === "multiAxis") {
      runAdvancedBatch(stageId, state, definition)
      if (definition.successMode === "compareAll" || definition.successMode === "multiAxis") {
        completeAdvancedStage(state, "候補を比較し、有力候補を特定できました。", state.bestTrial ? `${state.bestTrial.label} を確認してください。` : "比較結果を確認してください。")
      }
      return state
    }

    if (definition.successMode === "roundLoop" || definition.successMode === "campaign") {
      const option = advancedOption(definition, state.selectedOptionId)
      const trial = createAdvancedTrial(stageId, option, state.round + 1, { runIndex: state.round + 1 })
      state.round += 1
      state.score += Math.max(0, trial.score)
      state.trialHistory.push(trial)
      state.bestTrial = bestAdvancedTrial(state.trialHistory)
      addAdvancedTimeline(state, `Round ${state.round}`, `${trial.label}: ${trial.summary}`, trial.blocked ? "anomaly" : "system")
      if (state.score >= definition.targetScore || (option.id === definition.bestOptionId && state.round >= 2)) {
        completeAdvancedStage(
          state,
          definition.successMode === "campaign"
            ? "動的防御キャンペーンで目標を達成しました。"
            : "観測、仮説、更新のループで改善できました。",
          "複数ラウンドで防御側の変化に適応できています。"
        )
      } else if (state.round >= definition.maxRounds) {
        state.feedback = "ラウンド上限に到達しました。"
        state.nextFocus = "同じ方針を続けず、防御ログに合わせた更新を選んでください。"
      } else {
        state.feedback = `Round ${state.round} を記録しました。`
        state.nextFocus = trial.summary
      }
      return state
    }

    if (definition.successMode === "repeatSame") {
      const trial = runSelectedAdvancedOption(stageId, state, definition)
      if (state.trialHistory.length >= 2) {
        const first = state.trialHistory[0]
        if (trial.detection > first.detection || trial.blocked !== first.blocked) {
          completeAdvancedStage(state, "同じ戦略を繰り返すと、防御側が反応を変えました。", "ここからは防御の変化を観測する必要があります。")
        }
      }
      return state
    }

    if (definition.successMode === "duelFirstRound") {
      const option = advancedOption(definition, state.selectedOptionId)
      if (option.id === "gui_empty") {
        state.feedback = "攻撃計画を作成するか、有効なスクリプトをコンパイルしてください。"
        state.nextFocus = "空の計画は実行できません。"
        return state
      }
      const runtimeState = advancedRuntimeState(state)
      const ir = guiPlanToDuelIr(option, { stageId, chapterId: runtimeState.chapterId })
      const validation = validatePlanIR(ir, runtimeState, {
        maxExpandedActions: DUEL_COMPILER_LIMITS.maxExpandedActions,
        maxEstimatedLoad: DUEL_COMPILER_LIMITS.maxVirtualLoad,
        maxEstimatedRisk: COMMON_PLAN_LIMITS.maxEstimatedRisk,
      })
      ir.validation = validation
      if (validation.status === "invalid") {
        state.feedback = "GUI計画を実行できません。"
        state.nextFocus = validation.diagnostics[0]?.message || "計画を見直してください。"
        appendRuntimeEvents(state, [
          {
            eventType: "plan.validation.failed",
            actor: "runtime",
            result: "failure",
            severity: "error",
            message: state.nextFocus,
            tags: ["plan", "gui", "validation"],
            metadata: { diagnostics: validation.diagnostics, invalidPlanPenalty: 1 },
          },
        ])
        return state
      }
      runtimeState.planSelection.activePlanSource = "gui"
      runtimeState.planSelection.guiPlan = ir
      runtimeState.planSelection.executablePlan = ir
      runtimeState.planSelection.staleSources = (runtimeState.planSelection.staleSources || []).filter((source) => source !== "gui")
      state.activePlanSource = "gui"
      appendRuntimeEvents(state, [
        {
          eventType: "plan.created",
          actor: "runtime",
          result: "success",
          severity: "notice",
          message: "GUI計画を PlanIR として登録しました。",
          tags: ["plan", "gui"],
          metadata: { plan: ir, gain: ir.metadata.estimatedGain || 0, success: true },
        },
      ])
      const round = simulateDuelRound(ir, state.defenderState, state.round + 1)
      state.round += 1
      state.duelCompiledPlan = ir
      state.duelLastRound = round
      state.defenderState = round.updatedDefenderState
      state.score += round.scoreDelta
      state.trialHistory.push({
        id: `${stageId}-gui-${state.round}`,
        index: state.round,
        optionId: option.id,
        label: option.label,
        gain: round.rawGain,
        detection: round.detectionScore,
        queue: round.queue,
        latency: round.latency,
        successRate: round.blocked ? 0.2 : 0.82,
        blocked: round.blocked,
        score: round.scoreDelta,
        summary: round.summary,
      })
      state.bestTrial = bestAdvancedTrial(state.trialHistory)
      addAdvancedTimeline(state, "GUI round", round.summary, round.blocked ? "anomaly" : "system", {
        eventType: round.blocked ? "defense.blocked" : "strategy.executed",
        actor: "runtime",
        result: round.blocked ? "blocked" : "success",
        severity: round.blocked ? "warning" : "notice",
        tags: ["gui", "plan", ...(round.blocked ? ["defense"] : [])],
        after: {
          alertLevel: round.updatedDefenderState.alertLevel,
          detectionScore: round.detectionScore,
          blocked: round.blocked,
          blockReason: round.updatedDefenderState.lastBlockReason,
          activeRules: round.defenseEvents,
          queueLength: round.queue,
          averageLatency: round.latency,
          virtualLoad: round.estimatedLoad,
          rateLimitActive: round.blocked,
        },
        metadata: {
          plan: ir,
          gain: round.rawGain,
          detection: round.detectionScore,
          queue: round.queue,
          latency: round.latency,
          success: !round.blocked,
          scoreDelta: round.scoreDelta,
        },
      })
      completeAdvancedStage(state, "初回ラウンドが完了しました。", "次は防御反応を読み、戦略を更新します。")
      return state
    }

    const trial = runSelectedAdvancedOption(stageId, state, definition)

    if (definition.successMode === "runAtLeast" && Object.keys(state.runs).length >= definition.requiredRunCount) {
      completeAdvancedStage(state, "強度を変えると資源圧力の差が見えました。", "負荷は利得だけでなく、遅延や検知にも影響します。")
      return state
    }

    if (definition.successMode === "passAndBlock") {
      const values = Object.values(state.runs)
      if (values.some((item) => item.blocked) && values.some((item) => !item.blocked)) {
        completeAdvancedStage(state, "通る条件と止まる条件の両方を確認できました。", "防御は条件や閾値に反応しています。")
      }
      return state
    }

    if (definition.successMode === "targetScore" && !trial.blocked && trial.gain >= definition.targetScore) {
      completeAdvancedStage(state, "制約内で効率的な戦略を組めました。", "強い要素を全部使うより、適切な順で絞る方が有効です。")
      return state
    }

    if (definition.successMode === "bestOption" && trial.optionId === definition.bestOptionId) {
      completeAdvancedStage(state, "最も有効な候補を見つけました。", trial.summary)
      return state
    }

    if (definition.successMode === "singleActionSuccess") {
      completeAdvancedStage(state, "必要な確認または保存が完了しました。", trial.summary)
      return state
    }

    return state
  }

  if (action === "add_route_part") {
    const option = advancedOption(definition, state.selectedOptionId)
    state.route.push(option.id)
    state.feedback = `${option.label} をルートに追加しました。`
    state.nextFocus = `現在の部品数: ${state.route.length}`
    addAdvancedTimeline(state, "部品追加", option.label, "player")
    return state
  }

  if (action === "compare_advanced") {
    if (definition.successMode === "runRequiredAndCompare") {
      const missing = definition.requiredOptionIds.filter((id) => !state.runs[id])
      if (missing.length) {
        state.feedback = "比較には両方のケース実行が必要です。"
        state.nextFocus = "ケースAとケースBをそれぞれ実行してください。"
        return state
      }
      state.compared = true
      completeAdvancedStage(state, "弱点は組み合わせると影響が大きくなることを確認できました。", "先に作った有利状態が、次の不整合を支えています。")
      return state
    }

    if (definition.successMode === "confirmBest") {
      const trial = runSelectedAdvancedOption(stageId, state, definition)
      state.compared = true
      if (trial.afterGain <= definition.targetScore) {
        completeAdvancedStage(state, "連鎖のボトルネックを止められました。", "依存関係の中心を塞ぐ方が効果的です。")
      }
      return state
    }

    runAdvancedBatch(stageId, state, definition)
    return state
  }

  if (action === "review_advanced_log") {
    state.logReviewed = true
    state.feedback = "防御ログを確認しました。"
    state.nextFocus = "検知スコアが上がったタイミングとログの理由を見比べてください。"
    addAdvancedTimeline(state, "ログ確認", "繰り返しパターンと検知スコア上昇を確認しました。", "system")
    return state
  }

  if (action === "save_advanced") {
    if (definition.successMode === "saveAndLoad") {
      state.saved = true
      state.feedback = "戦略をテンプレートとして保存しました。"
      state.nextFocus = "読み込むと再利用できることを確認できます。"
      addAdvancedTimeline(state, "保存", "quiet-chain テンプレートを保存しました。", "player")
      return state
    }

    if (definition.successMode === "searchAndSave" && !state.bestTrial) {
      runAdvancedBatch(stageId, state, definition)
    }

    const selectedIsBest = state.selectedOptionId === definition.bestOptionId || state.bestTrial?.optionId === definition.bestOptionId
    if (selectedIsBest || definition.successMode === "saveBest" || definition.successMode === "batchBest") {
      state.saved = true
      completeAdvancedStage(state, "評価結果を保存しました。", state.bestTrial ? `${state.bestTrial.label} を採用できます。` : "保存済みです。")
    } else {
      state.feedback = "まだ保存するには比較が足りません。"
      state.nextFocus = "ベスト候補を確認してから保存してください。"
    }
    return state
  }

  if (action === "load_advanced") {
    if (!state.saved) {
      state.feedback = "先にテンプレートを保存してください。"
      state.nextFocus = "名前付き戦略として保存すると読み込めます。"
      return state
    }
    state.loaded = true
    completeAdvancedStage(state, "戦略を保存し、再読込できました。", "次はこの戦略を条件付きで再利用します。")
    addAdvancedTimeline(state, "読込", "quiet-chain テンプレートを読み込みました。", "system")
    return state
  }

  if (action === "submit_hypothesis") {
    const option = advancedOption(definition, state.selectedOptionId)
    state.hypothesisSubmitted = true
    if (state.logReviewed && option.id === definition.bestOptionId) {
      completeAdvancedStage(state, "防御反応の原因に近い仮説を選択できました。", "観測から仮説を立てることが、適応の第一歩です。")
    } else {
      state.feedback = "仮説の根拠がまだ弱いです。"
      state.nextFocus = "先にログを確認し、検知スコアが上がった理由と照合してください。"
    }
    return state
  }

  return state
}

function stripDuelComment(line) {
  const quoted = line.match(/^([^"]*(?:"[^"]*"[^"]*)*)$/)
  if (!quoted) return line
  let inString = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"') inString = !inString
    if (char === "#" && !inString) return line.slice(0, index)
  }
  return line
}

function normalizeDuelLines(sourceCode) {
  return String(sourceCode ?? "")
    .replace(/\t/g, "  ")
    .split("\n")
    .map((raw, index) => {
      const withoutComment = stripDuelComment(raw).replace(/\s+$/, "")
      return {
        raw,
        text: withoutComment.trim(),
        indent: withoutComment.match(/^ */)?.[0].length || 0,
        line: index + 1,
      }
    })
    .filter((line) => line.text.length > 0)
}

function parseDuelValue(rawValue) {
  if (/^".*"$/.test(rawValue)) return rawValue.slice(1, -1)
  if (rawValue === "true") return true
  if (rawValue === "false") return false
  if (/^-?\d+(?:\.\d+)?$/.test(rawValue)) return Number(rawValue)
  return { ref: rawValue }
}

function parseDuelArgs(argText, line) {
  if (!argText.trim()) return {}
  const args = {}
  const pattern = /([A-Za-z_][A-Za-z0-9_]*)=("[^"]*"|true|false|-?\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*)/g
  let cursor = 0
  let match
  while ((match = pattern.exec(argText))) {
    if (argText.slice(cursor, match.index).trim()) {
      throw new Error(`Line ${line}: invalid argument syntax`)
    }
    args[match[1]] = parseDuelValue(match[2])
    cursor = match.index + match[0].length
  }
  if (argText.slice(cursor).trim()) {
    throw new Error(`Line ${line}: invalid argument syntax`)
  }
  return args
}

function parseDuelCondition(text, line) {
  const match = text.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/)
  if (!match) throw new Error(`Line ${line}: invalid condition`)
  return {
    left: parseDuelValue(match[1].trim()),
    comparator: match[2],
    right: parseDuelValue(match[3].trim()),
  }
}

function parseDuelBlock(lines, cursor, indent) {
  const body = []
  let index = cursor
  while (index < lines.length) {
    const line = lines[index]
    if (line.indent < indent) break
    if (line.indent > indent) {
      throw new Error(`Line ${line.line}: unexpected indentation`)
    }
    if (line.text === "else:") break

    let match = line.text.match(/^use\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+(.*))?$/)
    if (match) {
      body.push({ type: "use", line: line.line, actionId: match[1], args: parseDuelArgs(match[2] || "", line.line) })
      index += 1
      continue
    }

    if (line.text === "run") {
      body.push({ type: "run", line: line.line })
      index += 1
      continue
    }

    match = line.text.match(/^observe\s+([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)$/)
    if (match) {
      body.push({ type: "observe", line: line.line, path: match[1] })
      index += 1
      continue
    }

    match = line.text.match(/^save(?:\s+([A-Za-z_][A-Za-z0-9_]*))?$/)
    if (match) {
      body.push({ type: "save", line: line.line, name: match[1] || "" })
      index += 1
      continue
    }

    match = line.text.match(/^candidate\s+([A-Za-z_][A-Za-z0-9_]*)$/)
    if (match) {
      body.push({ type: "candidate", line: line.line, candidateId: match[1] })
      index += 1
      continue
    }

    match = line.text.match(/^repeat\s+(\d+):$/)
    if (match) {
      const parsed = parseDuelBlock(lines, index + 1, indent + 2)
      body.push({ type: "repeat", line: line.line, count: Number(match[1]), body: parsed.body })
      index = parsed.cursor
      continue
    }

    match = line.text.match(/^for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(-?\d+)\.\.(-?\d+):$/)
    if (match) {
      const parsed = parseDuelBlock(lines, index + 1, indent + 2)
      body.push({ type: "for", line: line.line, variable: match[1], start: Number(match[2]), end: Number(match[3]), body: parsed.body })
      index = parsed.cursor
      continue
    }

    match = line.text.match(/^if\s+(.+):$/)
    if (match) {
      const parsedThen = parseDuelBlock(lines, index + 1, indent + 2)
      let elseBody = []
      index = parsedThen.cursor
      if (lines[index]?.indent === indent && lines[index]?.text === "else:") {
        const parsedElse = parseDuelBlock(lines, index + 1, indent + 2)
        elseBody = parsedElse.body
        index = parsedElse.cursor
      }
      body.push({ type: "if", line: line.line, condition: parseDuelCondition(match[1], line.line), thenBody: parsedThen.body, elseBody })
      continue
    }

    match = line.text.match(/^choose\s+([A-Za-z_][A-Za-z0-9_]*)\s+by\s+([A-Za-z_][A-Za-z0-9_]*):$/)
    if (match) {
      const parsed = parseDuelBlock(lines, index + 1, indent + 2)
      body.push({ type: "choose", line: line.line, target: match[1], metric: match[2], body: parsed.body })
      index = parsed.cursor
      continue
    }

    throw new Error(`Line ${line.line}: unknown command '${line.text.split(/\s+/)[0]}'`)
  }
  return { body, cursor: index }
}

function parseDuelProgram(sourceCode) {
  const lines = normalizeDuelLines(sourceCode)
  const program = { params: [], plans: [] }
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (line.indent !== 0) throw new Error(`Line ${line.line}: top-level declarations must not be indented`)
    let match = line.text.match(/^param\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(-?\d+)\.\.(-?\d+)$/)
    if (match) {
      program.params.push({ type: "param", line: line.line, name: match[1], start: Number(match[2]), end: Number(match[3]) })
      index += 1
      continue
    }
    match = line.text.match(/^plan\s+([A-Za-z_][A-Za-z0-9_]*):$/)
    if (match) {
      const parsed = parseDuelBlock(lines, index + 1, 2)
      if (!parsed.body.length) throw new Error(`Line ${line.line}: plan must contain at least one statement`)
      program.plans.push({ type: "plan", line: line.line, name: match[1], body: parsed.body })
      index = parsed.cursor
      continue
    }
    throw new Error(`Line ${line.line}: expected plan or param declaration`)
  }
  if (!program.plans.length) throw new Error("Line 1: at least one plan is required")
  return program
}

function resolveDuelReference(value, scope) {
  if (!value || typeof value !== "object" || !("ref" in value)) return value
  if (value.ref in scope.variables) return scope.variables[value.ref]
  if (value.ref in scope.params) return scope.params[value.ref]
  return value
}

function evaluateDuelCondition(condition, scope) {
  const observationValues = {
    "defense.alert_level": scope.defenderState?.alertLevel ?? 1,
    "defense.rate_limit": scope.defenderState?.rateLimit ? 1 : 0,
    "round.last_block_reason": scope.defenderState?.lastBlockReason || "none",
    "round.score_delta": scope.defenderState?.lastScoreDelta || 0,
    "resource.queue": scope.defenderState?.queue || 0,
    "score.current": scope.defenderState?.score || 0,
  }

  function valueOf(input) {
    if (input && typeof input === "object" && "ref" in input) {
      if (input.ref in observationValues) return observationValues[input.ref]
      return resolveDuelReference(input, scope)
    }
    return input
  }

  const left = valueOf(condition.left)
  const right = valueOf(condition.right)
  if (condition.comparator === "==") return left === right
  if (condition.comparator === "!=") return left !== right
  if (condition.comparator === ">") return Number(left) > Number(right)
  if (condition.comparator === ">=") return Number(left) >= Number(right)
  if (condition.comparator === "<") return Number(left) < Number(right)
  if (condition.comparator === "<=") return Number(left) <= Number(right)
  return false
}

function validateDuelActionArg(actionId, argName, rawValue, line, scope) {
  const action = DUEL_ACTIONS[actionId]
  const schema = action.params[argName]
  if (!schema) throw new Error(`Line ${line}: action '${actionId}' does not accept argument '${argName}'`)
  const value = resolveDuelReference(rawValue, scope)
  if (value && typeof value === "object" && "ref" in value) {
    throw new Error(`Line ${line}: unknown variable '${value.ref}'`)
  }
  if (schema.type === "number") {
    if (typeof value !== "number" || Number.isNaN(value)) throw new Error(`Line ${line}: '${argName}' must be a number`)
    if (value < schema.min || value > schema.max) throw new Error(`Line ${line}: '${argName}' must be between ${schema.min} and ${schema.max}`)
  }
  if (schema.type === "string") {
    if (typeof value !== "string") throw new Error(`Line ${line}: '${argName}' must be a string`)
    if (schema.values && !schema.values.includes(value)) {
      throw new Error(`Line ${line}: '${argName}' must be one of ${schema.values.join(", ")}`)
    }
  }
  return value
}

function buildDuelIr(program, options = {}) {
  const plan = program.plans[0]
  const params = {}
  const actions = []
  const diagnostics = []
  const observations = []
  const choices = []
  const scope = {
    params: {},
    variables: {},
    defenderState: options.defenderState || {},
  }
  let statementCount = 0
  let runCount = 0
  let savedName = ""

  for (const param of program.params) {
    if (param.start > param.end) throw new Error(`Line ${param.line}: range start must be <= range end`)
    if (param.end - param.start > DUEL_COMPILER_LIMITS.maxLoopIterations) {
      throw new Error(`Line ${param.line}: parameter range exceeds maximum allowed span`)
    }
    params[param.name] = { type: "range", from: param.start, to: param.end }
    scope.params[param.name] = param.start
  }

  function bump(line) {
    statementCount += 1
    if (statementCount > DUEL_COMPILER_LIMITS.maxStatements) {
      throw new Error(`Line ${line}: statement count exceeds maximum allowed value`)
    }
  }

  function emitStatements(statements) {
    for (const statement of statements) {
      bump(statement.line)
      if (statement.type === "use") {
        const action = DUEL_ACTIONS[statement.actionId]
        if (!action) throw new Error(`Line ${statement.line}: unknown action '${statement.actionId}' is not allowed in Duel DSL.`)
        const paramsForAction = {}
        for (const [argName, argValue] of Object.entries(statement.args)) {
          paramsForAction[argName] = validateDuelActionArg(statement.actionId, argName, argValue, statement.line, scope)
        }
        for (const [argName, schema] of Object.entries(action.params)) {
          if (!(argName in paramsForAction) && schema.defaultValue !== undefined) {
            paramsForAction[argName] = schema.defaultValue
          }
        }
        actions.push({
          actionId: statement.actionId,
          actionType: statement.actionId,
          type: statement.actionId,
          label: action.label,
          params: paramsForAction,
          estimatedCost: action.estimatedCost,
          estimatedLoad: action.estimatedLoad,
          estimatedRisk: action.risk,
          risk: action.risk,
          gain: action.gain,
          tags: clone(action.tags),
          line: statement.line,
        })
        if (actions.length > DUEL_COMPILER_LIMITS.maxExpandedActions) {
          throw new Error(`Line ${statement.line}: expanded action count exceeds maximum allowed value`)
        }
      } else if (statement.type === "run") {
        runCount += 1
      } else if (statement.type === "observe") {
        if (!DUEL_OBSERVATIONS.has(statement.path)) {
          throw new Error(`Line ${statement.line}: observation '${statement.path}' is not available`)
        }
        observations.push(statement.path)
      } else if (statement.type === "save") {
        savedName = statement.name || plan.name
      } else if (statement.type === "repeat") {
        if (statement.count < 1 || statement.count > DUEL_COMPILER_LIMITS.maxLoopIterations) {
          throw new Error(`Line ${statement.line}: repeat count exceeds maximum allowed value.`)
        }
        for (let index = 0; index < statement.count; index += 1) {
          emitStatements(statement.body)
        }
      } else if (statement.type === "for") {
        if (statement.start > statement.end) throw new Error(`Line ${statement.line}: range start must be <= range end`)
        const loopCount = statement.end - statement.start + 1
        if (loopCount > DUEL_COMPILER_LIMITS.maxLoopIterations) {
          throw new Error(`Line ${statement.line}: loop range exceeds maximum allowed value`)
        }
        for (let value = statement.start; value <= statement.end; value += 1) {
          scope.variables[statement.variable] = value
          emitStatements(statement.body)
        }
        delete scope.variables[statement.variable]
      } else if (statement.type === "if") {
        observations.push(
          ...[statement.condition.left, statement.condition.right]
            .filter((value) => value && typeof value === "object" && "ref" in value && DUEL_OBSERVATIONS.has(value.ref))
            .map((value) => value.ref)
        )
        emitStatements(evaluateDuelCondition(statement.condition, scope) ? statement.thenBody : statement.elseBody)
      } else if (statement.type === "choose") {
        const candidates = statement.body.filter((child) => child.type === "candidate").map((child) => child.candidateId)
        if (!candidates.length) throw new Error(`Line ${statement.line}: choose block must contain candidates`)
        choices.push({ target: statement.target, metric: statement.metric, candidates })
      } else if (statement.type === "candidate") {
        diagnostics.push(`Line ${statement.line}: candidate '${statement.candidateId}' is only meaningful inside choose`)
      }
    }
  }

  emitStatements(plan.body)

  const estimatedLoad = actions.reduce((sum, action) => sum + action.estimatedLoad, 0)
  const estimatedRisk = actions.reduce((sum, action) => sum + Math.max(0, action.risk), 0)
  const riskTags = [...new Set(actions.flatMap((action) => action.tags))]
  if (!actions.length) throw new Error(`Line ${plan.line}: plan must contain at least one use action`)
  if (actions.length > DUEL_COMPILER_LIMITS.maxRoundActions) {
    throw new Error(`Line ${plan.line}: round action count exceeds maximum allowed value`)
  }
  if (estimatedLoad > DUEL_COMPILER_LIMITS.maxVirtualLoad) {
    throw new Error(`Line ${plan.line}: virtual load exceeds round budget`)
  }

  const planIr = createPlanIR({
    planId: plan.name,
    displayName: plan.name,
    source: {
      sourceType: "dsl",
      sourceId: plan.name,
      sourceLabel: "Duel DSL",
      dslSourceHash: String(statementCount),
    },
    chapterId: options.chapterId,
    stageId: options.stageId,
    parameters: params,
    actions,
    metadata: {
      usesObservation: observations.length > 0,
      usesLoop: program.params.length > 0 || statementCount > actions.length + runCount,
      usesBranch: choices.length > 0,
      usesTemplate: false,
      observations: [...new Set(observations)],
      choices,
      runCount,
      savedName,
      statementCount,
      safetyBudget: clone(DUEL_COMPILER_LIMITS),
    },
    validation: { status: "valid", checkedAt: 0, diagnostics: [] },
    now: options.now,
  })
  planIr.metadata.estimatedLoad = estimatedLoad
  planIr.metadata.estimatedRisk = estimatedRisk
  planIr.metadata.estimatedGain = actions.reduce((sum, action) => sum + action.gain, 0)
  planIr.metadata.riskTags = riskTags
  return planIr
}

function checkDuelSafety(sourceCode) {
  const source = String(sourceCode ?? "")
  const blockedPatterns = [
    { pattern: /\b(fetch|XMLHttpRequest|WebSocket|import|eval|Function|document|window|localStorage)\b/, message: "external browser or code execution API is not allowed" },
    { pattern: /https?:\/\//, message: "external URL is not allowed" },
    { pattern: /(?:^|\s)(?:\/|~\/|\.\.?\/)[^\s"]+/, message: "file path is not allowed" },
    { pattern: /\b(curl|wget|rm|chmod|shell|exec|spawn|network|socket)\b/i, message: "OS or network command is not allowed" },
    { pattern: /\bwhile\b/, message: "unbounded loop is not allowed" },
  ]
  for (const item of blockedPatterns) {
    if (item.pattern.test(source)) {
      throw new Error(`Line 1: ${item.message}`)
    }
  }
}

export function compileDuelScript(sourceCode, options = {}) {
  try {
    checkDuelSafety(sourceCode)
    const ast = parseDuelProgram(sourceCode)
    const ir = buildDuelIr(ast, options)
    const validation = validatePlanIR(ir, null, {
      maxExpandedActions: DUEL_COMPILER_LIMITS.maxExpandedActions,
      maxEstimatedLoad: DUEL_COMPILER_LIMITS.maxVirtualLoad,
      maxEstimatedRisk: COMMON_PLAN_LIMITS.maxEstimatedRisk,
    })
    ir.validation = validation
    if (validation.status === "invalid") {
      return { ok: false, ast, ir: null, errors: validation.diagnostics.map((diagnostic) => diagnostic.message), diagnostics: validation.diagnostics }
    }
    return { ok: true, ast, ir, errors: [], diagnostics: [] }
  } catch (error) {
    return { ok: false, ast: null, ir: null, errors: [String(error.message || error)], diagnostics: [] }
  }
}

export function guiPlanToDuelIr(option = {}, options = {}) {
  const actionIds =
    option.id === "gui_balanced"
      ? ["sequence_shift", "refund_probe", "low_noise_probe"]
      : option.steps?.filter((step) => DUEL_ACTIONS[step]) || []
  const actions = actionIds.map((actionId) => {
    const action = DUEL_ACTIONS[actionId]
    const params = Object.fromEntries(
      Object.entries(action.params).map(([name, schema]) => [name, schema.defaultValue])
    )
    return {
      type: actionId,
      label: action.label,
      params,
      estimatedCost: action.estimatedCost,
      estimatedLoad: action.estimatedLoad,
      estimatedRisk: action.risk,
      risk: action.risk,
      gain: action.gain,
      tags: clone(action.tags),
      line: 0,
    }
  })
  const planIr = createPlanIR({
    planId: option.id || "gui_plan",
    displayName: option.label || option.id || "GUI Plan",
    source: {
      sourceType: "gui",
      sourceId: option.id || "gui_plan",
      sourceLabel: option.label || "GUI Plan",
      guiBuilderId: "advanced-option-builder",
    },
    chapterId: options.chapterId,
    stageId: options.stageId,
    actions,
    metadata: {
      usesObservation: false,
      usesLoop: false,
      usesBranch: false,
      usesTemplate: false,
    },
    validation: { status: "valid", checkedAt: 0, diagnostics: [] },
    now: options.now,
  })
  planIr.metadata.estimatedLoad = planIr.metadata.estimatedTotalLoad
  planIr.metadata.estimatedRisk = planIr.metadata.estimatedDetectionRisk
  planIr.metadata.estimatedGain = actions.reduce((sum, action) => sum + action.gain, 0)
  return planIr
}

export function simulateDuelRound(duelIr, defenderState = {}, roundIndex = 1) {
  const actions = Array.isArray(duelIr?.actions) ? duelIr.actions : []
  const rawGain = actions.reduce((sum, action) => sum + Number(action.gain || 0), 0)
  const estimatedLoad = actions.reduce((sum, action) => sum + Number(action.estimatedLoad || 0), 0)
  const actionRisk = actions.reduce((sum, action) => sum + Math.max(0, Number(action.risk || 0)), 0)
  const alertLevel = Number(defenderState.alertLevel || 1)
  const memory = Number(defenderState.memory || 0)
  const repeatedPenalty = memory > 0 ? Math.min(24, memory * 8) : 0
  const detectionScore = Math.max(0, Math.round(actionRisk + alertLevel * 6 + repeatedPenalty - actions.filter((action) => action.tags.includes("stealth")).length * 10))
  const queue = Math.max(0, estimatedLoad + Math.floor(detectionScore / 24))
  const latency = 45 + queue * 22
  const blocked = detectionScore >= 72 || estimatedLoad > DUEL_COMPILER_LIMITS.maxVirtualLoad
  const scoreDelta = Math.max(0, Math.round(rawGain - detectionScore / 9 - (blocked ? 8 : 0) - latency / 90))
  const summary = blocked
    ? "防御側が高い検知スコアに反応し、ラウンド利得を抑えました。"
    : "計画は仮想環境内で実行され、防御反応を受けつつスコアを得ました。"
  return {
    roundIndex,
    rawGain,
    estimatedLoad,
    detectionScore,
    queue,
    latency,
    blocked,
    scoreDelta,
    summary,
    roundEvents: actions.map((action) => `${action.label}: ${JSON.stringify(action.params)}`),
    defenseEvents: [
      blocked ? "rate_limit_triggered" : "monitor_only",
      detectionScore >= 50 ? "pattern_score_increased" : "low_signal",
    ],
    updatedDefenderState: {
      alertLevel: Math.min(5, alertLevel + (blocked ? 1 : detectionScore >= 50 ? 0.5 : 0)),
      memory: memory + 1,
      rateLimit: blocked,
      queue,
      lastBlockReason: blocked ? "detection_threshold" : "none",
      lastScoreDelta: scoreDelta,
      score: Number(defenderState.score || 0) + scoreDelta,
    },
  }
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
    default: {
      const advancedState = createInitialAdvancedState(stageId)
      if (advancedState) return advancedState
      throw new Error(`unknown stage: ${stageId}`)
    }
  }
}

export function runStageAction(stageId, previousState, action, payload = {}) {
  const advancedState = runAdvancedStageAction(stageId, previousState, action, payload)
  if (advancedState) return advancedState

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
