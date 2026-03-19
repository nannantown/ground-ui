import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Button } from './Button'

afterEach(cleanup)

describe('Button', () => {
  // --- Rendering ---
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeTruthy()
  })

  it('applies default variant and size classes', () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('btn')
    expect(btn.className).toContain('btn-primary')
  })

  // --- Variants ---
  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'applies %s variant class',
    (variant) => {
      render(<Button variant={variant}>V</Button>)
      expect(screen.getByRole('button').className).toContain(`btn-${variant}`)
    }
  )

  // --- Sizes ---
  it('applies sm size class', () => {
    render(<Button size="sm">S</Button>)
    expect(screen.getByRole('button').className).toContain('btn-sm')
  })

  it('applies lg size class', () => {
    render(<Button size="lg">L</Button>)
    expect(screen.getByRole('button').className).toContain('btn-lg')
  })

  it('does not add size class for md (default)', () => {
    render(<Button size="md">M</Button>)
    const cls = screen.getByRole('button').className
    expect(cls).not.toContain('btn-sm')
    expect(cls).not.toContain('btn-lg')
  })

  // --- Icon mode ---
  it('applies btn-icon class when icon prop is true', () => {
    render(<Button icon aria-label="Menu">X</Button>)
    expect(screen.getByRole('button').className).toContain('btn-icon')
  })

  it('hides children text in icon mode', () => {
    render(<Button icon>Hidden</Button>)
    expect(screen.getByRole('button').textContent).not.toContain('Hidden')
  })

  // --- Disabled ---
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>No</Button>)
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })

  // --- Loading ---
  it('is disabled when loading', () => {
    render(<Button loading>Save</Button>)
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('sets aria-busy when loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true')
  })

  it('does not set aria-busy when not loading', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBeNull()
  })

  it('shows spinner SVG when loading', () => {
    render(<Button loading>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn.querySelector('svg.animate-spin')).toBeTruthy()
  })

  it('hides rightIcon when loading', () => {
    render(<Button loading rightIcon={<span data-testid="right">R</span>}>Go</Button>)
    expect(screen.queryByTestId('right')).toBeNull()
  })

  // --- Icons ---
  it('renders leftIcon', () => {
    render(<Button leftIcon={<span data-testid="left">L</span>}>Text</Button>)
    expect(screen.getByTestId('left')).toBeTruthy()
  })

  it('renders rightIcon', () => {
    render(<Button rightIcon={<span data-testid="right">R</span>}>Text</Button>)
    expect(screen.getByTestId('right')).toBeTruthy()
  })

  // --- Events ---
  it('calls onClick when clicked', () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  // --- Ref forwarding ---
  it('forwards ref to button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  // --- Custom className ---
  it('merges custom className', () => {
    render(<Button className="custom-class">C</Button>)
    const cls = screen.getByRole('button').className
    expect(cls).toContain('btn')
    expect(cls).toContain('custom-class')
  })

  // --- HTML attributes passthrough ---
  it('passes through HTML attributes', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>)
    const btn = screen.getByTestId('submit-btn')
    expect(btn.getAttribute('type')).toBe('submit')
  })
})
