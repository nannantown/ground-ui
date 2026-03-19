import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Spinner } from './Spinner'

afterEach(cleanup)

describe('Spinner', () => {
  it('renders an SVG', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('applies animate-spin class', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('animate-spin')
  })

  it('defaults to size 20', () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('20')
  })

  it('applies custom size', () => {
    const { container } = render(<Spinner size={40} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('40')
    expect(svg?.getAttribute('height')).toBe('40')
  })

  it('merges custom className', () => {
    const { container } = render(<Spinner className="custom" />)
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('custom')
  })
})
