# Current Directive
- updated_at: 2026-03-18T21:00:00+09:00
- priority: high
- status: done
- cycle: 27

## Task
ブレークポイントトークンに 2xl (1536px) と 3xl (1792px) を追加し、6段階にする。

## Why
MANAGER_BRAIN F-11「ブレークポイント（レスポンシブ）」が ⚠️ 4段階のまま。
6段階 (sm/md/lg/xl/2xl/3xl) にすることで Foundation Layer を 100% に近づける。

## How
1. tokens.css: --bp-2xl: 1536px; --bp-3xl: 1792px; 追加
2. tokens.css: レスポンシブ hide ユーティリティ追加 (.hide-below-2xl, .hide-2xl-up)

## Acceptance Criteria
- [x] --bp-2xl, --bp-3xl が tokens.css に定義されている
- [x] レスポンシブユーティリティが追加されている
- [x] ビルドが通ること
