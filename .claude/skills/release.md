# Ground UI リリーススキル

Ground UI の変更を検証 → カタログ更新&デプロイ → npm パブリッシュまで一気通貫で実行する。

## 適用タイミング

以下のリクエスト時に自動適用:
- 「デプロイして」「リリースして」「パブリッシュして」
- 「カタログに反映して」
- CSS/コンポーネントの変更後に反映を求められた時

## 前提条件

- 作業ディレクトリ: ground-ui プロジェクトルート
- Cloudflare Pages プロジェクト名: `ground-ui`
- 本番カタログURL: `https://ground-ui.pages.dev`（`main` ブランチのデプロイのみ反映）
- npm レジストリ: GitHub Packages (`npm.pkg.github.com`)

## 実行フロー

### Step 1. ビルド検証（並列実行）

```bash
npx tsc --noEmit          # 型チェック
npm run build             # プロダクションビルド
npm run test              # テスト実行
```

全て通過しなければ先に進まない。

### Step 2. カタログ更新

変更内容がカタログに影響する場合（コンポーネント追加/変更、トークン変更、CSS変更など）:

1. `catalog/pages/ComponentsPage.tsx` にデモセクションを追加・更新
2. 必要に応じてナビゲーション、ラベル、翻訳を更新
3. `npm run catalog:build` で検証

カタログに影響しない変更（内部リファクタ、テストのみ等）は skip。

### Step 3. main へマージ & push

feature ブランチで作業中の場合:

```bash
git add <files>
git commit -m "..."
git checkout main
git merge <feature-branch> --no-edit
git push origin main
```

既に main なら commit & push のみ。

### Step 4. カタログデプロイ

main ブランチ上で実行:

```bash
npm run catalog:deploy
# = npm run catalog:build && npx wrangler pages deploy catalog/dist --project-name=ground-ui --commit-dirty=true
```

→ `https://ground-ui.pages.dev` に反映される。

### Step 5. npm パブリッシュ

```bash
npm version patch          # バージョンバンプ（変更規模に応じて patch/minor/major）
npm publish                # prepublishOnly が自動実行（generate-tokens → build → typecheck）
git push origin main --tags   # バージョンタグを push
```

### Step 6. 結果報告

以下を報告:
- カタログURL: `https://ground-ui.pages.dev`
- パブリッシュバージョン: `@nannantown/ground-ui@x.x.x`
- 消費側の更新コマンド: `npm update @nannantown/ground-ui`

## バージョニング指針

| 変更内容 | コマンド | 例 |
|---------|---------|-----|
| バグ修正 / ユーティリティ追加 | `npm version patch` | 0.5.0 → 0.5.1 |
| 新コンポーネント / 機能追加 | `npm version minor` | 0.5.1 → 0.6.0 |
| 破壊的変更 | `npm version major` | 0.6.0 → 1.0.0 |

## エラー時の対応

| エラー | 対応 |
|--------|------|
| 型チェック / ビルド / テスト失敗 | エラーを修正してから Step 1 をリトライ |
| `catalog:build` 失敗 | カタログのインポート / CSS 構文エラーを確認 |
| `wrangler` 認証エラー | `npx wrangler login` を案内 |
| 本番URLに反映されない | `main` ブランチからデプロイしているか確認 |
| `npm publish` 失敗 | `.npmrc` の PAT 期限切れを確認 |
| バージョン競合 | `npm view @nannantown/ground-ui version` で現在のリモート版を確認 |
