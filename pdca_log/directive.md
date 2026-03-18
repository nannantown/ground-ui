# Current Directive
- updated_at: 2026-03-18T15:00:00+09:00
- priority: high
- status: done
- cycle: 21

## Task
Checkbox コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。Checkbox は controlled/uncontrolled dual mode を持つ
フォーム入力系コンポーネント。defaultChecked、onChange、disabled の動作を担保。

## How
1. src/components/Checkbox.test.tsx 新規作成
2. 18 テストケース: rendering, controlled/uncontrolled, onChange, disabled, ARIA, CSS, id
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Checkbox.test.tsx が作成されている
- [x] 全 18 テストがパスする
- [x] typecheck / lint / build が通ること
