# Current Directive
- updated_at: 2026-03-20T04:00:00+09:00
- priority: medium
- status: done
- cycle: 58

## Task
Toast コンポーネントの unit test を追加する。

## Why
Q-04 継続。Toast は Cycle 9 で dismiss ボタンを .btn に移行した。
Provider/useToast hook、dismiss、variant をテストで検証。

## Acceptance Criteria
- [x] Toast.test.tsx が作成されている
- [x] dismiss ボタンの .btn クラスがテストされている
- [x] 全 8 テストがパスする
- [x] ビルドが通ること
