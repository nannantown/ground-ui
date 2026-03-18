# Current Directive
- updated_at: 2026-03-19T06:00:00+09:00
- priority: medium
- status: done
- cycle: 35

## Task
Sticky (スクロール追従) レイアウトコンポーネントを新規作成する。

## Why
MANAGER_BRAIN L-13「Sticky（スクロール追従）」が ❌ 未実装。
CSS ヘルパー (.sticky-top 等) は tokens.css に存在するが React コンポーネントがなかった。

## How
1. Sticky.tsx: position (top/top-header/bottom) + offset + forwardRef
2. layout/index.ts + index.ts: export 追加
3. Sticky.test.tsx: 9 テストケース

## Acceptance Criteria
- [x] Sticky コンポーネントが作成されている
- [x] 既存 .sticky-* CSS クラスを使用している
- [x] 全テストがパスする
- [x] ビルドが通ること
