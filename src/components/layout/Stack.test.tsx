import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Stack } from './Stack'

afterEach(cleanup)

describe('Stack', () => {
  it('renders children', () => {
    const { container } = render(<Stack><span>A</span><span>B</span></Stack>)
    expect(container.textContent).toBe('AB')
  })

  it('renders as div by default', () => {
    const { container } = render(<Stack>C</Stack>)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders as custom element', () => {
    const { container } = render(<Stack as="section">C</Stack>)
    expect(container.firstElementChild?.tagName).toBe('SECTION')
  })

  it('applies vertical flexDirection by default', () => {
    const { container } = render(<Stack>C</Stack>)
    expect((container.firstElementChild as HTMLElement).style.flexDirection).toBe('column')
  })

  it('applies horizontal flexDirection', () => {
    const { container } = render(<Stack direction="horizontal">C</Stack>)
    expect((container.firstElementChild as HTMLElement).style.flexDirection).toBe('row')
  })

  it('applies gap', () => {
    const { container } = render(<Stack gap="md">C</Stack>)
    expect((container.firstElementChild as HTMLElement).style.gap).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Stack ref={ref}>C</Stack>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges custom className', () => {
    const { container } = render(<Stack className="custom">C</Stack>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
