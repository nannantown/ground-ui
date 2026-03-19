import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { VisuallyHidden } from './VisuallyHidden'

afterEach(cleanup)

describe('VisuallyHidden', () => {
  it('renders children in DOM', () => {
    const { container } = render(<VisuallyHidden>Hidden text</VisuallyHidden>)
    expect(container.textContent).toBe('Hidden text')
  })

  it('applies sr-only class', () => {
    const { container } = render(<VisuallyHidden>H</VisuallyHidden>)
    expect(container.firstElementChild?.className).toContain('sr-only')
  })

  it('renders as span by default', () => {
    const { container } = render(<VisuallyHidden>H</VisuallyHidden>)
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })
})
