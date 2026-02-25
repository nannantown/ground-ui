import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useLocale } from '../locale'
import { Button } from '../../src/components/Button'
import { Input } from '../../src/components/Input'
import { Textarea } from '../../src/components/Textarea'
import { Select } from '../../src/components/Select'
import { Toggle } from '../../src/components/Toggle'
import { FormField } from '../../src/components/FormField'
import { Avatar } from '../../src/components/Avatar'
import { Divider } from '../../src/components/Divider'
import { Spinner } from '../../src/components/Spinner'
import { ProgressRing } from '../../src/components/ProgressRing'
import { Badge } from '../../src/components/Badge'
import { StatCard } from '../../src/components/StatCard'
import { EmptyState } from '../../src/components/EmptyState'
import { Tabs } from '../../src/components/Tabs'
import { Skeleton } from '../../src/components/Skeleton'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../src/components/Modal'
import { ConfirmDialog } from '../../src/components/ConfirmDialog'
import { ToolbarButton } from '../../src/components/ToolbarButton'
import { DropdownMenu, DropdownItem, DropdownDivider } from '../../src/components/DropdownMenu'
import { useToast } from '../../src/components/Toast'
import {
  SURFACE_PRESETS,
  ACCENT_PRESETS,
  generateLightSurface,
  generateDarkSurface,
  generateSecondaryAccent,
  hexToHsl,
} from '../../src/theme'

/* ============================================
   Design System Catalog
   GroundUI — Minimal / Dark-first / High contrast
   ============================================ */

const NAV_IDS = [
  'overview', 'colors', 'surfaces', 'typography', 'spacing',
  'buttons', 'inputs', 'data', 'feedback', 'overlays', 'layout',
] as const

const NAV_LABELS: Record<string, { en: string; ja: string }> = {
  overview: { en: 'Overview', ja: '概要' },
  colors: { en: 'Colors', ja: 'カラー' },
  surfaces: { en: 'Surfaces', ja: 'サーフェス' },
  typography: { en: 'Typography', ja: 'タイポグラフィ' },
  spacing: { en: 'Spacing', ja: 'スペーシング' },
  buttons: { en: 'Buttons', ja: 'ボタン' },
  inputs: { en: 'Inputs', ja: '入力' },
  data: { en: 'Data', ja: 'データ' },
  feedback: { en: 'Feedback', ja: 'フィードバック' },
  overlays: { en: 'Overlays', ja: 'オーバーレイ' },
  layout: { en: 'Layout', ja: 'レイアウト' },
}

/* ============================================
   Translations
   ============================================ */

const T = {
  en: {
    // Overview
    principles: 'Principles',
    tokenArch: 'Token Architecture',
    principleMinimal: 'Minimal',
    principleMinimalDesc: 'Remove unnecessary elements, focus on content.',
    principleDark: 'Dark-first',
    principleDarkDesc: 'Dark theme as default, light as complement.',
    principleContrast: 'High Contrast',
    principleContrastDesc: 'Important elements stand out clearly.',
    principleRefined: 'Refined',
    principleRefinedDesc: 'Subtle borders and shadows add depth.',
    layerPrimitive: 'Primitive',
    layerPrimitiveDesc: 'Raw values: colors, spacing, type sizes.',
    layerSemantic: 'Semantic',
    layerSemanticDesc: 'Contextual meaning: what the value represents.',
    layerComponent: 'Component',
    layerComponentDesc: 'Scoped to specific components.',
    // Colors
    backgrounds: 'Backgrounds',
    textLabel: 'Text',
    borders: 'Borders',
    semantic: 'Semantic',
    semanticExtended: 'Semantic Extended',
    // Surfaces
    surfacePresets: 'Surface Presets',
    surfaceAccentMatrix: 'Surface x Accent Matrix',
    surfaceAccentMatrixDesc: 'Preview how each surface pairs with different accent colors in both light and dark modes.',
    secondaryAccentGen: 'Secondary Accent Generation',
    secondaryAccentGenDesc: 'Each accent automatically generates a complementary secondary color via +60 degree hue rotation.',
    bgHierarchy: 'Background Hierarchy',
    textHierarchy: 'Text Hierarchy',
    light: 'Light',
    dark: 'Dark',
    surface: 'Surface',
    primary: 'Primary',
    secondary: 'Secondary',
    // Typography
    typeScale: 'Type Scale',
    fontFamilies: 'Font Families',
    displayHeading: 'Display heading',
    pageHeading: 'Page heading',
    sectionTitle: 'Section title',
    cardHeading: 'Card heading',
    bodyEmphasis: 'Body emphasis',
    defaultBody: 'Default body text used across the interface',
    secondaryText: 'Secondary text and descriptions',
    labelsCaptions: 'LABELS AND CAPTIONS',
    // Spacing
    spacingScale: 'Spacing Scale',
    borderRadius: 'Border Radius',
    // Buttons
    variants: 'Variants',
    sizes: 'Sizes',
    states: 'States',
    iconButtons: 'Icon Buttons',
    withIcons: 'With Icons',
    btnPrimary: 'Primary',
    btnSecondary: 'Secondary',
    btnGhost: 'Ghost',
    btnDanger: 'Danger',
    btnSmall: 'Small',
    btnMedium: 'Medium',
    btnLarge: 'Large',
    btnDefault: 'Default',
    btnLoading: 'Loading',
    btnDisabled: 'Disabled',
    addItem: 'Add Item',
    continueBtn: 'Continue',
    // Inputs
    textInput: 'Text Input',
    textarea: 'Textarea',
    select: 'Select',
    toggle: 'Toggle',
    formField: 'Form Field',
    defaultInput: 'Default input',
    errorState: 'Error state',
    disabled: 'Disabled',
    password: 'Password',
    defaultTextarea: 'Default textarea',
    autosizeTry: 'Autosize — try typing',
    chooseOption: 'Choose option...',
    toggleOff: 'Toggle off',
    off: 'Off',
    toggleOn: 'Toggle on',
    on: 'On',
    email: 'Email',
    passwordLabel: 'Password',
    passwordError: 'Must be at least 8 characters',
    enterPassword: 'Enter password',
    bio: 'Bio',
    bioHint: 'Max 200 characters',
    bioPlaceholder: 'Tell us about yourself',
    role: 'Role',
    selectRole: 'Select role...',
    // Data Display
    badge: 'Badge',
    statCard: 'Stat Card',
    avatar: 'Avatar',
    tabsPill: 'Tabs (Pill)',
    tabsUnderline: 'Tabs (Underline)',
    divider: 'Divider',
    badgeSuccess: 'Success',
    badgeWarning: 'Warning',
    badgeError: 'Error',
    badgeInfo: 'Info',
    badgeAccent: 'Accent',
    badgeNeutral: 'Neutral',
    badgeCustom: 'Custom',
    totalItems: 'Total Items',
    growth: 'Growth',
    errors: 'Errors',
    tabOverview: 'Overview',
    tabDetails: 'Details',
    tabSettings: 'Settings',
    contentAbove: 'Content above',
    contentBelow: 'Content below',
    leftLabel: 'Left',
    rightLabel: 'Right',
    // Feedback
    spinner: 'Spinner',
    progressRing: 'Progress Ring',
    skeleton: 'Skeleton',
    emptyState: 'Empty State',
    noItemsYet: 'No items yet',
    addFirstItem: 'Add your first item to get started.',
    // Overlays
    modal: 'Modal',
    confirmDialog: 'Confirm Dialog',
    dropdownMenu: 'Dropdown Menu',
    toast: 'Toast',
    openModal: 'Open Modal',
    modalTitle: 'Modal Title',
    modalBody: 'This is a modal dialog with header, body, and footer sections.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    deleteItem: 'Delete Item',
    deleteItemTitle: 'Delete this item?',
    deleteItemDesc: 'This action cannot be undone. The item and all its data will be permanently deleted.',
    deleteLabel: 'Delete',
    actions: 'Actions',
    edit: 'Edit',
    duplicate: 'Duplicate',
    share: 'Share',
    exportLabel: 'Export',
    archive: 'Archive',
    toastSuccess: 'Operation completed successfully',
    toastError: 'Something went wrong',
    toastWarning: 'Please check your input',
    toastInfo: 'New update available',
    toastEdited: 'Item edited',
    toastCopied: 'Link copied',
    toastDeleted: 'Item deleted',
    toastShared: 'Shared',
    toastExported: 'Exported',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    // Layout
    stackVertical: 'Stack (Vertical)',
    stackHorizontal: 'Stack (Horizontal)',
    grid3col: 'Grid (3 Columns)',
    gridAutofit: 'Grid (Auto-fit)',
    stackItem: 'Stack item',
    item: 'Item',
    cell: 'Cell',
    auto: 'Auto',
    moreOptions: 'More options',
  },
  ja: {
    // Overview
    principles: '設計原則',
    tokenArch: 'トークンアーキテクチャ',
    principleMinimal: 'ミニマル',
    principleMinimalDesc: '不要な要素を排除し、コンテンツに集中する。',
    principleDark: 'ダークファースト',
    principleDarkDesc: 'ダークテーマをデフォルトに、ライトは補完。',
    principleContrast: 'ハイコントラスト',
    principleContrastDesc: '重要な要素が明確に際立つ。',
    principleRefined: '洗練',
    principleRefinedDesc: '繊細なボーダーとシャドウで奥行きを加える。',
    layerPrimitive: 'プリミティブ',
    layerPrimitiveDesc: '生の値: カラー、スペーシング、タイプサイズ。',
    layerSemantic: 'セマンティック',
    layerSemanticDesc: '文脈的な意味: 値が表すもの。',
    layerComponent: 'コンポーネント',
    layerComponentDesc: '特定のコンポーネントにスコープされた値。',
    // Colors
    backgrounds: '背景',
    textLabel: 'テキスト',
    borders: 'ボーダー',
    semantic: 'セマンティック',
    semanticExtended: 'セマンティック（拡張）',
    // Surfaces
    surfacePresets: 'サーフェスプリセット',
    surfaceAccentMatrix: 'サーフェス x アクセント マトリクス',
    surfaceAccentMatrixDesc: '各サーフェスがライト・ダークモードで異なるアクセントカラーとどのようにペアリングされるかをプレビュー。',
    secondaryAccentGen: 'セカンダリアクセント生成',
    secondaryAccentGenDesc: '各アクセントは+60度の色相回転により補完的なセカンダリカラーを自動生成します。',
    bgHierarchy: '背景の階層',
    textHierarchy: 'テキストの階層',
    light: 'ライト',
    dark: 'ダーク',
    surface: 'サーフェス',
    primary: 'プライマリ',
    secondary: 'セカンダリ',
    // Typography
    typeScale: 'タイプスケール',
    fontFamilies: 'フォントファミリー',
    displayHeading: 'ディスプレイ見出し',
    pageHeading: 'ページ見出し',
    sectionTitle: 'セクションタイトル',
    cardHeading: 'カード見出し',
    bodyEmphasis: '本文強調',
    defaultBody: 'インターフェース全体で使用されるデフォルト本文',
    secondaryText: '補助テキストと説明文',
    labelsCaptions: 'ラベルとキャプション',
    // Spacing
    spacingScale: 'スペーシングスケール',
    borderRadius: 'ボーダーラディウス',
    // Buttons
    variants: 'バリアント',
    sizes: 'サイズ',
    states: '状態',
    iconButtons: 'アイコンボタン',
    withIcons: 'アイコン付き',
    btnPrimary: 'プライマリ',
    btnSecondary: 'セカンダリ',
    btnGhost: 'ゴースト',
    btnDanger: 'デンジャー',
    btnSmall: 'スモール',
    btnMedium: 'ミディアム',
    btnLarge: 'ラージ',
    btnDefault: 'デフォルト',
    btnLoading: 'ローディング',
    btnDisabled: '無効',
    addItem: 'アイテムを追加',
    continueBtn: '続行',
    // Inputs
    textInput: 'テキスト入力',
    textarea: 'テキストエリア',
    select: 'セレクト',
    toggle: 'トグル',
    formField: 'フォームフィールド',
    defaultInput: 'デフォルト入力',
    errorState: 'エラー状態',
    disabled: '無効',
    password: 'パスワード',
    defaultTextarea: 'デフォルトテキストエリア',
    autosizeTry: '自動サイズ — 入力してみてください',
    chooseOption: 'オプションを選択...',
    toggleOff: 'トグル オフ',
    off: 'オフ',
    toggleOn: 'トグル オン',
    on: 'オン',
    email: 'メール',
    passwordLabel: 'パスワード',
    passwordError: '8文字以上で入力してください',
    enterPassword: 'パスワードを入力',
    bio: '自己紹介',
    bioHint: '最大200文字',
    bioPlaceholder: '自己紹介を入力してください',
    role: '役割',
    selectRole: '役割を選択...',
    // Data Display
    badge: 'バッジ',
    statCard: '統計カード',
    avatar: 'アバター',
    tabsPill: 'タブ（ピル）',
    tabsUnderline: 'タブ（アンダーライン）',
    divider: 'ディバイダー',
    badgeSuccess: '成功',
    badgeWarning: '警告',
    badgeError: 'エラー',
    badgeInfo: '情報',
    badgeAccent: 'アクセント',
    badgeNeutral: 'ニュートラル',
    badgeCustom: 'カスタム',
    totalItems: '合計アイテム',
    growth: '成長率',
    errors: 'エラー',
    tabOverview: '概要',
    tabDetails: '詳細',
    tabSettings: '設定',
    contentAbove: '上のコンテンツ',
    contentBelow: '下のコンテンツ',
    leftLabel: '左',
    rightLabel: '右',
    // Feedback
    spinner: 'スピナー',
    progressRing: 'プログレスリング',
    skeleton: 'スケルトン',
    emptyState: '空状態',
    noItemsYet: 'アイテムがありません',
    addFirstItem: '最初のアイテムを追加して始めましょう。',
    // Overlays
    modal: 'モーダル',
    confirmDialog: '確認ダイアログ',
    dropdownMenu: 'ドロップダウンメニュー',
    toast: 'トースト',
    openModal: 'モーダルを開く',
    modalTitle: 'モーダルタイトル',
    modalBody: 'ヘッダー、ボディ、フッターセクションを持つモーダルダイアログです。',
    cancel: 'キャンセル',
    confirm: '確認',
    deleteItem: 'アイテムを削除',
    deleteItemTitle: 'このアイテムを削除しますか？',
    deleteItemDesc: 'この操作は取り消せません。アイテムとそのすべてのデータが完全に削除されます。',
    deleteLabel: '削除',
    actions: 'アクション',
    edit: '編集',
    duplicate: '複製',
    share: '共有',
    exportLabel: 'エクスポート',
    archive: 'アーカイブ',
    toastSuccess: '操作が正常に完了しました',
    toastError: 'エラーが発生しました',
    toastWarning: '入力内容を確認してください',
    toastInfo: '新しいアップデートがあります',
    toastEdited: 'アイテムを編集しました',
    toastCopied: 'リンクをコピーしました',
    toastDeleted: 'アイテムを削除しました',
    toastShared: '共有しました',
    toastExported: 'エクスポートしました',
    success: '成功',
    error: 'エラー',
    warning: '警告',
    info: '情報',
    // Layout
    stackVertical: 'スタック（垂直）',
    stackHorizontal: 'スタック（水平）',
    grid3col: 'グリッド（3カラム）',
    gridAutofit: 'グリッド（自動調整）',
    stackItem: 'スタックアイテム',
    item: 'アイテム',
    cell: 'セル',
    auto: '自動',
    moreOptions: 'その他のオプション',
  },
} as const

type Locale = 'en' | 'ja'
type Translations = typeof T['en']

function useT() {
  const { locale } = useLocale()
  return { t: T[locale], locale }
}

export function ComponentsPage() {
  const [active, setActive] = useState('overview')
  const { locale } = useLocale()

  const navItems = NAV_IDS.map(id => ({
    id,
    label: NAV_LABELS[id]?.[locale] ?? id.charAt(0).toUpperCase() + id.slice(1),
  }))

  return (
    <div className="ds-root">
      <style>{`
        /* --- Stage (component demo area) --- */
        .ds-stage {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 32px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }
        .ds-stage-col {
          flex-direction: column;
          align-items: stretch;
        }
        .ds-stage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 32px;
        }

        /* --- Swatch Grid --- */
        .ds-swatch-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }
        .ds-swatch {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ds-swatch-color {
          height: 64px;
          border-radius: 10px;
          border: 1px solid var(--border-subtle);
        }
        .ds-swatch-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1;
        }
        .ds-swatch-value {
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          line-height: 1;
        }

        /* --- Inline Row --- */
        .ds-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* --- Responsive --- */
        @media (max-width: 768px) {
          .ds-stage { padding: 20px; }
          .ds-stage-grid { padding: 20px; }
          .ds-swatch-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
          .ds-swatch-color { height: 48px; }
        }
      `}</style>

      {/* Sidebar */}
      <nav className="ds-sidebar">
        <div className="ds-sidebar-header">
          <h1 className="ds-sidebar-title">GroundUI</h1>
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            className="ds-nav-item"
            data-active={active === item.id}
            onClick={() => {
              setActive(item.id)
              document.querySelector('.ds-main')?.scrollTo({ top: 0 })
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main className="ds-main">
        <div className="ds-content">
          {active === 'overview' && <OverviewSection />}
          {active === 'colors' && <ColorsSection />}
          {active === 'surfaces' && <SurfacesSection />}
          {active === 'typography' && <TypographySection />}
          {active === 'spacing' && <SpacingSection />}
          {active === 'buttons' && <ButtonsSection />}
          {active === 'inputs' && <InputsSection />}
          {active === 'data' && <DataDisplaySection />}
          {active === 'feedback' && <FeedbackSection />}
          {active === 'overlays' && <OverlaysSection />}
          {active === 'layout' && <LayoutSection />}
        </div>
      </main>
    </div>
  )
}

/* ============================================
   Helpers
   ============================================ */

function SectionHeader({ title, titleJa, desc, descJa }: { title: string; titleJa?: string; desc: string; descJa?: string }) {
  const { locale } = useLocale()
  return (
    <>
      <h2 className="ds-section-title">{locale === 'ja' && titleJa ? titleJa : title}</h2>
      <p className="ds-section-desc">{locale === 'ja' && descJa ? descJa : desc}</p>
    </>
  )
}

function Group({ label, labelJa, children }: { label: string; labelJa?: string; children: ReactNode }) {
  const { locale } = useLocale()
  return (
    <div className="ds-group">
      <h3 className="ds-group-label">{locale === 'ja' && labelJa ? labelJa : label}</h3>
      {children}
    </div>
  )
}

function Stage({ children, col, style }: { children: ReactNode; col?: boolean; style?: React.CSSProperties }) {
  return (
    <div className={`ds-stage ${col ? 'ds-stage-col' : ''}`} style={style}>
      {children}
    </div>
  )
}

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return rgb
  const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3])
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1
  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
  if (a < 1) return `${hex} / ${Math.round(a * 100)}%`
  return hex.toUpperCase()
}

function useResolvedColor(cssVar: string) {
  const ref = useRef<HTMLDivElement>(null)
  const [hex, setHex] = useState('')
  useEffect(() => {
    if (!ref.current) return
    const raw = getComputedStyle(ref.current).getPropertyValue(cssVar).trim()
    // Create a temp element to resolve the value to rgb
    const tmp = document.createElement('div')
    tmp.style.color = raw || `var(${cssVar})`
    document.body.appendChild(tmp)
    const resolved = getComputedStyle(tmp).color
    document.body.removeChild(tmp)
    setHex(rgbToHex(resolved))
  }, [cssVar])
  return { ref, hex }
}

function Swatch({ name, cssVar }: { name: string; cssVar: string }) {
  const { ref, hex } = useResolvedColor(cssVar)
  return (
    <div className="ds-swatch" ref={ref}>
      <div className="ds-swatch-color" style={{ background: `var(${cssVar})` }} />
      <span className="ds-swatch-name">{name}</span>
      <span className="ds-swatch-value">{cssVar}</span>
      {hex && <span className="ds-swatch-value">{hex}</span>}
    </div>
  )
}

function InlineColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  const { ref, hex } = useResolvedColor(cssVar)
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `var(${cssVar})`,
          border: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{cssVar}</div>
        {hex && <div style={{ fontSize: 10, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{hex}</div>}
      </div>
    </div>
  )
}

function BorderSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  const { ref, hex } = useResolvedColor(cssVar)
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 80,
          height: 48,
          borderRadius: 10,
          background: 'var(--bg-secondary)',
          border: `2px solid var(${cssVar})`,
          marginBottom: 8,
        }}
      />
      <div style={{ fontSize: 12, fontWeight: 500 }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{cssVar}</div>
      {hex && <div style={{ fontSize: 10, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{hex}</div>}
    </div>
  )
}

/* ============================================
   Sections
   ============================================ */

function OverviewSection() {
  const { t } = useT()
  return (
    <>
      <SectionHeader title="Overview" titleJa="概要" desc="Core principles and token architecture for GroundUI." descJa="GroundUIの設計原則とトークンアーキテクチャ。" />

      <Group label="Principles" labelJa="設計原則">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { title: t.principleMinimal, desc: t.principleMinimalDesc },
            { title: t.principleDark, desc: t.principleDarkDesc },
            { title: t.principleContrast, desc: t.principleContrastDesc },
            { title: t.principleRefined, desc: t.principleRefinedDesc },
          ].map((p) => (
            <div
              key={p.title}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: '20px 24px',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Token Architecture" labelJa="トークンアーキテクチャ">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { layer: t.layerPrimitive, desc: t.layerPrimitiveDesc, example: '--p-gray-800: #1a1a1a' },
            { layer: t.layerSemantic, desc: t.layerSemanticDesc, example: '--bg-elevated: var(--p-gray-800)' },
            { layer: t.layerComponent, desc: t.layerComponentDesc, example: '--card-bg: var(--bg-card)' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: '16px 20px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.layer}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
              <code
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-light)',
                  background: 'var(--p-white-5)',
                  padding: '4px 8px',
                  borderRadius: 6,
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.example}
              </code>
            </div>
          ))}
        </div>
      </Group>
    </>
  )
}

function ColorsSection() {
  return (
    <>
      <SectionHeader title="Colors" titleJa="カラー" desc="Semantic color tokens for backgrounds, text, borders, and status." descJa="背景、テキスト、ボーダー、ステータス用のセマンティックカラートークン。" />

      <Group label="Backgrounds" labelJa="背景">
        <div className="ds-swatch-grid">
          <Swatch name="Primary" cssVar="--bg-primary" />
          <Swatch name="Secondary" cssVar="--bg-secondary" />
          <Swatch name="Card" cssVar="--bg-card" />
          <Swatch name="Elevated" cssVar="--bg-elevated" />
          <Swatch name="Surface" cssVar="--bg-surface" />
          <Swatch name="Surface Hover" cssVar="--bg-surface-hover" />
        </div>
      </Group>

      <Group label="Text" labelJa="テキスト">
        <div className="ds-swatch-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {[
            { name: 'Primary', cssVar: '--text-primary' },
            { name: 'Secondary', cssVar: '--text-secondary' },
            { name: 'Muted', cssVar: '--text-muted' },
            { name: 'Disabled', cssVar: '--text-disabled' },
          ].map((c) => (
            <InlineColorSwatch key={c.name} name={c.name} cssVar={c.cssVar} />
          ))}
        </div>
      </Group>

      <Group label="Borders" labelJa="ボーダー">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { name: 'Subtle', cssVar: '--border-subtle' },
            { name: 'Default', cssVar: '--border-default' },
            { name: 'Strong', cssVar: '--border-strong' },
          ].map((b) => (
            <BorderSwatch key={b.name} name={b.name} cssVar={b.cssVar} />
          ))}
        </div>
      </Group>

      <Group label="Semantic" labelJa="セマンティック">
        <div className="ds-swatch-grid">
          <Swatch name="Success" cssVar="--success" />
          <Swatch name="Warning" cssVar="--warning" />
          <Swatch name="Error" cssVar="--error" />
          <Swatch name="Info" cssVar="--info" />
          <Swatch name="Accent" cssVar="--accent" />
          <Swatch name="Neutral" cssVar="--neutral" />
        </div>
      </Group>

      <Group label="Semantic Extended" labelJa="セマンティック（拡張）">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {['success', 'warning', 'error', 'info'].map((name) => (
            <div
              key={name}
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ height: 6, background: `var(--${name})` }} />
              <div
                style={{
                  padding: '12px 14px',
                  background: `var(--${name}-bg)`,
                  fontSize: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span style={{ fontWeight: 600, color: `var(--${name})`, textTransform: 'capitalize' }}>{name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  bg / border / glow
                </span>
              </div>
            </div>
          ))}
        </div>
      </Group>
    </>
  )
}

function SurfacesSection() {
  const { t, locale } = useT()
  const matrixAccents = ACCENT_PRESETS.filter(a =>
    ['sky', 'ember', 'violet', 'emerald', 'rose'].includes(a.id)
  )

  return (
    <>
      <SectionHeader title="Surfaces" titleJa="サーフェス" desc="Tinted surface presets for light and dark modes, with accent pairing matrix." descJa="ライト・ダークモード用のティントサーフェスプリセットとアクセントペアリングマトリクス。" />

      <Group label="Surface Presets" labelJa="サーフェスプリセット">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SURFACE_PRESETS.map((preset) => {
            const light = generateLightSurface(preset.hue, preset.tintStrength, preset.lightnessBase)
            const dark = generateDarkSurface(preset.hue, preset.tintStrength)

            const lightBgs = [
              { label: 'secondary', hex: light['--bg-secondary'] },
              { label: 'primary', hex: light['--bg-primary'] },
              { label: 'card', hex: light['--bg-card'] },
              { label: 'elevated', hex: light['--bg-elevated'] },
            ]
            const darkBgs = [
              { label: 'secondary', hex: dark['--bg-secondary'] },
              { label: 'primary', hex: dark['--bg-primary'] },
              { label: 'card', hex: dark['--bg-card'] },
              { label: 'elevated', hex: dark['--bg-elevated'] },
            ]

            const lightTexts = [
              { label: 'Primary', hex: light['--text-primary'] },
              { label: 'Secondary', hex: light['--text-secondary'] },
              { label: 'Muted', hex: light['--text-muted'] },
              { label: 'Disabled', hex: light['--text-disabled'] },
            ]
            const darkTexts = [
              { label: 'Primary', hex: dark['--text-primary'] },
              { label: 'Secondary', hex: dark['--text-secondary'] },
              { label: 'Muted', hex: dark['--text-muted'] },
              { label: 'Disabled', hex: dark['--text-disabled'] },
            ]

            return (
              <div
                key={preset.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{locale === 'ja' ? preset.nameJa : preset.name}</span>
                  {locale === 'en' && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{preset.nameJa}</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
                  Hue: {preset.hue} &middot; Tint: {preset.tintStrength} &middot; Lightness base: {preset.lightnessBase}
                </div>

                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
                  {t.bgHierarchy}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-disabled)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.light}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {lightBgs.map((bg) => (
                        <div key={bg.label} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ height: 40, borderRadius: 8, background: bg.hex, border: '1px solid var(--border-subtle)', marginBottom: 4 }} />
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{bg.label}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{bg.hex}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-disabled)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.dark}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {darkBgs.map((bg) => (
                        <div key={bg.label} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ height: 40, borderRadius: 8, background: bg.hex, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 4 }} />
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{bg.label}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{bg.hex}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
                  {t.textHierarchy}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {lightTexts.map((tx) => (
                      <div key={tx.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, background: tx.hex, border: '1px solid var(--border-subtle)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tx.label}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{tx.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {darkTexts.map((tx) => (
                      <div key={tx.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, background: tx.hex, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tx.label}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{tx.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Group>

      <Group label="Surface x Accent Matrix" labelJa="サーフェス x アクセント マトリクス">
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
          {t.surfaceAccentMatrixDesc}
        </p>
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            padding: 24,
            overflowX: 'auto',
          }}
        >
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'left', padding: '0 12px 12px 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {t.surface}
                </th>
                {matrixAccents.map((a) => (
                  <th key={a.id} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', padding: '0 8px 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {locale === 'ja' ? a.nameJa : a.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SURFACE_PRESETS.map((surface) => {
                const dark = generateDarkSurface(surface.hue, surface.tintStrength)
                const light = generateLightSurface(surface.hue, surface.tintStrength, surface.lightnessBase)
                return (
                  <tr key={surface.id}>
                    <td style={{ fontSize: 12, fontWeight: 500, padding: '8px 12px 8px 0', color: 'var(--text-secondary)' }}>
                      {locale === 'ja' ? surface.nameJa : surface.name}
                    </td>
                    {matrixAccents.map((accent) => (
                      <td key={accent.id} style={{ padding: '6px 8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <div
                            style={{
                              width: 36,
                              height: 28,
                              borderRadius: 6,
                              background: dark['--bg-primary'],
                              border: '1px solid rgba(255,255,255,0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent.color }} />
                          </div>
                          <div
                            style={{
                              width: 36,
                              height: 28,
                              borderRadius: 6,
                              background: light['--bg-primary'],
                              border: '1px solid rgba(0,0,0,0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent.color }} />
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Group>

      <Group label="Secondary Accent Generation" labelJa="セカンダリアクセント生成">
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
          {t.secondaryAccentGenDesc}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {ACCENT_PRESETS.slice(0, 6).map((accent) => {
            const secondary = generateSecondaryAccent(accent.color)
            const primaryHsl = hexToHsl(accent.color)
            const secondaryHsl = hexToHsl(secondary)

            return (
              <div
                key={accent.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{locale === 'ja' ? accent.nameJa : accent.name}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 32, borderRadius: 6, background: accent.color, marginBottom: 4 }} />
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.primary}</div>
                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-disabled)' }}>{accent.color}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-disabled)', fontSize: 14 }}>
                    &rarr;
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 32, borderRadius: 6, background: secondary, marginBottom: 4 }} />
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.secondary}</div>
                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-disabled)' }}>{secondary}</div>
                  </div>
                </div>
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-disabled)' }}>
                  Hue shift: {Math.round(primaryHsl.h)} &rarr; {Math.round(secondaryHsl.h)} (+60)
                </div>
              </div>
            )
          })}
        </div>
      </Group>
    </>
  )
}

function TypographySection() {
  const { t } = useT()
  return (
    <>
      <SectionHeader title="Typography" titleJa="タイポグラフィ" desc="Type scale, weights, and font families." descJa="タイプスケール、ウェイト、フォントファミリー。" />

      <Group label="Type Scale" labelJa="タイプスケール">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { token: '--text-3xl', size: '32px', weight: 700, text: t.displayHeading },
            { token: '--text-2xl', size: '24px', weight: 700, text: t.pageHeading },
            { token: '--text-xl', size: '20px', weight: 600, text: t.sectionTitle },
            { token: '--text-lg', size: '16px', weight: 600, text: t.cardHeading },
            { token: '--text-md', size: '14px', weight: 500, text: t.bodyEmphasis },
            { token: '--text-base', size: '13px', weight: 400, text: t.defaultBody },
            { token: '--text-sm', size: '12px', weight: 400, text: t.secondaryText },
            { token: '--text-xs', size: '10px', weight: 500, text: t.labelsCaptions, transform: 'uppercase' as const },
          ].map((item) => (
            <div
              key={item.token}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 24,
                padding: '14px 0',
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              <code
                style={{
                  width: 100,
                  flexShrink: 0,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                {item.size}
              </code>
              <span
                style={{
                  fontSize: item.size,
                  fontWeight: item.weight,
                  letterSpacing: item.token.includes('3xl') || item.token.includes('2xl') ? '-0.02em' : undefined,
                  textTransform: item.transform,
                  color: item.token === '--text-sm' || item.token === '--text-xs' ? 'var(--text-secondary)' : undefined,
                  lineHeight: 1.3,
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Font Families" labelJa="フォントファミリー">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 14 }}>Noto Sans JP / System</span>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>--font-family</code>
          </div>
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)' }}>SF Mono / Fira Code</span>
            <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>--font-mono</code>
          </div>
        </div>
      </Group>
    </>
  )
}

function SpacingSection() {
  return (
    <>
      <SectionHeader title="Spacing & Radius" titleJa="スペーシング & 角丸" desc="Consistent spacing scale and border radius tokens." descJa="一貫したスペーシングスケールとボーダーラディウストークン。" />

      <Group label="Spacing Scale" labelJa="スペーシングスケール">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { token: 'xs', value: '4px' },
            { token: 'sm', value: '8px' },
            { token: 'md', value: '12px' },
            { token: 'lg', value: '16px' },
            { token: 'xl', value: '24px' },
            { token: '2xl', value: '32px' },
            { token: '3xl', value: '48px' },
            { token: '4xl', value: '64px' },
          ].map((s) => (
            <div
              key={s.token}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '10px 0',
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              <code
                style={{
                  width: 60,
                  flexShrink: 0,
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                {s.token}
              </code>
              <div
                style={{
                  height: 8,
                  width: s.value,
                  background: 'var(--accent)',
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Border Radius" labelJa="ボーダーラディウス">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { token: 'none', value: '0', px: '0px' },
            { token: 'xs', value: '2px', px: '2px' },
            { token: 'sm', value: '4px', px: '4px' },
            { token: 'md', value: '8px', px: '8px' },
            { token: 'lg', value: '12px', px: '12px' },
            { token: 'xl', value: '16px', px: '16px' },
            { token: 'full', value: '9999px', px: '9999px' },
          ].map((r) => (
            <div key={r.token} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: r.px,
                  marginBottom: 8,
                }}
              />
              <div style={{ fontSize: 12, fontWeight: 500 }}>{r.token}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{r.value}</div>
            </div>
          ))}
        </div>
      </Group>
    </>
  )
}

function ButtonsSection() {
  const { t } = useT()
  return (
    <>
      <SectionHeader title="Buttons" titleJa="ボタン" desc="Button variants, sizes, states, and icon combinations." descJa="ボタンのバリアント、サイズ、状態、アイコンの組み合わせ。" />

      <Group label="Variants" labelJa="バリアント">
        <Stage>
          <Button variant="primary">{t.btnPrimary}</Button>
          <Button variant="secondary">{t.btnSecondary}</Button>
          <Button variant="ghost">{t.btnGhost}</Button>
          <Button variant="danger">{t.btnDanger}</Button>
        </Stage>
      </Group>

      <Group label="Sizes" labelJa="サイズ">
        <Stage style={{ alignItems: 'center' }}>
          <Button size="sm">{t.btnSmall}</Button>
          <Button size="md">{t.btnMedium}</Button>
          <Button size="lg">{t.btnLarge}</Button>
        </Stage>
      </Group>

      <Group label="States" labelJa="状態">
        <Stage>
          <Button>{t.btnDefault}</Button>
          <Button loading>{t.btnLoading}</Button>
          <Button disabled>{t.btnDisabled}</Button>
        </Stage>
      </Group>

      <Group label="Icon Buttons" labelJa="アイコンボタン">
        <Stage style={{ alignItems: 'center' }}>
          <Button icon size="sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>
          </Button>
          <Button icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>
          </Button>
          <Button icon size="lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>
          </Button>
        </Stage>
      </Group>

      <Group label="With Icons" labelJa="アイコン付き">
        <Stage>
          <Button
            leftIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>}
          >
            {t.addItem}
          </Button>
          <Button
            variant="secondary"
            rightIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-4-4l4 4-4 4" /></svg>}
          >
            {t.continueBtn}
          </Button>
        </Stage>
      </Group>
    </>
  )
}

function InputsSection() {
  const [toggle1, setToggle1] = useState(false)
  const [toggle2, setToggle2] = useState(true)
  const { t } = useT()

  return (
    <>
      <SectionHeader title="Inputs" titleJa="入力" desc="Form controls: text, textarea, select, toggle, and composed form fields." descJa="フォームコントロール: テキスト、テキストエリア、セレクト、トグル、フォームフィールド。" />

      <Group label="Text Input" labelJa="テキスト入力">
        <div className="ds-stage-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Input placeholder={t.defaultInput} />
          <Input placeholder={t.errorState} error />
          <Input placeholder={t.disabled} disabled />
          <Input type="password" placeholder={t.password} />
        </div>
      </Group>

      <Group label="Textarea" labelJa="テキストエリア">
        <div className="ds-stage-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Textarea placeholder={t.defaultTextarea} />
          <Textarea placeholder={t.autosizeTry} autosize />
        </div>
      </Group>

      <Group label="Select" labelJa="セレクト">
        <div className="ds-stage-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Select
            placeholder={t.chooseOption}
            options={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' },
              { value: '3', label: 'Option 3' },
            ]}
          />
          <Select error placeholder={t.errorState}>
            <option value="a">Option A</option>
            <option value="b">Option B</option>
          </Select>
        </div>
      </Group>

      <Group label="Toggle" labelJa="トグル">
        <Stage>
          <div className="ds-row">
            <Toggle checked={toggle1} onChange={setToggle1} label={t.toggleOff} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.off}</span>
          </div>
          <div className="ds-row">
            <Toggle checked={toggle2} onChange={setToggle2} label={t.toggleOn} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.on}</span>
          </div>
          <div className="ds-row">
            <Toggle checked={false} onChange={() => {}} disabled label={t.disabled} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.disabled}</span>
          </div>
        </Stage>
      </Group>

      <Group label="Form Field" labelJa="フォームフィールド">
        <div className="ds-stage-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <FormField label={t.email} htmlFor="email-demo" required>
            <Input id="email-demo" type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label={t.passwordLabel} htmlFor="pw-demo" error={t.passwordError}>
            <Input id="pw-demo" type="password" placeholder={t.enterPassword} error />
          </FormField>
          <FormField label={t.bio} htmlFor="bio-demo" hint={t.bioHint}>
            <Textarea id="bio-demo" placeholder={t.bioPlaceholder} autosize />
          </FormField>
          <FormField label={t.role} htmlFor="role-demo" required>
            <Select
              id="role-demo"
              placeholder={t.selectRole}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
                { value: 'viewer', label: 'Viewer' },
              ]}
            />
          </FormField>
        </div>
      </Group>
    </>
  )
}

function DataDisplaySection() {
  const [activeTab, setActiveTab] = useState('tab1')
  const { t } = useT()

  return (
    <>
      <SectionHeader title="Data Display" titleJa="データ表示" desc="Components for presenting information: badges, stats, avatars, tabs." descJa="情報表示用コンポーネント: バッジ、統計カード、アバター、タブ。" />

      <Group label="Badge" labelJa="バッジ">
        <Stage>
          <Badge variant="success">{t.badgeSuccess}</Badge>
          <Badge variant="warning">{t.badgeWarning}</Badge>
          <Badge variant="error">{t.badgeError}</Badge>
          <Badge variant="info">{t.badgeInfo}</Badge>
          <Badge variant="accent">{t.badgeAccent}</Badge>
          <Badge variant="neutral">{t.badgeNeutral}</Badge>
          <Badge color="#a855f7">{t.badgeCustom}</Badge>
        </Stage>
      </Group>

      <Group label="Stat Card" labelJa="統計カード">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <StatCard label={t.totalItems} value="1,234" />
          <StatCard label={t.growth} value="+12%" trend={{ value: "+12%", direction: "up" }} />
          <StatCard label={t.errors} value="3" trend={{ value: "-2", direction: "down" }} />
        </div>
      </Group>

      <Group label="Avatar" labelJa="アバター">
        <Stage>
          <Avatar name="John Doe" size="sm" />
          <Avatar name="Jane Smith" size="md" />
          <Avatar name="Bob" size="lg" />
          <Avatar name="Alice W" size="xl" />
          <Avatar size="md" />
        </Stage>
      </Group>

      <Group label="Tabs (Pill)" labelJa="タブ（ピル）">
        <Stage col>
          <Tabs
            variant="pill"
            value={activeTab}
            onChange={setActiveTab}
            items={[
              { value: 'tab1', label: t.tabOverview },
              { value: 'tab2', label: t.tabDetails, count: 5 },
              { value: 'tab3', label: t.tabSettings },
            ]}
          />
        </Stage>
      </Group>

      <Group label="Tabs (Underline)" labelJa="タブ（アンダーライン）">
        <Stage col>
          <Tabs
            variant="underline"
            value={activeTab}
            onChange={setActiveTab}
            items={[
              { value: 'tab1', label: t.tabOverview },
              { value: 'tab2', label: t.tabDetails, count: 5 },
              { value: 'tab3', label: t.tabSettings },
            ]}
          />
        </Stage>
      </Group>

      <Group label="Divider" labelJa="ディバイダー">
        <Stage col style={{ gap: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{t.contentAbove}</p>
          <Divider />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{t.contentBelow}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.leftLabel}</span>
            <Divider direction="vertical" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.rightLabel}</span>
          </div>
        </Stage>
      </Group>
    </>
  )
}

function FeedbackSection() {
  const { t } = useT()
  return (
    <>
      <SectionHeader title="Feedback" titleJa="フィードバック" desc="Loading, progress, empty states, and skeleton placeholders." descJa="ローディング、プログレス、空状態、スケルトンプレースホルダー。" />

      <Group label="Spinner" labelJa="スピナー">
        <Stage style={{ alignItems: 'center' }}>
          <Spinner size={16} />
          <Spinner size={20} />
          <Spinner size={28} />
          <Spinner size={36} />
        </Stage>
      </Group>

      <Group label="Progress Ring" labelJa="プログレスリング">
        <Stage style={{ alignItems: 'center', gap: 24 }}>
          <ProgressRing value={0} showLabel />
          <ProgressRing value={25} showLabel color="var(--info)" />
          <ProgressRing value={50} showLabel color="var(--warning)" />
          <ProgressRing value={75} showLabel color="var(--accent)" />
          <ProgressRing value={100} showLabel />
        </Stage>
      </Group>

      <Group label="Skeleton" labelJa="スケルトン">
        <Stage col style={{ maxWidth: 400 }}>
          <Skeleton variant="title" />
          <Skeleton variant="text" count={3} />
          <div style={{ marginTop: 12 }}>
            <Skeleton variant="card" />
          </div>
        </Stage>
      </Group>

      <Group label="Empty State" labelJa="空状態">
        <Stage col>
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5-5 5 5m-5-5v12" />
              </svg>
            }
            title={t.noItemsYet}
            description={t.addFirstItem}
            action={<Button size="sm">{t.addItem}</Button>}
          />
        </Stage>
      </Group>
    </>
  )
}

function OverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { toast } = useToast()
  const { t } = useT()

  return (
    <>
      <SectionHeader title="Overlays" titleJa="オーバーレイ" desc="Modal dialogs, confirm dialogs, dropdown menus, and toast notifications." descJa="モーダル、確認ダイアログ、ドロップダウンメニュー、トースト通知。" />

      <Group label="Modal" labelJa="モーダル">
        <Stage>
          <Button onClick={() => setModalOpen(true)} variant="secondary">
            {t.openModal}
          </Button>
        </Stage>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} showClose>
          <ModalHeader>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{t.modalTitle}</h3>
          </ModalHeader>
          <ModalBody>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              {t.modalBody}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>{t.cancel}</Button>
            <Button onClick={() => setModalOpen(false)}>{t.confirm}</Button>
          </ModalFooter>
        </Modal>
      </Group>

      <Group label="Confirm Dialog" labelJa="確認ダイアログ">
        <Stage>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            {t.deleteItem}
          </Button>
        </Stage>
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 1000))
            setConfirmOpen(false)
          }}
          title={t.deleteItemTitle}
          message={t.deleteItemDesc}
          confirmLabel={t.deleteLabel}
          variant="danger"
        />
      </Group>

      <Group label="Dropdown Menu" labelJa="ドロップダウンメニュー">
        <Stage>
          <DropdownMenu
            trigger={
              <Button variant="secondary">
                {t.actions}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Button>
            }
            align="left"
          >
            <DropdownItem onClick={() => toast(t.toastEdited, 'info')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              {t.edit}
            </DropdownItem>
            <DropdownItem onClick={() => toast(t.toastCopied, 'success')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              {t.duplicate}
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem variant="danger" onClick={() => toast(t.toastDeleted, 'error')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
              {t.deleteLabel}
            </DropdownItem>
          </DropdownMenu>

          <DropdownMenu
            trigger={
              <ToolbarButton aria-label={t.moreOptions}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                </svg>
              </ToolbarButton>
            }
            align="right"
          >
            <DropdownItem onClick={() => toast(t.toastShared, 'success')}>{t.share}</DropdownItem>
            <DropdownItem onClick={() => toast(t.toastExported, 'info')}>{t.exportLabel}</DropdownItem>
            <DropdownItem disabled>{t.archive}</DropdownItem>
          </DropdownMenu>
        </Stage>
      </Group>

      <Group label="Toast" labelJa="トースト">
        <Stage>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast(t.toastSuccess, 'success')}
          >
            {t.success}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast(t.toastError, 'error')}
          >
            {t.error}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast(t.toastWarning, 'warning')}
          >
            {t.warning}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast(t.toastInfo, 'info')}
          >
            {t.info}
          </Button>
        </Stage>
      </Group>
    </>
  )
}

function LayoutSection() {
  const { t } = useT()
  return (
    <>
      <SectionHeader title="Layout" titleJa="レイアウト" desc="Stacking, grid patterns, and spacing compositions." descJa="スタック、グリッドパターン、スペーシングの構成。" />

      <Group label="Stack (Vertical)" labelJa="スタック（垂直）">
        <Stage col>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                background: 'var(--bg-surface)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              {t.stackItem} {i}
            </div>
          ))}
        </Stage>
      </Group>

      <Group label="Stack (Horizontal)" labelJa="スタック（水平）">
        <Stage>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                padding: '8px 20px',
                background: 'var(--bg-surface)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              {t.item} {i}
            </div>
          ))}
        </Stage>
      </Group>

      <Group label="Grid (3 Columns)" labelJa="グリッド（3カラム）">
        <div className="ds-stage-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: 'var(--bg-surface)',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              {t.cell} {i}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Grid (Auto-fit)" labelJa="グリッド（自動調整）">
        <div className="ds-stage-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: 'var(--bg-surface)',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              {t.auto} {i}
            </div>
          ))}
        </div>
      </Group>
    </>
  )
}
