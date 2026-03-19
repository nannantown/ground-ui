import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Skeleton } from './Skeleton'

afterEach(cleanup)

describe('Skeleton', () => {
  it('renders skeleton class', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('.skeleton')).toBeTruthy()
  })

  it('applies skeleton-text for text variant', () => {
    const { container } = render(<Skeleton variant="text" />)
    expect(container.querySelector('.skeleton-text')).toBeTruthy()
  })

  it('applies skeleton-title for title variant', () => {
    const { container } = render(<Skeleton variant="title" />)
    expect(container.querySelector('.skeleton-title')).toBeTruthy()
  })

  it('applies skeleton-card for card variant', () => {
    const { container } = render(<Skeleton variant="card" />)
    expect(container.querySelector('.skeleton-card')).toBeTruthy()
  })

  it('applies border-radius for circle variant', () => {
    const { container } = render(<Skeleton variant="circle" width={40} height={40} />)
    const el = container.querySelector('.skeleton') as HTMLElement
    expect(el.style.borderRadius).toContain('var(--radius-full)')
  })

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={20} />)
    const el = container.querySelector('.skeleton') as HTMLElement
    expect(el.style.width).toBe('200px')
    expect(el.style.height).toBe('20px')
  })

  it('renders multiple items with count', () => {
    const { container } = render(<Skeleton count={3} />)
    expect(container.querySelectorAll('.skeleton')).toHaveLength(3)
  })

  it('makes last text item 60% width', () => {
    const { container } = render(<Skeleton variant="text" count={3} />)
    const items = container.querySelectorAll('.skeleton')
    expect((items[2] as HTMLElement).style.width).toBe('60%')
  })

  it('merges custom className', () => {
    const { container } = render(<Skeleton className="custom" />)
    expect(container.querySelector('.skeleton')?.getAttribute('class')).toContain('custom')
  })
})
