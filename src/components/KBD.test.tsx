import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { KBD, KBDGroup } from './KBD'

afterEach(cleanup)

describe('KBD', () => {
  it('renders a kbd element', () => {
    const { container } = render(<KBD>Ctrl</KBD>)
    expect(container.querySelector('kbd')).toBeTruthy()
  })

  it('renders key label', () => {
    render(<KBD>Shift</KBD>)
    expect(screen.getByText('Shift')).toBeTruthy()
  })

  it('applies kbd CSS class', () => {
    const { container } = render(<KBD>A</KBD>)
    expect(container.querySelector('kbd')?.className).toContain('kbd')
  })

  it('applies kbd-sm class for small size', () => {
    const { container } = render(<KBD size="sm">A</KBD>)
    expect(container.querySelector('kbd')?.className).toContain('kbd-sm')
  })

  it('does not apply kbd-sm for default md size', () => {
    const { container } = render(<KBD>A</KBD>)
    expect(container.querySelector('kbd')?.className).not.toContain('kbd-sm')
  })

  it('merges custom className', () => {
    const { container } = render(<KBD className="custom">A</KBD>)
    const cls = container.querySelector('kbd')?.className
    expect(cls).toContain('kbd')
    expect(cls).toContain('custom')
  })
})

describe('KBDGroup', () => {
  it('renders all keys', () => {
    render(<KBDGroup keys={['Ctrl', 'Shift', 'P']} />)
    expect(screen.getByText('Ctrl')).toBeTruthy()
    expect(screen.getByText('Shift')).toBeTruthy()
    expect(screen.getByText('P')).toBeTruthy()
  })

  it('renders default "+" separator', () => {
    render(<KBDGroup keys={['Ctrl', 'C']} />)
    expect(screen.getByText('+')).toBeTruthy()
  })

  it('renders custom separator', () => {
    render(<KBDGroup keys={['Ctrl', 'C']} separator="then" />)
    expect(screen.getByText('then')).toBeTruthy()
  })

  it('applies kbd-group class', () => {
    const { container } = render(<KBDGroup keys={['A']} />)
    expect(container.querySelector('.kbd-group')).toBeTruthy()
  })

  it('passes size to child KBD components', () => {
    const { container } = render(<KBDGroup keys={['Ctrl', 'S']} size="sm" />)
    const kbds = container.querySelectorAll('kbd')
    kbds.forEach((kbd) => {
      expect(kbd.className).toContain('kbd-sm')
    })
  })
})
