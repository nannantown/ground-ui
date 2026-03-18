# Current Directive
- updated_at: 2026-03-18T18:00:00+09:00
- priority: high
- status: done
- cycle: 24

## Task
Breadcrumb コンポーネントの unit test を追加する。

## Why
Q-04 Unit Test 追加継続。Breadcrumb は Cycle 14 で disabled を追加した。
link/span 切り替え、auto-active、disabled、separator の動作を担保。

## How
1. src/components/Breadcrumb.test.tsx 新規作成
2. 17 テストケース: Breadcrumb (7) + BreadcrumbItem (10)
3. vitest + @testing-library/react 使用

## Acceptance Criteria
- [x] Breadcrumb.test.tsx が作成されている
- [x] 全 17 テストがパスする
- [x] typecheck / lint / build が通ること
