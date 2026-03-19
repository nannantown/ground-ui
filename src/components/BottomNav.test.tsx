import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { BottomNav } from './BottomNav'

afterEach(cleanup)

const icon = <svg data-testid="icon"><circle /></svg>

const items = [
  { value: 'home', label: 'Home', icon },
  { value: 'search', label: 'Search', icon },
  { value: 'profile', label: 'Profile', icon },
]

describe('BottomNav', () => {
  it('renders nav with aria-label', () => {
    render(<BottomNav items={items} />)
    expect(screen.getByRole('navigation', { name: 'Bottom navigation' })).toBeTruthy()
  })

  it('renders all items as buttons', () => {
    render(<BottomNav items={items} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('renders item labels', () => {
    render(<BottomNav items={items} />)
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('Search')).toBeTruthy()
  })

  it('applies bottom-nav-item class', () => {
    render(<BottomNav items={items} />)
    expect(screen.getAllByRole('button')[0].className).toContain('bottom-nav-item')
  })

  it('marks active item with aria-current="page"', () => {
    render(<BottomNav items={items} value="search" />)
    expect(screen.getByText('Search').closest('button')?.getAttribute('aria-current')).toBe('page')
  })

  it('does not set aria-current on inactive items', () => {
    render(<BottomNav items={items} value="home" />)
    expect(screen.getByText('Search').closest('button')?.getAttribute('aria-current')).toBeNull()
  })

  it('calls onChange with item value', () => {
    const handler = vi.fn()
    render(<BottomNav items={items} onChange={handler} />)
    fireEvent.click(screen.getByText('Profile').closest('button')!)
    expect(handler).toHaveBeenCalledWith('profile')
  })

  // --- Disabled (Cycle 13) ---
  it('disables item when disabled=true', () => {
    const disabledItems = [
      { value: 'a', label: 'Active', icon },
      { value: 'b', label: 'Disabled', icon, disabled: true },
    ]
    render(<BottomNav items={disabledItems} />)
    expect((screen.getByText('Disabled').closest('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('does not call onChange for disabled item', () => {
    const handler = vi.fn()
    const disabledItems = [
      { value: 'a', label: 'OK', icon },
      { value: 'b', label: 'No', icon, disabled: true },
    ]
    render(<BottomNav items={disabledItems} onChange={handler} />)
    fireEvent.click(screen.getByText('No').closest('button')!)
    expect(handler).not.toHaveBeenCalled()
  })

  // --- hideLabels ---
  it('hides labels when hideLabels is true', () => {
    render(<BottomNav items={items} hideLabels />)
    // Labels should be in aria-label, not visible text
    const btns = screen.getAllByRole('button')
    expect(btns[0].getAttribute('aria-label')).toBe('Home')
  })

  // --- Badge ---
  it('shows numeric badge', () => {
    const badgeItems = [{ value: 'a', label: 'A', icon, badge: 5 }]
    render(<BottomNav items={badgeItems} />)
    expect(screen.getByText('5')).toBeTruthy()
  })

  // --- className ---
  it('merges custom className', () => {
    render(<BottomNav items={items} className="custom" />)
    expect(screen.getByRole('navigation').className).toContain('custom')
  })
})
