# Current Directive
- updated_at: 2026-03-17T16:00:00+09:00
- priority: high
- status: done
- cycle: 5

## Task
DropdownMenu の DropdownItem を CSS クラスシステムに移行し、全5状態を tokens.css で定義する。

## Why
5状態ルール監査 Top 10 #5。DropdownItem が全てインラインスタイルで CSS クラスなし。
active + focus-visible が欠落 (60%)。GroundUI パターン (CSS class + cn()) に反していた。

## How
1. tokens.css に .dropdown-item / .dropdown-item-danger クラス追加 (5状態完備)
2. DropdownItem を cn() + CSS クラスに移行、インラインスタイルと JS イベントハンドラ削除

## Acceptance Criteria
- [x] .dropdown-item が tokens.css に 5 状態で定義されている
- [x] DropdownItem が cn() + CSS クラスを使用している
- [x] インラインスタイルの onMouseEnter/Leave が削除されている
- [x] ビルドが通ること
