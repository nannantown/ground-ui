# Current Directive
- updated_at: 2026-03-18T05:00:00+09:00
- priority: medium
- status: done
- cycle: 11

## Task
Stepper の clickable steps に hover + active + focus-visible 視覚フィードバックを追加する。

## Why
監査スコア 60%。tabIndex + keyboard は実装済みだが hover 視覚フィードバックと focus-visible リングが欠落。
水平・垂直両レイアウトに影響。

## How
1. tokens.css: .stepper-step-clickable クラス追加 (hover/active/focus-visible)
2. Stepper.tsx: 水平の clickable step div + 垂直の clickable circle div に CSS クラス適用

## Acceptance Criteria
- [x] .stepper-step-clickable が tokens.css に定義されている
- [x] 水平・垂直両方で適用されている
- [x] inline cursor が CSS クラスに移行されている
- [x] ビルドが通ること
