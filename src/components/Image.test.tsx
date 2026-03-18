import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { Image } from './Image'

afterEach(cleanup)

describe('Image', () => {
  // --- Rendering ---
  it('renders an img element', () => {
    render(<Image src="/test.jpg" alt="Test" />)
    expect(screen.getByRole('img', { name: 'Test' })).toBeTruthy()
  })

  it('sets src attribute', () => {
    render(<Image src="/photo.jpg" alt="Photo" />)
    expect((screen.getByRole('img') as HTMLImageElement).src).toContain('/photo.jpg')
  })

  it('sets alt attribute', () => {
    render(<Image src="/test.jpg" alt="Description" />)
    expect(screen.getByRole('img').getAttribute('alt')).toBe('Description')
  })

  it('defaults alt to empty string', () => {
    const { container } = render(<Image src="/test.jpg" />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('alt')).toBe('')
  })

  // --- Fit ---
  it('applies object-fit cover by default', () => {
    render(<Image src="/test.jpg" alt="T" />)
    expect(screen.getByRole('img').style.objectFit).toBe('cover')
  })

  it('applies object-fit contain', () => {
    render(<Image src="/test.jpg" alt="T" fit="contain" />)
    expect(screen.getByRole('img').style.objectFit).toBe('contain')
  })

  // --- Radius ---
  it('applies border-radius from radius prop', () => {
    render(<Image src="/test.jpg" alt="T" radius="full" />)
    expect(screen.getByRole('img').style.borderRadius).toContain('var(--radius-full)')
  })

  it('has no border-radius by default (radius=none)', () => {
    render(<Image src="/test.jpg" alt="T" />)
    expect(screen.getByRole('img').style.borderRadius).toBe('0px')
  })

  // --- Aspect ratio ---
  it('applies aspect-ratio', () => {
    render(<Image src="/test.jpg" alt="T" aspectRatio="16/9" />)
    expect(screen.getByRole('img').style.aspectRatio).toBe('16/9')
  })

  // --- Fallback ---
  it('shows fallback on error', () => {
    render(<Image src="/broken.jpg" alt="T" fallback={<span>No image</span>} />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByText('No image')).toBeTruthy()
  })

  it('hides img when fallback is shown', () => {
    render(<Image src="/broken.jpg" alt="T" fallback={<span>No image</span>} />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('applies radius to fallback container', () => {
    const { container } = render(
      <Image src="/broken.jpg" alt="T" radius="lg" fallback={<span>X</span>} />
    )
    fireEvent.error(screen.getByRole('img'))
    const fallbackDiv = container.querySelector('.image-fallback')
    expect(fallbackDiv?.getAttribute('style')).toContain('var(--radius-lg)')
  })

  // --- Ref ---
  it('forwards ref to img element', () => {
    const ref = createRef<HTMLImageElement>()
    render(<Image ref={ref} src="/test.jpg" alt="T" />)
    expect(ref.current).toBeInstanceOf(HTMLImageElement)
  })

  // --- display: block ---
  it('renders as block by default', () => {
    render(<Image src="/test.jpg" alt="T" />)
    expect(screen.getByRole('img').style.display).toBe('block')
  })
})
