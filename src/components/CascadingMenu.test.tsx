import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CascadingMenu } from './CascadingMenu'

afterEach(cleanup)

const items = [
  { id: '1', label: 'Cut' },
  { id: '2', label: 'Copy' },
  { id: '3', label: 'Paste', disabled: true },
]

describe('CascadingMenu', () => {
  it('renders trigger', () => {
    render(<CascadingMenu trigger={<button>Menu</button>} items={items} />)
    expect(screen.getByText('Menu')).toBeTruthy()
  })

  it('does not show menu initially', () => {
    render(<CascadingMenu trigger={<button>Menu</button>} items={items} />)
    expect(screen.queryByText('Cut')).toBeNull()
  })

  it('shows menu on trigger click', () => {
    render(<CascadingMenu trigger={<button>Menu</button>} items={items} />)
    fireEvent.click(screen.getByText('Menu'))
    expect(screen.getByText('Cut')).toBeTruthy()
    expect(screen.getByText('Copy')).toBeTruthy()
  })

  it('renders disabled items', () => {
    render(<CascadingMenu trigger={<button>Menu</button>} items={items} />)
    fireEvent.click(screen.getByText('Menu'))
    expect(screen.getByText('Paste')).toBeTruthy()
  })
})
