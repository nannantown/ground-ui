import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Slider } from './Slider'

afterEach(cleanup)

describe('Slider', () => {
  it('renders slider role', () => {
    render(<Slider value={50} onChange={() => {}} />)
    expect(screen.getByRole('slider')).toBeTruthy()
  })

  it('sets aria-valuenow', () => {
    render(<Slider value={30} onChange={() => {}} />)
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('30')
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Slider value={50} onChange={() => {}} min={10} max={90} />)
    const el = screen.getByRole('slider')
    expect(el.getAttribute('aria-valuemin')).toBe('10')
    expect(el.getAttribute('aria-valuemax')).toBe('90')
  })

  it('sets aria-label', () => {
    render(<Slider value={50} onChange={() => {}} label="Volume" />)
    expect(screen.getByRole('slider').getAttribute('aria-label')).toBe('Volume')
  })

  it('sets aria-disabled when disabled', () => {
    render(<Slider value={50} onChange={() => {}} disabled />)
    expect(screen.getByRole('slider').getAttribute('aria-disabled')).toBe('true')
  })

  it('defaults min to 0 and max to 100', () => {
    render(<Slider value={50} onChange={() => {}} />)
    const el = screen.getByRole('slider')
    expect(el.getAttribute('aria-valuemin')).toBe('0')
    expect(el.getAttribute('aria-valuemax')).toBe('100')
  })

  it('applies slider CSS class', () => {
    const { container } = render(<Slider value={50} onChange={() => {}} />)
    expect(container.querySelector('.slider')).toBeTruthy()
  })
})
