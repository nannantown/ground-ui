import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

afterEach(cleanup)

describe('ProgressBar', () => {
  it('renders progressbar role', () => {
    render(<ProgressBar value={50} />)
    expect(screen.getByRole('progressbar')).toBeTruthy()
  })

  it('sets aria-valuenow', () => {
    render(<ProgressBar value={75} />)
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('75')
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<ProgressBar value={50} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuemin')).toBe('0')
    expect(bar.getAttribute('aria-valuemax')).toBe('100')
  })

  it('clamps value to 0-100', () => {
    render(<ProgressBar value={150} />)
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100')
  })

  it('clamps negative values to 0', () => {
    render(<ProgressBar value={-10} />)
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0')
  })

  it('applies progress CSS class', () => {
    render(<ProgressBar value={50} />)
    expect(screen.getByRole('progressbar').className).toContain('progress')
  })

  it('applies progress-sm for sm size', () => {
    render(<ProgressBar value={50} size="sm" />)
    expect(screen.getByRole('progressbar').className).toContain('progress-sm')
  })

  it('applies progress-lg for lg size', () => {
    render(<ProgressBar value={50} size="lg" />)
    expect(screen.getByRole('progressbar').className).toContain('progress-lg')
  })

  it('applies variant class', () => {
    const { container } = render(<ProgressBar value={50} variant="success" />)
    expect(container.querySelector('.progress-bar-success')).toBeTruthy()
  })

  it('shows label when showLabel is true', () => {
    render(<ProgressBar value={42} showLabel />)
    expect(screen.getByText('42%')).toBeTruthy()
  })

  it('does not show label by default', () => {
    render(<ProgressBar value={42} />)
    expect(screen.queryByText('42%')).toBeNull()
  })

  it('sets default aria-label', () => {
    render(<ProgressBar value={50} />)
    expect(screen.getByRole('progressbar').getAttribute('aria-label')).toBe('Progress')
  })
})
