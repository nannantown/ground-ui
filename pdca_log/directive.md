# Current Directive
- updated_at: 2026-03-19T17:00:00+09:00
- priority: medium
- status: done
- cycle: 47

## Task
RadioGroup コンポーネントの unit test を追加する。

## Why
Q-04 継続。RadioGroup は Context ベースの controlled/uncontrolled フォームコンポーネント。
hidden input + visual radio の二重構造をテストで検証。

## How
1. src/components/RadioGroup.test.tsx 新規作成
2. 12 テストケース (container query で hidden input を取得)

## Acceptance Criteria
- [x] RadioGroup.test.tsx が作成されている
- [x] 全 12 テストがパスする
- [x] typecheck / lint / build が通ること
