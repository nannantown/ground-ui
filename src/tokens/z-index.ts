/**
 * GroundUI Z-Index Tokens
 */

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 9998,
  modal: 9999,
  toast: 10000,
} as const

export type ZIndex = keyof typeof zIndex
