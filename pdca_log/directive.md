# Current Directive
- updated_at: 2026-03-18T14:00:00+09:00
- priority: high
- status: done
- cycle: 20

## Task
Toggle コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。Toggle は role="switch" + aria-checked を持つ
アクセシブルなコンポーネント。checked/disabled/label の動作を担保。

## How
1. src/components/Toggle.test.tsx 新規作成
2. 15 テストケース: rendering, checked state, onChange, disabled, label, button type
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Toggle.test.tsx が作成されている
- [x] 全 15 テストがパスする
- [x] typecheck / lint / build が通ること
