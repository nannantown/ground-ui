/**
 * GroundUI Typography Tokens
 */

export const fontFamily = {
  sans: "'Noto Sans JP', 'Helvetica Neue', Arial, sans-serif",
  mono: "'SF Mono', 'Fira Code', monospace",
} as const

export const fontSize = {
  xs: '10px',
  sm: '12px',
  base: '13px',
  md: '14px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const letterSpacing = {
  tight: '0.02em',
  normal: '0.04em',
  wide: '0.1em',
} as const

export type FontSize = keyof typeof fontSize
