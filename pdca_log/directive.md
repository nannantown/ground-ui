# Current Directive
- updated_at: 2026-03-19T01:00:00+09:00
- priority: medium
- status: done
- cycle: 30

## Task
ToolbarButton コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。ToolbarButton は Cycle 7 で CSS クラス化 + disabled 追加した。
リファクタリング結果が正しく動作することをテストで検証。

## How
1. src/components/ToolbarButton.test.tsx 新規作成
2. 9 テストケース: rendering, CSS class, onClick, disabled, aria-label, style
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] ToolbarButton.test.tsx が作成されている
- [x] 全 9 テストがパスする
- [x] typecheck / lint / build が通ること
