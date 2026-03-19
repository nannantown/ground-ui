import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { AspectRatio } from './AspectRatio'

afterEach(cleanup)

describe('AspectRatio', () => {
  it('renders children', () => {
    const { container } = render(<AspectRatio><img alt="t" /></AspectRatio>)
    expect(container.querySelector('img')).toBeTruthy()
  })

  it('applies aspect-video class for 16:9', () => {
    const { container } = render(<AspectRatio ratio="16:9">C</AspectRatio>)
    expect(container.firstElementChild?.className).toContain('aspect-video')
  })

  it('applies aspect-square class for 1:1', () => {
    const { container } = render(<AspectRatio ratio="1:1">C</AspectRatio>)
    expect(container.firstElementChild?.className).toContain('aspect-square')
  })

  it('applies numeric ratio without preset class', () => {
    const { container } = render(<AspectRatio ratio={2.5}>C</AspectRatio>)
    expect(container.firstElementChild?.className).not.toContain('aspect-')
  })

  it('merges custom className', () => {
    const { container } = render(<AspectRatio className="custom">C</AspectRatio>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
