# Current Directive
- updated_at: 2026-03-19T09:00:00+09:00
- priority: medium
- status: done
- cycle: 39

## Task
Select コンポーネントの unit test を追加する。

## Why
Q-04 継続。Select はカスタムドロップダウンで最も複雑なフォーム系コンポーネント。
controlled/uncontrolled、keyboard nav、disabled option、hidden input をテストで担保。

## How
1. src/components/Select.test.tsx 新規作成
2. 19 テストケース + scrollIntoView mock
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Select.test.tsx が作成されている
- [x] 全 19 テストがパスする
- [x] typecheck / lint / build が通ること
