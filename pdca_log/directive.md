# Current Directive
- updated_at: 2026-03-19T02:00:00+09:00
- priority: medium
- status: done
- cycle: 31

## Task
Modal コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。Modal は Cycle 10 で close ボタンを .btn クラスに移行した。
open/close 動作、Escape キー、close ボタン CSS クラス、ARIA をテストで検証。

## How
1. src/components/Modal.test.tsx 新規作成
2. 14 テストケース: Modal (11) + ModalHeader/Body/Footer (3)
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Modal.test.tsx が作成されている
- [x] 全 14 テストがパスする
- [x] typecheck / lint / build が通ること
