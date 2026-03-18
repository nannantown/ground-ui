import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Masonry } from './Masonry'

afterEach(cleanup)

describe('Masonry', () => {
  it('renders children', () => {
    const { container } = render(
      <Masonry>
        <div>A</div>
        <div>B</div>
      </Masonry>
    )
    expect(container.textContent).toContain('A')
    expect(container.textContent).toContain('B')
  })

  it('applies masonry-3 class by default', () => {
    const { container } = render(<Masonry>C</Masonry>)
    expect(container.firstElementChild?.className).toContain('masonry-3')
  })

  it('applies masonry-2 class for 2 columns', () => {
    const { container } = render(<Masonry columns={2}>C</Masonry>)
    expect(container.firstElementChild?.className).toContain('masonry-2')
  })

  it('applies masonry-4 class for 4 columns', () => {
    const { container } = render(<Masonry columns={4}>C</Masonry>)
    expect(container.firstElementChild?.className).toContain('masonry-4')
  })

  it('merges custom className', () => {
    const { container } = render(<Masonry className="custom">C</Masonry>)
    const cls = container.firstElementChild?.className
    expect(cls).toContain('masonry-3')
    expect(cls).toContain('custom')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Masonry ref={ref}>C</Masonry>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes through HTML attributes', () => {
    const { container } = render(<Masonry data-testid="grid">C</Masonry>)
    expect(container.firstElementChild?.getAttribute('data-testid')).toBe('grid')
  })
})
