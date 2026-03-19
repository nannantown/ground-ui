import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Typography } from './Typography'

afterEach(cleanup)

describe('Typography', () => {
  // --- Rendering ---
  it('renders children text', () => {
    render(<Typography>Hello</Typography>)
    expect(screen.getByText('Hello')).toBeTruthy()
  })

  it('defaults to body1 variant (p tag)', () => {
    render(<Typography>Text</Typography>)
    expect(screen.getByText('Text').tagName).toBe('P')
  })

  // --- Variant → tag mapping ---
  it.each([
    ['h1', 'H1'], ['h2', 'H2'], ['h3', 'H3'], ['h4', 'H4'], ['h5', 'H5'], ['h6', 'H6'],
  ] as const)('renders %s variant as %s tag', (variant, tag) => {
    render(<Typography variant={variant}>V</Typography>)
    expect(screen.getByText('V').tagName).toBe(tag)
  })

  it('renders caption as span', () => {
    render(<Typography variant="caption">C</Typography>)
    expect(screen.getByText('C').tagName).toBe('SPAN')
  })

  it('renders label as label tag', () => {
    render(<Typography variant="label">L</Typography>)
    expect(screen.getByText('L').tagName).toBe('LABEL')
  })

  // --- Polymorphic as ---
  it('overrides tag with as prop', () => {
    render(<Typography as="div">D</Typography>)
    expect(screen.getByText('D').tagName).toBe('DIV')
  })

  // --- Color ---
  it('applies color style', () => {
    render(<Typography color="accent">A</Typography>)
    expect(screen.getByText('A').style.color).toContain('var(--accent)')
  })

  // --- Weight ---
  it('applies weight override', () => {
    render(<Typography weight="bold">B</Typography>)
    expect(screen.getByText('B').style.fontWeight).toBe('700')
  })

  // --- Align ---
  it('applies text alignment', () => {
    render(<Typography align="center">C</Typography>)
    expect(screen.getByText('C').style.textAlign).toBe('center')
  })

  // --- Truncate ---
  it('applies single-line truncate', () => {
    render(<Typography truncate>T</Typography>)
    const el = screen.getByText('T')
    expect(el.style.overflow).toBe('hidden')
    expect(el.style.whiteSpace).toBe('nowrap')
  })

  // --- Overline ---
  it('applies uppercase for overline', () => {
    render(<Typography variant="overline">O</Typography>)
    expect(screen.getByText('O').style.textTransform).toBe('uppercase')
  })

  // --- Ref ---
  it('forwards ref', () => {
    const ref = createRef<HTMLElement>()
    render(<Typography ref={ref}>R</Typography>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  // --- className ---
  it('merges custom className', () => {
    render(<Typography className="custom">C</Typography>)
    expect(screen.getByText('C').className).toContain('custom')
  })
})
