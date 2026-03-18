# Current Directive
- updated_at: 2026-03-18T13:00:00+09:00
- priority: high
- status: done
- cycle: 19

## Task
Tabs コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。Tabs は Cycle 12 で disabled + underline CSS クラス化した。
pill/underline 両 variant、disabled、count badge の動作をテストで担保する。

## How
1. src/components/Tabs.test.tsx 新規作成
2. 15 テストケース: rendering, pill/underline variants, onChange, disabled, count badge
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Tabs.test.tsx が作成されている
- [x] 全 15 テストがパスする
- [x] typecheck / lint / build が通ること
