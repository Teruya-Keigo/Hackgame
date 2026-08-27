# Security Learning Game

ブラウザで遊べるセキュリティ学習ゲームです。ローカル開発では `server.py` が `static/` 配下の原本ファイルを配信します。

## ローカル開発

```sh
npm run dev
```

`http://127.0.0.1:8080/` を開いて確認します。

## テスト

```sh
npm run test:js
npm run test:py
```

## itch.io 向け公開ビルド

公開用コピーは `public_build/itch/` に生成されます。`static/` の原本ファイルは直接変更しません。

```sh
npm run build:itch
npm run verify:itch
npm run serve:itch
npm run zip:itch
```

`serve:itch` は `public_build/itch` を `http://127.0.0.1:8090/` で静的配信します。公開用コピーは Python サーバ固有の `/static/...` パスを使わず、相対パスで動きます。

itch.io には `public_build/security-game-itch-v0.1.0.zip` をアップロードします。zip の直下に `index.html` がある必要があります。

## Demo

- Play on itch.io: <https://annmnn03.itch.io/security-learning-game>
- GitHub Release: <https://github.com/Teruya-Keigo/Hackgame/releases/tag/v0.1.0>
