# Current Directive
- updated_at: 2026-03-18T08:00:00+09:00
- priority: medium
- status: done
- cycle: 14

## Task
Breadcrumb に disabled 状態を追加し、全5状態準拠にする。

## Why
Breadcrumb は 80% (disabled 欠落のみ)。disabled 追加で 100% 達成。

## How
1. tokens.css: .breadcrumb-item-disabled クラス追加
2. BreadcrumbItemProps に disabled? 追加
3. disabled 時は <span> 描画 + aria-disabled

## Acceptance Criteria
- [x] BreadcrumbItemProps.disabled が型定義に含まれている
- [x] .breadcrumb-item-disabled が tokens.css に定義されている
- [x] disabled 時に <a> → <span> にフォールバック
- [x] ビルドが通ること
