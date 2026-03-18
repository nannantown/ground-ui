# Current Directive
- updated_at: 2026-03-18T19:00:00+09:00
- priority: high
- status: done
- cycle: 25

## Task
Alert コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続 (9/10)。Alert は 4 variant + close ボタン (.btn クラス) を持つ
フィードバック系コンポーネント。variant 出し分け、title、close 動作を担保。

## How
1. src/components/Alert.test.tsx 新規作成
2. 16 テストケース: rendering, variants (4), title, icon, close button
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Alert.test.tsx が作成されている
- [x] 全 16 テストがパスする
- [x] typecheck / lint / build が通ること
