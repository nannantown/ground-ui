import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Carousel } from './Carousel'

afterEach(cleanup)

describe('Carousel', () => {
  it('renders children slides', () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    )
    expect(screen.getByText('Slide 1')).toBeTruthy()
  })

  it('shows arrow buttons by default', () => {
    render(
      <Carousel>
        <div>A</div>
        <div>B</div>
      </Carousel>
    )
    expect(screen.getByRole('button', { name: /previous/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /next/i })).toBeTruthy()
  })

  it('hides arrows when showArrows=false', () => {
    render(
      <Carousel showArrows={false}>
        <div>A</div>
        <div>B</div>
      </Carousel>
    )
    expect(screen.queryByRole('button', { name: /previous/i })).toBeNull()
  })

  it('disables previous button at first slide', () => {
    render(
      <Carousel>
        <div>A</div>
        <div>B</div>
      </Carousel>
    )
    expect((screen.getByRole('button', { name: /previous/i }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('navigates to next slide on next click', () => {
    const handler = vi.fn()
    render(
      <Carousel onChange={handler}>
        <div>A</div>
        <div>B</div>
      </Carousel>
    )
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(handler).toHaveBeenCalledWith(1)
  })

  it('merges custom className', () => {
    const { container } = render(
      <Carousel className="custom">
        <div>A</div>
      </Carousel>
    )
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
