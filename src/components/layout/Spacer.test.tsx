import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Spacer } from './Spacer'

afterEach(cleanup)

describe('Spacer', () => {
  it('renders flexible spacer by default', () => {
    const { container } = render(<Spacer />)
    expect((container.firstElementChild as HTMLElement).style.flex).toContain('1')
  })

  it('is aria-hidden', () => {
    const { container } = render(<Spacer />)
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders fixed vertical spacer with size', () => {
    const { container } = render(<Spacer size="md" />)
    expect((container.firstElementChild as HTMLElement).style.height).toContain('var(--space-md)')
  })

  it('renders fixed horizontal spacer', () => {
    const { container } = render(<Spacer size="lg" axis="horizontal" />)
    expect((container.firstElementChild as HTMLElement).style.width).toContain('var(--space-lg)')
  })

  it('merges custom className', () => {
    const { container } = render(<Spacer className="custom" />)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
