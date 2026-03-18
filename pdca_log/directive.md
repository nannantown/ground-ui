# Current Directive
- updated_at: 2026-03-18T22:00:00+09:00
- priority: medium
- status: done
- cycle: 28

## Task
エグジットアニメーション (fade-out, scale-out, slide-out-down, slide-out-up) を追加する。

## Why
MANAGER_BRAIN A-02「エグジットアニメーション」が ⚠️ 一部のみ。
fade-in/scale-in/slide-up/slide-down のエントランスに対応するエグジットが必要。
overlay/modal/toast の退場時に使用。

## How
1. tokens.css: @keyframes scale-out, slide-out-down, slide-out-up 追加
2. tokens.css: .animate-fade-out, .animate-scale-out, .animate-slide-out-down, .animate-slide-out-up クラス追加
3. CLAUDE.md Animations セクション更新

## Acceptance Criteria
- [x] 4 エグジットアニメーション keyframes + classes が定義されている
- [x] CLAUDE.md が更新されている
- [x] ビルドが通ること
