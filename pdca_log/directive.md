# Current Directive
- updated_at: 2026-03-18T00:00:00+09:00
- priority: high
- status: done
- cycle: 6

## Task
Accordion に disabled + active 状態を追加し、5状態ルール完全準拠にする。

## Why
5状態ルール監査 Top 10 #7。Accordion は hover + focus-visible はあるが disabled + active が欠落 (60%)。
AccordionItem に disabled prop がないため、特定項目を無効化できなかった。

## How
1. tokens.css: .accordion-trigger に :active:not(:disabled) + :disabled ルール追加
2. tokens.css: :hover → :hover:not(:disabled) に修正
3. Accordion.tsx: AccordionItem interface に disabled? 追加、button に disabled 属性渡し

## Acceptance Criteria
- [x] .accordion-trigger:active:not(:disabled) が定義されている
- [x] .accordion-trigger:disabled が定義されている
- [x] AccordionItem.disabled が型定義に含まれている
- [x] ビルドが通ること
