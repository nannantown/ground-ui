# Current Directive
- updated_at: 2026-03-18T03:00:00+09:00
- priority: high
- status: done
- cycle: 9

## Task
Toast の dismiss ボタンを .btn CSS クラスシステムに移行し、全5状態を自動継承させる。

## Why
5状態ルール監査 Top 10 #10 (最後)。Toast dismiss ボタンが全インラインスタイルで5状態中1つしか対応なし (20%)。
既存 .btn-ghost .btn-icon クラスを再利用すれば CSS 追加なしで全5状態が付与される。

## How
1. Toast.tsx: dismiss button に className="btn btn-ghost btn-icon btn-sm" を適用
2. インラインスタイル削除、aria-label 追加

## Acceptance Criteria
- [x] dismiss ボタンが .btn CSS クラスを使用している
- [x] 全5状態が CSS から継承されている
- [x] aria-label が追加されている
- [x] ビルドが通ること
