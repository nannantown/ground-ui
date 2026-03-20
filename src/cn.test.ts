import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins string classes', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters false values', () => {
    expect(cn('a', false, 'b')).toBe('a b')
  })

  it('filters null values', () => {
    expect(cn('a', null, 'b')).toBe('a b')
  })

  it('filters undefined values', () => {
    expect(cn('a', undefined, 'b')).toBe('a b')
  })

  it('filters empty strings', () => {
    expect(cn('a', '', 'b')).toBe('a b')
  })

  it('returns empty string with no args', () => {
    expect(cn()).toBe('')
  })

  it('returns single class', () => {
    expect(cn('solo')).toBe('solo')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('btn', isActive && 'active', isDisabled && 'disabled')).toBe('btn active')
  })
})
