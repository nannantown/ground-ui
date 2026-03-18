# Current Directive
- updated_at: 2026-03-18T17:00:00+09:00
- priority: high
- status: done
- cycle: 23

## Task
DropdownMenu コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。DropdownMenu は Cycle 5 で CSS クラス化した。
DropdownItem (CSS classes, variants, disabled) + DropdownMenu (open/close, Escape) の動作を担保。

## How
1. src/components/DropdownMenu.test.tsx 新規作成
2. 13 テストケース: DropdownItem (7), DropdownDivider (1), DropdownMenu (5)
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] DropdownMenu.test.tsx が作成されている
- [x] 全 13 テストがパスする
- [x] typecheck / lint / build が通ること
