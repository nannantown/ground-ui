import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { CrossFade } from './CrossFade'

afterEach(cleanup)

describe('CrossFade', () => {
  it('shows first child when show=false', () => {
    render(
      <CrossFade show={false}>
        <div>First</div>
        <div>Second</div>
      </CrossFade>
    )
    expect(screen.getByText('First')).toBeTruthy()
  })

  it('shows second child when show=true', () => {
    render(
      <CrossFade show={true}>
        <div>First</div>
        <div>Second</div>
      </CrossFade>
    )
    expect(screen.getByText('Second')).toBeTruthy()
  })

  it('renders container element', () => {
    const { container } = render(
      <CrossFade show={false}>
        <div>A</div>
        <div>B</div>
      </CrossFade>
    )
    expect(container.firstElementChild).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(
      <CrossFade show={false} className="custom">
        <div>A</div>
        <div>B</div>
      </CrossFade>
    )
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
