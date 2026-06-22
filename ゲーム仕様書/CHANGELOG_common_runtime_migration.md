# 共通ランタイム仕様 切り出し作業レポート

## 1. 実施内容

- `common_runtime_spec.md` を新設した。
- `GameEvent` を定義した。
- `RuntimeState` を定義した。
- `ScoreResult` / `ScoreProfile` を定義した。
- `PlanIR` を定義した。
- `activePlanSource` を定義した。
- 共通実行パイプラインを固定した。
- 章別仕様書の冒頭に、共通ランタイム仕様への準拠節を追加した。
- 章別仕様書内の「イベントログのデータ構造」「状態遷移仕様」「スコアリング詳細」「GUI/DSL相互変換」などの共通化対象を、共通仕様参照に置き換えた。

## 2. 生成ファイル

- `common_runtime_spec.md`
- `common_runtime_types.ts`
- `security_game_improvement_spec (2).md`
- `chapter_2_spec_cancel_refund.md`
- `chapter_3_spec_rounding_and_search.md`
- `chapter_4_spec_compound_attacks_and_strategy.md`
- `chapter_5_spec_free_experiment_and_adaptive_defense_bridge.md`
- `chapter_6_spec_strategy_automation.md`
- `chapter_7_spec_strategy_search_and_selection.md`
- `chapter8_spec_resource_pressure_and_resilience.md`
- `chapter9_spec_adaptive_strategy_and_reading.md`
- `chapter10_spec_dynamic_duel_mode.md`
- `duel_dsl_compiler_spec.md`

## 3. 参照ルール

章別仕様書では、イベントログ構造、共通状態、共通スコア計算式、PlanIR、activePlanSource、共通実行パイプラインを再定義しない。
章別仕様書は、章固有イベント、章固有UI、章固有成功条件、章固有ScoreProfile重みのみを追加する。

## 4. 次に実装へ進む場合の順序

1. `common_runtime_types.ts` を実装プロジェクトへ配置する。
2. `GameEvent` 生成ヘルパーを作る。
3. `reduceEvents` を作る。
4. `validatePlanIR` を作る。
5. `calculateScore` を作る。
6. 第0〜1章から順に、既存UI操作を `RuntimeCommand` または `PlanIR` 生成へ置き換える。
