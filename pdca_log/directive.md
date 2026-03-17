# Current Directive
- updated_at: 2026-03-17T14:00:00+09:00
- priority: high
- status: done
- cycle: 3

## Task
tokens.css の .pill-filter / .pill-filter-active に :focus-visible ルールを追加し、Tabs コンポーネントでキーボードフォーカスが可視化されるようにする。

## Why
5状態ルール監査 Top 10 #2。Tabs は頻出ナビゲーションパターンだが :focus-visible が未定義。
WCAG 2.4.7 準拠のため。

## How
1. tokens.css の .pill-filter:disabled の後に .pill-filter:focus-visible + .pill-filter-active:focus-visible を追加
2. 既存パターンと同じスタイル: outline: 2px solid var(--focus-ring); outline-offset: 2px;

## Acceptance Criteria
- [x] .pill-filter:focus-visible が tokens.css に定義されている
- [x] .pill-filter-active:focus-visible も定義されている
- [x] ビルドが通ること
