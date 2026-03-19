import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { NavigationRail } from './NavigationRail'

afterEach(cleanup)

const icon = <svg data-testid="icon"><circle /></svg>
const items = [
  { value: 'home', label: 'Home', icon },
  { value: 'search', label: 'Search', icon },
]

describe('NavigationRail', () => {
  it('renders nav element', () => {
    render(<NavigationRail items={items} />)
    expect(screen.getByRole('navigation')).toBeTruthy()
  })

  it('renders item labels', () => {
    render(<NavigationRail items={items} />)
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('Search')).toBeTruthy()
  })

  it('calls onChange when item clicked', () => {
    const handler = vi.fn()
    render(<NavigationRail items={items} onChange={handler} />)
    fireEvent.click(screen.getByText('Search'))
    expect(handler).toHaveBeenCalledWith('search')
  })

  it('merges custom className', () => {
    render(<NavigationRail items={items} className="custom" />)
    expect(screen.getByRole('navigation').className).toContain('custom')
  })

  it('renders header slot', () => {
    render(<NavigationRail items={items} header={<span data-testid="hdr">H</span>} />)
    expect(screen.getByTestId('hdr')).toBeTruthy()
  })

  it('renders footer slot', () => {
    render(<NavigationRail items={items} footer={<span data-testid="ftr">F</span>} />)
    expect(screen.getByTestId('ftr')).toBeTruthy()
  })
})
