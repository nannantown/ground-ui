# Current Directive
- updated_at: 2026-03-18T07:00:00+09:00
- priority: medium
- status: done
- cycle: 13

## Task
BottomNav に disabled 状態を追加し、focus-visible を CSS に移行する。

## Why
BottomNav は 80% (disabled 欠落 + focus-visible が JS onFocus/onBlur で不正確)。
inline outline:none が CSS :focus-visible をブロックしていた。

## How
1. BottomNavItem に disabled? 追加、button に disabled 属性渡し
2. inline outline:none 削除、className="bottom-nav-item" 追加
3. JS onFocus/onBlur 削除 → CSS :focus-visible で代替

## Acceptance Criteria
- [x] BottomNavItem.disabled が型定義に含まれている
- [x] disabled 時の視覚的フィードバックがある
- [x] JS onFocus/onBlur が削除され CSS :focus-visible に移行
- [x] ビルドが通ること
