import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Select } from './Select'

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(cleanup)

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry' },
]

describe('Select', () => {
  // --- Rendering ---
  it('renders a combobox role', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('combobox')).toBeTruthy()
  })

  it('applies select CSS class', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('combobox').className).toContain('select')
  })

  // --- Placeholder ---
  it('shows placeholder when no value', () => {
    render(<Select options={options} placeholder="Choose..." />)
    expect(screen.getByText('Choose...')).toBeTruthy()
  })

  // --- Controlled value ---
  it('shows selected option label', () => {
    render(<Select options={options} value="b" />)
    expect(screen.getByText('Banana')).toBeTruthy()
  })

  // --- Dropdown open/close ---
  it('does not show listbox initially', () => {
    render(<Select options={options} />)
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('opens dropdown on click', () => {
    render(<Select options={options} />)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  it('shows all options when open', () => {
    render(<Select options={options} />)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  // --- Selection ---
  it('calls onChange when option is clicked', () => {
    const handler = vi.fn()
    render(<Select options={options} onChange={handler} />)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Cherry'))
    expect(handler).toHaveBeenCalledWith('c')
  })

  it('closes dropdown after selection', () => {
    render(<Select options={options} onChange={() => {}} />)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Apple'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // --- Uncontrolled ---
  it('updates display in uncontrolled mode', () => {
    render(<Select options={options} placeholder="Pick" />)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Banana'))
    expect(screen.getByText('Banana')).toBeTruthy()
  })

  // --- Disabled ---
  it('sets aria-disabled when disabled', () => {
    render(<Select options={options} disabled />)
    expect(screen.getByRole('combobox').getAttribute('aria-disabled')).toBe('true')
  })

  it('does not open when disabled', () => {
    render(<Select options={options} disabled />)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // --- Error ---
  it('applies input-error class when error', () => {
    render(<Select options={options} error />)
    expect(screen.getByRole('combobox').className).toContain('input-error')
  })

  // --- ARIA ---
  it('sets aria-expanded false when closed', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('false')
  })

  it('sets aria-expanded true when open', () => {
    render(<Select options={options} />)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('true')
  })

  it('has aria-haspopup="listbox"', () => {
    render(<Select options={options} />)
    expect(screen.getByRole('combobox').getAttribute('aria-haspopup')).toBe('listbox')
  })

  // --- Keyboard ---
  it('opens on Enter key', () => {
    render(<Select options={options} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  it('closes on Escape key', () => {
    render(<Select options={options} />)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  // --- Hidden input ---
  it('renders hidden input with name for forms', () => {
    const { container } = render(<Select options={options} name="fruit" value="b" />)
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement
    expect(hidden).toBeTruthy()
    expect(hidden.name).toBe('fruit')
    expect(hidden.value).toBe('b')
  })
})
