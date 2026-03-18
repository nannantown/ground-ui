# Current Directive
- updated_at: 2026-03-18T16:00:00+09:00
- priority: high
- status: done
- cycle: 22

## Task
Input コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。Input はフォーム系の最も基本的なコンポーネント。
icon 有無で描画構造が変わる分岐 (plain input vs div wrapper) をテストで担保。

## How
1. src/components/Input.test.tsx 新規作成
2. 20 テストケース: rendering, value, onChange, disabled, error, icons, ref, HTML attrs
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Input.test.tsx が作成されている
- [x] 全 20 テストがパスする
- [x] typecheck / lint / build が通ること
