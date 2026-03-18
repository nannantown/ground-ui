import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Input } from './Input'

afterEach(cleanup)

describe('Input', () => {
  // --- Rendering ---
  it('renders a text input', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('applies input CSS class', () => {
    render(<Input />)
    expect(screen.getByRole('textbox').className).toContain('input')
  })

  it('merges custom className', () => {
    render(<Input className="custom" />)
    expect(screen.getByRole('textbox').className).toContain('custom')
  })

  // --- Value & onChange ---
  it('displays value', () => {
    render(<Input value="hello" onChange={() => {}} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('hello')
  })

  it('calls onChange when typing', () => {
    const handler = vi.fn()
    render(<Input onChange={handler} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handler).toHaveBeenCalled()
  })

  // --- Placeholder ---
  it('shows placeholder text', () => {
    render(<Input placeholder="Enter name" />)
    expect(screen.getByPlaceholderText('Enter name')).toBeTruthy()
  })

  // --- Disabled ---
  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
  })

  // --- Error ---
  it('applies input-error class when error is true', () => {
    render(<Input error />)
    expect(screen.getByRole('textbox').className).toContain('input-error')
  })

  it('does not apply input-error class when error is false', () => {
    render(<Input />)
    expect(screen.getByRole('textbox').className).not.toContain('input-error')
  })

  it('sets aria-invalid when error is true', () => {
    render(<Input error />)
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
  })

  it('does not set aria-invalid when error is false', () => {
    render(<Input />)
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBeNull()
  })

  // --- Icons ---
  it('renders leftIcon', () => {
    render(<Input leftIcon={<span data-testid="left-icon">L</span>} />)
    expect(screen.getByTestId('left-icon')).toBeTruthy()
  })

  it('renders rightIcon', () => {
    render(<Input rightIcon={<span data-testid="right-icon">R</span>} />)
    expect(screen.getByTestId('right-icon')).toBeTruthy()
  })

  it('wraps in div when icons are present', () => {
    const { container } = render(<Input leftIcon={<span>L</span>} />)
    const wrapper = container.firstElementChild
    expect(wrapper?.tagName).toBe('DIV')
    expect(wrapper?.className).toContain('input')
  })

  it('renders plain input when no icons', () => {
    const { container } = render(<Input />)
    expect(container.firstElementChild?.tagName).toBe('INPUT')
  })

  it('applies error class to wrapper when icons present', () => {
    const { container } = render(<Input leftIcon={<span>L</span>} error />)
    expect(container.firstElementChild?.className).toContain('input-error')
  })

  // --- Ref forwarding ---
  it('forwards ref to input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('forwards ref when icons are present', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} leftIcon={<span>L</span>} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  // --- HTML attributes ---
  it('passes through type attribute', () => {
    render(<Input type="email" />)
    expect(screen.getByRole('textbox').getAttribute('type')).toBe('email')
  })

  it('passes through name attribute', () => {
    render(<Input name="email" />)
    expect((screen.getByRole('textbox') as HTMLInputElement).name).toBe('email')
  })
})
