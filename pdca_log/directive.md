# Current Directive
- updated_at: 2026-03-18T04:00:00+09:00
- priority: high
- status: done
- cycle: 10

## Task
Modal の close ボタンを .btn CSS クラスシステムに移行し、全5状態を自動継承させる。

## Why
Modal は監査で 30% と最低スコア。close ボタンが全インラインスタイルで hover/active/disabled/focus-visible なし。
Toast (Cycle 9) と同じパターンで .btn クラス再利用が最も効率的。

## How
1. Modal.tsx: close button に className="btn btn-ghost btn-icon btn-sm" を適用
2. インラインスタイルは position:absolute のみ残し、他は削除
3. aria-label="Close" 追加

## Acceptance Criteria
- [x] close ボタンが .btn CSS クラスを使用している
- [x] 全5状態が CSS から継承されている
- [x] aria-label が追加されている
- [x] ビルドが通ること
