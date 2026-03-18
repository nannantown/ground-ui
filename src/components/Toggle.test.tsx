import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Toggle } from './Toggle'

afterEach(cleanup)

describe('Toggle', () => {
  // --- Rendering ---
  it('renders as a switch role', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toBeTruthy()
  })

  it('applies toggle-switch CSS class', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch').className).toContain('toggle-switch')
  })

  it('merges custom className', () => {
    render(<Toggle checked={false} onChange={() => {}} className="custom" />)
    const cls = screen.getByRole('switch').className
    expect(cls).toContain('toggle-switch')
    expect(cls).toContain('custom')
  })

  // --- Checked state ---
  it('sets aria-checked=true when checked', () => {
    render(<Toggle checked={true} onChange={() => {}} />)
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true')
  })

  it('sets aria-checked=false when unchecked', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false')
  })

  it('applies active class when checked', () => {
    render(<Toggle checked={true} onChange={() => {}} />)
    expect(screen.getByRole('switch').className).toContain('active')
  })

  it('does not apply active class when unchecked', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch').className).not.toContain('active')
  })

  // --- onChange ---
  it('calls onChange with true when unchecked toggle is clicked', () => {
    const handler = vi.fn()
    render(<Toggle checked={false} onChange={handler} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when checked toggle is clicked', () => {
    const handler = vi.fn()
    render(<Toggle checked={true} onChange={handler} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handler).toHaveBeenCalledWith(false)
  })

  // --- Disabled ---
  it('is disabled when disabled prop is true', () => {
    render(<Toggle checked={false} onChange={() => {}} disabled />)
    expect((screen.getByRole('switch') as HTMLButtonElement).disabled).toBe(true)
  })

  it('sets aria-disabled when disabled', () => {
    render(<Toggle checked={false} onChange={() => {}} disabled />)
    expect(screen.getByRole('switch').getAttribute('aria-disabled')).toBe('true')
  })

  it('does not call onChange when disabled', () => {
    const handler = vi.fn()
    render(<Toggle checked={false} onChange={handler} disabled />)
    fireEvent.click(screen.getByRole('switch'))
    expect(handler).not.toHaveBeenCalled()
  })

  // --- Label ---
  it('sets aria-label when label prop is provided', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Dark mode" />)
    expect(screen.getByRole('switch').getAttribute('aria-label')).toBe('Dark mode')
  })

  it('has no aria-label when label is not provided', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch').getAttribute('aria-label')).toBeNull()
  })

  // --- Button type ---
  it('has type="button" to prevent form submission', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch').getAttribute('type')).toBe('button')
  })
})
