import { useState, useEffect, useRef, useMemo } from 'react'
import { useTheme } from 'next-themes'
import {
  ACCENT_PRESETS,
  SURFACE_PRESETS,
  THEME_PAIRINGS,
  type ThemeConfig,
  type CustomPreset,
  loadThemeConfig,
  saveThemeConfig,
  applyAccentTheme,
  getAccentColor,
  hexToHsl,
  isValidHex,
  contrastRatio,
  ensureContrast,
  generateSecondaryAccent,
  generateLightSurface,
  generateDarkSurface,
  loadCustomPresets,
  addCustomPreset,
  deleteCustomPreset,
} from '../../src/theme'
import { ConfirmDialog } from '../../src/components/ConfirmDialog'
import { Toggle } from '../../src/components/Toggle'
import { useLocale } from '../locale'

/* ============================================
   Theme Page — Full-page theme customization
   ============================================ */

const T = {
  en: {
    themeTitle: 'Theme',
    themeDesc: 'Pick a curated preset, select a saved custom, or create your own.',
    newPreset: 'New Preset',
    newPresetMood: 'Create your own',
    presetName: 'Preset Name',
    presetNamePlaceholder: 'My Theme',
    save: 'Save',
    cancel: 'Cancel',
    surface: 'Surface',
    accentColor: 'Accent Color',
    custom: 'Custom',
    deleteConfirm: 'Delete',
    deleteTitle: 'Delete Preset',
    deleteMessage: 'Are you sure you want to delete this preset? This action cannot be undone.',
    maxReached: 'Maximum 20 presets reached',
    detailsTitle: 'Details',
    detailsDesc: 'WCAG contrast ratios, button style, and color distribution for the current theme.',
    wcagContrast: 'WCAG Contrast',
    primary: 'Primary',
    secondaryAuto: 'Secondary (auto)',
    buttonStyle: 'Primary Button Style',
    colorDist: 'Color Distribution',
    mono: 'Mono',
    accent: 'Accent',
    activeTab: 'Active Tab',
    linkText: 'Link text',
    secondary: 'Secondary',
    bg: 'BG',
    surfaceLabel: 'Surface',
    text: 'Text',
    accentLabel: 'Accent',
    border: 'Border',
    secondLabel: '2nd',
  },
  ja: {
    themeTitle: 'テーマ',
    themeDesc: 'プリセットを選ぶか、保存済みのカスタムを選ぶか、新しく作成できます。',
    newPreset: '新規プリセット',
    newPresetMood: '自由にカスタマイズ',
    presetName: 'プリセット名',
    presetNamePlaceholder: 'マイテーマ',
    save: '保存',
    cancel: 'キャンセル',
    surface: 'サーフェス',
    accentColor: 'アクセントカラー',
    custom: 'カスタム',
    deleteConfirm: '削除',
    deleteTitle: 'プリセットを削除',
    deleteMessage: 'このプリセットを削除しますか？この操作は取り消せません。',
    maxReached: 'プリセットは最大20個までです',
    detailsTitle: '詳細',
    detailsDesc: '現在のテーマのWCAGコントラスト比、ボタンスタイル、カラー配分。',
    wcagContrast: 'WCAGコントラスト',
    primary: 'プライマリ',
    secondaryAuto: 'セカンダリ（自動）',
    buttonStyle: 'プライマリボタンスタイル',
    colorDist: 'カラー配分',
    mono: 'モノ',
    accent: 'アクセント',
    activeTab: 'アクティブタブ',
    linkText: 'リンク',
    secondary: 'セカンダリ',
    bg: '背景',
    surfaceLabel: 'サーフェス',
    text: 'テキスト',
    accentLabel: 'アクセント',
    border: 'ボーダー',
    secondLabel: '2nd',
  },
} as const

type Translations = typeof T['en']

type PreviewColors = { bg: string; bgSec: string; bgCrd: string; text: string; textMut: string; accent: string; accentSec: string }


/** Compute preview colors for a given surface + accent */
function computePreview(surfaceId: string, accentColor: string, isDark: boolean): PreviewColors {
  const surface = SURFACE_PRESETS.find(s => s.id === surfaceId)
  let bg: string, bgSec: string, bgCrd: string, text: string, textMut: string
  if (!surface || surfaceId === 'default') {
    if (isDark) {
      bg = '#0a0a0a'; bgSec = '#111111'; bgCrd = '#161616'; text = '#ffffff'; textMut = '#666666'
    } else {
      bg = '#ffffff'; bgSec = '#f4f4f4'; bgCrd = '#fafafa'; text = '#1a1a1a'; textMut = '#999999'
    }
  } else {
    const surfaceHue = hexToHsl(accentColor).h
    const tokens = isDark
      ? generateDarkSurface(surfaceHue, surface.tintStrength)
      : generateLightSurface(surfaceHue, surface.tintStrength, surface.lightnessBase)
    bg = tokens['--bg-primary']
    bgSec = tokens['--bg-secondary']
    bgCrd = tokens['--bg-card']
    text = tokens['--text-primary'] ?? (isDark ? '#ffffff' : '#1a1a1a')
    textMut = tokens['--text-muted'] ?? (isDark ? '#666666' : '#999999')
  }
  const accentSec = generateSecondaryAccent(accentColor)
  return { bg, bgSec, bgCrd, text, textMut, accent: accentColor, accentSec }
}

export function ThemePage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const { locale } = useLocale()
  const t = T[locale]

  // --- Theme state ---
  const [config, setConfig] = useState<ThemeConfig | null>(null)
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([])
  const [customOpen, setCustomOpen] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [customInput, setCustomInput] = useState('')
  const colorInputRef = useRef<HTMLInputElement>(null)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const loaded = loadThemeConfig()
    setConfig(loaded)
    setCustomInput(loaded.customColor ?? '')
    setCustomPresets(loadCustomPresets())
  }, [])

  useEffect(() => {
    if (!config) return
    applyAccentTheme(config, isDark)
    saveThemeConfig(config)
  }, [config, isDark])

  // --- Computed ---
  const bgHex = useMemo(() => {
    if (!config) return isDark ? '#0a0a0a' : '#ffffff'
    const surfaceId = config.surfaceId ?? 'default'
    return computePreview(surfaceId, '#fff', isDark).bg
  }, [config, isDark])

  const builtinPreviews = useMemo(() => {
    return THEME_PAIRINGS.map(pairing => {
      const accent = ACCENT_PRESETS.find(a => a.id === pairing.accentId)!
      return computePreview(pairing.surfaceId, accent.color, isDark)
    })
  }, [isDark])

  const customPresetPreviews = useMemo(() => {
    return customPresets.map(preset => {
      const accentColor = preset.accentId === 'custom' && preset.customColor
        ? preset.customColor
        : ACCENT_PRESETS.find(a => a.id === preset.accentId)?.color ?? ACCENT_PRESETS[0].color
      return computePreview(preset.surfaceId, accentColor, isDark)
    })
  }, [customPresets, isDark])

  if (!config) return null

  const accentColor = getAccentColor(config)
  const adjustedPrimary = ensureContrast(accentColor, bgHex, 4.5)
  const primaryRatio = contrastRatio(adjustedPrimary, bgHex)
  const secondaryColor = generateSecondaryAccent(accentColor)
  const adjustedSecondary = ensureContrast(secondaryColor, bgHex, 4.5)
  const secondaryRatio = contrastRatio(adjustedSecondary, bgHex)
  const activeSurfaceId = config.surfaceId ?? 'default'

  // --- Actions ---
  function selectBuiltinPairing(pairing: typeof THEME_PAIRINGS[number]) {
    setCustomOpen(false)
    setConfig(prev => prev ? {
      ...prev,
      surfaceId: pairing.surfaceId,
      accentId: pairing.accentId,
      pairingId: pairing.id,
      customColor: undefined,
    } : prev)
  }

  function selectCustomPreset(preset: CustomPreset) {
    setCustomOpen(false)
    setConfig(prev => prev ? {
      ...prev,
      surfaceId: preset.surfaceId === 'default' ? null : preset.surfaceId,
      accentId: preset.accentId,
      customColor: preset.customColor,
      pairingId: preset.id,
      primaryStyle: preset.primaryStyle,
    } : prev)
  }

  function handleDeleteCustomPreset(id: string) {
    setDeleteTargetId(id)
  }

  function confirmDeletePreset() {
    if (!deleteTargetId) return
    deleteCustomPreset(deleteTargetId)
    setCustomPresets(loadCustomPresets())
    if (config?.pairingId === deleteTargetId) {
      setConfig(prev => prev ? { ...prev, pairingId: null } : prev)
    }
    setDeleteTargetId(null)
  }

  function openNewPresetPanel() {
    setCustomOpen(true)
    setPresetName('')
    // Clear pairingId so changes are "live" while editing
    setConfig(prev => prev ? { ...prev, pairingId: null } : prev)
  }

  function closePanel() {
    setCustomOpen(false)
    setPresetName('')
  }

  function handleSavePreset() {
    const name = presetName.trim()
    if (!name) return
    const saved = addCustomPreset({
      name,
      surfaceId: config.surfaceId ?? 'default',
      accentId: config.accentId,
      customColor: config.customColor,
      primaryStyle: config.primaryStyle,
    })
    if (saved) {
      setCustomPresets(loadCustomPresets())
      setConfig(prev => prev ? { ...prev, pairingId: saved.id } : prev)
      setCustomOpen(false)
      setPresetName('')
    }
  }

  function selectSurface(id: string) {
    setConfig(prev => prev ? {
      ...prev,
      surfaceId: id === 'default' ? null : id,
      pairingId: null,
    } : prev)
  }

  function selectAccent(id: string) {
    setConfig(prev => prev ? {
      ...prev,
      accentId: id,
      pairingId: null,
      customColor: undefined,
    } : prev)
  }

  function setCustomColor(hex: string) {
    setCustomInput(hex)
    if (isValidHex(hex)) {
      setConfig(prev => prev ? {
        ...prev,
        accentId: 'custom',
        customColor: hex,
        pairingId: null,
      } : prev)
    }
  }

  function setPrimaryStyle(style: 'mono' | 'accent') {
    setConfig(prev => prev ? { ...prev, primaryStyle: style } : prev)
  }

  const canAddMore = customPresets.length < 20

  return (
    <div className="ds-root">
      {/* Main */}
      <main className="ds-main" ref={mainRef} style={{ marginLeft: 0 }}>
        <div className="ds-content">
          <section id="theme-theme">
            <h2 className="ds-section-title">{t.themeTitle}</h2>
            <p className="ds-section-desc">{t.themeDesc}</p>

            {/* Primary Button Style — toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-xl)',
            }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: config.primaryStyle === 'mono' ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'color 0.15s ease',
              }}>
                {t.mono}
              </span>
              <Toggle
                checked={config.primaryStyle === 'accent'}
                onChange={(checked) => setPrimaryStyle(checked ? 'accent' : 'mono')}
                label={t.buttonStyle}
              />
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: config.primaryStyle === 'accent' ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'color 0.15s ease',
              }}>
                {t.accent}
              </span>
            </div>

            {/* Preset grid: builtin → custom presets → "+" button */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 'var(--space-md)',
            }}>
              {/* Built-in presets */}
              {THEME_PAIRINGS.map((pairing, index) => (
                <PresetCard
                  key={pairing.id}
                  name={locale === 'ja' ? pairing.nameJa : pairing.name}
                  mood={locale === 'ja' ? pairing.moodJa : pairing.mood}
                  isActive={config.pairingId === pairing.id}
                  preview={builtinPreviews[index]}
                  onClick={() => selectBuiltinPairing(pairing)}
                />
              ))}

              {/* Custom presets */}
              {customPresets.map((preset, index) => (
                <PresetCard
                  key={preset.id}
                  name={preset.name}
                  mood={locale === 'ja' ? 'カスタムプリセット' : 'Custom preset'}
                  isActive={config.pairingId === preset.id}
                  preview={customPresetPreviews[index]}
                  onClick={() => selectCustomPreset(preset)}
                  onDelete={() => handleDeleteCustomPreset(preset.id)}
                />
              ))}

              {/* Add new preset button */}
              <AddPresetCard
                isOpen={customOpen}
                canAdd={canAddMore}
                locale={locale}
                t={t}
                onClick={canAddMore ? openNewPresetPanel : undefined}
              />
            </div>

            {/* Inline customize panel */}
            <CustomizePanel
              open={customOpen}
              config={config}
              activeSurfaceId={activeSurfaceId}
              isDark={isDark}
              locale={locale}
              t={t}
              presetName={presetName}
              canSave={presetName.trim().length > 0}
              colorInputRef={colorInputRef}
              customInput={customInput}
              accentColor={accentColor}
              onPresetNameChange={setPresetName}
              onSave={handleSavePreset}
              onCancel={closePanel}
              onSelectSurface={selectSurface}
              onSelectAccent={selectAccent}
              onSetCustomColor={setCustomColor}
            />

          </section>

          <div className="ds-section-divider" />

          <section id="theme-details">
            <DetailsSection
              t={t}
              adjustedPrimary={adjustedPrimary}
              primaryRatio={primaryRatio}
              adjustedSecondary={adjustedSecondary}
              secondaryRatio={secondaryRatio}
            />
          </section>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDeletePreset}
        title={t.deleteTitle}
        message={t.deleteMessage}
        confirmLabel={t.deleteConfirm}
        cancelLabel={t.cancel}
        variant="danger"
      />
    </div>
  )
}

/* ============================================
   Add Preset Card ("+" button in grid)
   ============================================ */

function AddPresetCard({
  isOpen,
  canAdd,
  locale,
  t,
  onClick,
}: {
  isOpen: boolean
  canAdd: boolean
  locale: 'en' | 'ja'
  t: Translations
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={!canAdd}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-lg)',
        border: `var(--border-width-thin) dashed ${
          isOpen
            ? 'var(--accent-border)'
            : hovered && canAdd ? 'var(--border-default)' : 'var(--border-subtle)'
        }`,
        background: isOpen
          ? 'var(--accent-bg)'
          : hovered && canAdd ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
        cursor: canAdd ? 'pointer' : 'not-allowed',
        opacity: canAdd ? 1 : 0.4,
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Plus icon area */}
      <div style={{
        height: 'var(--space-4xl)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-secondary)',
        border: 'var(--border-width-thin) solid var(--border-subtle)',
      }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOpen ? 'var(--text-primary)' : hovered ? 'var(--text-secondary)' : 'var(--text-secondary)'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'stroke 0.15s ease' }}
        >
          <path d="M12 5v14m-7-7h14" />
        </svg>
      </div>

      {/* Label */}
      <div>
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
          marginBottom: 'var(--space-2xs)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
        }}>
          {t.newPreset}
          {isOpen && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
        </div>
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
        }}>
          {canAdd ? t.newPresetMood : t.maxReached}
        </div>
      </div>
    </button>
  )
}

/* ============================================
   Preset Card (shared for builtin + custom)
   ============================================ */

function PresetCard({
  name,
  mood,
  isActive,
  preview,
  onClick,
  onDelete,
}: {
  name: string
  mood: string
  isActive: boolean
  preview: PreviewColors
  onClick: () => void
  onDelete?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          padding: 'var(--space-lg)',
          borderRadius: 'var(--radius-lg)',
          border: `var(--border-width-thin) solid ${isActive ? 'var(--accent-border)' : hovered ? 'var(--border-default)' : 'var(--border-subtle)'}`,
          background: isActive ? 'var(--accent-bg)' : hovered ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          transition: 'all 0.15s ease',
          width: '100%',
        }}
      >
        {/* Mini mockup */}
        <div style={{
          height: 'var(--space-4xl)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          background: preview.bg,
          border: 'var(--border-width-thin) solid var(--border-subtle)',
        }}>
          <div style={{
            width: 20,
            background: preview.bgSec,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 'var(--space-sm)',
            gap: 'var(--space-xs)',
          }}>
            <div style={{ width: 'var(--space-sm)', height: 'var(--space-sm)', borderRadius: 3, background: preview.accent, opacity: 0.9 }} />
            <div style={{ width: 'var(--space-sm)', height: 2, borderRadius: 1, background: preview.textMut, opacity: 0.3 }} />
            <div style={{ width: 'var(--space-sm)', height: 2, borderRadius: 1, background: preview.textMut, opacity: 0.3 }} />
          </div>
          <div style={{ flex: 1, padding: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <div style={{ height: 3, width: '55%', borderRadius: 1.5, background: preview.text, opacity: 0.5 }} />
            <div style={{
              flex: 1,
              background: preview.bgCrd,
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-xs) var(--space-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ height: 2, width: '70%', borderRadius: 1, background: preview.textMut, opacity: 0.3 }} />
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <div style={{ height: 'var(--space-xs)', width: '40%', borderRadius: 'var(--radius-xs)', background: preview.accent }} />
                <div style={{ height: 'var(--space-xs)', width: '25%', borderRadius: 'var(--radius-xs)', background: preview.accentSec, opacity: 0.7 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2xs)' }}>{name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{mood}</div>
        </div>
      </button>

      {/* Delete button for custom presets */}
      {onDelete && hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          style={{
            position: 'absolute',
            top: 'var(--space-sm)',
            right: 'var(--space-sm)',
            width: 22,
            height: 22,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'var(--bg-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8' }}
          aria-label="Delete preset"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

/* ============================================
   Inline Customize Panel (expands below grid)
   ============================================ */

function CustomizePanel({
  open,
  config,
  activeSurfaceId,
  isDark,
  locale,
  t,
  presetName,
  canSave,
  colorInputRef,
  customInput,
  accentColor,
  onPresetNameChange,
  onSave,
  onCancel,
  onSelectSurface,
  onSelectAccent,
  onSetCustomColor,
}: {
  open: boolean
  config: ThemeConfig
  activeSurfaceId: string
  isDark: boolean
  locale: 'en' | 'ja'
  t: Translations
  presetName: string
  canSave: boolean
  colorInputRef: React.RefObject<HTMLInputElement | null>
  customInput: string
  accentColor: string
  onPresetNameChange: (name: string) => void
  onSave: () => void
  onCancel: () => void
  onSelectSurface: (id: string) => void
  onSelectAccent: (id: string) => void
  onSetCustomColor: (hex: string) => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState(0)

  useEffect(() => {
    if (open && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight)
    } else {
      setMaxHeight(0)
    }
  }, [open, config?.surfaceId, config?.accentId])

  return (
    <div
      style={{
        maxHeight: open ? maxHeight + 32 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}
    >
      <div
        ref={contentRef}
        style={{
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-xl)',
          background: 'var(--bg-secondary)',
          border: 'var(--border-width-thin) solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Preset name input */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 className="ds-group-label" style={{ marginBottom: 'var(--space-sm)' }}>{t.presetName}</h3>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <input
              type="text"
              value={presetName}
              onChange={(e) => onPresetNameChange(e.target.value)}
              placeholder={t.presetNamePlaceholder}
              maxLength={30}
              className="input"
              style={{
                flex: 1,
                maxWidth: 280,
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' && canSave) onSave() }}
            />
          </div>
        </div>

        {/* Surface */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 className="ds-group-label" style={{ marginBottom: 'var(--space-md)' }}>{t.surface}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {SURFACE_PRESETS.map(preset => (
              <SurfaceChip
                key={preset.id}
                preset={preset}
                isActive={activeSurfaceId === preset.id}
                isDark={isDark}
                locale={locale}
                accentColor={accentColor}
                onClick={() => onSelectSurface(preset.id)}
              />
            ))}
          </div>
        </div>

        {/* Accent */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 className="ds-group-label" style={{ marginBottom: 'var(--space-md)' }}>{t.accentColor}</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
            gap: 'var(--space-sm)',
          }}>
            {ACCENT_PRESETS.map(preset => (
              <AccentButton
                key={preset.id}
                preset={preset}
                isActive={config.accentId === preset.id}
                locale={locale}
                onClick={() => onSelectAccent(preset.id)}
              />
            ))}

            {/* Custom color */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-xs)',
            }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => colorInputRef.current?.click()}
                  style={{
                    width: 'var(--space-2xl)',
                    height: 'var(--space-2xl)',
                    borderRadius: 'var(--radius-full)',
                    background: config.accentId === 'custom' && config.customColor
                      ? config.customColor
                      : 'var(--bg-surface)',
                    border: config.accentId === 'custom'
                      ? 'var(--border-width-medium) solid var(--bg-primary)'
                      : 'var(--border-width-thin) dashed var(--border-default)',
                    boxShadow: config.accentId === 'custom' && config.customColor
                      ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${config.customColor}`
                      : 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  aria-label="Open color picker"
                >
                  {!(config.accentId === 'custom' && config.customColor) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14m-7-7h14" />
                    </svg>
                  )}
                </button>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={config.accentId === 'custom' && config.customColor ? config.customColor : accentColor}
                  onChange={(e) => onSetCustomColor(e.target.value)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>
              <span style={{
                fontSize: 'var(--text-xs)',
                color: config.accentId === 'custom' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: config.accentId === 'custom' ? 500 : 400,
                whiteSpace: 'nowrap',
              }}>
                {config.accentId === 'custom' && config.customColor
                  ? config.customColor.toUpperCase()
                  : t.custom}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
          >
            {t.cancel}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={onSave}
            disabled={!canSave}
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   Surface & Accent sub-components
   ============================================ */

function SurfaceChip({
  preset,
  isActive,
  isDark,
  locale,
  accentColor,
  onClick,
}: {
  preset: typeof SURFACE_PRESETS[number]
  isActive: boolean
  isDark: boolean
  locale: 'en' | 'ja'
  accentColor: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const previewColors = useMemo(() => {
    if (preset.id === 'default') {
      return isDark
        ? ['#111111', '#0a0a0a', '#161616', '#1a1a1a']
        : ['#f4f4f4', '#ffffff', '#fafafa', '#fdfdfd']
    }
    const surfaceHue = hexToHsl(accentColor).h
    const tokens = isDark
      ? generateDarkSurface(surfaceHue, preset.tintStrength)
      : generateLightSurface(surfaceHue, preset.tintStrength, preset.lightnessBase)
    return [
      tokens['--bg-secondary'] ?? '#111111',
      tokens['--bg-primary'] ?? '#0a0a0a',
      tokens['--bg-card'] ?? '#161616',
      tokens['--bg-elevated'] ?? '#1a1a1a',
    ]
  }, [preset, isDark, accentColor])

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-md) var(--space-lg)',
        background: isActive
          ? 'var(--accent-bg)'
          : hovered ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
        border: `var(--border-width-thin) solid ${
          isActive
            ? 'var(--accent-border)'
            : hovered ? 'var(--border-default)' : 'var(--border-subtle)'
        }`,
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
        minWidth: 80,
      }}
    >
      <div style={{
        display: 'flex',
        width: 56,
        height: 36,
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        border: 'var(--border-width-thin) solid var(--border-subtle)',
      }}>
        <div style={{ width: 16, background: previewColors[0], flexShrink: 0 }} />
        <div style={{
          flex: 1,
          background: previewColors[1],
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2xs)',
        }}>
          <div style={{ flex: 1, background: previewColors[2], borderRadius: 'var(--radius-xs)' }} />
          <div style={{ height: 7, background: previewColors[3], borderRadius: 'var(--radius-xs)' }} />
        </div>
      </div>
      <span style={{
        fontSize: 'var(--text-xs)',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        whiteSpace: 'nowrap',
      }}>
        {locale === 'ja' ? preset.nameJa : preset.name}
      </span>
    </button>
  )
}

function AccentButton({
  preset,
  isActive,
  locale,
  onClick,
}: {
  preset: typeof ACCENT_PRESETS[number]
  isActive: boolean
  locale: 'en' | 'ja'
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-xs)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
      }}
      title={`${preset.name} (${preset.nameJa})`}
    >
      <div style={{
        width: 'var(--space-2xl)',
        height: 'var(--space-2xl)',
        borderRadius: 'var(--radius-full)',
        background: preset.color,
        boxShadow: isActive
          ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${preset.color}`
          : 'none',
        transition: 'box-shadow 0.15s ease',
      }} />
      <span style={{
        fontSize: 'var(--text-xs)',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontWeight: isActive ? 500 : 400,
        whiteSpace: 'nowrap',
      }}>
        {locale === 'ja' ? preset.nameJa : preset.name}
      </span>
    </button>
  )
}

/* ============================================
   Details Section
   ============================================ */

function DetailsSection({
  t,
  adjustedPrimary,
  primaryRatio,
  adjustedSecondary,
  secondaryRatio,
}: {
  t: Translations
  adjustedPrimary: string
  primaryRatio: number
  adjustedSecondary: string
  secondaryRatio: number
}) {
  const colorSegments = getColorSegments(t)

  return (
    <>
      <h2 className="ds-section-title">{t.detailsTitle}</h2>
      <p className="ds-section-desc">{t.detailsDesc}</p>

      <div className="ds-group">
        <h3 className="ds-group-label">{t.wcagContrast}</h3>
        <div style={{
          background: 'var(--bg-secondary)',
          border: 'var(--border-width-thin) solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
        }}>
          <ContrastRow label={t.primary} color={adjustedPrimary} ratio={primaryRatio} />
          <ContrastRow label={t.secondaryAuto} color={adjustedSecondary} ratio={secondaryRatio} />
        </div>
      </div>

      <div className="ds-group">
        <h3 className="ds-group-label">{t.colorDist}</h3>
        <div style={{
          background: 'var(--bg-secondary)',
          border: 'var(--border-width-thin) solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xl)',
        }}>
          <div style={{
            display: 'flex',
            height: 28,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: 'var(--border-width-thin) solid var(--border-subtle)',
          }}>
            {colorSegments.map((s, i) => (
              <div
                key={s.label}
                style={{
                  flex: s.pct,
                  background: `var(${s.cssVar})`,
                  borderRight: i < colorSegments.length - 1 ? 'var(--border-width-thin) solid var(--border-subtle)' : 'none',
                }}
              />
            ))}
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-sm) var(--space-lg)',
            marginTop: 'var(--space-md)',
          }}>
            {colorSegments.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: `var(${s.cssVar})`,
                  border: 'var(--border-width-thin) solid var(--border-subtle)',
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {s.label} {s.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ============================================
   Helpers
   ============================================ */

function getColorSegments(t: Translations) {
  return [
    { label: t.bg, pct: 42, cssVar: '--bg-primary' },
    { label: t.surfaceLabel, pct: 28, cssVar: '--bg-card' },
    { label: t.text, pct: 12, cssVar: '--text-primary' },
    { label: t.accentLabel, pct: 8, cssVar: '--accent' },
    { label: t.border, pct: 6, cssVar: '--border-strong' },
    { label: t.secondLabel, pct: 4, cssVar: '--accent-secondary' },
  ]
}

function ContrastRow({ label, color, ratio }: { label: string; color: string; ratio: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 'var(--radius-full)',
        background: color,
        border: 'var(--border-width-thin) solid var(--border-subtle)',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500, minWidth: 100 }}>
          {label}
        </span>
        <span style={{
          fontSize: 'var(--text-base)',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          color: ratio >= 4.5 ? 'var(--success)' : 'var(--warning)',
        }}>
          {ratio.toFixed(1)}:1
        </span>
        <span style={{
          fontSize: 'var(--text-xs)',
          padding: 'var(--space-2xs) var(--space-sm)',
          borderRadius: 'var(--radius-sm)',
          background: ratio >= 4.5 ? 'var(--success-bg)' : 'var(--warning-bg)',
          color: ratio >= 4.5 ? 'var(--success)' : 'var(--warning)',
          fontWeight: 500,
        }}>
          {ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'}
        </span>
      </div>
    </div>
  )
}
