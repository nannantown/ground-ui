import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { BottomSheet } from './BottomSheet'

afterEach(cleanup)

describe('BottomSheet', () => {
  it('renders nothing when closed', () => {
    render(<BottomSheet open={false} onClose={() => {}}>Content</BottomSheet>)
    expect(screen.queryByText('Content')).toBeNull()
  })

  it('renders children when open', () => {
    render(<BottomSheet open={true} onClose={() => {}}>Content</BottomSheet>)
    expect(screen.getByText('Content')).toBeTruthy()
  })

  it('renders dialog role', () => {
    render(<BottomSheet open={true} onClose={() => {}}>C</BottomSheet>)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('closes on Escape key', () => {
    const handler = vi.fn()
    render(<BottomSheet open={true} onClose={handler}>C</BottomSheet>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handler).toHaveBeenCalledOnce()
  })
})
