import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Sidebar } from './Sidebar'

afterEach(cleanup)

const sections = [
  {
    label: 'Main',
    items: [
      { value: 'home', label: 'Home' },
      { value: 'settings', label: 'Settings' },
    ],
  },
]

describe('Sidebar', () => {
  it('renders nav element', () => {
    render(<Sidebar sections={sections} />)
    expect(screen.getByRole('navigation')).toBeTruthy()
  })

  it('renders item labels', () => {
    render(<Sidebar sections={sections} />)
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('Settings')).toBeTruthy()
  })

  it('renders section label', () => {
    render(<Sidebar sections={sections} />)
    expect(screen.getByText('Main')).toBeTruthy()
  })

  it('applies sidebar class', () => {
    const { container } = render(<Sidebar sections={sections} />)
    expect(container.querySelector('.sidebar')).toBeTruthy()
  })

  it('highlights active item', () => {
    const { container } = render(<Sidebar sections={sections} value="home" />)
    expect(container.querySelector('.sidebar-item-active')).toBeTruthy()
  })

  it('calls onChange when item clicked', () => {
    const handler = vi.fn()
    render(<Sidebar sections={sections} onChange={handler} />)
    fireEvent.click(screen.getByText('Settings'))
    expect(handler).toHaveBeenCalledWith('settings')
  })

  it('renders header slot', () => {
    render(<Sidebar sections={sections} header={<div data-testid="hdr">Logo</div>} />)
    expect(screen.getByTestId('hdr')).toBeTruthy()
  })

  it('renders user profile', () => {
    render(<Sidebar sections={sections} user={{ name: 'John', email: 'j@e.com' }} />)
    expect(screen.getByText('John')).toBeTruthy()
    expect(screen.getByText('j@e.com')).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(<Sidebar sections={sections} className="custom" />)
    expect(container.querySelector('.sidebar')?.className).toContain('custom')
  })
})
