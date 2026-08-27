# ゲーム内DSLガイド

このディレクトリには、Security Learning Game でプレイヤーが入力できる3種類の専用言語（DSL）の説明書があります。

- [Search Console Mini Script](./search-console-dsl/README.md) — 第3章の条件探索を自動化する小型DSL
- [Duel DSL](./duel-dsl/README.md) — 第10章の攻撃計画を `PlanIR` に変換するDSL
- [HackScript](./hackscript/README.md) — Hack Lab の章別パラメーターを設定するDSL（現在は本編未接続）

いずれもJavaScriptやPythonを直接実行するものではありません。ブラウザ上のJavaScriptで構文を解析し、許可されたゲーム内操作だけを処理します。
