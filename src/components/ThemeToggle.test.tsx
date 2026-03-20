import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

// Mock next-themes
const mockSetTheme = vi.fn()
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: mockSetTheme }),
}))

import { ThemeToggle } from './ThemeToggle'

afterEach(() => {
  cleanup()
  mockSetTheme.mockClear()
})

describe('ThemeToggle', () => {
  it('renders a button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('has aria-label for current theme', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Switch to light mode')
  })

  it('uses ToolbarButton (toolbar-button class)', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button').className).toContain('toolbar-button')
  })

  it('calls setTheme on click', () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('merges custom className', () => {
    render(<ThemeToggle className="custom" />)
    expect(screen.getByRole('button').className).toContain('custom')
  })
})
