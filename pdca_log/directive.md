# Current Directive
- updated_at: 2026-03-18T20:00:00+09:00
- priority: high
- status: done
- cycle: 26

## Task
Badge コンポーネントの unit test を追加し、Q-04 の Week 2 目標 (主要10コンポーネント) を達成する。

## Why
Q-04 Unit Test 追加の最終コンポーネント (10/10)。Badge は 6 variant + custom color を持つ
表示系コンポーネント。variant 出し分け、custom color の inline style 動作を担保。

## How
1. src/components/Badge.test.tsx 新規作成
2. 13 テストケース: rendering, 6 variants, custom color, span element
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Badge.test.tsx が作成されている
- [x] 全 13 テストがパスする
- [x] typecheck / lint / build が通ること
- [x] Q-04 主要 10 コンポーネントテスト達成
