import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProgressRing } from './ProgressRing'

afterEach(cleanup)

describe('ProgressRing', () => {
  it('renders an SVG', () => {
    const { container } = render(<ProgressRing value={50} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('renders circle elements', () => {
    const { container } = render(<ProgressRing value={50} />)
    expect(container.querySelectorAll('circle').length).toBeGreaterThanOrEqual(1)
  })

  it('shows label when showLabel is true', () => {
    render(<ProgressRing value={42} showLabel />)
    expect(screen.getByText('42%')).toBeTruthy()
  })

  it('does not show label by default', () => {
    render(<ProgressRing value={42} />)
    expect(screen.queryByText('42%')).toBeNull()
  })

  it('accepts custom size', () => {
    const { container } = render(<ProgressRing value={50} size={80} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('80')
  })

  it('merges custom className', () => {
    const { container } = render(<ProgressRing value={50} className="custom" />)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
