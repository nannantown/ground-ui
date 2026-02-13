/**
 * GroundUI Transition Tokens
 */

export const transition = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
} as const

export type Transition = keyof typeof transition
