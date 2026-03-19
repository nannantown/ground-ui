import { describe, it, expect, afterEach, beforeAll } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { VirtualList } from './VirtualList'

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})
afterEach(cleanup)

describe('VirtualList', () => {
  it('renders container', () => {
    const { container } = render(
      <VirtualList
        items={Array.from({ length: 100 }, (_, i) => i)}
        itemHeight={40}
        height={200}
        renderItem={(item) => <div key={item}>{`Item ${item}`}</div>}
      />
    )
    expect(container.firstElementChild).toBeTruthy()
  })

  it('renders visible items', () => {
    const { container } = render(
      <VirtualList
        items={Array.from({ length: 10 }, (_, i) => i)}
        itemHeight={40}
        height={200}
        renderItem={(item) => <div key={item}>{`Item ${item}`}</div>}
      />
    )
    expect(container.textContent).toContain('Item 0')
  })

  it('merges custom className', () => {
    const { container } = render(
      <VirtualList
        items={[1]}
        itemHeight={40}
        height={200}
        renderItem={(item) => <div key={item}>I</div>}
        className="custom"
      />
    )
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
