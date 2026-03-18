# Current Directive
- updated_at: 2026-03-19T09:00:00+09:00
- priority: high
- status: done
- cycle: 38

## Task
セマンティック motion トークン (enter/exit/emphasis) を追加し、アニメーションクラスを接続する。

## Why
MANAGER_BRAIN F-12「モーショントークン（enter/exit/emphasis）」が ⚠️ 部分的。
duration/easing プリミティブはあるが、アニメーション用のセマンティック層がなかった。
アニメーションクラスがハードコード値を使用していた。

## How
1. tokens.css: --motion-enter/exit/emphasis-duration/ease トークン 6 種追加
2. tokens.css: 8 アニメーションクラスのハードコード値を motion トークン参照に置換

## Acceptance Criteria
- [x] 6 motion トークンが定義されている
- [x] 8 アニメーションクラスが motion トークンを参照している
- [x] Foundation Layer 12/12 = 100%
- [x] ビルドが通ること
