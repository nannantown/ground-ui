# Current Directive
- updated_at: 2026-03-19T23:00:00+09:00
- priority: medium
- status: done
- cycle: 53

## Task
Calendar (月表示) コンポーネントを新規作成する。

## Why
MANAGER_BRAIN C-48「Calendar（月/週表示）」が ⚠️ CSSクラスのみ。
.calendar-* CSS は tokens.css に定義済みだが React コンポーネントがなかった。

## Acceptance Criteria
- [x] Calendar コンポーネントが作成されている
- [x] 既存 .calendar-* CSS クラスを使用している
- [x] min/max 制限が動作する
- [x] 全テストがパスする
- [x] ビルドが通ること
