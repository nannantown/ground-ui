import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Timeline } from './Timeline'

afterEach(cleanup)

const items = [
  { id: '1', title: 'Created', date: '2026-01-01', status: 'completed' as const },
  { id: '2', title: 'In Progress', date: '2026-02-01', status: 'current' as const },
  { id: '3', title: 'Pending', date: '2026-03-01', status: 'upcoming' as const },
]

describe('Timeline', () => {
  it('renders timeline class', () => {
    const { container } = render(<Timeline items={items} />)
    expect(container.querySelector('.timeline')).toBeTruthy()
  })

  it('renders all item titles', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('Created')).toBeTruthy()
    expect(screen.getByText('In Progress')).toBeTruthy()
    expect(screen.getByText('Pending')).toBeTruthy()
  })

  it('renders dates', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('2026-01-01')).toBeTruthy()
  })

  it('renders description when provided', () => {
    const withDesc = [{ id: '1', title: 'T', date: 'D', description: 'Details here' }]
    render(<Timeline items={withDesc} />)
    expect(screen.getByText('Details here')).toBeTruthy()
  })

  it('applies clickable class for items with onClick', () => {
    const clickItems = [{ id: '1', title: 'Click', date: 'D', onClick: () => {} }]
    const { container } = render(<Timeline items={clickItems} />)
    expect(container.querySelector('.timeline-item-clickable')).toBeTruthy()
  })

  it('calls onClick when clickable item is clicked', () => {
    const handler = vi.fn()
    const clickItems = [{ id: '1', title: 'Click', date: 'D', onClick: handler }]
    render(<Timeline items={clickItems} />)
    fireEvent.click(screen.getByText('Click').closest('.timeline-item-clickable')!)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('merges custom className', () => {
    const { container } = render(<Timeline items={items} className="custom" />)
    expect(container.querySelector('.timeline')?.className).toContain('custom')
  })
})
