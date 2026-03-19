import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createRef } from 'react'
import { ListTile } from './ListTile'

afterEach(cleanup)

describe('ListTile', () => {
  it('renders title', () => {
    render(<ListTile title="Item" />)
    expect(screen.getByText('Item')).toBeTruthy()
  })

  it('renders subtitle', () => {
    render(<ListTile title="T" subtitle="Sub" />)
    expect(screen.getByText('Sub')).toBeTruthy()
  })

  it('renders description', () => {
    render(<ListTile title="T" description="Desc" />)
    expect(screen.getByText('Desc')).toBeTruthy()
  })

  it('renders leading content', () => {
    render(<ListTile title="T" leading={<span data-testid="lead">L</span>} />)
    expect(screen.getByTestId('lead')).toBeTruthy()
  })

  it('renders trailing content', () => {
    render(<ListTile title="T" trailing={<span data-testid="trail">R</span>} />)
    expect(screen.getByTestId('trail')).toBeTruthy()
  })

  it('calls onClick when clicked', () => {
    const handler = vi.fn()
    render(<ListTile title="Click" onClick={handler} />)
    fireEvent.click(screen.getByText('Click').closest('div')!)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('has role=button when interactive', () => {
    render(<ListTile title="T" onClick={() => {}} />)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('supports Enter key when interactive', () => {
    const handler = vi.fn()
    render(<ListTile title="T" onClick={handler} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(handler).toHaveBeenCalled()
  })

  it('is disabled when disabled=true', () => {
    const handler = vi.fn()
    render(<ListTile title="T" onClick={handler} disabled />)
    fireEvent.click(screen.getByText('T').closest('div')!)
    expect(handler).not.toHaveBeenCalled()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<ListTile title="T" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges custom className', () => {
    const { container } = render(<ListTile title="T" className="custom" />)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
