# Current Directive
- updated_at: 2026-03-17T13:00:00+09:00
- priority: high
- status: done
- cycle: 2

## Task
tokens.css の .btn クラスに :focus-visible ルールを追加し、全ボタンvariantでキーボードフォーカスが可視化されるようにする。

## Why
5状態ルール監査 (five_state_audit.md) の Top 10 #1。
.btn の `outline: none` が global `*:focus-visible` を上書きしており、WCAG 2.4.7 違反。
Button は最も使用頻度の高いコンポーネントであり、10+コンポーネントに波及する。

## How
1. tokens.css の .btn-icon.btn-lg の後に .btn:focus-visible ルールを追加
2. 既存パターン (checkbox, toggle-switch 等) と同じスタイル: outline: 2px solid var(--focus-ring); outline-offset: 2px;
3. typecheck / lint / build 確認

## Acceptance Criteria
- [x] .btn:focus-visible がtokens.cssに定義されている
- [x] ビルドが通ること
- [x] 既存パターンと一貫したスタイル
