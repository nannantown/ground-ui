import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ToolbarButton } from './ToolbarButton'

afterEach(cleanup)

describe('ToolbarButton', () => {
  // --- Rendering ---
  it('renders a button element', () => {
    render(<ToolbarButton>X</ToolbarButton>)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('renders children content', () => {
    render(<ToolbarButton>Icon</ToolbarButton>)
    expect(screen.getByText('Icon')).toBeTruthy()
  })

  // --- CSS class ---
  it('applies toolbar-button CSS class', () => {
    render(<ToolbarButton>X</ToolbarButton>)
    expect(screen.getByRole('button').className).toContain('toolbar-button')
  })

  it('merges custom className', () => {
    render(<ToolbarButton className="custom">X</ToolbarButton>)
    const cls = screen.getByRole('button').className
    expect(cls).toContain('toolbar-button')
    expect(cls).toContain('custom')
  })

  // --- onClick ---
  it('calls onClick when clicked', () => {
    const handler = vi.fn()
    render(<ToolbarButton onClick={handler}>X</ToolbarButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  // --- Disabled ---
  it('is disabled when disabled prop is true', () => {
    render(<ToolbarButton disabled>X</ToolbarButton>)
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('does not call onClick when disabled', () => {
    const handler = vi.fn()
    render(<ToolbarButton disabled onClick={handler}>X</ToolbarButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  // --- aria-label ---
  it('sets aria-label', () => {
    render(<ToolbarButton aria-label="Settings">X</ToolbarButton>)
    expect(screen.getByRole('button', { name: 'Settings' })).toBeTruthy()
  })

  // --- style ---
  it('passes through style prop', () => {
    render(<ToolbarButton style={{ marginLeft: 8 }}>X</ToolbarButton>)
    expect(screen.getByRole('button').style.marginLeft).toBe('8px')
  })
})
