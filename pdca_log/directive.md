# Current Directive
- updated_at: 2026-03-18T09:00:00+09:00
- priority: high
- status: done
- cycle: 15

## Task
全既存 lint エラー (8 errors + 1 warning) を修正する。

## Why
MANAGER_BRAIN Q-02 (ESLint) に該当。14サイクル全てで lint エラーが残存していた。
コード品質の基盤として、lint クリーンは必須条件。

## How
1. no-emoji.ts: combining characters を regex から除去
2. interactions/: 未使用変数・import 削除
3. index.test.ts: 未使用 vi import 削除

## Acceptance Criteria
- [x] npm run lint が 0 errors, 0 warnings
- [x] npm run typecheck が 0 errors
- [x] npm run build が成功
