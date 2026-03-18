import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Tabs } from './Tabs'

afterEach(cleanup)

const items = [
  { value: 'one', label: 'Tab One' },
  { value: 'two', label: 'Tab Two' },
  { value: 'three', label: 'Tab Three' },
]

describe('Tabs', () => {
  // --- Rendering ---
  it('renders all tab labels', () => {
    render(<Tabs items={items} value="one" onChange={() => {}} />)
    expect(screen.getByText('Tab One')).toBeTruthy()
    expect(screen.getByText('Tab Two')).toBeTruthy()
    expect(screen.getByText('Tab Three')).toBeTruthy()
  })

  it('renders correct number of buttons', () => {
    render(<Tabs items={items} value="one" onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  // --- Pill variant (default) ---
  it('applies pill-filter class by default', () => {
    render(<Tabs items={items} value="one" onChange={() => {}} />)
    const btn = screen.getByText('Tab One').closest('button')
    expect(btn?.className).toContain('pill-filter')
  })

  it('applies pill-filter-active to selected tab', () => {
    render(<Tabs items={items} value="two" onChange={() => {}} />)
    const btn = screen.getByText('Tab Two').closest('button')
    expect(btn?.className).toContain('pill-filter-active')
  })

  it('does not apply pill-filter-active to unselected tabs', () => {
    render(<Tabs items={items} value="one" onChange={() => {}} />)
    const btn = screen.getByText('Tab Two').closest('button')
    expect(btn?.className).not.toContain('pill-filter-active')
  })

  // --- Underline variant ---
  it('applies nav-tab class for underline variant', () => {
    render(<Tabs items={items} value="one" onChange={() => {}} variant="underline" />)
    const btn = screen.getByText('Tab One').closest('button')
    expect(btn?.className).toContain('nav-tab')
  })

  it('applies nav-tab-active to selected underline tab', () => {
    render(<Tabs items={items} value="one" onChange={() => {}} variant="underline" />)
    const btn = screen.getByText('Tab One').closest('button')
    expect(btn?.className).toContain('nav-tab-active')
  })

  // --- onChange ---
  it('calls onChange with tab value when clicked', () => {
    const handler = vi.fn()
    render(<Tabs items={items} value="one" onChange={handler} />)
    fireEvent.click(screen.getByText('Tab Two'))
    expect(handler).toHaveBeenCalledWith('two')
  })

  it('calls onChange for underline variant', () => {
    const handler = vi.fn()
    render(<Tabs items={items} value="one" onChange={handler} variant="underline" />)
    fireEvent.click(screen.getByText('Tab Three'))
    expect(handler).toHaveBeenCalledWith('three')
  })

  // --- Disabled ---
  it('disables tab when item.disabled is true (pill)', () => {
    const disabledItems = [
      { value: 'a', label: 'Active' },
      { value: 'b', label: 'Disabled', disabled: true },
    ]
    render(<Tabs items={disabledItems} value="a" onChange={() => {}} />)
    const btn = screen.getByText('Disabled').closest('button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('disables tab when item.disabled is true (underline)', () => {
    const disabledItems = [
      { value: 'a', label: 'Active' },
      { value: 'b', label: 'Disabled', disabled: true },
    ]
    render(<Tabs items={disabledItems} value="a" onChange={() => {}} variant="underline" />)
    const btn = screen.getByText('Disabled').closest('button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('does not call onChange when disabled tab is clicked', () => {
    const handler = vi.fn()
    const disabledItems = [
      { value: 'a', label: 'Active' },
      { value: 'b', label: 'Disabled', disabled: true },
    ]
    render(<Tabs items={disabledItems} value="a" onChange={handler} />)
    fireEvent.click(screen.getByText('Disabled'))
    expect(handler).not.toHaveBeenCalled()
  })

  // --- Count badge ---
  it('renders count badge when provided', () => {
    const countItems = [
      { value: 'a', label: 'Messages', count: 5 },
    ]
    render(<Tabs items={countItems} value="a" onChange={() => {}} />)
    expect(screen.getByText('5')).toBeTruthy()
  })

  it('renders count badge in underline variant', () => {
    const countItems = [
      { value: 'a', label: 'Messages', count: 42 },
    ]
    render(<Tabs items={countItems} value="a" onChange={() => {}} variant="underline" />)
    expect(screen.getByText('42')).toBeTruthy()
  })

  it('renders count of 0', () => {
    const countItems = [
      { value: 'a', label: 'Empty', count: 0 },
    ]
    render(<Tabs items={countItems} value="a" onChange={() => {}} />)
    expect(screen.getByText('0')).toBeTruthy()
  })
})
