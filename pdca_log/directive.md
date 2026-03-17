# Current Directive
- updated_at: 2026-03-17T15:00:00+09:00
- priority: high
- status: done
- cycle: 4

## Task
tokens.css の .bottom-nav-item と .breadcrumb-item に :focus-visible ルールを追加する。

## Why
5状態ルール監査 Top 10 #3 (BottomNav 70%) と #4 (Breadcrumb 60%)。
両方とも :focus-visible が欠落しており、WCAG 2.4.7 違反。
CSS のみの修正で完結するため1サイクルでまとめて対応。

## How
1. .bottom-nav-item:focus-visible 追加 (hover/active の後)
2. .breadcrumb-item:focus-visible 追加 (.breadcrumb-separator の前)

## Acceptance Criteria
- [x] .bottom-nav-item:focus-visible が tokens.css に定義されている
- [x] .breadcrumb-item:focus-visible が tokens.css に定義されている
- [x] ビルドが通ること
