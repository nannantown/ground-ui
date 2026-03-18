# Current Directive
- updated_at: 2026-03-19T00:00:00+09:00
- priority: medium
- status: done
- cycle: 29

## Task
未コミットの Chip shape prop 変更にテストを追加し、まとめてコミットする。

## Why
git status に PDCA 開始前からの未コミット変更 (Chip.tsx shape prop, index.ts ChipShape export,
package.json version bump) が残存。品質を担保するためテストを追加してからコミット。

## How
1. Chip.test.tsx 新規作成 (22 テストケース)
2. shape prop (pill/square) を含む全機能をテスト
3. 未コミット変更 + テストをまとめてコミット

## Acceptance Criteria
- [x] Chip.test.tsx が作成され全テストパス
- [x] shape="square" で borderRadius: 0 になることが検証済み
- [x] 未コミット変更が全てコミットされている
- [x] ビルドが通ること
