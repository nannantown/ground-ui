# Execution Log

> Claude Code が各サイクルの実行結果をここに追記する。
> 最新のエントリが一番上。

---

## Cycle 8 — DataTable keyboard accessibility + focus-visible (2026-03-18)

**Directive**: 監査 Top 10 #9 — DataTable focus-visible + keyboard navigation 追加
**Status**: DONE

### Changes
- `src/css/tokens.css`:
  - `.table-header-sortable` クラス追加 (hover + focus-visible)
  - `.table-row-clickable` クラス追加 (focus-visible)
- `src/components/DataTable.tsx`:
  - sortable headers: CSS クラス + `tabIndex={0}` + `role="button"` + Enter/Space キーハンドラ追加
  - sortable headers: JS onMouseEnter/Leave 削除 → CSS :hover で代替
  - clickable rows: CSS クラス + `tabIndex={0}` + Enter/Space キーハンドラ追加
  - clickable rows: inline `cursor` 削除 → CSS で処理

### Impact
- DataTable 監査スコア: 60% → **80%** (focus-visible + keyboard 追加。disabled は N/A)
- sortable ヘッダーが Tab キーでフォーカス可能に
- clickable 行が Tab + Enter/Space で操作可能に
- **WCAG 2.1.1 (Keyboard) + 2.4.7 (Focus Visible) 準拠改善**

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 7 — ToolbarButton CSS class + 5-state fix (2026-03-18)

**Directive**: 監査 Top 10 #8 — ToolbarButton CSS クラス化 + 全5状態追加
**Status**: DONE

### Changes
- `src/css/tokens.css`: `.toolbar-button` CSS クラス追加 (5状態完備: default/hover/active/disabled/focus-visible)
- `src/components/ToolbarButton.tsx`: インラインスタイルから CSS クラス (`cn()`) に全面移行
  - onMouseEnter/Leave ハンドラ削除 (CSS :hover で代替)
  - `disabled` prop 追加
- ThemeToggle は ToolbarButton を wrap しているため自動的に改善

### Impact
- ToolbarButton 監査スコア: 40% → **100%**
- ThemeToggle 監査スコア: 40% → **100%** (ToolbarButton 改善により)
- バンドルサイズ: 329.70KB → 328.86KB (インラインスタイル削除)

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 6 — Accordion disabled + active state (2026-03-18)

**Directive**: 監査 Top 10 #7 — Accordion disabled + active 追加
**Status**: DONE

### Changes
- `src/css/tokens.css`:
  - `.accordion-trigger:active:not(:disabled)` 追加 (active-bg)
  - `.accordion-trigger:disabled` 追加 (opacity + cursor)
  - `.accordion-trigger:hover` → `:hover:not(:disabled)` に修正
- `src/components/Accordion.tsx`:
  - `AccordionItem` interface に `disabled?: boolean` 追加
  - `<button>` に `disabled={item.disabled}` を渡すよう修正

### Impact
- Accordion 監査スコア: 60% → **100%** (全5状態完備)
- `AccordionItem.disabled` が public API として型安全に公開

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 5 — DropdownMenu CSS class + 5-state fix (2026-03-17)

**Directive**: 監査 Top 10 #5 — DropdownMenu CSS クラス化 + 全5状態追加
**Status**: DONE

### Changes
- `src/css/tokens.css`: `.dropdown-item` CSS クラス追加 (default/hover/active/disabled/focus-visible 全5状態)
- `src/css/tokens.css`: `.dropdown-item-danger` variant 追加
- `src/components/DropdownMenu.tsx`: DropdownItem をインラインスタイルから CSS クラス (`cn()`) に移行
  - onMouseEnter/Leave ハンドラ削除 (CSS :hover で代替)
  - JS による opacity/cursor 計算削除 (CSS :disabled で代替)

### Impact
- DropdownMenu 監査スコア: 60% → **100%** (全5状態 CSS で定義)
- バンドルサイズ微減: 330.38KB → 329.66KB (インラインスタイル削除)
- GroundUI パターン準拠 (CSS class system + cn() utility)

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 4 — BottomNav & Breadcrumb :focus-visible fix (2026-03-17)

**Directive**: 監査 Top 10 #3/#4 — BottomNav + Breadcrumb :focus-visible 追加
**Status**: DONE

### Changes
- `src/css/tokens.css`: `.bottom-nav-item:focus-visible` ルール追加
- `src/css/tokens.css`: `.breadcrumb-item:focus-visible` ルール追加
- 両方とも `outline: 2px solid var(--focus-ring); outline-offset: 2px;`

### Impact
- BottomNav 監査スコア: 70% → **80%** (disabled まだ未対応)
- Breadcrumb 監査スコア: 60% → **80%** (disabled まだ未対応)
- モバイルナビ + パンくずリストのキーボードアクセシビリティ改善

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 3 — Pill-filter :focus-visible fix (2026-03-17)

**Directive**: 監査 Top 10 #2 — Tabs (.pill-filter) :focus-visible 追加
**Status**: DONE

### Changes
- `src/css/tokens.css`: `.pill-filter:focus-visible` + `.pill-filter-active:focus-visible` ルール追加
- `outline: 2px solid var(--focus-ring); outline-offset: 2px;` — 既存パターンと一貫

### Impact
- Tabs コンポーネント (pill variant) にキーボードフォーカスインジケータが表示されるように
- SegmentedControl の pill スタイル使用時にも波及
- **Tabs 監査スコア: 60% → 80%** (disabled はまだ未対応)

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 2 — Button :focus-visible fix (2026-03-17)

**Directive**: 監査 Top 10 #1 — Button :focus-visible 追加
**Status**: DONE

### Changes
- `src/css/tokens.css`: `.btn:focus-visible` ルール追加 (`outline: 2px solid var(--focus-ring); outline-offset: 2px;`)
- `.btn` base class の `outline: none` (line 702) が `*:focus-visible` global ルール (line 3091) を詳細度で上書きしていた問題を修正
- `.btn:focus-visible` (詳細度 0,1,1) > `.btn` (0,1,0) > `*:focus-visible` (0,0,1) で正しく適用

### Impact
- Button (primary/secondary/ghost/danger) 全variant にキーボードフォーカスインジケータが表示されるように
- Button を内部使用するコンポーネント (Alert close, Modal close, Carousel arrows, ConfirmDialog, etc.) にも波及
- **WCAG 2.4.7 (Focus Visible) 準拠改善**

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing, CSS変更と無関係)
- `npm run build`: SUCCESS

### Audit Score Update
- Button: 80% → **100%** (5/5 states now covered)
- Alert (close btn): 30% → **~50%** (inherits btn focus-visible)
- Modal (close btn): 30% → **~40%** (inherits btn focus-visible)

---

## Cycle 1 — 5-State Rule Full Audit (2026-03-17)

**Directive**: 全66コンポーネントの5状態ルール監査
**Status**: DONE

### Results
- 監査レポート: `pdca_log/five_state_audit.md`
- 対象: 66コンポーネント（41 interactive / 25 non-interactive）
- **平均5状態準拠率: 69%**
- 100%準拠: 14/41コンポーネント (34%)
- 50%未満: 9/41コンポーネント (22%)

### Top 3 Gaps
1. **Button :focus-visible 欠落** — 最重要。.btn-* CSS に :focus-visible ルールなし。10+コンポーネントに波及。
2. **Nav系 disabled 欠落** — BottomNav, Breadcrumb, Tabs, Stepper に disabled prop/styling なし。
3. **Overlay close button 状態不足** — Modal, Toast, Alert の close ボタンが最小限のみ。

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing, unrelated to this cycle)
- `npm run build`: SUCCESS

### Next Action
Top 10 優先修正リストに基づき、Button :focus-visible から着手すべき。

