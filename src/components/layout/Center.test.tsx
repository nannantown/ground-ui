import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Center } from './Center'

afterEach(cleanup)

describe('Center', () => {
  it('renders children', () => {
    const { container } = render(<Center>Centered</Center>)
    expect(container.textContent).toBe('Centered')
  })

  it('applies center CSS class', () => {
    const { container } = render(<Center>C</Center>)
    expect(container.firstElementChild?.className).toContain('center')
  })

  it('renders as div by default', () => {
    const { container } = render(<Center>C</Center>)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('merges custom className', () => {
    const { container } = render(<Center className="custom">C</Center>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
