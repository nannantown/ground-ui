# Current Directive
- updated_at: 2026-03-19T14:00:00+09:00
- priority: medium
- status: done
- cycle: 44

## Task
FileUpload (ファイルアップロード) コンポーネントを新規作成する。

## Why
MANAGER_BRAIN C-42「FileUpload」が ❌ 未実装。
drag & drop + click to browse パターンはフォーム系の基本パーツ。

## How
1. FileUpload.tsx: drag/drop + click + accept/multiple/maxSize/disabled
2. tokens.css: .file-upload CSS クラス群追加
3. index.ts: export
4. FileUpload.test.tsx: 16 テストケース

## Acceptance Criteria
- [x] FileUpload コンポーネントが作成されている
- [x] CSS クラスが tokens.css に定義されている
- [x] 全テストがパスする
- [x] ビルドが通ること
