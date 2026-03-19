import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Dismissible } from './Dismissible'

afterEach(cleanup)

describe('Dismissible', () => {
  it('renders children', () => {
    render(<Dismissible onDismiss={() => {}}>Content</Dismissible>)
    expect(screen.getByText('Content')).toBeTruthy()
  })

  it('renders container element', () => {
    const { container } = render(<Dismissible onDismiss={() => {}}>C</Dismissible>)
    expect(container.firstElementChild).toBeTruthy()
  })

  it('renders when disabled', () => {
    render(<Dismissible onDismiss={() => {}} disabled>Still here</Dismissible>)
    expect(screen.getByText('Still here')).toBeTruthy()
  })
})
