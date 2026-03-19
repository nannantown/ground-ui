import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { FormField } from './FormField'

afterEach(cleanup)

describe('FormField', () => {
  it('renders label', () => {
    render(<FormField label="Email"><input /></FormField>)
    expect(screen.getByText('Email')).toBeTruthy()
  })

  it('renders children', () => {
    render(<FormField label="L"><input data-testid="inp" /></FormField>)
    expect(screen.getByTestId('inp')).toBeTruthy()
  })

  it('shows error message', () => {
    render(<FormField label="L" error="Required"><input /></FormField>)
    expect(screen.getByText('Required')).toBeTruthy()
  })

  it('shows hint text', () => {
    render(<FormField label="L" hint="Enter email"><input /></FormField>)
    expect(screen.getByText('Enter email')).toBeTruthy()
  })

  it('shows required indicator', () => {
    render(<FormField label="Name" required><input /></FormField>)
    expect(screen.getByText('*')).toBeTruthy()
  })

  it('has error role="alert"', () => {
    render(<FormField label="L" error="Bad"><input /></FormField>)
    expect(screen.getByRole('alert')).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(<FormField label="L" className="custom"><input /></FormField>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
