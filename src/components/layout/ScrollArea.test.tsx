import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ScrollArea } from './ScrollArea'

afterEach(cleanup)

describe('ScrollArea', () => {
  it('renders children', () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>)
    expect(container.textContent).toBe('Content')
  })

  it('applies scroll-area class for vertical', () => {
    const { container } = render(<ScrollArea>C</ScrollArea>)
    expect(container.firstElementChild?.className).toContain('scroll-area')
  })

  it('applies scroll-x class for horizontal', () => {
    const { container } = render(<ScrollArea direction="horizontal">C</ScrollArea>)
    expect(container.firstElementChild?.className).toContain('scroll-x')
  })

  it('applies maxHeight', () => {
    const { container } = render(<ScrollArea maxHeight="300px">C</ScrollArea>)
    expect((container.firstElementChild as HTMLElement).style.maxHeight).toBe('300px')
  })

  it('merges custom className', () => {
    const { container } = render(<ScrollArea className="custom">C</ScrollArea>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
