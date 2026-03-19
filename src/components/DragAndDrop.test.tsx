import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { DragItem, DropZone } from './DragAndDrop'

afterEach(cleanup)

describe('DragItem', () => {
  it('renders children via render prop', () => {
    render(<DragItem id="1">{({ isDragging }) => <div>{isDragging ? 'Dragging' : 'Idle'}</div>}</DragItem>)
    expect(screen.getByText('Idle')).toBeTruthy()
  })

  it('renders draggable element', () => {
    const { container } = render(<DragItem id="1">{() => <div>D</div>}</DragItem>)
    expect(container.querySelector('[draggable]')).toBeTruthy()
  })

  it('disables dragging when disabled', () => {
    const { container } = render(<DragItem id="1" disabled>{() => <div>D</div>}</DragItem>)
    expect(container.querySelector('[draggable="false"]')).toBeTruthy()
  })
})

describe('DropZone', () => {
  it('renders children via render prop', () => {
    render(<DropZone onDrop={() => {}}>{({ isOver }) => <div>{isOver ? 'Over' : 'Ready'}</div>}</DropZone>)
    expect(screen.getByText('Ready')).toBeTruthy()
  })

  it('renders container', () => {
    const { container } = render(<DropZone onDrop={() => {}}>{() => <div>Z</div>}</DropZone>)
    expect(container.firstElementChild).toBeTruthy()
  })
})
