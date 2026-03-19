import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { SegmentedControl } from './SegmentedControl'

afterEach(cleanup)

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

describe('SegmentedControl', () => {
  it('renders radiogroup role', () => {
    render(<SegmentedControl items={items} value="a" onChange={() => {}} />)
    expect(screen.getByRole('radiogroup')).toBeTruthy()
  })

  it('renders all items', () => {
    render(<SegmentedControl items={items} value="a" onChange={() => {}} />)
    expect(screen.getByText('Alpha')).toBeTruthy()
    expect(screen.getByText('Beta')).toBeTruthy()
    expect(screen.getByText('Gamma')).toBeTruthy()
  })

  it('applies segmented-control class', () => {
    render(<SegmentedControl items={items} value="a" onChange={() => {}} />)
    expect(screen.getByRole('radiogroup').className).toContain('segmented-control')
  })

  it('marks selected item with active class', () => {
    render(<SegmentedControl items={items} value="b" onChange={() => {}} />)
    expect(screen.getByText('Beta').closest('button')?.className).toContain('segmented-control-active')
  })

  it('sets aria-checked on selected item', () => {
    render(<SegmentedControl items={items} value="a" onChange={() => {}} />)
    expect(screen.getByText('Alpha').closest('button')?.getAttribute('aria-checked')).toBe('true')
    expect(screen.getByText('Beta').closest('button')?.getAttribute('aria-checked')).toBe('false')
  })

  it('calls onChange when item is clicked', () => {
    const handler = vi.fn()
    render(<SegmentedControl items={items} value="a" onChange={handler} />)
    fireEvent.click(screen.getByText('Gamma'))
    expect(handler).toHaveBeenCalledWith('c')
  })

  it('disables all items when group disabled', () => {
    render(<SegmentedControl items={items} value="a" onChange={() => {}} disabled />)
    const buttons = screen.getAllByRole('radio')
    buttons.forEach((btn) => expect((btn as HTMLButtonElement).disabled).toBe(true))
  })

  it('disables individual items', () => {
    const disItems = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ]
    render(<SegmentedControl items={disItems} value="a" onChange={() => {}} />)
    expect((screen.getByText('B').closest('button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('has default aria-label', () => {
    render(<SegmentedControl items={items} value="a" onChange={() => {}} />)
    expect(screen.getByRole('radiogroup').getAttribute('aria-label')).toBe('Options')
  })

  it('merges custom className', () => {
    render(<SegmentedControl items={items} value="a" onChange={() => {}} className="custom" />)
    expect(screen.getByRole('radiogroup').className).toContain('custom')
  })
})
