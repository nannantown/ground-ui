import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Grid } from './Grid'

afterEach(cleanup)

describe('Grid', () => {
  it('renders children', () => {
    const { container } = render(<Grid><div>A</div><div>B</div></Grid>)
    expect(container.textContent).toBe('AB')
  })

  it('renders as div by default', () => {
    const { container } = render(<Grid>C</Grid>)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders as custom element', () => {
    const { container } = render(<Grid as="section">C</Grid>)
    expect(container.firstElementChild?.tagName).toBe('SECTION')
  })

  it('applies CSS grid display', () => {
    const { container } = render(<Grid>C</Grid>)
    expect((container.firstElementChild as HTMLElement).style.display).toBe('grid')
  })

  it('applies columns', () => {
    const { container } = render(<Grid columns={3}>C</Grid>)
    expect((container.firstElementChild as HTMLElement).style.gridTemplateColumns).toContain('1fr')
  })

  it('applies autoFill', () => {
    const { container } = render(<Grid autoFill="250px">C</Grid>)
    expect((container.firstElementChild as HTMLElement).style.gridTemplateColumns).toContain('auto-fill')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Grid ref={ref}>C</Grid>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges custom className', () => {
    const { container } = render(<Grid className="custom">C</Grid>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
