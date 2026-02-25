import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  hexToRgb,
  hexToHsl,
  hslToHex,
  isValidHex,
  contrastRatio,
  ensureContrast,
  generateColorTokens,
  generateAccentTokens,
  generateSecondaryAccent,
  generateLightSurface,
  generateDarkSurface,
  getAccentColor,
  loadThemeConfig,
  saveThemeConfig,
  applyAccentTheme,
  detectPairing,
  ACCENT_PRESETS,
  SURFACE_PRESETS,
  THEME_PAIRINGS,
  type ThemeConfig,
} from './index'

// --- Color Utility Tests ---

describe('hexToRgb', () => {
  it('converts hex to RGB', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgb('#0EA5E9')).toEqual({ r: 14, g: 165, b: 233 })
  })

  it('handles invalid hex', () => {
    expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0 })
  })
})

describe('hexToHsl / hslToHex roundtrip', () => {
  const testCases = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#808080']

  testCases.forEach(hex => {
    it(`roundtrips ${hex}`, () => {
      const { h, s, l } = hexToHsl(hex)
      const result = hslToHex(h, s, l)
      // Allow 1-step rounding tolerance
      const original = hexToRgb(hex)
      const roundtripped = hexToRgb(result)
      expect(Math.abs(original.r - roundtripped.r)).toBeLessThanOrEqual(1)
      expect(Math.abs(original.g - roundtripped.g)).toBeLessThanOrEqual(1)
      expect(Math.abs(original.b - roundtripped.b)).toBeLessThanOrEqual(1)
    })
  })
})

describe('isValidHex', () => {
  it('validates correct hex strings', () => {
    expect(isValidHex('#000000')).toBe(true)
    expect(isValidHex('#FFFFFF')).toBe(true)
    expect(isValidHex('#0EA5E9')).toBe(true)
  })

  it('rejects invalid hex strings', () => {
    expect(isValidHex('000000')).toBe(false)
    expect(isValidHex('#FFF')).toBe(false)
    expect(isValidHex('#GGGGGG')).toBe(false)
    expect(isValidHex('')).toBe(false)
  })
})

// --- WCAG Contrast Tests ---

describe('contrastRatio', () => {
  it('returns 21:1 for black/white', () => {
    const ratio = contrastRatio('#000000', '#ffffff')
    expect(ratio).toBeCloseTo(21, 0)
  })

  it('returns 1:1 for identical colors', () => {
    const ratio = contrastRatio('#888888', '#888888')
    expect(ratio).toBeCloseTo(1, 0)
  })

  it('is symmetric', () => {
    const r1 = contrastRatio('#0EA5E9', '#0a0a0a')
    const r2 = contrastRatio('#0a0a0a', '#0EA5E9')
    expect(r1).toBeCloseTo(r2, 5)
  })
})

describe('ensureContrast', () => {
  it('returns same color if already meeting ratio', () => {
    const result = ensureContrast('#ffffff', '#000000', 4.5)
    expect(result).toBe('#ffffff')
  })

  it('adjusts color to meet WCAG AA on dark background', () => {
    const result = ensureContrast('#333333', '#0a0a0a', 4.5)
    const ratio = contrastRatio(result, '#0a0a0a')
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('adjusts color to meet WCAG AA on light background', () => {
    const result = ensureContrast('#cccccc', '#ffffff', 4.5)
    const ratio = contrastRatio(result, '#ffffff')
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
})

// --- Token Generation Tests ---

describe('generateColorTokens', () => {
  it('generates all required token keys', () => {
    const tokens = generateColorTokens('#0EA5E9', '#0a0a0a', '--accent')
    expect(tokens).toHaveProperty('--accent')
    expect(tokens).toHaveProperty('--accent-hover')
    expect(tokens).toHaveProperty('--accent-light')
    expect(tokens).toHaveProperty('--accent-bg')
    expect(tokens).toHaveProperty('--accent-bg-strong')
    expect(tokens).toHaveProperty('--accent-border')
  })

  it('produces accessible primary color', () => {
    const tokens = generateColorTokens('#0EA5E9', '#0a0a0a', '--accent')
    const ratio = contrastRatio(tokens['--accent'], '#0a0a0a')
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
})

describe('generateAccentTokens', () => {
  it('generates --accent prefixed tokens', () => {
    const tokens = generateAccentTokens('#0EA5E9')
    expect(Object.keys(tokens).every(k => k.startsWith('--accent'))).toBe(true)
  })
})

describe('generateSecondaryAccent', () => {
  it('returns a different color than input', () => {
    const secondary = generateSecondaryAccent('#0EA5E9')
    expect(secondary).not.toBe('#0EA5E9')
  })

  it('returns valid hex', () => {
    const secondary = generateSecondaryAccent('#0EA5E9')
    expect(isValidHex(secondary)).toBe(true)
  })
})

// --- Surface Generation Tests ---

describe('generateDarkSurface', () => {
  it('generates all semantic token keys', () => {
    const tokens = generateDarkSurface(30, 0.5)
    const requiredKeys = [
      '--bg-primary', '--bg-secondary', '--bg-card', '--bg-elevated',
      '--text-primary', '--text-secondary', '--text-muted',
      '--border-subtle', '--border-default', '--border-strong',
      '--selected-bg', '--selected-text',
      '--btn-primary-hover', '--btn-primary-active',
      '--input-bg', '--card-bg', '--modal-bg',
    ]
    requiredKeys.forEach(key => {
      expect(tokens).toHaveProperty(key)
    })
  })

  it('produces dark backgrounds (low luminance)', () => {
    const tokens = generateDarkSurface(30, 0.5)
    const { r, g, b } = hexToRgb(tokens['--bg-primary'])
    // Dark surface should have low RGB values
    expect(r + g + b).toBeLessThan(100)
  })
})

describe('generateLightSurface', () => {
  it('generates all semantic token keys', () => {
    const tokens = generateLightSurface(30, 0.5, 92)
    const requiredKeys = [
      '--bg-primary', '--bg-secondary', '--bg-card', '--bg-elevated',
      '--text-primary', '--text-secondary', '--text-muted',
      '--border-subtle', '--border-default', '--border-strong',
    ]
    requiredKeys.forEach(key => {
      expect(tokens).toHaveProperty(key)
    })
  })

  it('produces light backgrounds (high luminance)', () => {
    const tokens = generateLightSurface(30, 0.5, 92)
    const { r, g, b } = hexToRgb(tokens['--bg-primary'])
    // Light surface should have high RGB values
    expect(r + g + b).toBeGreaterThan(600)
  })
})

// --- Preset Data Tests ---

describe('ACCENT_PRESETS', () => {
  it('has bilingual names', () => {
    ACCENT_PRESETS.forEach(preset => {
      expect(preset.name).toBeTruthy()
      expect(preset.nameJa).toBeTruthy()
      expect(isValidHex(preset.color)).toBe(true)
    })
  })

  it('has unique ids', () => {
    const ids = ACCENT_PRESETS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('SURFACE_PRESETS', () => {
  it('includes default', () => {
    expect(SURFACE_PRESETS.find(p => p.id === 'default')).toBeDefined()
  })

  it('has bilingual names', () => {
    SURFACE_PRESETS.forEach(preset => {
      expect(preset.name).toBeTruthy()
      expect(preset.nameJa).toBeTruthy()
    })
  })
})

describe('THEME_PAIRINGS', () => {
  it('references valid surface and accent ids', () => {
    const surfaceIds = new Set(SURFACE_PRESETS.map(p => p.id))
    const accentIds = new Set(ACCENT_PRESETS.map(p => p.id))

    THEME_PAIRINGS.forEach(pairing => {
      expect(surfaceIds.has(pairing.surfaceId)).toBe(true)
      expect(accentIds.has(pairing.accentId)).toBe(true)
    })
  })

  it('has bilingual names and mood', () => {
    THEME_PAIRINGS.forEach(pairing => {
      expect(pairing.name).toBeTruthy()
      expect(pairing.nameJa).toBeTruthy()
      expect(pairing.mood).toBeTruthy()
      expect(pairing.moodJa).toBeTruthy()
    })
  })
})

// --- Config Management Tests ---

describe('getAccentColor', () => {
  it('returns preset color for known id', () => {
    const config: ThemeConfig = { accentId: 'sky', primaryStyle: 'mono' }
    expect(getAccentColor(config)).toBe('#0EA5E9')
  })

  it('returns custom color when valid', () => {
    const config: ThemeConfig = { accentId: 'custom', customColor: '#FF5500', primaryStyle: 'mono' }
    expect(getAccentColor(config)).toBe('#FF5500')
  })

  it('falls back to first preset for invalid custom', () => {
    const config: ThemeConfig = { accentId: 'custom', customColor: 'invalid', primaryStyle: 'mono' }
    expect(getAccentColor(config)).toBe(ACCENT_PRESETS[0].color)
  })

  it('falls back to first preset for unknown id', () => {
    const config: ThemeConfig = { accentId: 'nonexistent', primaryStyle: 'mono' }
    expect(getAccentColor(config)).toBe(ACCENT_PRESETS[0].color)
  })
})

describe('detectPairing', () => {
  it('detects matching pairing', () => {
    const config: ThemeConfig = { accentId: 'sky', surfaceId: 'default', primaryStyle: 'mono' }
    expect(detectPairing(config)).toBe('midnight')
  })

  it('detects pairing with null surfaceId (treated as default)', () => {
    const config: ThemeConfig = { accentId: 'sky', surfaceId: null, primaryStyle: 'mono' }
    expect(detectPairing(config)).toBe('midnight')
  })

  it('returns null for non-matching combo', () => {
    const config: ThemeConfig = { accentId: 'sky', surfaceId: 'warm', primaryStyle: 'mono' }
    expect(detectPairing(config)).toBeNull()
  })
})

describe('loadThemeConfig / saveThemeConfig', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns default config when nothing saved', () => {
    const config = loadThemeConfig()
    expect(config.accentId).toBe('sky')
    expect(config.primaryStyle).toBe('mono')
  })

  it('roundtrips config through localStorage', () => {
    const config: ThemeConfig = {
      accentId: 'ember',
      primaryStyle: 'accent',
      surfaceId: 'warm',
      pairingId: 'ember',
    }
    saveThemeConfig(config)
    const loaded = loadThemeConfig()
    expect(loaded.accentId).toBe('ember')
    expect(loaded.primaryStyle).toBe('accent')
    expect(loaded.surfaceId).toBe('warm')
    expect(loaded.pairingId).toBe('ember')
  })
})

// --- applyAccentTheme Integration Tests ---

describe('applyAccentTheme', () => {
  let root: HTMLElement

  beforeEach(() => {
    root = document.documentElement
    // Clear all inline styles
    root.removeAttribute('style')
    root.setAttribute('data-theme', 'dark')
    localStorage.clear()
  })

  afterEach(() => {
    root.removeAttribute('style')
    root.removeAttribute('data-theme')
  })

  it('sets accent tokens in default surface mode', () => {
    const config: ThemeConfig = { accentId: 'sky', primaryStyle: 'mono' }
    applyAccentTheme(config, true)

    expect(root.style.getPropertyValue('--accent')).toBeTruthy()
    expect(root.style.getPropertyValue('--accent-hover')).toBeTruthy()
    expect(root.style.getPropertyValue('--accent-secondary')).toBeTruthy()
  })

  it('sets surface tokens in non-default surface mode', () => {
    const config: ThemeConfig = { accentId: 'sky', primaryStyle: 'mono', surfaceId: 'warm' }
    applyAccentTheme(config, true)

    expect(root.style.getPropertyValue('--bg-primary')).toBeTruthy()
    expect(root.style.getPropertyValue('--bg-secondary')).toBeTruthy()
    expect(root.style.getPropertyValue('--text-primary')).toBeTruthy()
    expect(root.style.getPropertyValue('--border-subtle')).toBeTruthy()
    expect(root.style.getPropertyValue('--accent')).toBeTruthy()
  })

  it('cleans up surface tokens when switching from surface to default', () => {
    // Step 1: Apply warm surface
    const surfaceConfig: ThemeConfig = { accentId: 'sky', primaryStyle: 'mono', surfaceId: 'warm' }
    applyAccentTheme(surfaceConfig, true)
    expect(root.style.getPropertyValue('--bg-primary')).toBeTruthy()

    // Step 2: Switch to default
    const defaultConfig: ThemeConfig = { accentId: 'sky', primaryStyle: 'mono', surfaceId: null }
    applyAccentTheme(defaultConfig, true)

    // Surface-specific tokens should be cleaned up
    expect(root.style.getPropertyValue('--bg-primary')).toBe('')
    expect(root.style.getPropertyValue('--bg-secondary')).toBe('')
    expect(root.style.getPropertyValue('--text-primary')).toBe('')

    // Accent tokens should still exist
    expect(root.style.getPropertyValue('--accent')).toBeTruthy()
  })

  it('cleans up default accent tokens when switching to surface', () => {
    // Step 1: Apply default with ember accent
    const defaultConfig: ThemeConfig = { accentId: 'ember', primaryStyle: 'mono', surfaceId: null }
    applyAccentTheme(defaultConfig, true)
    const accentValue = root.style.getPropertyValue('--accent')
    expect(accentValue).toBeTruthy()

    // Step 2: Switch to surface with different accent
    const surfaceConfig: ThemeConfig = { accentId: 'sky', primaryStyle: 'mono', surfaceId: 'cool' }
    applyAccentTheme(surfaceConfig, true)

    // Accent should be updated (sky, not ember)
    const newAccentValue = root.style.getPropertyValue('--accent')
    expect(newAccentValue).toBeTruthy()
    expect(newAccentValue).not.toBe(accentValue)
  })

  it('handles surface→default→surface transitions cleanly', () => {
    // Step 1: warm surface + ember
    applyAccentTheme({ accentId: 'ember', primaryStyle: 'mono', surfaceId: 'warm' }, true)
    const warmBg = root.style.getPropertyValue('--bg-primary')
    expect(warmBg).toBeTruthy()

    // Step 2: default surface
    applyAccentTheme({ accentId: 'sky', primaryStyle: 'mono', surfaceId: null }, true)
    expect(root.style.getPropertyValue('--bg-primary')).toBe('')

    // Step 3: cool surface + ocean
    applyAccentTheme({ accentId: 'ocean', primaryStyle: 'mono', surfaceId: 'cool' }, true)
    const coolBg = root.style.getPropertyValue('--bg-primary')
    expect(coolBg).toBeTruthy()
    expect(coolBg).not.toBe(warmBg)
  })

  it('applies button overrides for accent primaryStyle', () => {
    const config: ThemeConfig = { accentId: 'sky', primaryStyle: 'accent' }
    applyAccentTheme(config, true)

    expect(root.style.getPropertyValue('--selected-bg')).toBeTruthy()
    expect(root.style.getPropertyValue('--selected-text')).toBe('#ffffff')
    expect(root.style.getPropertyValue('--btn-primary-hover')).toBeTruthy()
    expect(root.style.getPropertyValue('--btn-primary-active')).toBeTruthy()
  })

  it('cleans up button overrides when switching accent→mono in default mode', () => {
    // Apply with accent style
    applyAccentTheme({ accentId: 'sky', primaryStyle: 'accent' }, true)
    expect(root.style.getPropertyValue('--selected-bg')).toBeTruthy()

    // Switch to mono
    applyAccentTheme({ accentId: 'sky', primaryStyle: 'mono' }, true)
    expect(root.style.getPropertyValue('--selected-bg')).toBe('')
    expect(root.style.getPropertyValue('--selected-text')).toBe('')
  })

  it('cleans up button overrides when switching accent→mono across surface change', () => {
    // Surface mode + accent style
    applyAccentTheme({ accentId: 'sky', primaryStyle: 'accent', surfaceId: 'warm' }, true)
    expect(root.style.getPropertyValue('--selected-text')).toBe('#ffffff')

    // Default mode + mono style
    applyAccentTheme({ accentId: 'sky', primaryStyle: 'mono', surfaceId: null }, true)
    // Button accent overrides should be gone (mono mode cleans them)
    // Note: --selected-bg is also cleaned up via lastOverrideKeys because
    // surface tokens include it
    expect(root.style.getPropertyValue('--selected-text')).toBe('')
  })

  it('dark and light mode produce different surface tokens', () => {
    const config: ThemeConfig = { accentId: 'sky', primaryStyle: 'mono', surfaceId: 'warm' }

    applyAccentTheme(config, true)
    const darkBg = root.style.getPropertyValue('--bg-primary')

    applyAccentTheme(config, false)
    const lightBg = root.style.getPropertyValue('--bg-primary')

    expect(darkBg).not.toBe(lightBg)
  })

  it('applies all THEME_PAIRINGS without error', () => {
    THEME_PAIRINGS.forEach(pairing => {
      const config: ThemeConfig = {
        accentId: pairing.accentId,
        primaryStyle: 'mono',
        surfaceId: pairing.surfaceId,
        pairingId: pairing.id,
      }
      expect(() => applyAccentTheme(config, true)).not.toThrow()
      expect(() => applyAccentTheme(config, false)).not.toThrow()
      // Accent token should always be set
      expect(root.style.getPropertyValue('--accent')).toBeTruthy()
    })
  })

  it('switches between every pairing combination cleanly', () => {
    // Apply each pairing in sequence and verify cleanup
    for (let i = 0; i < THEME_PAIRINGS.length; i++) {
      const pairing = THEME_PAIRINGS[i]
      const config: ThemeConfig = {
        accentId: pairing.accentId,
        primaryStyle: 'mono',
        surfaceId: pairing.surfaceId,
        pairingId: pairing.id,
      }
      applyAccentTheme(config, true)

      // Verify accent is set
      expect(root.style.getPropertyValue('--accent')).toBeTruthy()

      // If surface is non-default, bg should be set
      if (pairing.surfaceId !== 'default') {
        expect(root.style.getPropertyValue('--bg-primary')).toBeTruthy()
      }
    }

    // After all pairings, switch to default and verify cleanup
    applyAccentTheme({ accentId: 'sky', primaryStyle: 'mono', surfaceId: null }, true)
    expect(root.style.getPropertyValue('--bg-primary')).toBe('')
    expect(root.style.getPropertyValue('--accent')).toBeTruthy()
  })

  it('all accent presets produce accessible contrast on dark bg', () => {
    ACCENT_PRESETS.forEach(preset => {
      const config: ThemeConfig = { accentId: preset.id, primaryStyle: 'mono' }
      applyAccentTheme(config, true)
      const accent = root.style.getPropertyValue('--accent')
      const ratio = contrastRatio(accent, '#0a0a0a')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })
  })

  it('all accent presets produce accessible contrast on light bg', () => {
    ACCENT_PRESETS.forEach(preset => {
      const config: ThemeConfig = { accentId: preset.id, primaryStyle: 'mono' }
      applyAccentTheme(config, false)
      const accent = root.style.getPropertyValue('--accent')
      const ratio = contrastRatio(accent, '#ffffff')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })
  })
})
