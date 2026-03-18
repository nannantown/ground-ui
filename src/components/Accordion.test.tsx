import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Accordion } from './Accordion'

afterEach(cleanup)

const items = [
  { value: 'a', title: 'Section A', content: 'Content A' },
  { value: 'b', title: 'Section B', content: 'Content B' },
  { value: 'c', title: 'Section C', content: 'Content C' },
]

describe('Accordion', () => {
  // --- Rendering ---
  it('renders all item titles', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Section A')).toBeTruthy()
    expect(screen.getByText('Section B')).toBeTruthy()
    expect(screen.getByText('Section C')).toBeTruthy()
  })

  it('applies accordion CSS class', () => {
    const { container } = render(<Accordion items={items} />)
    expect(container.querySelector('.accordion')).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(<Accordion items={items} className="custom" />)
    const el = container.querySelector('.accordion')
    expect(el?.className).toContain('custom')
  })

  // --- Single mode (default) ---
  it('starts with all items closed by default', () => {
    render(<Accordion items={items} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn.getAttribute('aria-expanded')).toBe('false')
    })
  })

  it('opens an item when clicked', () => {
    render(<Accordion items={items} />)
    const btnA = screen.getByText('Section A')
    fireEvent.click(btnA)
    expect(btnA.closest('button')?.getAttribute('aria-expanded')).toBe('true')
  })

  it('closes open item when clicked again (single mode)', () => {
    render(<Accordion items={items} />)
    const btnA = screen.getByText('Section A')
    fireEvent.click(btnA)
    fireEvent.click(btnA)
    expect(btnA.closest('button')?.getAttribute('aria-expanded')).toBe('false')
  })

  it('only one item open at a time in single mode', () => {
    render(<Accordion items={items} />)
    fireEvent.click(screen.getByText('Section A'))
    fireEvent.click(screen.getByText('Section B'))
    const buttons = screen.getAllByRole('button')
    const expanded = buttons.filter((b) => b.getAttribute('aria-expanded') === 'true')
    expect(expanded).toHaveLength(1)
  })

  // --- Multiple mode ---
  it('allows multiple items open in multiple mode', () => {
    render(<Accordion items={items} type="multiple" />)
    fireEvent.click(screen.getByText('Section A'))
    fireEvent.click(screen.getByText('Section B'))
    const buttons = screen.getAllByRole('button')
    const expanded = buttons.filter((b) => b.getAttribute('aria-expanded') === 'true')
    expect(expanded).toHaveLength(2)
  })

  // --- defaultValue ---
  it('opens item specified by defaultValue (string)', () => {
    render(<Accordion items={items} defaultValue="b" />)
    const btnB = screen.getByText('Section B').closest('button')
    expect(btnB?.getAttribute('aria-expanded')).toBe('true')
  })

  it('opens items specified by defaultValue (array, multiple mode)', () => {
    render(<Accordion items={items} type="multiple" defaultValue={['a', 'c']} />)
    const btnA = screen.getByText('Section A').closest('button')
    const btnC = screen.getByText('Section C').closest('button')
    expect(btnA?.getAttribute('aria-expanded')).toBe('true')
    expect(btnC?.getAttribute('aria-expanded')).toBe('true')
  })

  it('only opens first item from array defaultValue in single mode', () => {
    render(<Accordion items={items} defaultValue={['a', 'c']} />)
    const btnA = screen.getByText('Section A').closest('button')
    const btnC = screen.getByText('Section C').closest('button')
    expect(btnA?.getAttribute('aria-expanded')).toBe('true')
    expect(btnC?.getAttribute('aria-expanded')).toBe('false')
  })

  // --- Disabled ---
  it('disables button when item.disabled is true', () => {
    const disabledItems = [
      { value: 'a', title: 'Enabled', content: 'Yes' },
      { value: 'b', title: 'Disabled', content: 'No', disabled: true },
    ]
    render(<Accordion items={disabledItems} />)
    const btnB = screen.getByText('Disabled').closest('button')
    expect(btnB?.disabled).toBe(true)
  })

  it('does not toggle disabled item on click', () => {
    const disabledItems = [
      { value: 'a', title: 'Disabled', content: 'No', disabled: true },
    ]
    render(<Accordion items={disabledItems} />)
    const btn = screen.getByText('Disabled').closest('button')!
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })

  // --- ARIA ---
  it('trigger has aria-controls linking to content', () => {
    render(<Accordion items={[items[0]]} />)
    const btn = screen.getByRole('button')
    const controlsId = btn.getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()
    expect(document.getElementById(controlsId!)).toBeTruthy()
  })

  it('content has role="region"', () => {
    render(<Accordion items={[items[0]]} />)
    const btn = screen.getByRole('button')
    const regionId = btn.getAttribute('aria-controls')!
    const region = document.getElementById(regionId)
    expect(region?.getAttribute('role')).toBe('region')
  })

  // --- CSS classes ---
  it('applies accordion-item and accordion-trigger classes', () => {
    const { container } = render(<Accordion items={[items[0]]} />)
    expect(container.querySelector('.accordion-item')).toBeTruthy()
    expect(container.querySelector('.accordion-trigger')).toBeTruthy()
  })

  it('sets data-state="open" when item is expanded', () => {
    const { container } = render(<Accordion items={[items[0]]} defaultValue="a" />)
    const item = container.querySelector('.accordion-item')
    expect(item?.getAttribute('data-state')).toBe('open')
  })

  it('sets data-state="closed" when item is collapsed', () => {
    const { container } = render(<Accordion items={[items[0]]} />)
    const item = container.querySelector('.accordion-item')
    expect(item?.getAttribute('data-state')).toBe('closed')
  })
})
