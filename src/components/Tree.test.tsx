import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Tree } from './Tree'
import type { TreeNode } from './Tree'

afterEach(cleanup)

const nodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'app', label: 'App.tsx' },
      { id: 'main', label: 'main.tsx' },
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'btn', label: 'Button.tsx' },
        ],
      },
    ],
  },
  { id: 'readme', label: 'README.md' },
]

describe('Tree', () => {
  it('renders tree role', () => {
    render(<Tree nodes={nodes} />)
    expect(screen.getByRole('tree')).toBeTruthy()
  })

  it('renders root level items', () => {
    render(<Tree nodes={nodes} />)
    expect(screen.getByText('src')).toBeTruthy()
    expect(screen.getByText('README.md')).toBeTruthy()
  })

  it('hides children by default', () => {
    render(<Tree nodes={nodes} />)
    expect(screen.queryByText('App.tsx')).toBeNull()
  })

  it('expands node on click', () => {
    render(<Tree nodes={nodes} />)
    fireEvent.click(screen.getByText('src'))
    expect(screen.getByText('App.tsx')).toBeTruthy()
    expect(screen.getByText('main.tsx')).toBeTruthy()
  })

  it('collapses expanded node on click', () => {
    render(<Tree nodes={nodes} />)
    fireEvent.click(screen.getByText('src'))
    fireEvent.click(screen.getByText('src'))
    expect(screen.queryByText('App.tsx')).toBeNull()
  })

  it('shows children when defaultExpanded', () => {
    render(<Tree nodes={nodes} defaultExpanded={['src']} />)
    expect(screen.getByText('App.tsx')).toBeTruthy()
  })

  it('calls onSelect for leaf nodes', () => {
    const handler = vi.fn()
    render(<Tree nodes={nodes} defaultExpanded={['src']} onSelect={handler} />)
    fireEvent.click(screen.getByText('App.tsx'))
    expect(handler).toHaveBeenCalledWith('app')
  })

  it('highlights selected node', () => {
    render(<Tree nodes={nodes} defaultExpanded={['src']} selectedId="app" />)
    const item = screen.getByText('App.tsx').closest('.tree-item')
    expect(item?.className).toContain('tree-item-selected')
  })

  it('supports nested expansion', () => {
    render(<Tree nodes={nodes} defaultExpanded={['src']} />)
    fireEvent.click(screen.getByText('components'))
    expect(screen.getByText('Button.tsx')).toBeTruthy()
  })

  it('applies tree CSS class', () => {
    const { container } = render(<Tree nodes={nodes} />)
    expect(container.querySelector('.tree')).toBeTruthy()
  })

  it('merges custom className', () => {
    const { container } = render(<Tree nodes={nodes} className="custom" />)
    expect(container.querySelector('.tree')?.className).toContain('custom')
  })
})
