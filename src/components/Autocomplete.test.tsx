import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Autocomplete } from './Autocomplete'

afterEach(cleanup)

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

describe('Autocomplete', () => {
  it('renders an input', () => {
    render(<Autocomplete value="" onChange={() => {}} options={options} />)
    expect(screen.getByRole('combobox')).toBeTruthy()
  })

  it('displays current value', () => {
    render(<Autocomplete value="test" onChange={() => {}} options={options} />)
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('test')
  })

  it('shows placeholder', () => {
    render(<Autocomplete value="" onChange={() => {}} options={options} placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy()
  })

  it('calls onChange when typing', () => {
    const handler = vi.fn()
    render(<Autocomplete value="" onChange={handler} options={options} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'app' } })
    expect(handler).toHaveBeenCalledWith('app')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Autocomplete value="" onChange={() => {}} options={options} disabled />)
    expect((screen.getByRole('combobox') as HTMLInputElement).disabled).toBe(true)
  })

  it('renders with error prop without crashing', () => {
    const { container } = render(<Autocomplete value="" onChange={() => {}} options={options} error />)
    expect(container.firstElementChild).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(
      <Autocomplete value="" onChange={() => {}} options={options} className="custom" />
    )
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
