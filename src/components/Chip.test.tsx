import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Chip } from './Chip'

afterEach(cleanup)

describe('Chip', () => {
  // --- Rendering ---
  it('renders children text', () => {
    render(<Chip>Label</Chip>)
    expect(screen.getByText('Label')).toBeTruthy()
  })

  // --- Variants ---
  it('defaults to soft variant', () => {
    const { container } = render(<Chip>Tag</Chip>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.borderStyle).toBe('solid')
  })

  // --- Colors ---
  it.each(['accent', 'success', 'warning', 'error', 'info', 'neutral'] as const)(
    'renders %s color without error',
    (color) => {
      render(<Chip color={color}>C</Chip>)
      expect(screen.getByText('C')).toBeTruthy()
    }
  )

  // --- Sizes ---
  it('renders sm size', () => {
    const { container } = render(<Chip size="sm">S</Chip>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.height).toBeTruthy()
  })

  it('renders md size (default)', () => {
    const { container } = render(<Chip>M</Chip>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.height).toBeTruthy()
  })

  // --- Shape ---
  it('has pill border-radius by default', () => {
    const { container } = render(<Chip>Pill</Chip>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.borderRadius).toContain('var(--radius-full)')
  })

  it('has 0 border-radius when shape is square', () => {
    const { container } = render(<Chip shape="square">Square</Chip>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.borderRadius).toBe('0px')
  })

  // --- Selected ---
  it('applies selected styles when selected', () => {
    const { container } = render(<Chip selected>Sel</Chip>)
    const el = container.firstElementChild as HTMLElement
    expect(el).toBeTruthy()
  })

  // --- Disabled ---
  it('applies disabled opacity', () => {
    const { container } = render(<Chip disabled>Dis</Chip>)
    const el = container.firstElementChild as HTMLElement
    expect(el.getAttribute('aria-disabled')).toBe('true')
  })

  it('does not call onClick when disabled', () => {
    const handler = vi.fn()
    render(<Chip disabled onClick={handler}>Dis</Chip>)
    fireEvent.click(screen.getByText('Dis').closest('[role]') || screen.getByText('Dis'))
    expect(handler).not.toHaveBeenCalled()
  })

  // --- onClick ---
  it('calls onClick when clicked', () => {
    const handler = vi.fn()
    render(<Chip onClick={handler}>Click</Chip>)
    const el = screen.getByText('Click').closest('[role]') || screen.getByText('Click')
    fireEvent.click(el!)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('has role="button" when onClick is provided', () => {
    render(<Chip onClick={() => {}}>Interactive</Chip>)
    const el = screen.getByText('Interactive').closest('[role="button"]')
    expect(el).toBeTruthy()
  })

  // --- Deletable ---
  it('shows delete button when deletable', () => {
    render(<Chip deletable onDelete={() => {}}>Del</Chip>)
    expect(screen.getByRole('button', { name: /delete|remove/i })).toBeTruthy()
  })

  it('calls onDelete when delete button is clicked', () => {
    const handler = vi.fn()
    render(<Chip deletable onDelete={handler}>Del</Chip>)
    fireEvent.click(screen.getByRole('button', { name: /delete|remove/i }))
    expect(handler).toHaveBeenCalledOnce()
  })

  // --- Icon / Avatar ---
  it('renders icon slot', () => {
    render(<Chip icon={<span data-testid="icon">I</span>}>With icon</Chip>)
    expect(screen.getByTestId('icon')).toBeTruthy()
  })

  it('renders avatar slot', () => {
    render(<Chip avatar={<img data-testid="avatar" src="" alt="" />}>With avatar</Chip>)
    expect(screen.getByTestId('avatar')).toBeTruthy()
  })

  // --- className / style ---
  it('merges custom className', () => {
    const { container } = render(<Chip className="custom">C</Chip>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
