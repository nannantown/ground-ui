import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AppShell, AppShellHeader, AppShellSidebar } from './AppShell'

afterEach(cleanup)

describe('AppShell', () => {
  it('renders children', () => {
    render(<AppShell>Main</AppShell>)
    expect(screen.getByText('Main')).toBeTruthy()
  })

  it('applies app-shell class', () => {
    const { container } = render(<AppShell>C</AppShell>)
    expect(container.querySelector('.app-shell')).toBeTruthy()
  })

  it('renders header slot', () => {
    render(<AppShell header={<AppShellHeader>Head</AppShellHeader>}>C</AppShell>)
    expect(screen.getByText('Head')).toBeTruthy()
  })

  it('renders sidebar slot', () => {
    render(<AppShell sidebar={<AppShellSidebar>Side</AppShellSidebar>}>C</AppShell>)
    expect(screen.getByText('Side')).toBeTruthy()
  })
})
