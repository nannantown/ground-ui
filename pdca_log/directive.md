# Current Directive
- updated_at: 2026-03-19T03:00:00+09:00
- priority: medium
- status: done
- cycle: 32

## Task
KBD (キーボードショートカット表示) コンポーネントを新規作成する。

## Why
MANAGER_BRAIN C-22 「KBD（キーボードショートカット表示）」が ❌ 未実装。
<kbd> 要素ベースの軽量コンポーネントで、ドキュメントや UI のキーボードヘルプに使用。

## How
1. tokens.css: .kbd, .kbd-sm, .kbd-group, .kbd-separator CSS クラス追加
2. KBD.tsx: KBD + KBDGroup コンポーネント作成
3. index.ts: export 追加
4. KBD.test.tsx: 11 テストケース
5. CLAUDE.md: KBD セクション追加

## Acceptance Criteria
- [x] KBD + KBDGroup コンポーネントが作成されている
- [x] CSS クラスが tokens.css に定義されている
- [x] 全テストがパスする
- [x] ビルドが通ること
