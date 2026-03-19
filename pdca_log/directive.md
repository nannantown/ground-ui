# Current Directive
- updated_at: 2026-03-19T13:00:00+09:00
- priority: medium
- status: done
- cycle: 43

## Task
リスト追加/削除のレイアウトアニメーションを CSS で追加する。

## Why
MANAGER_BRAIN A-09「レイアウトアニメーション」が ❌ 未実装。Animation Layer 最後の 1 項目。
リストアイテムの enter/exit で opacity + max-height + translateX の複合アニメーションを提供。

## How
1. tokens.css: 2 keyframes (list-item-enter/exit)
2. tokens.css: 2 CSS クラス (.list-item-enter/exit) + overflow:hidden
3. motion トークン参照

## Acceptance Criteria
- [x] list-item-enter/exit が定義されている
- [x] Animation Layer 9/9 = 100%
- [x] ビルドが通ること
