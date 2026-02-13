/**
 * GroundUI Spacing Tokens
 */

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  page: 'clamp(24px, 5vw, 80px)',
} as const

export const containerWidth = {
  max: '640px',
  wide: '960px',
  full: '100%',
} as const

export const headerHeight = '56px'

export type Spacing = keyof typeof spacing
