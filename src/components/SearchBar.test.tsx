import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { SearchBar } from './SearchBar'

afterEach(cleanup)

describe('SearchBar', () => {
  it('renders a text input', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('displays value', () => {
    render(<SearchBar value="query" onChange={() => {}} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('query')
  })

  it('calls onChange when typing', () => {
    const handler = vi.fn()
    render(<SearchBar value="" onChange={handler} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handler).toHaveBeenCalledWith('test')
  })

  it('shows placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy()
  })

  it('calls onSubmit on Enter', () => {
    const handler = vi.fn()
    render(<SearchBar value="q" onChange={() => {}} onSubmit={handler} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    expect(handler).toHaveBeenCalledWith('q')
  })

  it('is disabled when disabled prop is true', () => {
    render(<SearchBar value="" onChange={() => {}} disabled />)
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
  })

  it('merges custom className', () => {
    const { container } = render(<SearchBar value="" onChange={() => {}} className="custom" />)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
