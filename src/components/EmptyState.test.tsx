import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { EmptyState } from './EmptyState'

afterEach(cleanup)

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items" />)
    expect(screen.getByText('No items')).toBeTruthy()
  })

  it('applies empty-state class', () => {
    const { container } = render(<EmptyState title="Empty" />)
    expect(container.querySelector('.empty-state')).toBeTruthy()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Try adding some" />)
    expect(screen.getByText('Try adding some')).toBeTruthy()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(1)
  })

  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">X</span>} />)
    expect(screen.getByTestId('icon')).toBeTruthy()
  })

  it('renders action slot', () => {
    render(<EmptyState title="Empty" action={<button>Add</button>} />)
    expect(screen.getByRole('button', { name: 'Add' })).toBeTruthy()
  })

  it('does not render action when not provided', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
