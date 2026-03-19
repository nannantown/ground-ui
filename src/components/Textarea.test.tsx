import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Textarea } from './Textarea'

afterEach(cleanup)

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeTruthy()
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA')
  })

  it('applies textarea CSS class', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox').className).toContain('textarea')
  })

  it('merges custom className', () => {
    render(<Textarea className="custom" />)
    const cls = screen.getByRole('textbox').className
    expect(cls).toContain('textarea')
    expect(cls).toContain('custom')
  })

  it('displays value', () => {
    render(<Textarea value="hello" onChange={() => {}} />)
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('hello')
  })

  it('calls onChange', () => {
    const handler = vi.fn()
    render(<Textarea onChange={handler} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handler).toHaveBeenCalled()
  })

  it('shows placeholder', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled />)
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(true)
  })

  // --- Error ---
  it('applies input-error class when error', () => {
    render(<Textarea error />)
    expect(screen.getByRole('textbox').className).toContain('input-error')
  })

  it('does not apply input-error when no error', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox').className).not.toContain('input-error')
  })

  // --- Autosize ---
  it('sets overflow hidden and resize none when autosize', () => {
    render(<Textarea autosize />)
    const el = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(el.style.overflow).toBe('hidden')
    expect(el.style.resize).toBe('none')
  })

  it('does not set autosize styles by default', () => {
    render(<Textarea />)
    const el = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(el.style.overflow).toBe('')
  })

  // --- Ref ---
  it('forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  // --- HTML attributes ---
  it('passes through rows attribute', () => {
    render(<Textarea rows={5} />)
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).rows).toBe(5)
  })
})
