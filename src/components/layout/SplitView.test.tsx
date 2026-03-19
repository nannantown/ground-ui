import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SplitView } from './SplitView'

afterEach(cleanup)

describe('SplitView', () => {
  it('renders primary and secondary content', () => {
    render(<SplitView primary={<div>Left</div>} secondary={<div>Right</div>} />)
    expect(screen.getByText('Left')).toBeTruthy()
    expect(screen.getByText('Right')).toBeTruthy()
  })

  it('applies split-view class', () => {
    const { container } = render(<SplitView primary="A" secondary="B" />)
    expect(container.querySelector('.split-view')).toBeTruthy()
  })

  it('renders both panels', () => {
    render(<SplitView primary={<div>P</div>} secondary={<div>S</div>} />)
    expect(screen.getByText('P')).toBeTruthy()
    expect(screen.getByText('S')).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(<SplitView primary="A" secondary="B" className="custom" />)
    expect(container.querySelector('.split-view')?.className).toContain('custom')
  })
})
