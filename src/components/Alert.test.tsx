import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Alert } from './Alert'

afterEach(cleanup)

describe('Alert', () => {
  // --- Rendering ---
  it('renders with role="alert"', () => {
    render(<Alert>Message</Alert>)
    expect(screen.getByRole('alert')).toBeTruthy()
  })

  it('renders children content', () => {
    render(<Alert>Something happened</Alert>)
    expect(screen.getByText('Something happened')).toBeTruthy()
  })

  it('applies alert CSS class', () => {
    render(<Alert>Msg</Alert>)
    expect(screen.getByRole('alert').className).toContain('alert')
  })

  it('merges custom className', () => {
    render(<Alert className="custom">Msg</Alert>)
    expect(screen.getByRole('alert').className).toContain('custom')
  })

  // --- Variants ---
  it('applies alert-info class by default', () => {
    render(<Alert>Msg</Alert>)
    expect(screen.getByRole('alert').className).toContain('alert-info')
  })

  it.each(['info', 'success', 'warning', 'error'] as const)(
    'applies alert-%s class for %s variant',
    (variant) => {
      render(<Alert variant={variant}>Msg</Alert>)
      expect(screen.getByRole('alert').className).toContain(`alert-${variant}`)
    }
  )

  // --- Title ---
  it('renders title when provided', () => {
    render(<Alert title="Heads up">Details here</Alert>)
    expect(screen.getByText('Heads up')).toBeTruthy()
  })

  it('does not render title element when not provided', () => {
    const { container } = render(<Alert>No title</Alert>)
    expect(container.querySelector('.alert-title')).toBeNull()
  })

  // --- Icon ---
  it('renders an icon', () => {
    const { container } = render(<Alert>Msg</Alert>)
    expect(container.querySelector('.alert-icon')).toBeTruthy()
    expect(container.querySelector('.alert-icon svg')).toBeTruthy()
  })

  // --- Close button ---
  it('shows close button when onClose is provided', () => {
    render(<Alert onClose={() => {}}>Msg</Alert>)
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy()
  })

  it('does not show close button when onClose is not provided', () => {
    render(<Alert>Msg</Alert>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('calls onClose when close button is clicked', () => {
    const handler = vi.fn()
    render(<Alert onClose={handler}>Msg</Alert>)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('close button uses .btn CSS classes', () => {
    render(<Alert onClose={() => {}}>Msg</Alert>)
    const btn = screen.getByRole('button', { name: 'Close' })
    expect(btn.className).toContain('btn')
    expect(btn.className).toContain('btn-ghost')
    expect(btn.className).toContain('btn-icon')
  })
})
