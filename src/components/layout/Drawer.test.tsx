import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Drawer } from './Drawer'

afterEach(cleanup)

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    render(<Drawer open={false} onClose={() => {}}>Content</Drawer>)
    expect(screen.queryByText('Content')).toBeNull()
  })

  it('renders children when open', () => {
    render(<Drawer open={true} onClose={() => {}}>Content</Drawer>)
    expect(screen.getByText('Content')).toBeTruthy()
  })

  it('applies drawer CSS class', () => {
    render(<Drawer open={true} onClose={() => {}}>C</Drawer>)
    expect(document.querySelector('.drawer')).toBeTruthy()
  })

  it('closes on Escape key', () => {
    const handler = vi.fn()
    render(<Drawer open={true} onClose={handler}>C</Drawer>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handler).toHaveBeenCalledOnce()
  })

  it('merges custom className', () => {
    render(<Drawer open={true} onClose={() => {}} className="custom">C</Drawer>)
    expect(document.querySelector('.drawer')?.className).toContain('custom')
  })
})
