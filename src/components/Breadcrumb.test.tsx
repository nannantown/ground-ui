import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

afterEach(cleanup)

describe('Breadcrumb', () => {
  // --- Rendering ---
  it('renders a nav with aria-label', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy()
  })

  it('applies breadcrumb CSS class', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByRole('navigation').className).toContain('breadcrumb')
  })

  it('merges custom className', () => {
    render(
      <Breadcrumb className="custom">
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByRole('navigation').className).toContain('custom')
  })

  // --- Separator ---
  it('renders default "/" separator between items', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Settings</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByText('/')).toBeTruthy()
  })

  it('renders custom separator', () => {
    render(
      <Breadcrumb separator=">">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Settings</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByText('>')).toBeTruthy()
  })

  it('does not render separator after last item', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Settings</BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
      </Breadcrumb>
    )
    const separators = container.querySelectorAll('.breadcrumb-separator')
    expect(separators).toHaveLength(2)
  })

  // --- Auto-active last item ---
  it('auto-marks the last item as active', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Current</BreadcrumbItem>
      </Breadcrumb>
    )
    const current = screen.getByText('Current')
    expect(current.className).toContain('breadcrumb-item-active')
    expect(current.getAttribute('aria-current')).toBe('page')
  })
})

describe('BreadcrumbItem', () => {
  // --- Link rendering ---
  it('renders as <a> when href is provided', () => {
    render(<BreadcrumbItem href="/home">Home</BreadcrumbItem>)
    const link = screen.getByRole('link', { name: 'Home' })
    expect(link.getAttribute('href')).toBe('/home')
  })

  it('applies breadcrumb-item CSS class', () => {
    render(<BreadcrumbItem href="/home">Home</BreadcrumbItem>)
    expect(screen.getByRole('link').className).toContain('breadcrumb-item')
  })

  // --- Active ---
  it('renders as <span> when active (even with href)', () => {
    render(<BreadcrumbItem href="/home" active>Home</BreadcrumbItem>)
    expect(screen.queryByRole('link')).toBeNull()
    const el = screen.getByText('Home')
    expect(el.tagName).toBe('SPAN')
  })

  it('applies breadcrumb-item-active class when active', () => {
    render(<BreadcrumbItem active>Current</BreadcrumbItem>)
    expect(screen.getByText('Current').className).toContain('breadcrumb-item-active')
  })

  it('sets aria-current="page" when active', () => {
    render(<BreadcrumbItem active>Current</BreadcrumbItem>)
    expect(screen.getByText('Current').getAttribute('aria-current')).toBe('page')
  })

  // --- Disabled ---
  it('renders as <span> when disabled (even with href)', () => {
    render(<BreadcrumbItem href="/home" disabled>Home</BreadcrumbItem>)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('Home').tagName).toBe('SPAN')
  })

  it('applies breadcrumb-item-disabled class when disabled', () => {
    render(<BreadcrumbItem disabled>Disabled</BreadcrumbItem>)
    expect(screen.getByText('Disabled').className).toContain('breadcrumb-item-disabled')
  })

  it('sets aria-disabled when disabled', () => {
    render(<BreadcrumbItem disabled>Disabled</BreadcrumbItem>)
    expect(screen.getByText('Disabled').getAttribute('aria-disabled')).toBe('true')
  })

  // --- Plain text ---
  it('renders as <span> when no href', () => {
    render(<BreadcrumbItem>Text</BreadcrumbItem>)
    expect(screen.getByText('Text').tagName).toBe('SPAN')
  })

  // --- Custom className ---
  it('merges custom className', () => {
    render(<BreadcrumbItem className="custom">Item</BreadcrumbItem>)
    expect(screen.getByText('Item').className).toContain('custom')
  })
})
