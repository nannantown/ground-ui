/* ============================================
   Centra Accent Theme System
   Runtime-configurable surface style + accent color.
   WCAG AA contrast-aware: automatically adjusts shade per mode.
   Surface x Accent: two independent axes for theme customization.
   ============================================ */

// --- Types ---

export interface AccentPreset {
  id: string
  name: string
  nameJa: string
  color: string
}

export interface SurfacePreset {
  id: string
  name: string
  nameJa: string
  tintStrength: number  // 0-1
  lightnessBase: number // 85-100
}

export interface ThemeConfig {
  accentId: string           // preset id or 'custom'
  customColor?: string       // hex color when accentId === 'custom'
  primaryStyle: 'mono' | 'accent'
  surfaceId?: string | null  // surface preset id (null = default)
  pairingId?: string | null  // active preset pairing id
  paletteId?: string | null  // deprecated, kept for migration
}

export interface ThemePairing {
  id: string
  name: string
  nameJa: string
  mood: string
  moodJa: string
  surfaceId: string
  accentId: string
}

// --- Presets ---

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'neutral', name: 'Neutral', nameJa: 'ニュートラル', color: '#ededed' },
  { id: 'sky',     name: 'Sky',     nameJa: '空',   color: '#0EA5E9' },
  { id: 'ocean',   name: 'Ocean',   nameJa: '海',   color: '#3B82F6' },
  { id: 'indigo',  name: 'Indigo',  nameJa: '藍',   color: '#6366F1' },
  { id: 'violet',  name: 'Violet',  nameJa: '菫',   color: '#8B5CF6' },
  { id: 'rose',    name: 'Rose',    nameJa: '薔薇', color: '#F43F5E' },
  { id: 'crimson', name: 'Crimson', nameJa: '紅',   color: '#E11D48' },
  { id: 'ember',   name: 'Ember',   nameJa: '炎',   color: '#F97316' },
  { id: 'amber',   name: 'Amber',   nameJa: '琥珀', color: '#F59E0B' },
  { id: 'emerald', name: 'Emerald', nameJa: '翠',   color: '#10B981' },
  { id: 'teal',    name: 'Teal',    nameJa: '青磁', color: '#14B8A6' },
]

export const SURFACE_PRESETS: SurfacePreset[] = [
  { id: 'default', name: 'Default', nameJa: 'デフォルト', tintStrength: 0.0, lightnessBase: 100 },
  { id: 'subtle',  name: 'Subtle',  nameJa: 'サトル',     tintStrength: 0.35, lightnessBase: 96 },
  { id: 'tinted',  name: 'Tinted',  nameJa: 'ティンテッド', tintStrength: 0.6, lightnessBase: 93 },
  { id: 'rich',    name: 'Rich',    nameJa: 'リッチ',     tintStrength: 0.85, lightnessBase: 90 },
]

export const THEME_PAIRINGS: ThemePairing[] = [
  { id: 'default', name: 'Default', nameJa: 'デフォルト', mood: 'Pure and neutral', moodJa: '純粋でニュートラル', surfaceId: 'default', accentId: 'neutral' },
  { id: 'midnight', name: 'Midnight', nameJa: 'ミッドナイト', mood: 'Clean and focused', moodJa: 'クリーンで集中できる', surfaceId: 'default', accentId: 'sky' },
  { id: 'monochrome', name: 'Monochrome', nameJa: 'モノクローム', mood: 'Minimal and precise', moodJa: 'ミニマルで精密', surfaceId: 'subtle', accentId: 'indigo' },
  { id: 'arctic', name: 'Arctic', nameJa: 'アークティック', mood: 'Crisp and expansive', moodJa: '澄んで広がりのある', surfaceId: 'tinted', accentId: 'ocean' },
  { id: 'aurora', name: 'Aurora', nameJa: 'オーロラ', mood: 'Deep and vivid', moodJa: '深くて鮮やかな', surfaceId: 'tinted', accentId: 'emerald' },
  { id: 'ember', name: 'Ember', nameJa: 'エンバー', mood: 'Bold and energetic', moodJa: '力強くエネルギッシュ', surfaceId: 'tinted', accentId: 'ember' },
  { id: 'sandstone', name: 'Sandstone', nameJa: 'サンドストーン', mood: 'Warm and grounded', moodJa: '温かく落ち着いた', surfaceId: 'rich', accentId: 'amber' },
  { id: 'rosewood', name: 'Rosewood', nameJa: 'ローズウッド', mood: 'Rich and refined', moodJa: '豊かで洗練された', surfaceId: 'tinted', accentId: 'rose' },
  { id: 'twilight', name: 'Twilight', nameJa: 'トワイライト', mood: 'Warm glow, cool edge', moodJa: '温かい光と冷たい輝き', surfaceId: 'rich', accentId: 'violet' },
]

// --- Constants ---

const THEME_STORAGE_KEY = 'centra-accent-theme'
const WCAG_AA_NORMAL = 4.5
const WCAG_AA_LARGE = 3.0

const DEFAULT_CONFIG: ThemeConfig = {
  accentId: 'neutral',
  primaryStyle: 'mono',
}

// --- Color Utilities ---

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex)
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

// --- WCAG Contrast Utilities ---

export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map(c => {
    const cn = c / 255
    return cn <= 0.03928 ? cn / 12.92 : Math.pow((cn + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1)
  const l2 = getRelativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getContrastColor(hex: string): '#ffffff' | '#000000' {
  const blackContrast = contrastRatio(hex, '#000000')
  const whiteContrast = contrastRatio(hex, '#ffffff')
  return blackContrast >= whiteContrast ? '#000000' : '#ffffff'
}

export function ensureContrast(
  hex: string,
  bgHex: string,
  minRatio: number = WCAG_AA_NORMAL,
): string {
  if (contrastRatio(hex, bgHex) >= minRatio) return hex

  const { h, s, l } = hexToHsl(hex)
  const bgL = getRelativeLuminance(bgHex)

  if (bgL > 0.5) {
    for (let newL = Math.floor(l); newL >= 0; newL--) {
      const candidate = hslToHex(h, s, newL)
      if (contrastRatio(candidate, bgHex) >= minRatio) return candidate
    }
  } else {
    for (let newL = Math.ceil(l); newL <= 100; newL++) {
      const candidate = hslToHex(h, s, newL)
      if (contrastRatio(candidate, bgHex) >= minRatio) return candidate
    }
  }

  return hex
}

// --- Token Generation ---

export function generateColorTokens(
  hex: string,
  bgHex: string,
  prefix: string,
): Record<string, string> {
  const accessible = ensureContrast(hex, bgHex, WCAG_AA_NORMAL)
  const { r, g, b } = hexToRgb(accessible)
  const { h, s, l } = hexToHsl(accessible)

  const hover = hslToHex(h, s, Math.max(l - 8, 5))
  const lightCandidate = hslToHex(h, s, Math.min(l + 15, 90))
  const light = ensureContrast(lightCandidate, bgHex, WCAG_AA_LARGE)

  return {
    [prefix]: accessible,
    [`${prefix}-hover`]: hover,
    [`${prefix}-light`]: light,
    [`${prefix}-bg`]: `rgba(${r}, ${g}, ${b}, 0.10)`,
    [`${prefix}-bg-strong`]: `rgba(${r}, ${g}, ${b}, 0.20)`,
    [`${prefix}-border`]: `rgba(${r}, ${g}, ${b}, 0.50)`,
  }
}

export function generateAccentTokens(
  hex: string,
  bgHex: string = '#0a0a0a',
): Record<string, string> {
  return generateColorTokens(hex, bgHex, '--accent')
}

// --- Secondary Accent Generation ---

const SECONDARY_HUE_SHIFT = 30 // ~8% of 360° — analogous harmony

export function generateSecondaryAccent(primaryHex: string): string {
  const { h, s, l } = hexToHsl(primaryHex)
  const secondaryHue = (h + SECONDARY_HUE_SHIFT) % 360
  return hslToHex(secondaryHue, s * 0.65, Math.min(l + 12, 85))
}

// --- Surface Tint Helpers ---

/**
 * Generate an off-white tinted with the surface hue.
 * When tint=0, returns pure white (#ffffff).
 * Saturation is very subtle (3-8% range) — imperceptible individually
 * but creates cohesive warmth/coolness across the entire theme.
 */
function tintedWhite(hue: number, tint: number): string {
  if (tint === 0) return '#ffffff'
  const saturation = tint * 8  // 0-8% range
  const lightness = 98 - tint * 1  // 97-98% — nearly white
  return hslToHex(hue, saturation, lightness)
}

/**
 * Generate an off-black tinted with the surface hue.
 * When tint=0, returns pure black (#000000).
 * Same subtle saturation approach for dark inverse text.
 */
function tintedBlack(hue: number, tint: number): string {
  if (tint === 0) return '#000000'
  const saturation = tint * 10  // 0-10% range (slightly more than white for visibility)
  const lightness = 4 + tint * 2  // 4-6% — nearly black
  return hslToHex(hue, saturation, lightness)
}

/**
 * Generate a tinted hover shade (for selected-hover, btn-primary-hover).
 * Based on the off-white but slightly darker for visual feedback.
 */
function tintedHover(hue: number, tint: number): string {
  if (tint === 0) return '#e8e8e8'
  const saturation = tint * 6
  const lightness = 90 - tint * 2  // 88-90%
  return hslToHex(hue, saturation, lightness)
}

/**
 * Generate a tinted active shade (for btn-primary-active).
 * Darker than hover for pressed state feedback.
 */
function tintedActive(hue: number, tint: number): string {
  if (tint === 0) return '#d0d0d0'
  const saturation = tint * 5
  const lightness = 82 - tint * 2  // 80-82%
  return hslToHex(hue, saturation, lightness)
}

/**
 * Generate a tinted selected-hover shade for dark mode.
 * Slightly darker than the tinted white for hover feedback.
 */
function tintedSelectedHover(hue: number, tint: number): string {
  if (tint === 0) return '#e0e0e0'
  const saturation = tint * 6
  const lightness = 87 - tint * 2  // 85-87%
  return hslToHex(hue, saturation, lightness)
}

// --- Surface Token Generation ---

export function generateLightSurface(hue: number, tint: number, lBase: number): Record<string, string> {
  const bgPrimary = hslToHex(hue, tint * 40, lBase)
  const bgSecondary = hslToHex(hue, tint * 30, lBase - 4)
  const bgCard = hslToHex(hue, tint * 45, Math.min(lBase + 5, 99))
  const bgElevated = hslToHex(hue, tint * 15, Math.min(lBase + 7, 100))

  const { r: bgCardR, g: bgCardG, b: bgCardB } = hexToRgb(bgCard)
  const { r: bgPrimR, g: bgPrimG, b: bgPrimB } = hexToRgb(bgPrimary)

  const textPrimary = hslToHex(hue, tint * 12, Math.max(18 - tint * 7, 11))
  const textSecondary = ensureContrast(
    hslToHex(hue, tint * 8, 40 - tint * 4), bgPrimary, WCAG_AA_NORMAL
  )
  const textDisabled = ensureContrast(
    hslToHex(hue, tint * 10, 54 - tint * 6), bgPrimary, WCAG_AA_LARGE
  )

  const { r: tpR, g: tpG, b: tpB } = hexToRgb(textPrimary)
  const { h: tpH, s: tpS, l: tpL } = hexToHsl(textPrimary)
  const lightenedPrimary = hslToHex(tpH, tpS, Math.min(tpL + 15, 50))

  // Surface-hue-tinted inverse colors (Apple-style off-white for light mode)
  const textInverse = tintedWhite(hue, tint)
  const selectedText = ensureContrast(tintedWhite(hue, tint), textPrimary, WCAG_AA_NORMAL)

  return {
    // Background hierarchy
    '--bg-primary': bgPrimary,
    '--bg-secondary': bgSecondary,
    '--bg-card': bgCard,
    '--bg-elevated': bgElevated,

    // Overlay/translucent
    '--bg-overlay': `rgba(${bgCardR}, ${bgCardG}, ${bgCardB}, 0.96)`,
    '--bg-scrim': 'rgba(0, 0, 0, 0.30)',
    '--bg-translucent': `rgba(${bgPrimR}, ${bgPrimG}, ${bgPrimB}, 0.70)`,
    '--bg-surface': 'rgba(0, 0, 0, 0.03)',
    '--bg-surface-hover': 'rgba(0, 0, 0, 0.06)',
    '--bg-surface-active': 'rgba(0, 0, 0, 0.08)',

    // Text hierarchy
    '--text-primary': textPrimary,
    '--text-secondary': textSecondary,
    '--text-muted': textSecondary,
    '--text-disabled': textDisabled,
    '--text-inverse': textInverse,

    // Primitives — flip to black-alpha for light surfaces
    '--p-white-2': 'rgba(0, 0, 0, 0.02)',
    '--p-white-3': 'rgba(0, 0, 0, 0.03)',
    '--p-white-5': 'rgba(0, 0, 0, 0.04)',
    '--p-white-6': 'rgba(0, 0, 0, 0.06)',
    '--p-white-8': 'rgba(0, 0, 0, 0.08)',
    '--p-white-10': 'rgba(0, 0, 0, 0.10)',
    '--p-white-12': 'rgba(0, 0, 0, 0.12)',
    '--p-white-15': 'rgba(0, 0, 0, 0.15)',
    '--p-white-20': 'rgba(0, 0, 0, 0.20)',
    '--p-white-25': 'rgba(0, 0, 0, 0.25)',
    '--p-white-30': 'rgba(0, 0, 0, 0.30)',
    '--p-white-35': 'rgba(0, 0, 0, 0.35)',
    '--p-white-50': 'rgba(0, 0, 0, 0.50)',
    '--p-white-70': 'rgba(0, 0, 0, 0.70)',

    // Interactive
    '--hover-bg': 'rgba(0, 0, 0, 0.03)',
    '--active-bg': 'rgba(0, 0, 0, 0.06)',
    '--selected-bg': textPrimary,
    '--selected-text': selectedText,
    '--selected-hover-bg': lightenedPrimary,
    '--focus-ring': textPrimary,

    // Borders
    '--border-subtle': `rgba(${tpR}, ${tpG}, ${tpB}, 0.08)`,
    '--border-default': `rgba(${tpR}, ${tpG}, ${tpB}, 0.15)`,
    '--border-strong': `rgba(${tpR}, ${tpG}, ${tpB}, 0.25)`,

    // Shadows
    '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',

    // Component tokens
    '--input-bg': bgCard,
    '--input-border': `rgba(${tpR}, ${tpG}, ${tpB}, 0.15)`,
    '--input-border-hover': `rgba(${tpR}, ${tpG}, ${tpB}, 0.25)`,
    '--input-border-focus': `rgba(${tpR}, ${tpG}, ${tpB}, 0.40)`,
    '--card-bg': bgCard,
    '--card-border': `rgba(${tpR}, ${tpG}, ${tpB}, 0.08)`,
    '--card-border-hover': `rgba(${tpR}, ${tpG}, ${tpB}, 0.15)`,
    '--modal-bg': `rgba(${bgCardR}, ${bgCardG}, ${bgCardB}, 0.98)`,
    '--modal-border': `rgba(${tpR}, ${tpG}, ${tpB}, 0.10)`,
    '--stat-bg': 'rgba(0, 0, 0, 0.03)',
    '--stat-border': `rgba(${tpR}, ${tpG}, ${tpB}, 0.15)`,
    '--btn-primary-hover': lightenedPrimary,
    '--btn-primary-active': hslToHex(tpH, tpS, Math.min(tpL + 25, 55)),

    // Semantic bg
    '--success-bg': 'rgba(34, 197, 94, 0.08)',
    '--success-bg-strong': 'rgba(34, 197, 94, 0.15)',
    '--warning-bg': 'rgba(245, 158, 11, 0.08)',
    '--warning-bg-strong': 'rgba(245, 158, 11, 0.15)',
    '--error-bg': 'rgba(239, 68, 68, 0.08)',
    '--error-bg-strong': 'rgba(239, 68, 68, 0.15)',
    '--info-bg': 'rgba(59, 130, 246, 0.08)',
    '--info-bg-strong': 'rgba(59, 130, 246, 0.15)',
  }
}

export function generateDarkSurface(hue: number, tint: number): Record<string, string> {
  // Dark mode needs higher saturation + slight lightness boost for visible tint
  const darkSat = tint * 55
  const lBoost = tint * 3

  const bgPrimary = hslToHex(hue, darkSat, 4 + lBoost)
  const bgSecondary = hslToHex(hue, darkSat, 7 + lBoost)
  const bgCard = hslToHex(hue, darkSat, 9 + lBoost)
  const bgElevated = hslToHex(hue, darkSat, 11 + lBoost)

  const { r: bgR, g: bgG, b: bgB } = hexToRgb(bgPrimary)

  const textSecondary = ensureContrast(
    hslToHex(hue, darkSat * 1.5, 62), bgPrimary, WCAG_AA_NORMAL
  )
  const textDisabled = ensureContrast(
    hslToHex(hue, darkSat * 1.0, 33), bgPrimary, WCAG_AA_LARGE
  )

  // Surface-hue-tinted primary colors (Apple-style off-white/off-black)
  const textPrimary = ensureContrast(tintedWhite(hue, tint), bgPrimary, WCAG_AA_NORMAL)
  const textInverse = tintedBlack(hue, tint)
  const selectedBg = tintedWhite(hue, tint)
  const selectedText = tintedBlack(hue, tint)
  const selectedHoverBg = tintedSelectedHover(hue, tint)
  const focusRing = tintedWhite(hue, tint)
  const btnPrimaryHover = tintedHover(hue, tint)
  const btnPrimaryActive = tintedActive(hue, tint)

  return {
    // Backgrounds
    '--bg-primary': bgPrimary,
    '--bg-secondary': bgSecondary,
    '--bg-card': bgCard,
    '--bg-elevated': bgElevated,
    '--bg-overlay': `rgba(${bgR}, ${bgG}, ${bgB}, 0.96)`,
    '--bg-scrim': 'rgba(0, 0, 0, 0.50)',
    '--bg-translucent': `rgba(${bgR}, ${bgG}, ${bgB}, 0.70)`,
    '--bg-surface': 'rgba(255, 255, 255, 0.03)',
    '--bg-surface-hover': 'rgba(255, 255, 255, 0.06)',
    '--bg-surface-active': 'rgba(255, 255, 255, 0.08)',

    // Text
    '--text-primary': textPrimary,
    '--text-secondary': textSecondary,
    '--text-muted': textSecondary,
    '--text-disabled': textDisabled,
    '--text-inverse': textInverse,

    // Primitives — white-alpha
    '--p-white-2': 'rgba(255, 255, 255, 0.02)',
    '--p-white-3': 'rgba(255, 255, 255, 0.03)',
    '--p-white-5': 'rgba(255, 255, 255, 0.05)',
    '--p-white-6': 'rgba(255, 255, 255, 0.06)',
    '--p-white-8': 'rgba(255, 255, 255, 0.08)',
    '--p-white-10': 'rgba(255, 255, 255, 0.10)',
    '--p-white-12': 'rgba(255, 255, 255, 0.12)',
    '--p-white-15': 'rgba(255, 255, 255, 0.15)',
    '--p-white-20': 'rgba(255, 255, 255, 0.20)',
    '--p-white-25': 'rgba(255, 255, 255, 0.25)',
    '--p-white-30': 'rgba(255, 255, 255, 0.30)',
    '--p-white-35': 'rgba(255, 255, 255, 0.35)',
    '--p-white-50': 'rgba(255, 255, 255, 0.50)',
    '--p-white-70': 'rgba(255, 255, 255, 0.70)',

    // Interactive
    '--hover-bg': 'rgba(255, 255, 255, 0.04)',
    '--active-bg': 'rgba(255, 255, 255, 0.07)',
    '--selected-bg': selectedBg,
    '--selected-text': selectedText,
    '--selected-hover-bg': selectedHoverBg,
    '--focus-ring': focusRing,

    // Borders
    '--border-subtle': 'rgba(255, 255, 255, 0.12)',
    '--border-default': 'rgba(255, 255, 255, 0.20)',
    '--border-strong': 'rgba(255, 255, 255, 0.35)',

    // Shadows (none in dark mode)
    '--shadow-sm': 'none',
    '--shadow-md': 'none',
    '--shadow-lg': 'none',

    // Component tokens
    '--input-bg': bgSecondary,
    '--input-border': 'rgba(255, 255, 255, 0.20)',
    '--input-border-hover': 'rgba(255, 255, 255, 0.30)',
    '--input-border-focus': 'rgba(255, 255, 255, 0.45)',
    '--card-bg': bgCard,
    '--card-border': 'rgba(255, 255, 255, 0.12)',
    '--card-border-hover': 'rgba(255, 255, 255, 0.20)',
    '--modal-bg': `rgba(${bgR}, ${bgG}, ${bgB}, 0.98)`,
    '--modal-border': 'rgba(255, 255, 255, 0.10)',
    '--stat-bg': 'rgba(255, 255, 255, 0.04)',
    '--stat-border': 'rgba(255, 255, 255, 0.15)',
    '--btn-primary-hover': btnPrimaryHover,
    '--btn-primary-active': btnPrimaryActive,

    // Semantic bg
    '--success-bg': 'rgba(34, 197, 94, 0.08)',
    '--success-bg-strong': 'rgba(34, 197, 94, 0.15)',
    '--warning-bg': 'rgba(245, 158, 11, 0.08)',
    '--warning-bg-strong': 'rgba(245, 158, 11, 0.15)',
    '--error-bg': 'rgba(239, 68, 68, 0.08)',
    '--error-bg-strong': 'rgba(239, 68, 68, 0.15)',
    '--info-bg': 'rgba(59, 130, 246, 0.08)',
    '--info-bg-strong': 'rgba(59, 130, 246, 0.15)',
  }
}

// --- Pairing Detection ---

export function detectPairing(config: ThemeConfig): string | null {
  const surfaceId = config.surfaceId ?? 'default'
  const match = THEME_PAIRINGS.find(
    p => p.surfaceId === surfaceId && p.accentId === config.accentId
  )
  return match?.id ?? null
}

// --- Config Management ---

export function loadThemeConfig(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      const config: ThemeConfig = { ...DEFAULT_CONFIG, ...JSON.parse(stored) }

      // Migrate old paletteId to surfaceId + accentId
      if (config.paletteId === 'linen') {
        config.surfaceId = 'tinted'
        config.accentId = 'ember'
        delete config.paletteId
        saveThemeConfig(config)
      } else if (config.paletteId === 'stone') {
        config.surfaceId = 'warm'
        config.accentId = 'ember'
        delete config.paletteId
        saveThemeConfig(config)
      } else if (config.paletteId) {
        // Unknown palette — clear it
        config.surfaceId = 'default'
        delete config.paletteId
        saveThemeConfig(config)
      }

      // Migrate removed surface presets
      const surfaceMigrations: Record<string, string> = {
        cream: 'rich',
        mono: 'subtle',
        warm: 'tinted',
        cool: 'tinted',
      }
      if (config.surfaceId && surfaceMigrations[config.surfaceId]) {
        config.surfaceId = surfaceMigrations[config.surfaceId]
        saveThemeConfig(config)
      }

      if (!config.pairingId) {
        config.pairingId = detectPairing(config)
      }

      return config
    }
  } catch { /* ignore */ }
  return DEFAULT_CONFIG
}

export function saveThemeConfig(config: ThemeConfig): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config))
  } catch { /* ignore */ }
}

// --- Custom Presets ---

const CUSTOM_PRESETS_KEY = 'ground-ui-custom-presets'
const MAX_CUSTOM_PRESETS = 20

export interface CustomPreset {
  id: string
  name: string
  surfaceId: string
  accentId: string
  customColor?: string
  primaryStyle: 'mono' | 'accent'
  createdAt: number
}

export function loadCustomPresets(): CustomPreset[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CUSTOM_PRESETS_KEY)
    if (stored) {
      const presets: CustomPreset[] = JSON.parse(stored)
      return Array.isArray(presets) ? presets.slice(0, MAX_CUSTOM_PRESETS) : []
    }
  } catch { /* ignore */ }
  return []
}

export function saveCustomPresets(presets: CustomPreset[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets.slice(0, MAX_CUSTOM_PRESETS)))
  } catch { /* ignore */ }
}

export function addCustomPreset(preset: Omit<CustomPreset, 'id' | 'createdAt'>): CustomPreset | null {
  const presets = loadCustomPresets()
  if (presets.length >= MAX_CUSTOM_PRESETS) return null
  const newPreset: CustomPreset = {
    ...preset,
    id: `custom-${Date.now()}`,
    createdAt: Date.now(),
  }
  presets.push(newPreset)
  saveCustomPresets(presets)
  return newPreset
}

export function deleteCustomPreset(id: string): void {
  const presets = loadCustomPresets()
  saveCustomPresets(presets.filter(p => p.id !== id))
}

export function getAccentColor(config: ThemeConfig): string {
  if (config.accentId === 'custom' && config.customColor && isValidHex(config.customColor)) {
    return config.customColor
  }
  const preset = ACCENT_PRESETS.find(p => p.id === config.accentId)
  return preset?.color ?? ACCENT_PRESETS[0].color
}

function getCurrentBgHex(isDark?: boolean): string {
  if (typeof window === 'undefined') return '#0a0a0a'
  const dark = isDark ?? (document.documentElement.getAttribute('data-theme') !== 'light')
  return dark ? '#0a0a0a' : '#ffffff'
}

// --- CSS variable names used by old palettes (for cleanup) ---

const SECONDARY_VARS = [
  '--accent-secondary', '--accent-secondary-hover', '--accent-secondary-light',
  '--accent-secondary-bg', '--accent-secondary-bg-strong', '--accent-secondary-border',
]
const TERTIARY_VARS = [
  '--accent-tertiary', '--accent-tertiary-bg', '--accent-tertiary-border',
]
const SURFACE_TINT_VARS = ['--surface-tint', '--surface-tint-strong']

// Track which override keys were last applied so we can remove them
let lastOverrideKeys: string[] = []

// --- Apply Theme ---

export function applyAccentTheme(config: ThemeConfig, isDark?: boolean): void {
  if (typeof window === 'undefined') return

  const root = document.documentElement

  // Resolve isDark: prefer explicit parameter, fallback to DOM
  const darkMode = isDark ?? (root.getAttribute('data-theme') !== 'light')

  // Clean up previous overrides
  if (lastOverrideKeys.length > 0) {
    lastOverrideKeys.forEach(k => root.style.removeProperty(k))
    lastOverrideKeys = []
  }

  const surfaceId = config.surfaceId ?? 'default'
  const surface = SURFACE_PRESETS.find(p => p.id === surfaceId)
  const hasSurface = surface && surface.id !== 'default'

  let bgHex: string

  // Collect ALL override keys set in this call for cleanup on next call
  const overrideKeys: string[] = []

  const isNeutral = config.accentId === 'neutral'

  if (hasSurface) {
    // --- Surface mode: generate surface tokens algorithmically ---
    // Surface hue = accent hue (same color family)
    const surfaceHue = hexToHsl(getAccentColor(config)).h

    const surfaceTokens = darkMode
      ? generateDarkSurface(surfaceHue, surface.tintStrength)
      : generateLightSurface(surfaceHue, surface.tintStrength, surface.lightnessBase)

    // Apply all surface overrides
    Object.entries(surfaceTokens).forEach(([k, v]) => {
      root.style.setProperty(k, v)
      overrideKeys.push(k)
    })

    bgHex = surfaceTokens['--bg-primary'] ?? getCurrentBgHex(darkMode)

    // Auto-correct text colors for WCAG compliance
    const textContrastPairs: Array<{ key: string; min: number }> = [
      { key: '--text-secondary', min: WCAG_AA_NORMAL },
      { key: '--text-disabled', min: WCAG_AA_LARGE },
    ]
    for (const { key, min } of textContrastPairs) {
      const textHex = surfaceTokens[key]
      if (textHex && isValidHex(textHex)) {
        const corrected = ensureContrast(textHex, bgHex, min)
        if (corrected !== textHex) {
          root.style.setProperty(key, corrected)
        }
      }
    }

    // Generate accent tokens (always, including neutral — ensures gray accent instead of blue CSS defaults)
    const accentColor = getAccentColor(config)
    const primaryTokens = generateColorTokens(accentColor, bgHex, '--accent')
    Object.entries(primaryTokens).forEach(([k, v]) => root.style.setProperty(k, v))
    overrideKeys.push(...Object.keys(primaryTokens))

    const secondaryColor = generateSecondaryAccent(accentColor)
    const secondaryTokens = generateColorTokens(secondaryColor, bgHex, '--accent-secondary')
    Object.entries(secondaryTokens).forEach(([k, v]) => root.style.setProperty(k, v))
    overrideKeys.push(...Object.keys(secondaryTokens))

    // Clean up tertiary and surface tint (not used in new system)
    TERTIARY_VARS.forEach(v => root.style.removeProperty(v))
    SURFACE_TINT_VARS.forEach(v => root.style.removeProperty(v))

  } else {
    // --- Default surface: generate accent tokens against base bg ---
    bgHex = getCurrentBgHex(darkMode)

    const accentColor = getAccentColor(config)
    const tokens = generateAccentTokens(accentColor, bgHex)
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value)
      overrideKeys.push(key)
    })

    // Generate secondary accent
    const secondaryColor = generateSecondaryAccent(accentColor)
    const secondaryTokens = generateColorTokens(secondaryColor, bgHex, '--accent-secondary')
    Object.entries(secondaryTokens).forEach(([k, v]) => {
      root.style.setProperty(k, v)
      overrideKeys.push(k)
    })

    TERTIARY_VARS.forEach(v => root.style.removeProperty(v))
    SURFACE_TINT_VARS.forEach(v => root.style.removeProperty(v))
  }

  // Apply primary button style
  const BUTTON_OVERRIDE_KEYS = [
    '--selected-bg', '--selected-text', '--selected-hover-bg',
    '--btn-primary-hover', '--btn-primary-active',
  ]
  if (config.primaryStyle === 'accent' && !isNeutral) {
    const accentHex = getAccentColor(config)
    const accessibleAccent = ensureContrast(accentHex, bgHex, WCAG_AA_NORMAL)
    const buttonBg = ensureContrast(accessibleAccent, '#ffffff', WCAG_AA_NORMAL)
    const { h, s, l } = hexToHsl(buttonBg)
    const hoverColor = hslToHex(h, s, Math.max(l - 6, 5))
    const activeColor = hslToHex(h, s, Math.max(l - 12, 5))

    root.style.setProperty('--selected-bg', buttonBg)
    root.style.setProperty('--selected-text', '#ffffff')
    root.style.setProperty('--selected-hover-bg', hoverColor)
    root.style.setProperty('--btn-primary-hover', hoverColor)
    root.style.setProperty('--btn-primary-active', activeColor)
    overrideKeys.push(...BUTTON_OVERRIDE_KEYS)
  } else {
    // Neutral or mono style: remove button overrides to use CSS defaults
    BUTTON_OVERRIDE_KEYS.forEach(k => root.style.removeProperty(k))
  }

  lastOverrideKeys = overrideKeys
}
