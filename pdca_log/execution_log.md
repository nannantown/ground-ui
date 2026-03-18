# Execution Log

> Claude Code が各サイクルの実行結果をここに追記する。
> 最新のエントリが一番上。

---

## Cycle 15 — Fix all pre-existing lint errors (2026-03-18)

**Directive**: 全8 lint エラー + 1 warning を修正
**Status**: DONE

### Changes
- `src/eslint/no-emoji.ts`: combining characters (`\u{200D}`, `\u{FE0F}`, `\u{20E3}`) を regex から除去 → `no-misleading-character-class` エラー2件 + unused disable warning 1件 修正
- `src/interactions/AmbientDemos.tsx`: `let h = 0` → `let h: number` に変更 → `no-useless-assignment` エラー修正
- `src/interactions/PhysicsDemos.tsx`: 未使用 `pivotY` 変数を削除
- `src/interactions/SemanticDemos.tsx`: 未使用 `useEffect` import を削除
- `src/interactions/SliderDemos.tsx`: 未使用 `valueA`, `valueB` ローカル変数を削除
- `src/theme/index.test.ts`: 未使用 `vi` import を削除

### Impact
- **lint: 8 errors + 1 warning → 0 errors, 0 warnings**
- 14 サイクル目にして初の完全クリーンビルド (typecheck + lint + build 全パス)
- MANAGER_BRAIN Q-02 (ESLint) 完全準拠

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: **0 errors, 0 warnings**
- `npm run build`: SUCCESS

---

## Cycle 14 — Breadcrumb disabled state (2026-03-18)

**Directive**: Breadcrumb に disabled 状態を追加
**Status**: DONE

### Changes
- `src/css/tokens.css`: `.breadcrumb-item-disabled` クラス追加 (opacity + cursor + pointer-events)
- `src/components/Breadcrumb.tsx`:
  - `BreadcrumbItemProps.disabled?: boolean` 追加
  - disabled 時は `<span>` で描画 (href があっても `<a>` にならない)
  - `aria-disabled` 属性追加
  - CSS クラス `.breadcrumb-item-disabled` 適用

### Impact
- Breadcrumb 監査スコア: 80% → **100%** (disabled 追加で全5状態完備)

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 13 — BottomNav disabled + focus-visible fix (2026-03-18)

**Directive**: BottomNav に disabled 追加 + focus-visible 修正
**Status**: DONE

### Changes
- `src/components/BottomNav.tsx`:
  - `BottomNavItem.disabled?: boolean` 追加
  - `disabled={item.disabled}` を button に渡す
  - inline `outline: 'none'` 削除 → CSS `.bottom-nav-item:focus-visible` が有効に
  - JS onFocus/onBlur ハンドラ削除 (CSS :focus-visible で代替)
  - `className="bottom-nav-item"` 追加 → CSS :focus-visible ルール適用
  - disabled 時の opacity + cursor をインラインで設定

### Impact
- BottomNav 監査スコア: 80% → **100%** (disabled + focus-visible 修正)
- JS focus handlers → CSS :focus-visible で正しくキーボードのみフォーカス表示

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 12 — Tabs disabled + underline CSS class (2026-03-18)

**Directive**: Tabs を 100% 5状態準拠にする (disabled 追加 + underline variant CSS クラス化)
**Status**: DONE

### Changes
- `src/css/tokens.css`: `.nav-tab` CSS クラス追加 (underline variant 用、5状態完備)
  - `.nav-tab-active` for active state
  - hover/active/disabled/focus-visible 全て定義
- `src/components/Tabs.tsx`:
  - `TabItem.disabled?: boolean` 追加
  - pill variant: `disabled={tab.disabled}` を button に渡す (既存 CSS :disabled が適用)
  - underline variant: インラインスタイル → `.nav-tab` + `.nav-tab-active` CSS クラスに全面移行

### Impact
- Tabs (pill) 監査スコア: 80% → **100%** (disabled 追加)
- Tabs (underline) 監査スコア: N/A → **100%** (新規 CSS クラスで全5状態)
- バンドル微減: 328.60KB → 328.27KB

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 11 — Stepper hover + focus-visible fix (2026-03-18)

**Directive**: Stepper clickable steps に hover + active + focus-visible 追加
**Status**: DONE

### Changes
- `src/css/tokens.css`: `.stepper-step-clickable` CSS クラス追加 (hover/active/focus-visible)
- `src/components/Stepper.tsx`:
  - 水平: clickable step div に `.stepper-step-clickable` クラス適用、inline cursor 削除
  - 垂直: clickable circle div に `.stepper-step-clickable` クラス適用、inline cursor 削除

### Impact
- Stepper 監査スコア: 60% → **80%** (hover + active + focus-visible 追加。disabled は未対応)
- 水平・垂直両方のレイアウトで hover フィードバック + フォーカスリング表示

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 10 — Modal close button 5-state fix (2026-03-18)

**Directive**: Modal close ボタンを .btn CSS クラスに移行
**Status**: DONE

### Changes
- `src/components/Modal.tsx`:
  - close ボタンのインラインスタイルを `.btn .btn-ghost .btn-icon .btn-sm` CSS クラスに置換
  - inline style は `position: absolute; top; right` のみ残存（レイアウト配置用）
  - `aria-label="Close"` 追加

### Impact
- Modal 監査スコア: 30% → **80%** (close ボタンが全5状態完備。disabled は Modal 自体には不要)
- a11y: aria-label 追加でスクリーンリーダー対応改善
- バンドル微減: 329.00KB → 328.59KB

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

---

## Cycle 9 — Toast dismiss button 5-state fix (2026-03-18)

**Directive**: 監査 Top 10 #10 — Toast dismiss ボタンを .btn CSS クラスに移行
**Status**: DONE

### Changes
- `src/components/Toast.tsx`:
  - dismiss ボタンのインラインスタイルを `.btn .btn-ghost .btn-icon .btn-sm` CSS クラスに置換
  - `cn()` import 追加
  - `aria-label="Dismiss"` 追加 (a11y改善)
  - JS hover ハンドラなし → CSS :hover/:active/:disabled/:focus-visible が全て .btn クラスから継承

### Impact
- Toast 監査スコア: 20% → **100%** (既存 .btn CSS クラス再利用で全5状態完備)
- a11y: aria-label 追加でスクリーンリーダー対応改善
- バンドル微減: インラインスタイル削除

### Build Verification
- `npm run typecheck`: 0 errors
- `npm run lint`: 8 errors (pre-existing)
- `npm run build`: SUCCESS

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

