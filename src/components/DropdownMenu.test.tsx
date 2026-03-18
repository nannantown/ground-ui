import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { DropdownMenu, DropdownItem, DropdownDivider } from './DropdownMenu'

afterEach(cleanup)

describe('DropdownItem', () => {
  // --- Rendering ---
  it('renders children text', () => {
    render(<DropdownItem>Edit</DropdownItem>)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy()
  })

  it('applies dropdown-item CSS class', () => {
    render(<DropdownItem>Edit</DropdownItem>)
    expect(screen.getByRole('button').className).toContain('dropdown-item')
  })

  // --- Variants ---
  it('applies dropdown-item-danger class for danger variant', () => {
    render(<DropdownItem variant="danger">Delete</DropdownItem>)
    expect(screen.getByRole('button').className).toContain('dropdown-item-danger')
  })

  it('does not apply danger class for default variant', () => {
    render(<DropdownItem>Edit</DropdownItem>)
    expect(screen.getByRole('button').className).not.toContain('dropdown-item-danger')
  })

  // --- onClick ---
  it('calls onClick when clicked', () => {
    const handler = vi.fn()
    render(<DropdownItem onClick={handler}>Edit</DropdownItem>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  // --- Disabled ---
  it('is disabled when disabled prop is true', () => {
    render(<DropdownItem disabled>Edit</DropdownItem>)
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('does not call onClick when disabled', () => {
    const handler = vi.fn()
    render(<DropdownItem disabled onClick={handler}>Edit</DropdownItem>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('DropdownDivider', () => {
  it('renders a divider element', () => {
    const { container } = render(<DropdownDivider />)
    const div = container.firstElementChild
    expect(div).toBeTruthy()
    expect(div?.style.borderTop).toContain('1px solid')
  })
})

describe('DropdownMenu', () => {
  const trigger = <button>Open Menu</button>

  it('renders the trigger', () => {
    render(
      <DropdownMenu trigger={trigger}>
        <DropdownItem>Edit</DropdownItem>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeTruthy()
  })

  it('does not show menu content initially', () => {
    render(
      <DropdownMenu trigger={trigger}>
        <DropdownItem>Edit</DropdownItem>
      </DropdownMenu>
    )
    expect(screen.queryByText('Edit')).toBeNull()
  })

  it('shows menu content after trigger click', () => {
    render(
      <DropdownMenu trigger={trigger}>
        <DropdownItem>Edit</DropdownItem>
      </DropdownMenu>
    )
    fireEvent.click(screen.getByText('Open Menu'))
    expect(screen.getByText('Edit')).toBeTruthy()
  })

  it('closes menu on Escape key', () => {
    render(
      <DropdownMenu trigger={trigger}>
        <DropdownItem>Edit</DropdownItem>
      </DropdownMenu>
    )
    fireEvent.click(screen.getByText('Open Menu'))
    expect(screen.getByText('Edit')).toBeTruthy()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Edit')).toBeNull()
  })

  it('toggles menu on repeated trigger clicks', () => {
    render(
      <DropdownMenu trigger={trigger}>
        <DropdownItem>Edit</DropdownItem>
      </DropdownMenu>
    )
    const triggerBtn = screen.getByText('Open Menu')
    fireEvent.click(triggerBtn)
    expect(screen.getByText('Edit')).toBeTruthy()
    fireEvent.click(triggerBtn)
    expect(screen.queryByText('Edit')).toBeNull()
  })
})
