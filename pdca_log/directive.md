# Current Directive
- updated_at: 2026-03-19T12:00:00+09:00
- priority: medium
- status: done
- cycle: 42

## Task
ページトランジション CSS アニメーションクラスを追加する。

## Why
MANAGER_BRAIN A-04「ページトランジション」が ❌ 未実装。
SPA のルート遷移時に使える enter/exit + 左右スライドのアニメーションが必要。

## How
1. tokens.css: 4 keyframes (page-enter/exit/slide-left/slide-right)
2. tokens.css: 4 CSS クラス (.page-enter/exit/slide-left/slide-right)
3. motion トークン参照

## Acceptance Criteria
- [x] 4 ページトランジションクラスが定義されている
- [x] motion トークンを使用している
- [x] ビルドが通ること
