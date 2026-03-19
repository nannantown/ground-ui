import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Calendar } from './Calendar'

afterEach(cleanup)

describe('Calendar', () => {
  it('renders calendar container', () => {
    const { container } = render(<Calendar />)
    expect(container.querySelector('.calendar')).toBeTruthy()
  })

  it('shows month and year header', () => {
    render(<Calendar value={new Date(2026, 2, 19)} />)
    expect(screen.getByText('March 2026')).toBeTruthy()
  })

  it('renders weekday headers', () => {
    render(<Calendar />)
    expect(screen.getByText('Su')).toBeTruthy()
    expect(screen.getByText('Mo')).toBeTruthy()
    expect(screen.getByText('Sa')).toBeTruthy()
  })

  it('renders day cells', () => {
    render(<Calendar value={new Date(2026, 2, 1)} />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('15')).toBeTruthy()
    expect(screen.getByText('31')).toBeTruthy()
  })

  it('highlights selected date', () => {
    render(<Calendar value={new Date(2026, 2, 19)} />)
    const btn = screen.getByText('19')
    expect(btn.className).toContain('calendar-cell-selected')
  })

  it('calls onChange when a date is clicked', () => {
    const handler = vi.fn()
    render(<Calendar value={new Date(2026, 2, 19)} onChange={handler} />)
    fireEvent.click(screen.getByText('25'))
    expect(handler).toHaveBeenCalledOnce()
    const arg = handler.mock.calls[0][0] as Date
    expect(arg.getDate()).toBe(25)
    expect(arg.getMonth()).toBe(2)
  })

  it('navigates to previous month', () => {
    render(<Calendar value={new Date(2026, 2, 19)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(screen.getByText('February 2026')).toBeTruthy()
  })

  it('navigates to next month', () => {
    render(<Calendar value={new Date(2026, 2, 19)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    expect(screen.getByText('April 2026')).toBeTruthy()
  })

  it('disables dates before min', () => {
    render(<Calendar value={new Date(2026, 2, 19)} min={new Date(2026, 2, 15)} />)
    const btn10 = screen.getByText('10') as HTMLButtonElement
    expect(btn10.disabled).toBe(true)
  })

  it('disables dates after max', () => {
    render(<Calendar value={new Date(2026, 2, 19)} max={new Date(2026, 2, 20)} />)
    const btn25 = screen.getByText('25') as HTMLButtonElement
    expect(btn25.disabled).toBe(true)
  })

  it('merges custom className', () => {
    const { container } = render(<Calendar className="custom" />)
    expect(container.querySelector('.calendar')?.className).toContain('custom')
  })
})
