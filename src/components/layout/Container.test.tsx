import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Container } from './Container'

afterEach(cleanup)

describe('Container', () => {
  it('renders children', () => {
    const { container } = render(<Container>Content</Container>)
    expect(container.textContent).toBe('Content')
  })

  it('renders as div by default', () => {
    const { container } = render(<Container>C</Container>)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders as custom element', () => {
    const { container } = render(<Container as="main">C</Container>)
    expect(container.firstElementChild?.tagName).toBe('MAIN')
  })

  it('applies container class for default size', () => {
    const { container } = render(<Container>C</Container>)
    expect(container.firstElementChild?.className).toContain('container-page')
  })

  it('applies full width class', () => {
    const { container } = render(<Container size="full">C</Container>)
    expect(container.firstElementChild?.className).toContain('container-full')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Container ref={ref}>C</Container>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges custom className', () => {
    const { container } = render(<Container className="custom">C</Container>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
