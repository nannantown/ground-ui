# Current Directive
- updated_at: 2026-03-19T04:00:00+09:00
- priority: medium
- status: done
- cycle: 33

## Task
CodeBlock コンポーネントを新規作成する (既存 CSS クラスのコンポーネント化)。

## Why
MANAGER_BRAIN C-21 「CodeBlock（シンタックスハイライト）」が ⚠️ CSSクラスのみ。
.code-block CSS は tokens.css に定義済みだが React コンポーネントがなかった。

## How
1. CodeBlock.tsx: language/title ヘッダー + copy ボタン + pre/code
2. index.ts: export 追加
3. CodeBlock.test.tsx: 12 テストケース

## Acceptance Criteria
- [x] CodeBlock コンポーネントが作成されている
- [x] 既存 .code-block CSS クラスを使用している
- [x] copy ボタンが .btn クラスを使用している
- [x] 全テストがパスする
- [x] ビルドが通ること
