import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { FileUpload } from './FileUpload'

afterEach(cleanup)

describe('FileUpload', () => {
  // --- Rendering ---
  it('renders with role="button"', () => {
    render(<FileUpload />)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('shows default label', () => {
    render(<FileUpload />)
    expect(screen.getByText('Drop files here or click to browse')).toBeTruthy()
  })

  it('shows custom label', () => {
    render(<FileUpload label="Upload image" />)
    expect(screen.getByText('Upload image')).toBeTruthy()
  })

  it('shows hint text', () => {
    render(<FileUpload hint="Max 5MB" />)
    expect(screen.getByText('Max 5MB')).toBeTruthy()
  })

  it('does not show hint when not provided', () => {
    const { container } = render(<FileUpload />)
    expect(container.querySelector('.file-upload-hint')).toBeNull()
  })

  // --- CSS classes ---
  it('applies file-upload CSS class', () => {
    render(<FileUpload />)
    expect(screen.getByRole('button').className).toContain('file-upload')
  })

  it('merges custom className', () => {
    render(<FileUpload className="custom" />)
    expect(screen.getByRole('button').className).toContain('custom')
  })

  // --- Disabled ---
  it('applies file-upload-disabled class when disabled', () => {
    render(<FileUpload disabled />)
    expect(screen.getByRole('button').className).toContain('file-upload-disabled')
  })

  it('sets aria-disabled when disabled', () => {
    render(<FileUpload disabled />)
    expect(screen.getByRole('button').getAttribute('aria-disabled')).toBe('true')
  })

  it('sets tabIndex=-1 when disabled', () => {
    render(<FileUpload disabled />)
    expect(screen.getByRole('button').tabIndex).toBe(-1)
  })

  // --- Hidden input ---
  it('renders a hidden file input', () => {
    const { container } = render(<FileUpload />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toBeTruthy()
    expect(input.style.display).toBe('none')
  })

  it('passes accept prop to input', () => {
    const { container } = render(<FileUpload accept="image/*" />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input.accept).toBe('image/*')
  })

  it('passes multiple prop to input', () => {
    const { container } = render(<FileUpload multiple />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input.multiple).toBe(true)
  })

  // --- Drag events ---
  it('applies file-upload-active on dragover', () => {
    render(<FileUpload />)
    const el = screen.getByRole('button')
    fireEvent.dragOver(el, { dataTransfer: { files: [] } })
    expect(el.className).toContain('file-upload-active')
  })

  it('removes file-upload-active on dragleave', () => {
    render(<FileUpload />)
    const el = screen.getByRole('button')
    fireEvent.dragOver(el, { dataTransfer: { files: [] } })
    fireEvent.dragLeave(el)
    expect(el.className).not.toContain('file-upload-active')
  })

  // --- Keyboard ---
  it('is focusable with tabIndex=0', () => {
    render(<FileUpload />)
    expect(screen.getByRole('button').tabIndex).toBe(0)
  })
})
