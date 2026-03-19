# Current Directive
- updated_at: 2026-03-19T19:00:00+09:00
- priority: high
- status: done
- cycle: 49

## Task
WCAG AA アクセシビリティ監査を実施し、クリティカルな問題を即時修正する。

## Why
MANAGER_BRAIN Q-07「アクセシビリティ監査」が ⚠️ 色対比のみ。
ARIA/keyboard/labels/focus の体系的チェックが未実施だった。

## How
1. エージェントで 10 コンポーネントの ARIA/keyboard/labels/focus を監査
2. a11y_audit.md にレポート保存
3. クリティカル修正: Button aria-busy, Checkbox 重複 ARIA 削除

## Acceptance Criteria
- [x] 監査レポートが作成されている
- [x] Button に aria-busy が追加されている
- [x] Checkbox の重複 ARIA が削除されている
- [x] テスト追加 + ビルドが通ること
