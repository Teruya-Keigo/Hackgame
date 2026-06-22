# 更新版仕様書セット

このフォルダには、共通ランタイム仕様を切り出した更新版仕様書を格納している。

## 中核ファイル

- `common_runtime_spec.md`: イベントログ、状態遷移、スコアリング、PlanIR、activePlanSource、実行パイプラインの共通仕様
- `common_runtime_types.ts`: 実装参照用の TypeScript 型定義
- `CHANGELOG_common_runtime_migration.md`: 今回の切り出し作業レポート

## 更新方針

章別仕様書は、章固有の学習目標・画面・UI・成功条件・イベント種別のみを定義する。
共通データ構造、共通スコア計算、共通状態管理、PlanIR、GUI/Template/DSL の実行対象選択、共通パイプラインは `common_runtime_spec.md` を参照する。
