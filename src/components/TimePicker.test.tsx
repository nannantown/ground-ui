import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { TimePicker } from './TimePicker'

afterEach(cleanup)

describe('TimePicker', () => {
  it('renders an input', () => {
    render(<TimePicker value="12:00" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('displays value', () => {
    render(<TimePicker value="14:30" onChange={() => {}} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('14:30')
  })

  it('is disabled when disabled', () => {
    render(<TimePicker value="12:00" onChange={() => {}} disabled />)
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
  })

  it('shows placeholder', () => {
    render(<TimePicker value="" onChange={() => {}} placeholder="HH:MM" />)
    expect(screen.getByPlaceholderText('HH:MM')).toBeTruthy()
  })
})
