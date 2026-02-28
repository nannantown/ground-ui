/**
 * GroundUI Color Tokens
 *
 * 3-layer architecture:
 * 1. Primitive — Raw palette values (p-*)
 * 2. Semantic  — Meaning-based (bg-*, text-*, border-*, etc.)
 * 3. Component — Component-specific (modal-*, input-*, card-*)
 */

export const primitiveColors = {
  // Gray Scale
  gray: {
    950: '#0a0a0a',
    900: '#111111',
    850: '#141414',
    800: '#1a1a1a',
    700: '#333333',
    600: '#666666',
    500: '#888888',
    450: '#949494',
    400: '#a0a0a0',
    300: '#cccccc',
    200: '#e0e0e0',
    150: '#ededed',
    100: '#f0f0f0',
    50: '#fafafa',
  },

  // White Alpha Scale
  whiteAlpha: {
    2: 'rgba(255, 255, 255, 0.02)',
    3: 'rgba(255, 255, 255, 0.03)',
    5: 'rgba(255, 255, 255, 0.05)',
    6: 'rgba(255, 255, 255, 0.06)',
    8: 'rgba(255, 255, 255, 0.08)',
    10: 'rgba(255, 255, 255, 0.10)',
    12: 'rgba(255, 255, 255, 0.12)',
    15: 'rgba(255, 255, 255, 0.15)',
    20: 'rgba(255, 255, 255, 0.20)',
    30: 'rgba(255, 255, 255, 0.30)',
    50: 'rgba(255, 255, 255, 0.50)',
    70: 'rgba(255, 255, 255, 0.70)',
  },

  // Black Alpha Scale
  blackAlpha: {
    40: 'rgba(0, 0, 0, 0.40)',
    60: 'rgba(0, 0, 0, 0.60)',
    70: 'rgba(0, 0, 0, 0.70)',
    80: 'rgba(0, 0, 0, 0.80)',
  },

  // Brand Colors
  green: {
    400: '#6ABEA5',
    500: '#43A386',
    600: '#35886F',
  },

  emerald: {
    500: '#10b981',
  },

  amber: {
    400: '#DDC16E',
    500: '#C7A338',
    600: '#A98928',
  },

  red: {
    400: '#DF969D',
    500: '#D06C76',
    600: '#B04F59',
  },

  blue: {
    400: '#879ED4',
    500: '#5C7BC1',
    600: '#4560A1',
  },

  sky: {
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
  },

  slate: {
    500: '#64748b',
    600: '#475569',
  },
} as const

export const semanticColors = {
  bg: {
    primary: primitiveColors.gray[950],
    secondary: primitiveColors.gray[900],
    card: primitiveColors.gray[850],
    elevated: primitiveColors.gray[800],
    overlay: 'rgba(17, 24, 39, 0.95)',
    scrim: primitiveColors.blackAlpha[60],
    translucent: 'rgba(17, 24, 39, 0.40)',
    surface: primitiveColors.whiteAlpha[5],
    surfaceHover: primitiveColors.whiteAlpha[8],
    surfaceActive: primitiveColors.whiteAlpha[10],
  },

  text: {
    primary: primitiveColors.gray[150],
    secondary: primitiveColors.gray[400],
    disabled: primitiveColors.gray[700],
    inverse: '#000000',
  },

  border: {
    subtle: primitiveColors.whiteAlpha[6],
    default: primitiveColors.whiteAlpha[12],
    strong: primitiveColors.whiteAlpha[20],
  },

  interactive: {
    hover: primitiveColors.whiteAlpha[3],
    active: primitiveColors.whiteAlpha[6],
    selectedBg: '#ffffff',
    selectedText: '#000000',
    selectedHover: primitiveColors.gray[200],
  },

  success: {
    DEFAULT: primitiveColors.green[500],
    hover: primitiveColors.green[600],
    light: primitiveColors.green[400],
    bg: 'rgba(67, 163, 134, 0.10)',
    bgStrong: 'rgba(67, 163, 134, 0.20)',
    border: 'rgba(67, 163, 134, 0.30)',
  },

  warning: {
    DEFAULT: primitiveColors.amber[500],
    hover: primitiveColors.amber[600],
    light: primitiveColors.amber[400],
    bg: 'rgba(199, 163, 56, 0.10)',
    bgStrong: 'rgba(199, 163, 56, 0.20)',
    border: 'rgba(199, 163, 56, 0.30)',
  },

  error: {
    DEFAULT: primitiveColors.red[500],
    hover: primitiveColors.red[600],
    light: primitiveColors.red[400],
    bg: 'rgba(208, 108, 118, 0.10)',
    bgStrong: 'rgba(208, 108, 118, 0.20)',
    border: 'rgba(208, 108, 118, 0.30)',
  },

  info: {
    DEFAULT: primitiveColors.blue[500],
    hover: primitiveColors.blue[600],
    light: primitiveColors.blue[400],
    bg: 'rgba(92, 123, 193, 0.10)',
    bgStrong: 'rgba(92, 123, 193, 0.20)',
    border: 'rgba(92, 123, 193, 0.30)',
  },

  accent: {
    DEFAULT: primitiveColors.sky[500],
    hover: primitiveColors.sky[600],
    light: primitiveColors.sky[400],
    bg: 'rgba(14, 165, 233, 0.10)',
    bgStrong: 'rgba(14, 165, 233, 0.20)',
    border: 'rgba(14, 165, 233, 0.50)',
  },

  neutral: {
    DEFAULT: primitiveColors.slate[500],
    hover: primitiveColors.slate[600],
  },
} as const

export type PrimitiveColors = typeof primitiveColors
export type SemanticColors = typeof semanticColors
