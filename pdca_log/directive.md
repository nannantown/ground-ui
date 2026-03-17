# Current Directive
- updated_at: 2026-03-17T12:00:00+09:00
- priority: critical
- status: done
- cycle: 1

## Task
全66コンポーネントの5状態ルール（default/hover/active/disabled/focus-visible）準拠状況を監査し、結果を記録する。

## Why
MANAGER_BRAIN.md の Goal によると、Q-03「5状態ルール全コンポーネント監査」が未実施。
既存コンポーネントの品質を上げることが新規追加より優先。
この監査結果が今後の全改善サイクルの出発点となる。

## How
1. src/components/ と src/components/layout/ の全 .tsx ファイルを順番に読む
2. 各コンポーネントについて、CSS（tokens.css）と JSX の両方で以下を確認：
   - default 状態のスタイル定義があるか
   - :hover 擬似クラスまたは hover 状態のスタイルがあるか
   - :active 擬似クラスまたは active/pressed 状態があるか
   - disabled 属性/状態のスタイルがあるか
   - :focus-visible 擬似クラスのスタイルがあるか
3. 非インタラクティブ（表示のみ）のコンポーネントは「N/A」と記録
4. 結果を pdca_log/five_state_audit.md に以下のフォーマットで記録：

```
| Component | Interactive | default | hover | active | disabled | focus-visible | Score |
```

5. npm run typecheck && npm run build で現状確認（修正はしない、まず調査のみ）
6. execution_log.md に結果サマリーを追記

## Acceptance Criteria
- [x] 全66コンポーネントの監査結果が five_state_audit.md に記録されている
- [x] 各コンポーネントの準拠率が明確にスコア化されている
- [x] 未準拠コンポーネントの優先修正リスト（Top 10）が記載されている
- [x] ビルドが通ること（コード変更なし）
