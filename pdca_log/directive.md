# Current Directive
- updated_at: 2026-03-19T10:00:00+09:00
- priority: medium
- status: done
- cycle: 40

## Task
マイクロインタラクション CSS ユーティリティ (press-scale, press-dim, press-feedback, ripple) を追加する。

## Why
MANAGER_BRAIN A-03「マイクロインタラクション」が ⚠️ hover中心。
press/ripple のフィードバックユーティリティがなかった。

## How
1. tokens.css: .press-scale, .press-dim, .press-feedback, .ripple クラス追加
2. :active:not(:disabled) で適用、50ms の即時反応
3. .ripple は ::after + radial-gradient で CSS-only 実装
4. CLAUDE.md 更新

## Acceptance Criteria
- [x] 4 マイクロインタラクションクラスが定義されている
- [x] prefers-reduced-motion 対応 (既存 global ルールで自動)
- [x] CLAUDE.md が更新されている
- [x] ビルドが通ること
