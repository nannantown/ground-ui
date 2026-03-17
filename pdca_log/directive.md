# Current Directive
- updated_at: 2026-03-18T02:00:00+09:00
- priority: high
- status: done
- cycle: 8

## Task
DataTable の sortable headers と clickable rows にキーボードアクセシビリティ + focus-visible を追加する。

## Why
5状態ルール監査 Top 10 #9。DataTable は hover/active はJS で実装済みだが focus-visible 欠落。
sortable ヘッダーとクリック可能行がキーボードで操作不可だった。

## How
1. tokens.css: .table-header-sortable (hover + focus-visible) + .table-row-clickable (focus-visible) 追加
2. DataTable.tsx: sortable headers に CSS クラス + tabIndex + role="button" + onKeyDown 追加
3. DataTable.tsx: clickable rows に CSS クラス + tabIndex + onKeyDown 追加
4. sortable headers の JS hover を CSS :hover に移行

## Acceptance Criteria
- [x] sortable ヘッダーが Tab でフォーカス可能
- [x] sortable ヘッダーが Enter/Space で操作可能
- [x] clickable 行が Tab でフォーカス可能
- [x] clickable 行が Enter/Space で操作可能
- [x] focus-visible スタイルが定義されている
- [x] ビルドが通ること
