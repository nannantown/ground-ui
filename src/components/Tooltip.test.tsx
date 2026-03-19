import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { Tooltip } from './Tooltip'

afterEach(cleanup)

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders trigger element', () => {
    render(
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.getByText('Hover me')).toBeTruthy()
  })

  it('does not show tooltip initially', () => {
    render(
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('shows tooltip on mouse enter after delay', () => {
    render(
      <Tooltip content="Help text" delay={100}>
        <button>Hover me</button>
      </Tooltip>
    )
    fireEvent.mouseEnter(screen.getByText('Hover me'))
    act(() => { vi.advanceTimersByTime(100) })
    expect(screen.getByRole('tooltip')).toBeTruthy()
    expect(screen.getByText('Help text')).toBeTruthy()
  })

  it('hides tooltip on mouse leave', () => {
    render(
      <Tooltip content="Help text" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    )
    fireEvent.mouseEnter(screen.getByText('Hover me'))
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByRole('tooltip')).toBeTruthy()
    fireEvent.mouseLeave(screen.getByText('Hover me'))
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('shows tooltip on focus', () => {
    render(
      <Tooltip content="Focus tip" delay={0}>
        <button>Focus me</button>
      </Tooltip>
    )
    fireEvent.focus(screen.getByText('Focus me'))
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByText('Focus tip')).toBeTruthy()
  })

  it('hides tooltip on blur', () => {
    render(
      <Tooltip content="Tip" delay={0}>
        <button>B</button>
      </Tooltip>
    )
    fireEvent.focus(screen.getByText('B'))
    act(() => { vi.advanceTimersByTime(0) })
    fireEvent.blur(screen.getByText('B'))
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('hides tooltip on Escape key', () => {
    render(
      <Tooltip content="Tip" delay={0}>
        <button>B</button>
      </Tooltip>
    )
    fireEvent.mouseEnter(screen.getByText('B'))
    act(() => { vi.advanceTimersByTime(0) })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('applies tooltip-content CSS class', () => {
    render(
      <Tooltip content="Tip" delay={0}>
        <button>B</button>
      </Tooltip>
    )
    fireEvent.mouseEnter(screen.getByText('B'))
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByRole('tooltip').className).toContain('tooltip-content')
  })

  it('merges custom className', () => {
    render(
      <Tooltip content="Tip" delay={0} className="custom">
        <button>B</button>
      </Tooltip>
    )
    fireEvent.mouseEnter(screen.getByText('B'))
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByRole('tooltip').className).toContain('custom')
  })
})
