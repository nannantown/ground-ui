# Current Directive
- updated_at: 2026-03-18T06:00:00+09:00
- priority: medium
- status: done
- cycle: 12

## Task
Tabs に disabled 状態を追加し、underline variant を CSS クラスシステムに移行する。

## Why
Tabs は 80% (disabled 欠落)。underline variant が全インラインスタイルで GroundUI パターン違反。
TabItem.disabled を追加し、両 variant で 100% 準拠にする。

## How
1. tokens.css: .nav-tab / .nav-tab-active CSS クラス追加 (5状態完備)
2. TabItem interface に disabled? 追加
3. underline variant を CSS クラスに移行
4. pill variant に disabled 伝播

## Acceptance Criteria
- [x] TabItem.disabled が型定義に含まれている
- [x] .nav-tab が tokens.css に 5 状態で定義されている
- [x] underline variant が CSS クラスを使用している
- [x] pill variant で disabled が伝播されている
- [x] ビルドが通ること
