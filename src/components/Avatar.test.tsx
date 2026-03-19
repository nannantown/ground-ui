import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Avatar } from './Avatar'

afterEach(cleanup)

describe('Avatar', () => {
  // --- Image mode ---
  it('renders img when src is provided', () => {
    render(<Avatar src="/photo.jpg" name="John" />)
    expect(screen.getByRole('img')).toBeTruthy()
  })

  it('sets alt from name', () => {
    render(<Avatar src="/photo.jpg" name="John" />)
    expect(screen.getByRole('img').getAttribute('alt')).toBe('John')
  })

  it('sets src attribute', () => {
    render(<Avatar src="/photo.jpg" name="John" />)
    expect((screen.getByRole('img') as HTMLImageElement).src).toContain('/photo.jpg')
  })

  // --- Initials mode ---
  it('shows initials when no src', () => {
    render(<Avatar name="John Doe" />)
    expect(screen.getByText('JD')).toBeTruthy()
  })

  it('shows single initial for single name', () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText('A')).toBeTruthy()
  })

  it('shows ? when no name and no src', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeTruthy()
  })

  it('uppercases initials', () => {
    render(<Avatar name="jane smith" />)
    expect(screen.getByText('JS')).toBeTruthy()
  })

  // --- Sizes ---
  it('applies md size by default (32px)', () => {
    const { container } = render(<Avatar name="A" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('32px')
    expect(el.style.height).toBe('32px')
  })

  it('applies sm size (24px)', () => {
    const { container } = render(<Avatar name="A" size="sm" />)
    expect((container.firstElementChild as HTMLElement).style.width).toBe('24px')
  })

  it('applies xl size (56px)', () => {
    const { container } = render(<Avatar name="A" size="xl" />)
    expect((container.firstElementChild as HTMLElement).style.width).toBe('56px')
  })

  // --- className ---
  it('merges custom className on img', () => {
    render(<Avatar src="/p.jpg" name="X" className="custom" />)
    expect(screen.getByRole('img').className).toContain('custom')
  })

  it('merges custom className on initials div', () => {
    const { container } = render(<Avatar name="A" className="custom" />)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
