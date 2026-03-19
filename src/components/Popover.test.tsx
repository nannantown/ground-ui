import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Popover } from './Popover'

afterEach(cleanup)

describe('Popover', () => {
  it('renders trigger element', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Content</div>
      </Popover>
    )
    expect(screen.getByText('Open')).toBeTruthy()
  })

  it('does not show content initially', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Content</div>
      </Popover>
    )
    expect(screen.queryByText('Content')).toBeNull()
  })

  it('shows content on trigger click', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Content')).toBeTruthy()
  })

  it('hides content on second trigger click', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByText('Open'))
    expect(screen.queryByText('Content')).toBeNull()
  })

  it('calls onOpenChange', () => {
    const handler = vi.fn()
    render(
      <Popover trigger={<button>Open</button>} onOpenChange={handler}>
        <div>Content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('applies popover CSS class', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(document.querySelector('.popover')).toBeTruthy()
  })
})
