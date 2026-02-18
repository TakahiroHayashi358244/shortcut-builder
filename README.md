# Shortcut Builder

ショートカットボタン作成ダッシュボード。  
URLを登録してボタンを自由配置し、4桁PINでクラウド保存/読込ができます。

## デモURL

`https://<GitHubユーザー名>.github.io/shortcut-builder/`

## セットアップ

### 1. GAS（バックエンド）

1. [Google スプレッドシート](https://sheets.new) を新規作成
2. シート名を `data` に変更
3. A1〜D1 にヘッダー入力: `pin` / `data` / `updated` / `created`
4. 拡張機能 → Apps Script を開く
5. 以下のGASコードを貼り付けて保存（gas-code.gs を参照）
6. デプロイ → 新しいデプロイ → ウェブアプリ
   - 実行するユーザー: **自分**
   - アクセス: **全員**
7. デプロイURLをコピー

### 2. GitHub Pages（フロントエンド）

1. このリポジトリをGitHubにpush
2. Settings → Pages → Source: `main` branch / `/ (root)`
3. 公開されるURLをチームに共有

### 3. 初回アクセス

1. 右上の ⚙ アイコンをクリック
2. GAS API URLを貼り付けて保存
3. ショートカットを追加 → クラウド保存（4桁PIN）

## 機能

- カテゴリー / 作業名 / URL でショートカットボタン作成
- 30色 + 30アイコンからカスタマイズ
- 完全フリー配置（端ドラッグで移動、中央クリックでリンク）
- 4桁PINでクラウド保存/読込（別PCから復元可能）
- JSON エクスポート/インポート（ローカルバックアップ）
- 右クリックメニュー（開く/編集/複製/削除）

## ファイル構成

```
index.html    ... ダッシュボード本体（GitHub Pagesで配信）
gas-code.gs   ... GAS WebAPI コード（スプレッドシートに貼り付け）
README.md     ... この説明
```
