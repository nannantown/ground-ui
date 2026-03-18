# Current Directive
- updated_at: 2026-03-19T07:00:00+09:00
- priority: medium
- status: done
- cycle: 36

## Task
Masonry (ピン留めグリッド) レイアウトコンポーネントを新規作成する。

## Why
MANAGER_BRAIN L-12「Masonry（ピン留めグリッド）」が ⚠️ CSSクラスのみ。
.masonry-2/3/4 CSS は tokens.css に定義済みだが React コンポーネントがなかった。
これで Layout Layer 全 13 コンポーネント完了 (100%)。

## How
1. Masonry.tsx: columns (2/3/4) + forwardRef
2. layout/index.ts + index.ts: export 追加
3. Masonry.test.tsx: 7 テストケース

## Acceptance Criteria
- [x] Masonry コンポーネントが作成されている
- [x] 既存 .masonry-* CSS クラスを使用している
- [x] 全テストがパスする
- [x] ビルドが通ること
- [x] Layout Layer 100% 達成
