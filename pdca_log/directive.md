# Current Directive
- updated_at: 2026-03-18T11:00:00+09:00
- priority: high
- status: done
- cycle: 17

## Task
Button コンポーネントの unit test を追加する。

## Why
MANAGER_BRAIN Q-04 (Unit Test) が ⚠️ 2ファイルのみ。
Button は最頻使用コンポーネントであり、Cycle 2 で :focus-visible 修正済み。
テスト追加でリグレッション防止。

## How
1. src/components/Button.test.tsx 新規作成
2. 22 テストケース: rendering, variants, sizes, icon, disabled, loading, events, ref, props
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Button.test.tsx が作成されている
- [x] 全 22 テストがパスする
- [x] typecheck / lint / build が通ること
