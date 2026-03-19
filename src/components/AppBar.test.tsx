import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AppBar } from './AppBar'

afterEach(cleanup)

describe('AppBar', () => {
  it('renders header element', () => {
    render(<AppBar title="Title" />)
    expect(screen.getByRole('banner')).toBeTruthy()
  })

  it('renders title', () => {
    render(<AppBar title="My App" />)
    expect(screen.getByText('My App')).toBeTruthy()
  })

  it('renders subtitle', () => {
    render(<AppBar title="T" subtitle="Sub" />)
    expect(screen.getByText('Sub')).toBeTruthy()
  })

  it('renders leading content', () => {
    render(<AppBar title="T" leading={<button>Back</button>} />)
    expect(screen.getByText('Back')).toBeTruthy()
  })

  it('renders action buttons', () => {
    render(<AppBar title="T" actions={[<button key="s">Save</button>]} />)
    expect(screen.getByText('Save')).toBeTruthy()
  })

  it('merges custom className', () => {
    render(<AppBar title="T" className="custom" />)
    expect(screen.getByRole('banner').className).toContain('custom')
  })
})
