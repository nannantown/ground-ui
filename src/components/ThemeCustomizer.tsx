import { useState, useEffect, useRef, useMemo } from 'react'
import { useTheme } from 'next-themes'
import {
  ACCENT_PRESETS,
  SURFACE_PRESETS,
  THEME_PAIRINGS,
  type ThemeConfig,
  type SurfacePreset,
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
} from '../theme'

export interface ThemeCustomizerLabels {
  preview: string
  presets: string
  customized: string
  colorDistribution: string
  customize: string
  surface: string
  accentColor: string
  openColorPicker: string
  customColor: string
  details: string
  wcagContrast: string
  primary: string
  secondaryAuto: string
  primaryStyle: string
  mono: string
  accent: string
  activeTab: string
  linkText: string
  surfaceDefault: string
  surfaceSubtle: string
  surfaceTinted: string
  surfaceRich: string
}

const DEFAULT_LABELS: ThemeCustomizerLabels = {
  preview: 'Preview',
  presets: 'Presets',
  customized: 'Customized',
  colorDistribution: 'Color Distribution',
  customize: 'Customize',
  surface: 'Surface',
  accentColor: 'Accent Color',
  openColorPicker: 'Open color picker',
  customColor: 'Custom',
  details: 'Details',
  wcagContrast: 'WCAG Contrast',
  primary: 'Primary',
  secondaryAuto: 'Secondary (auto)',
  primaryStyle: 'Primary Button Style',
  mono: 'Mono',
  accent: 'Accent',
  activeTab: 'Active Tab',
  linkText: 'Link text',
  surfaceDefault: 'Default',
  surfaceSubtle: 'Subtle',
  surfaceTinted: 'Tinted',
  surfaceRich: 'Rich',
}

interface ThemeCustomizerProps {
  labels?: Partial<ThemeCustomizerLabels>
  language?: 'ja' | 'en'
}

export function ThemeCustomizer({ labels: labelOverrides, language = 'en' }: ThemeCustomizerProps) {
  const ds = { ...DEFAULT_LABELS, ...labelOverrides }

  const [config, setConfig] = useState<ThemeConfig | null>(null)
  const [customInput, setCustomInput] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  // Load config on mount
  useEffect(() => {
    const loaded = loadThemeConfig()
    setConfig(loaded)
    setCustomInput(loaded.customColor ?? '')
  }, [])

  // Apply and save whenever config or theme changes
  useEffect(() => {
    if (!config) return
    applyAccentTheme(config, isDark)
    saveThemeConfig(config)
  }, [config, isDark])

  // Compute effective bg hex from surface selection
  const bgHex = useMemo(() => {
    if (!config) return isDark ? '#0a0a0a' : '#ffffff'
    const surfaceId = config.surfaceId ?? 'default'
    if (surfaceId === 'default') return isDark ? '#0a0a0a' : '#ffffff'
    const surface = SURFACE_PRESETS.find(p => p.id === surfaceId)
    if (!surface) return isDark ? '#0a0a0a' : '#ffffff'
    const surfaceHue = hexToHsl(getAccentColor(config)).h
    const tokens = isDark
      ? generateDarkSurface(surfaceHue, surface.tintStrength)
      : generateLightSurface(surfaceHue, surface.tintStrength, surface.lightnessBase)
    return tokens['--bg-primary'] ?? (isDark ? '#0a0a0a' : '#ffffff')
  }, [config, isDark])

  // Compute preview colors for each pairing (rich data for mini UI mockups)
  const previewColors = useMemo(() => {
    return THEME_PAIRINGS.map(pairing => {
      const surface = SURFACE_PRESETS.find(s => s.id === pairing.surfaceId)!
      const accent = ACCENT_PRESETS.find(a => a.id === pairing.accentId)!

      let bg: string, bgSec: string, bgCrd: string, text: string, textMut: string

      if (surface.id === 'default') {
        if (isDark) {
          bg = '#0a0a0a'; bgSec = '#111111'; bgCrd = '#161616'; text = '#ffffff'; textMut = '#666666'
        } else {
          bg = '#ffffff'; bgSec = '#f4f4f4'; bgCrd = '#fafafa'; text = '#1a1a1a'; textMut = '#999999'
        }
      } else {
        const surfaceHue = hexToHsl(accent.color).h
        const tokens = isDark
          ? generateDarkSurface(surfaceHue, surface.tintStrength)
          : generateLightSurface(surfaceHue, surface.tintStrength, surface.lightnessBase)
        bg = tokens['--bg-primary']
        bgSec = tokens['--bg-secondary']
        bgCrd = tokens['--bg-card']
        text = tokens['--text-primary'] ?? (isDark ? '#ffffff' : '#1a1a1a')
        textMut = tokens['--text-muted'] ?? (isDark ? '#666666' : '#999999')
      }

      const accentSec = generateSecondaryAccent(accent.color)
      return { bg, bgSec, bgCrd, text, textMut, accent: accent.color, accentSec }
    })
  }, [isDark])

  if (!config) return null

  const accentColor = getAccentColor(config)
  const adjustedPrimary = ensureContrast(accentColor, bgHex, 4.5)
  const primaryRatio = contrastRatio(adjustedPrimary, bgHex)

  const secondaryColor = generateSecondaryAccent(accentColor)
  const adjustedSecondary = ensureContrast(secondaryColor, bgHex, 4.5)
  const secondaryRatio = contrastRatio(adjustedSecondary, bgHex)

  const activeSurfaceId = config.surfaceId ?? 'default'
  const isCustomized = !config.pairingId && activeSurfaceId !== 'default'

  function selectPairing(pairing: typeof THEME_PAIRINGS[number]) {
    setConfig(prev => prev ? {
      ...prev,
      surfaceId: pairing.surfaceId,
      accentId: pairing.accentId,
      pairingId: pairing.id,
      customColor: undefined,
    } : prev)
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* --- Preview --- */}
      <div>
        <SectionLabel>{ds.preview}</SectionLabel>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <MobilePreview />
          <WebPreview />
        </div>
      </div>

      {/* --- Presets Section --- */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <SectionLabel style={{ marginBottom: 0 }}>{ds.presets}</SectionLabel>
          {isCustomized && (
            <span
              style={{ fontSize: 10, padding: '2px 6px', borderRadius: 'var(--radius-full)', color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
            >
              {ds.customized}
            </span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {THEME_PAIRINGS.map((pairing, index) => {
            const isActive = config.pairingId === pairing.id
            const preview = previewColors[index]
            return (
              <button
                key={pairing.id}
                onClick={() => selectPairing(pairing)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: 10,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  transition: 'all 150ms ease',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  borderColor: isActive ? 'var(--accent-border)' : 'var(--border-subtle)',
                  background: isActive ? 'var(--accent-bg)' : 'var(--bg-surface)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-surface-hover)'
                    e.currentTarget.style.borderColor = 'var(--border-default)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-surface)'
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  }
                }}
              >
                {/* Mini app mockup showing surface + accent in context */}
                <div
                  style={{ height: 40, background: preview.bg, borderRadius: 'var(--radius-sm)', overflow: 'hidden', display: 'flex' }}
                >
                  {/* Sidebar */}
                  <div style={{
                    width: 16,
                    background: preview.bgSec,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 6,
                    gap: 3,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, background: preview.accent, opacity: 0.9 }} />
                    <div style={{ width: 6, height: 1.5, borderRadius: 1, background: preview.textMut, opacity: 0.3 }} />
                    <div style={{ width: 6, height: 1.5, borderRadius: 1, background: preview.textMut, opacity: 0.3 }} />
                  </div>
                  {/* Content area */}
                  <div style={{ flex: 1, padding: '5px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ height: 2, width: '50%', borderRadius: 1, background: preview.text, opacity: 0.5 }} />
                    <div style={{
                      flex: 1,
                      background: preview.bgCrd,
                      borderRadius: 3,
                      padding: '3px 4px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ height: 1.5, width: '65%', borderRadius: 1, background: preview.textMut, opacity: 0.3 }} />
                      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <div style={{ height: 3, width: '40%', borderRadius: 1.5, background: preview.accent }} />
                        <div style={{ height: 3, width: '25%', borderRadius: 1.5, background: preview.accentSec, opacity: 0.7 }} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Name */}
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {language === 'ja' ? pairing.nameJa : pairing.name}
                </span>
                {/* Mood */}
                <span style={{ fontSize: 10, lineHeight: 1.3, color: 'var(--text-muted)' }}>
                  {language === 'ja' ? pairing.moodJa : pairing.mood}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* --- Color Distribution --- */}
      <div>
        <SectionLabel>{ds.colorDistribution}</SectionLabel>
        <ColorDistribution />
      </div>

      {/* --- Customize Section (collapsible) --- */}
      <div>
        <button
          onClick={() => setCustomizeOpen(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '10px 0',
            background: 'none',
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            borderTop: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: customizeOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
            }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {ds.customize}
          </span>
        </button>

        {customizeOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            paddingTop: 16,
          }}>
            {/* Surface Selection */}
            <div>
              <SectionLabel>{ds.surface}</SectionLabel>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                {SURFACE_PRESETS.map(preset => (
                  <SurfaceCard
                    key={preset.id}
                    preset={preset}
                    isActive={activeSurfaceId === preset.id}
                    isDark={isDark}
                    language={language}
                    ds={ds}
                    accentColor={accentColor}
                    onClick={() => selectSurface(preset.id)}
                  />
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <SectionLabel>{ds.accentColor}</SectionLabel>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {ACCENT_PRESETS.map(preset => {
                  const isActive = config.accentId === preset.id
                  return (
                    <button
                      key={preset.id}
                      onClick={() => selectAccent(preset.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        padding: 0,
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        opacity: isActive ? 1 : 0.7,
                        width: 44,
                      }}
                      title={`${preset.name} (${preset.nameJa})`}
                    >
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: preset.color,
                        boxShadow: isActive
                          ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${preset.color}`
                          : 'none',
                        transition: 'box-shadow 150ms ease',
                      }} />
                      <span style={{
                        fontSize: 10,
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: isActive ? 500 : 400,
                        whiteSpace: 'nowrap',
                      }}>
                        {preset.name}
                      </span>
                    </button>
                  )
                })}

                {/* Custom color picker */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  width: 44,
                }}>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => colorInputRef.current?.click()}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: config.accentId === 'custom' && config.customColor
                          ? config.customColor
                          : 'var(--bg-surface)',
                        border: config.accentId === 'custom'
                          ? '2px solid var(--bg-primary)'
                          : '1.5px dashed var(--border-default)',
                        boxShadow: config.accentId === 'custom' && config.customColor
                          ? `0 0 0 4px ${config.customColor}`
                          : 'none',
                        cursor: 'pointer',
                        padding: 0,
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 150ms ease',
                      }}
                      aria-label={ds.openColorPicker}
                    >
                      {!(config.accentId === 'custom' && config.customColor) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14m-7-7h14" />
                        </svg>
                      )}
                    </button>
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={config.accentId === 'custom' && config.customColor ? config.customColor : accentColor}
                      onChange={(e) => setCustomColor(e.target.value)}
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
                    fontSize: 10,
                    color: config.accentId === 'custom' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: config.accentId === 'custom' ? 500 : 400,
                    whiteSpace: 'nowrap',
                  }}>
                    {config.accentId === 'custom' && config.customColor
                      ? config.customColor.toUpperCase()
                      : ds.customColor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Collapsible: Details --- */}
      <div>
        <button
          onClick={() => setDetailsOpen(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '10px 0',
            background: 'none',
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            borderTop: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: detailsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
            }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {ds.details}
          </span>
        </button>

        {detailsOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            paddingTop: 16,
          }}>
            {/* WCAG Contrast */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
              }}>
                {ds.wcagContrast}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ContrastRow
                  label={ds.primary}
                  color={adjustedPrimary}
                  ratio={primaryRatio}
                />
                <ContrastRow
                  label={ds.secondaryAuto}
                  color={adjustedSecondary}
                  ratio={secondaryRatio}
                />
              </div>
            </div>

            {/* Primary Button Style */}
            <div>
              <SectionLabel>{ds.primaryStyle}</SectionLabel>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['mono', 'accent'] as const).map(style => {
                  const isActive = config.primaryStyle === style
                  return (
                    <button
                      key={style}
                      onClick={() => setPrimaryStyle(style)}
                      className={`pill-filter ${isActive ? 'pill-filter-active' : ''}`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {style === 'mono' ? ds.mono : ds.accent}
                    </button>
                  )
                })}
              </div>

              {/* Preview */}
              <div
                style={{
                  marginTop: 16,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: 24,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <button className="btn btn-primary btn-sm">
                  Primary
                </button>
                <button className="btn btn-secondary btn-sm">
                  Secondary
                </button>
                <span className="pill-filter pill-filter-active" style={{ pointerEvents: 'none' }}>
                  {ds.activeTab}
                </span>
                <span style={{ color: 'var(--accent)', fontSize: 13 }}>
                  {ds.linkText}
                </span>
                <span style={{ color: 'var(--accent-secondary)', fontSize: 13 }}>
                  Secondary
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================================
   Section Label
   ============================================ */

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--text-muted)',
      marginBottom: 12,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ============================================
   Surface Preset Card
   ============================================ */

function SurfaceCard({
  preset,
  isActive,
  isDark,
  language,
  ds,
  accentColor,
  onClick,
}: {
  preset: SurfacePreset
  isActive: boolean
  isDark: boolean
  language: string
  ds: { surfaceDefault: string; surfaceSubtle: string; surfaceTinted: string; surfaceRich: string }
  accentColor: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  // Get preview colors for this surface preset
  const previewColors = useMemo(() => {
    if (preset.id === 'default') {
      if (isDark) {
        return ['#111111', '#0a0a0a', '#161616', '#1a1a1a']
      }
      return ['#f4f4f4', '#ffffff', '#fafafa', '#fdfdfd']
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

  // Surface name from translations
  const nameMap: Record<string, string> = {
    default: ds.surfaceDefault,
    subtle: ds.surfaceSubtle,
    tinted: ds.surfaceTinted,
    rich: ds.surfaceRich,
  }
  const displayName = nameMap[preset.id] ?? (language === 'ja' ? preset.nameJa : preset.name)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        background: isActive
          ? 'var(--accent-bg)'
          : hovered
            ? 'var(--bg-surface-hover)'
            : 'var(--bg-surface)',
        border: `1px solid ${
          isActive
            ? 'var(--accent-border)'
            : hovered
              ? 'var(--border-default)'
              : 'var(--border-subtle)'
        }`,
        borderRadius: 10,
        cursor: 'pointer',
        outline: 'none',
        fontFamily: 'inherit',
        transition: 'all 150ms ease',
        minWidth: 72,
      }}
    >
      {/* Mini app layout showing surface bg hierarchy */}
      <div style={{
        display: 'flex',
        width: 52,
        height: 32,
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        {/* Sidebar strip */}
        <div style={{ width: 14, background: previewColors[0], flexShrink: 0 }} />
        {/* Main area */}
        <div style={{
          flex: 1,
          background: previewColors[1],
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {/* Card */}
          <div style={{
            flex: 1,
            background: previewColors[2],
            borderRadius: 2,
          }} />
          {/* Elevated element */}
          <div style={{
            height: 6,
            background: previewColors[3],
            borderRadius: 2,
          }} />
        </div>
      </div>

      <span style={{
        fontSize: 10,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        whiteSpace: 'nowrap',
      }}>
        {displayName}
      </span>
    </button>
  )
}

/* ============================================
   Color Distribution Bar
   ============================================ */

const COLOR_SEGMENTS = [
  { label: 'BG', pct: 42, cssVar: '--bg-primary' },
  { label: 'Surface', pct: 28, cssVar: '--bg-card' },
  { label: 'Text', pct: 12, cssVar: '--text-primary' },
  { label: 'Accent', pct: 8, cssVar: '--accent' },
  { label: 'Border', pct: 6, cssVar: '--border-strong' },
  { label: '2nd', pct: 4, cssVar: '--accent-secondary' },
]

function ColorDistribution() {
  return (
    <div>
      {/* Stacked bar */}
      <div style={{
        display: 'flex',
        height: 24,
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}>
        {COLOR_SEGMENTS.map((s, i) => (
          <div
            key={s.label}
            style={{
              flex: s.pct,
              background: `var(${s.cssVar})`,
              borderRight: i < COLOR_SEGMENTS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 14px',
        marginTop: 10,
      }}>
        {COLOR_SEGMENTS.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: `var(${s.cssVar})`,
              border: '1px solid var(--border-subtle)',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {s.label} {s.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   Mobile Preview Mock
   ============================================ */

function MobilePreview() {
  return (
    <div style={{
      width: 172,
      borderRadius: 20,
      border: '2px solid var(--border-default)',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
      flexShrink: 0,
    }}>
      {/* Status bar */}
      <div style={{
        padding: '5px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 7, fontWeight: 700, color: 'var(--text-primary)' }}>9:41</span>
        <div style={{
          width: 36,
          height: 10,
          borderRadius: 5,
          background: 'var(--text-primary)',
        }} />
        <div style={{ display: 'flex', gap: 2 }}>
          {[4, 6, 8, 10].map((h, i) => (
            <div key={i} style={{ width: 2, height: h, borderRadius: 1, background: 'var(--text-primary)' }} />
          ))}
        </div>
      </div>

      {/* Nav header */}
      <div style={{
        padding: '6px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>&#x2190;</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)', flex: 1, textAlign: 'center' }}>
          Dashboard
        </span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>&#x2022;&#x2022;&#x2022;</span>
      </div>

      {/* Content */}
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Stat card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--card-border, var(--border-subtle))',
          borderRadius: 8,
          padding: '8px 10px',
        }}>
          <div style={{ fontSize: 7, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Items
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 4px' }}>
            1,234
          </div>
          <div style={{
            height: 3,
            borderRadius: 2,
            background: 'var(--accent-secondary-bg, var(--bg-surface))',
          }}>
            <div style={{
              width: '71%',
              height: '100%',
              borderRadius: 2,
              background: 'var(--accent)',
            }} />
          </div>
        </div>

        {/* List card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--card-border, var(--border-subtle))',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '5px 10px',
            fontSize: 8,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Recent</span>
            <span style={{ fontSize: 7, fontWeight: 500, color: 'var(--accent-secondary)' }}>View all</span>
          </div>
          {['Project Alpha', 'Weekly Report', 'Settings'].map((item, i) => (
            <div key={i} style={{
              padding: '5px 10px',
              borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 8, color: 'var(--text-primary)' }}>{item}</span>
              <span style={{ fontSize: 8, color: i === 0 ? 'var(--accent)' : 'var(--accent-secondary)' }}>&rsaquo;</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <div style={{
          padding: '6px 0',
          background: 'var(--selected-bg)',
          color: 'var(--selected-text)',
          border: 'none',
          borderRadius: 6,
          fontSize: 9,
          fontWeight: 600,
          textAlign: 'center',
        }}>
          Save Changes
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '7px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {['Home', 'Search', 'Profile'].map((label, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: i === 0 ? 'var(--accent-bg)' : i === 1 ? 'var(--accent-secondary-bg)' : 'transparent',
              margin: '0 auto 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: i === 2 ? '50%' : 2,
                background: i <= 1 ? (i === 0 ? 'var(--accent)' : 'var(--accent-secondary)') : 'none',
                border: i <= 1 ? 'none' : '1.5px solid var(--text-disabled)',
              }} />
            </div>
            <span style={{
              fontSize: 6,
              color: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent-secondary)' : 'var(--text-disabled)',
              fontWeight: i <= 1 ? 600 : 400,
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   Web Preview Mock
   ============================================ */

function WebPreview() {
  return (
    <div style={{
      flex: 1,
      borderRadius: 10,
      border: '2px solid var(--border-default)',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
      minWidth: 0,
    }}>
      {/* Browser chrome */}
      <div style={{
        padding: '6px 10px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{
          flex: 1,
          height: 14,
          borderRadius: 4,
          background: 'var(--bg-surface)',
          marginLeft: 4,
        }}>
          <div style={{
            padding: '0 6px',
            fontSize: 7,
            color: 'var(--text-disabled)',
            lineHeight: '14px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
            centra.app/dashboard
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', minHeight: 200 }}>
        {/* Sidebar */}
        <div style={{
          width: 72,
          borderRight: '1px solid var(--border-subtle)',
          padding: '8px 0',
          background: 'var(--bg-secondary)',
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{
            padding: '0 10px 6px',
            marginBottom: 4,
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Centra
            </div>
          </div>
          {['Dashboard', 'Items', 'Graph', 'Settings'].map((item, i) => (
            <div key={i} style={{
              padding: '4px 10px',
              fontSize: 7,
              color: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontWeight: i <= 1 ? 600 : 400,
              background: i === 0 ? 'var(--accent-bg)' : i === 1 ? 'var(--accent-secondary-bg)' : 'transparent',
              borderRight: i === 0 ? '2px solid var(--accent)' : i === 1 ? '2px solid var(--accent-secondary)' : '2px solid transparent',
            }}>
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 10, minWidth: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Welcome back
            </div>
            <div style={{ fontSize: 7, color: 'var(--text-muted)', marginTop: 1 }}>
              Here&apos;s your overview
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {[
              { label: 'Total', value: '1,234', trend: '+12%', trendColor: 'var(--success)' },
              { label: 'Active', value: '856', trend: '+3%', trendColor: 'var(--accent-secondary, var(--success))' },
              { label: 'Pending', value: '23', trend: '-2', trendColor: 'var(--error)' },
            ].map(stat => (
              <div key={stat.label} style={{
                flex: 1,
                padding: '6px 8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--card-border, var(--border-subtle))',
                borderRadius: 6,
              }}>
                <div style={{ fontSize: 6, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</span>
                  <span style={{
                    fontSize: 6,
                    fontWeight: 600,
                    color: stat.trendColor,
                  }}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Card with list */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--card-border, var(--border-subtle))',
            borderRadius: 6,
            overflow: 'hidden',
            marginBottom: 8,
          }}>
            <div style={{
              padding: '5px 8px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Activity</span>
              <span style={{ fontSize: 7, color: 'var(--accent-secondary, var(--accent))' }}>View all</span>
            </div>
            {['Updated profile settings', 'Added 3 new items', 'Shared with team'].map((item, i) => (
              <div key={i} style={{
                padding: '4px 8px',
                borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <div style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--accent)' : i === 1 ? 'var(--accent-secondary)' : 'var(--text-disabled)',
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 7, color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Buttons row */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{
              padding: '3px 10px',
              background: 'var(--selected-bg)',
              color: 'var(--selected-text)',
              borderRadius: 4,
              fontSize: 7,
              fontWeight: 600,
            }}>
              Primary
            </div>
            <div style={{
              padding: '3px 10px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
              borderRadius: 4,
              fontSize: 7,
            }}>
              Secondary
            </div>
            <span style={{ fontSize: 7, color: 'var(--accent-secondary)', marginLeft: 2 }}>
              Link
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   Contrast Row Helper
   ============================================ */

function ContrastRow({ label, color, ratio }: { label?: string; color: string; ratio: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: color,
        border: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {label && (
            <span style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              fontWeight: 500,
              minWidth: 60,
            }}>
              {label}
            </span>
          )}
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: ratio >= 4.5 ? 'var(--success)' : 'var(--warning)',
          }}>
            {ratio.toFixed(1)}:1
          </span>
          <span style={{
            fontSize: 11,
            padding: '1px 6px',
            borderRadius: 4,
            background: ratio >= 4.5 ? 'var(--success-bg)' : 'var(--warning-bg)',
            color: ratio >= 4.5 ? 'var(--success)' : 'var(--warning)',
            fontWeight: 500,
          }}>
            {ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'}
          </span>
        </div>
      </div>
    </div>
  )
}
