import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Sticky } from './Sticky'

afterEach(cleanup)

describe('Sticky', () => {
  it('renders children', () => {
    const { container } = render(<Sticky>Content</Sticky>)
    expect(container.textContent).toBe('Content')
  })

  it('applies sticky-top class by default', () => {
    const { container } = render(<Sticky>C</Sticky>)
    expect(container.firstElementChild?.className).toContain('sticky-top')
  })

  it('applies sticky-top-header class', () => {
    const { container } = render(<Sticky position="top-header">C</Sticky>)
    expect(container.firstElementChild?.className).toContain('sticky-top-header')
  })

  it('applies sticky-bottom class', () => {
    const { container } = render(<Sticky position="bottom">C</Sticky>)
    expect(container.firstElementChild?.className).toContain('sticky-bottom')
  })

  it('merges custom className', () => {
    const { container } = render(<Sticky className="custom">C</Sticky>)
    const cls = container.firstElementChild?.className
    expect(cls).toContain('sticky-top')
    expect(cls).toContain('custom')
  })

  it('applies custom offset for top', () => {
    const { container } = render(<Sticky offset="60px">C</Sticky>)
    expect((container.firstElementChild as HTMLElement).style.top).toBe('60px')
  })

  it('applies custom offset for bottom', () => {
    const { container } = render(<Sticky position="bottom" offset="20px">C</Sticky>)
    expect((container.firstElementChild as HTMLElement).style.bottom).toBe('20px')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Sticky ref={ref}>C</Sticky>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes through HTML attributes', () => {
    const { container } = render(<Sticky data-testid="sticky">C</Sticky>)
    expect(container.firstElementChild?.getAttribute('data-testid')).toBe('sticky')
  })
})
