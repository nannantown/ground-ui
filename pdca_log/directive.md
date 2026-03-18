# Current Directive
- updated_at: 2026-03-18T12:00:00+09:00
- priority: high
- status: done
- cycle: 18

## Task
Accordion コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。Accordion は Cycle 6 で disabled + active を追加した。
single/multiple モード、defaultValue、disabled の動作をテストで担保する。

## How
1. src/components/Accordion.test.tsx 新規作成
2. 18 テストケース: rendering, single/multiple mode, defaultValue, disabled, ARIA, CSS state
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Accordion.test.tsx が作成されている
- [x] 全 18 テストがパスする
- [x] typecheck / lint / build が通ること
