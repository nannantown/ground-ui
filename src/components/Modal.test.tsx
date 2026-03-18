import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal'

afterEach(cleanup)

describe('Modal', () => {
  // --- Rendering ---
  it('renders nothing when open is false', () => {
    render(<Modal open={false} onClose={() => {}}>Content</Modal>)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders dialog when open is true', () => {
    render(<Modal open={true} onClose={() => {}}>Content</Modal>)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('renders children content', () => {
    render(<Modal open={true} onClose={() => {}}>Hello Modal</Modal>)
    expect(screen.getByText('Hello Modal')).toBeTruthy()
  })

  // --- ARIA ---
  it('has aria-modal=true', () => {
    render(<Modal open={true} onClose={() => {}}>M</Modal>)
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true')
  })

  it('applies aria-label when provided', () => {
    render(<Modal open={true} onClose={() => {}} aria-label="Settings">M</Modal>)
    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('Settings')
  })

  // --- Close ---
  it('calls onClose on Escape key', () => {
    const handler = vi.fn()
    render(<Modal open={true} onClose={handler}>M</Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handler).toHaveBeenCalledOnce()
  })

  // --- Close button ---
  it('shows close button when showClose is true', () => {
    render(<Modal open={true} onClose={() => {}} showClose>M</Modal>)
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy()
  })

  it('does not show close button by default', () => {
    render(<Modal open={true} onClose={() => {}}>M</Modal>)
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
  })

  it('calls onClose when close button is clicked', () => {
    const handler = vi.fn()
    render(<Modal open={true} onClose={handler} showClose>M</Modal>)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('close button uses .btn CSS classes (Cycle 10 migration)', () => {
    render(<Modal open={true} onClose={() => {}} showClose>M</Modal>)
    const btn = screen.getByRole('button', { name: 'Close' })
    expect(btn.className).toContain('btn')
    expect(btn.className).toContain('btn-ghost')
    expect(btn.className).toContain('btn-icon')
  })

  // --- CSS ---
  it('applies modal-content CSS class', () => {
    render(<Modal open={true} onClose={() => {}}>M</Modal>)
    expect(screen.getByRole('dialog').className).toContain('modal-content')
  })
})

describe('ModalHeader', () => {
  it('renders children', () => {
    render(<ModalHeader>Title</ModalHeader>)
    expect(screen.getByText('Title')).toBeTruthy()
  })
})

describe('ModalBody', () => {
  it('renders children', () => {
    render(<ModalBody>Body content</ModalBody>)
    expect(screen.getByText('Body content')).toBeTruthy()
  })
})

describe('ModalFooter', () => {
  it('renders children', () => {
    render(<ModalFooter>Footer actions</ModalFooter>)
    expect(screen.getByText('Footer actions')).toBeTruthy()
  })
})
