import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { DatePicker } from './DatePicker'

afterEach(cleanup)

describe('DatePicker', () => {
  it('renders an input', () => {
    render(<DatePicker value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('displays formatted value', () => {
    render(<DatePicker value="2026-03-20" onChange={() => {}} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBeTruthy()
  })

  it('is disabled when disabled', () => {
    render(<DatePicker value="" onChange={() => {}} disabled />)
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
  })

  it('shows placeholder', () => {
    render(<DatePicker value="" onChange={() => {}} placeholder="YYYY-MM-DD" />)
    expect(screen.getByPlaceholderText('YYYY-MM-DD')).toBeTruthy()
  })
})
