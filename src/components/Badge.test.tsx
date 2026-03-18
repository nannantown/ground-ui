import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Badge } from './Badge'

afterEach(cleanup)

describe('Badge', () => {
  // --- Rendering ---
  it('renders children text', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeTruthy()
  })

  it('applies badge CSS class', () => {
    render(<Badge>Tag</Badge>)
    expect(screen.getByText('Tag').className).toContain('badge')
  })

  // --- Variants ---
  it('applies badge-neutral by default', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default').className).toContain('badge-neutral')
  })

  it.each(['success', 'warning', 'error', 'info', 'accent', 'neutral'] as const)(
    'applies badge-%s class for %s variant',
    (variant) => {
      render(<Badge variant={variant}>V</Badge>)
      expect(screen.getByText('V').className).toContain(`badge-${variant}`)
    }
  )

  // --- Custom color ---
  it('uses custom color with inline styles', () => {
    render(<Badge color="#ff5500">Custom</Badge>)
    const el = screen.getByText('Custom')
    expect(el.style.color).toBeTruthy()
    expect(el.style.background).toBeTruthy()
  })

  it('applies badge class even with custom color', () => {
    render(<Badge color="#ff5500">Custom</Badge>)
    expect(screen.getByText('Custom').className).toContain('badge')
  })

  it('does not apply variant class when custom color is used', () => {
    render(<Badge color="#ff5500" variant="success">Custom</Badge>)
    expect(screen.getByText('Custom').className).not.toContain('badge-success')
  })

  // --- Renders as span ---
  it('renders as a span element', () => {
    render(<Badge>Span</Badge>)
    expect(screen.getByText('Span').tagName).toBe('SPAN')
  })
})
