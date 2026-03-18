# Current Directive
- updated_at: 2026-03-19T05:00:00+09:00
- priority: medium
- status: done
- cycle: 34

## Task
Image (レスポンシブ画像) コンポーネントを新規作成する。

## Why
MANAGER_BRAIN C-20「Image（レスポンシブ画像）」が ❌ 未実装。
fit/radius/aspectRatio/fallback を持つ画像コンポーネントはデザインシステムの基本パーツ。

## How
1. Image.tsx: fit, radius, aspectRatio, fallback props + forwardRef
2. index.ts: export 追加
3. Image.test.tsx: 14 テストケース

## Acceptance Criteria
- [x] Image コンポーネントが作成されている
- [x] radius が GroundUI トークン (--radius-*) を使用している
- [x] fallback が onError で表示される
- [x] 全テストがパスする
- [x] ビルドが通ること
