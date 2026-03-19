import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ConfirmDialog } from './ConfirmDialog'

afterEach(cleanup)

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    render(<ConfirmDialog open={false} onClose={() => {}} onConfirm={() => {}} message="Sure?" />)
    expect(screen.queryByText('Sure?')).toBeNull()
  })

  it('renders message when open', () => {
    render(<ConfirmDialog open={true} onClose={() => {}} onConfirm={() => {}} message="Are you sure?" />)
    expect(screen.getByText('Are you sure?')).toBeTruthy()
  })

  it('renders title when provided', () => {
    render(<ConfirmDialog open={true} onClose={() => {}} onConfirm={() => {}} message="M" title="Warning" />)
    expect(screen.getByText('Warning')).toBeTruthy()
  })

  it('shows default Delete label for danger variant', () => {
    render(<ConfirmDialog open={true} onClose={() => {}} onConfirm={() => {}} message="M" />)
    expect(screen.getByText('Delete')).toBeTruthy()
    expect(screen.getByText('Cancel')).toBeTruthy()
  })

  it('shows default Confirm label for default variant', () => {
    render(<ConfirmDialog open={true} onClose={() => {}} onConfirm={() => {}} message="M" variant="default" />)
    expect(screen.getByText('Confirm')).toBeTruthy()
  })

  it('shows custom labels', () => {
    render(
      <ConfirmDialog open={true} onClose={() => {}} onConfirm={() => {}} message="M"
        confirmLabel="Yes" cancelLabel="No" />
    )
    expect(screen.getByText('Yes')).toBeTruthy()
    expect(screen.getByText('No')).toBeTruthy()
  })

  it('calls onClose when cancel clicked', () => {
    const handler = vi.fn()
    render(<ConfirmDialog open={true} onClose={handler} onConfirm={() => {}} message="M" />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('calls onConfirm when confirm clicked', async () => {
    const handler = vi.fn()
    render(<ConfirmDialog open={true} onClose={() => {}} onConfirm={handler} message="M" />)
    fireEvent.click(screen.getByText('Delete'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('uses btn-danger class for danger variant', () => {
    render(<ConfirmDialog open={true} onClose={() => {}} onConfirm={() => {}} message="M" />)
    expect(screen.getByText('Delete').className).toContain('btn-danger')
  })

  it('uses btn-primary class for default variant', () => {
    render(<ConfirmDialog open={true} onClose={() => {}} onConfirm={() => {}} message="M" variant="default" />)
    expect(screen.getByText('Confirm').className).toContain('btn-primary')
  })

  it('cancel uses btn-secondary class', () => {
    render(<ConfirmDialog open={true} onClose={() => {}} onConfirm={() => {}} message="M" />)
    expect(screen.getByText('Cancel').className).toContain('btn-secondary')
  })
})
