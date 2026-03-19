# Current Directive
- updated_at: 2026-03-19T11:00:00+09:00
- priority: medium
- status: done
- cycle: 41

## Task
スプリング物理イージングのバリエーションを CSS トークンとして追加する。

## Why
MANAGER_BRAIN A-07「スプリング物理」が ⚠️ interactionsのみ。
--ease-spring が 1 種類しかなく、バウンス感の調整がトークンレベルでできなかった。

## How
1. tokens.css: --ease-spring-gentle/bouncy/snappy の 3 バリエーション追加
2. 既存 --ease-spring (default) は変更なし

## Acceptance Criteria
- [x] 3 スプリングバリエーションが定義されている
- [x] ビルドが通ること
