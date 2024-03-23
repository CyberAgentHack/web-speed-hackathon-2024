## 開発方法

### 必要なもの

- Node.js v20.11.1 以上

### セットアップ

1. pnpm （パッケージマネージャ）を有効化します
   - ```bash
     corepack enable pnpm
     corepack use pnpm@latest
     ```
2. 依存パッケージをインストールします
   - ```bash
     pnpm install
     ```

### ビルド・起動

1. サーバー、アプリ、管理画面のコードをビルドします
   - ```bash
     pnpm run build
     ```
2. サーバーを起動します
   - ```bash
     pnpm run start
     ```
3. Cyber TOON Web アプリには `http://localhost:8000/` でアクセスします
4. Cyber TOON 管理画面には `http://localhost:8000/admin` でアクセスします
   - ユーザー名: `administrator@example.com`
   - パスワード: `pa5sW0rd!`

## ディレクトリ構成

pnpm workspaces を採用しています。

- `/workspaces/server` : サーバーの実装です
- `/workspaces/client` : ブラウザが読み込むエントリーファイルです
- `/workspaces/app` : Cyber TOON Web アプリです
- `/workspaces/admin` : Cyber TOON 管理画面です
- `/workspaces/schema` : データベースモデルと API リクエスト・レスポンスのインタフェースです
- `/workspaces/image-encrypt`: 画像難読化のためのコードです
- `/workspaces/testing`: E2E テストと VRT の実行環境です

## API ドキュメント

API ドキュメントを Swagger UI で提供しています。

ローカルでサーバーを建てて、 `http://localhost:8000/api/v1` にアクセスします。

## E2E テスト・Visual Regression Testing

Playwright で E2E テスト・Visual Regression Testing (VRT) を提供しています。

**競技後のレギュレーションチェックでは、提供している E2E テスト・VRT と同等のコードで検証します。**

### 使い方

1. Playwright 用の Chromium をインストールします
   - ```bash
     pnpm --filter "@wsh-2024/testing" exec playwright install chromium
     ```
2. ローカル環境に対してテストを実行する場合は、サーバーをあらかじめ起動しておきます
   - ```bash
     pnpm run build && pnpm run start
     ```
3. E2E テスト・VRT を実行します

   - :warning: スクリーンショットは環境によって差異が生じるため、ご自身の環境で最初に取り直すことを推奨します
     - スクリーンショットを取り直す場合は、 `/workspaces/testing/package.json` のコマンドに `--update-snapshots` オプションを追加します
   - ローカル環境に対してテストを実行する場合
     - ```bash
       pnpm run test
       ```
   - リモート環境に対してテストを実行する場合
     - ```bash
       E2E_BASE_URL=https://web-speed-hackathon-2024.example.com pnpm run test
       ```

4. デバッグモードでは、ステップバイステップで E2E テスト・VRT を実行できます
   - ```bash
     pnpm run test:debug
     ```
   - 特定のテストのみを実行したい場合は [test.describe.only](https://playwright.dev/docs/api/class-test#test-describe-only) や [test.only](https://playwright.dev/docs/api/class-test#test-only) で絞り込みを行うと便利です
   - さらに詳しいデバッグの Tips は Playwright 公式が提供している [Debugging Tests](https://playwright.dev/docs/debug) をご覧ください

## Service Worker について

今回の課題は、Service Worker のコードも提供しています。
Service Worker で不具合が起きた場合、ページへアクセスできなくなる可能性があります。

ページへアクセスできなくなった場合、次の手順で Service Worker をデバッグ・削除できます。

1. `chrome://serviceworker-internals/` にアクセスします
2. 対応する URL の Service Worker を探します
3. Service Worker に対して、停止・削除・インスペクタの表示を行います

## @wsh-2024/image-encrypt について

今回の課題は、漫画ページ画像へ簡易的な難読化処理をかけています。
このレポジトリで提供される漫画ページ画像は、既に難読化処理がされています。

難読化された画像を復号するための CLI ツールを用意しています。

### 復号する場合

難読化された画像が格納されているディレクトリを `./encrypted`、出力先ディレクトリを `./output` とするとき、次のコマンドで復号化できます。

```bash
cd workspaces/image-encrypt
pnpm run cli decrypt ./encrypted ./output
```

### 難読化する場合

元画像が格納されているディレクトリを `./raw`、出力先ディレクトリを `./output` とするとき、次のコマンドで復号化できます。

```bash
cd workspaces/image-encrypt;
pnpm run cli encrypt ./raw ./output
```
