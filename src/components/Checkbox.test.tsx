import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Checkbox } from './Checkbox'

afterEach(cleanup)

describe('Checkbox', () => {
  // --- Rendering ---
  it('renders a checkbox input', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeTruthy()
  })

  it('renders label text when provided', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeTruthy()
  })

  it('does not render label when not provided', () => {
    const { container } = render(<Checkbox />)
    const spans = container.querySelectorAll('span')
    // Only the visual checkbox span, no label span
    const textSpans = Array.from(spans).filter((s) => !s.getAttribute('aria-hidden'))
    expect(textSpans).toHaveLength(0)
  })

  // --- Controlled mode ---
  it('reflects controlled checked=true', () => {
    render(<Checkbox checked={true} />)
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true)
  })

  it('reflects controlled checked=false', () => {
    render(<Checkbox checked={false} />)
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false)
  })

  it('applies checkbox-checked class when checked', () => {
    const { container } = render(<Checkbox checked={true} />)
    expect(container.querySelector('.checkbox-checked')).toBeTruthy()
  })

  it('does not apply checkbox-checked class when unchecked', () => {
    const { container } = render(<Checkbox checked={false} />)
    expect(container.querySelector('.checkbox-checked')).toBeNull()
  })

  // --- Uncontrolled mode ---
  it('starts unchecked by default in uncontrolled mode', () => {
    render(<Checkbox />)
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false)
  })

  it('starts checked when defaultChecked=true', () => {
    render(<Checkbox defaultChecked={true} />)
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true)
  })

  it('toggles in uncontrolled mode on click', () => {
    render(<Checkbox label="Toggle me" />)
    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.checked).toBe(false)
    fireEvent.click(input)
    expect(input.checked).toBe(true)
    fireEvent.click(input)
    expect(input.checked).toBe(false)
  })

  // --- onChange ---
  it('calls onChange with new checked value', () => {
    const handler = vi.fn()
    render(<Checkbox checked={false} onChange={handler} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when unchecking', () => {
    const handler = vi.fn()
    render(<Checkbox checked={true} onChange={handler} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handler).toHaveBeenCalledWith(false)
  })

  // --- Disabled ---
  it('is disabled when disabled prop is true', () => {
    render(<Checkbox disabled />)
    expect((screen.getByRole('checkbox') as HTMLInputElement).disabled).toBe(true)
  })

  it('does not call onChange when disabled', () => {
    const handler = vi.fn()
    render(<Checkbox disabled onChange={handler} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(handler).not.toHaveBeenCalled()
  })

  // --- ARIA ---
  it('sets aria-checked matching checked state', () => {
    render(<Checkbox checked={true} />)
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('true')
  })

  // --- CSS classes ---
  it('applies checkbox CSS class to visual element', () => {
    const { container } = render(<Checkbox />)
    expect(container.querySelector('.checkbox')).toBeTruthy()
  })

  // --- id ---
  it('applies custom id to input', () => {
    render(<Checkbox id="my-checkbox" />)
    expect(document.getElementById('my-checkbox')).toBeTruthy()
  })

  it('generates an id when not provided', () => {
    render(<Checkbox />)
    const input = screen.getByRole('checkbox')
    expect(input.id).toBeTruthy()
  })
})
