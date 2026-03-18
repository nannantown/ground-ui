import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CodeBlock } from './CodeBlock'

afterEach(cleanup)

describe('CodeBlock', () => {
  // --- Rendering ---
  it('renders code content', () => {
    render(<CodeBlock>{'const x = 1'}</CodeBlock>)
    expect(screen.getByText('const x = 1')).toBeTruthy()
  })

  it('applies code-block CSS class', () => {
    const { container } = render(<CodeBlock>{'code'}</CodeBlock>)
    expect(container.querySelector('.code-block')).toBeTruthy()
  })

  it('renders code inside pre > code elements', () => {
    const { container } = render(<CodeBlock>{'hello'}</CodeBlock>)
    const pre = container.querySelector('pre')
    expect(pre).toBeTruthy()
    expect(pre?.querySelector('code')).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(<CodeBlock className="custom">{'c'}</CodeBlock>)
    const el = container.querySelector('.code-block')
    expect(el?.className).toContain('custom')
  })

  // --- Header ---
  it('shows language label in header', () => {
    render(<CodeBlock language="tsx">{'code'}</CodeBlock>)
    expect(screen.getByText('tsx')).toBeTruthy()
  })

  it('shows title in header', () => {
    render(<CodeBlock title="example.ts">{'code'}</CodeBlock>)
    expect(screen.getByText('example.ts')).toBeTruthy()
  })

  it('shows header with code-block-header class', () => {
    const { container } = render(<CodeBlock language="js">{'code'}</CodeBlock>)
    expect(container.querySelector('.code-block-header')).toBeTruthy()
  })

  // --- Copy button ---
  it('shows copy button by default', () => {
    render(<CodeBlock>{'code'}</CodeBlock>)
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy()
  })

  it('hides copy button when copyable is false', () => {
    render(<CodeBlock copyable={false} language="js">{'code'}</CodeBlock>)
    expect(screen.queryByRole('button', { name: 'Copy code' })).toBeNull()
  })

  it('copy button uses .btn CSS classes', () => {
    render(<CodeBlock>{'code'}</CodeBlock>)
    const btn = screen.getByRole('button', { name: 'Copy code' })
    expect(btn.className).toContain('btn')
    expect(btn.className).toContain('btn-ghost')
  })

  it('calls clipboard.writeText on copy click', () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(<CodeBlock>{'const x = 1'}</CodeBlock>)
    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(writeText).toHaveBeenCalledWith('const x = 1')
  })

  // --- No header ---
  it('hides header when no language, title, or copyable', () => {
    const { container } = render(<CodeBlock copyable={false}>{'code'}</CodeBlock>)
    expect(container.querySelector('.code-block-header')).toBeNull()
  })
})
