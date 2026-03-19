import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Divider } from './Divider'

afterEach(cleanup)

describe('Divider', () => {
  // --- Horizontal (default) ---
  it('renders an hr element by default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeTruthy()
  })

  it('applies divider CSS class', () => {
    render(<Divider />)
    expect(screen.getByRole('separator').className).toContain('divider')
  })

  it('merges custom className on hr', () => {
    render(<Divider className="custom" />)
    expect(screen.getByRole('separator').className).toContain('custom')
  })

  // --- With label ---
  it('renders label text', () => {
    render(<Divider label="OR" />)
    expect(screen.getByText('OR')).toBeTruthy()
  })

  it('renders as div (not hr) when label is provided', () => {
    const { container } = render(<Divider label="Section" />)
    expect(container.querySelector('hr')).toBeNull()
    expect(screen.getByText('Section')).toBeTruthy()
  })

  it('merges custom className on labeled divider', () => {
    const { container } = render(<Divider label="X" className="custom" />)
    expect(container.firstElementChild?.className).toContain('custom')
  })

  // --- Vertical ---
  it('renders as vertical div', () => {
    const { container } = render(<Divider direction="vertical" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('1px')
    expect(el.tagName).toBe('DIV')
  })

  it('does not render hr for vertical', () => {
    const { container } = render(<Divider direction="vertical" />)
    expect(container.querySelector('hr')).toBeNull()
  })

  it('merges custom className on vertical', () => {
    const { container } = render(<Divider direction="vertical" className="custom" />)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
