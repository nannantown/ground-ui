# Current Directive
- updated_at: 2026-03-18T01:00:00+09:00
- priority: high
- status: done
- cycle: 7

## Task
ToolbarButton を CSS クラスシステムに移行し、全5状態を tokens.css で定義する。

## Why
5状態ルール監査 Top 10 #8。ToolbarButton が全てインラインスタイルで CSS クラスなし。
disabled/active/focus-visible が欠落 (40%)。ThemeToggle もこのコンポーネントを wrap しているため波及効果大。

## How
1. tokens.css に .toolbar-button クラス追加 (5状態完備)
2. ToolbarButton.tsx を cn() + CSS クラスに移行、インラインスタイルと JS イベントハンドラ削除
3. disabled prop 追加

## Acceptance Criteria
- [x] .toolbar-button が tokens.css に 5 状態で定義されている
- [x] ToolbarButton が cn() + CSS クラスを使用している
- [x] disabled prop が追加されている
- [x] ビルドが通ること
