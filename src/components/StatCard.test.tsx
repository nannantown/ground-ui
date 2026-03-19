import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { StatCard } from './StatCard'

afterEach(cleanup)

describe('StatCard', () => {
  it('renders label', () => {
    render(<StatCard label="Revenue" value="$1,200" />)
    expect(screen.getByText('Revenue')).toBeTruthy()
  })

  it('renders value', () => {
    render(<StatCard label="L" value="42" />)
    expect(screen.getByText('42')).toBeTruthy()
  })

  it('applies card-stat class', () => {
    const { container } = render(<StatCard label="L" value="V" />)
    expect(container.querySelector('.card-stat')).toBeTruthy()
  })

  it('renders trend with direction', () => {
    render(<StatCard label="L" value="V" trend={{ value: '+12%', direction: 'up' }} />)
    expect(screen.getByText('+12%')).toBeTruthy()
  })

  it('renders icon', () => {
    render(<StatCard label="L" value="V" icon={<span data-testid="ico">$</span>} />)
    expect(screen.getByTestId('ico')).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(<StatCard label="L" value="V" className="custom" />)
    expect(container.querySelector('.card-stat')?.className).toContain('custom')
  })
})
