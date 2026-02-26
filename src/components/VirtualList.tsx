import {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  type ReactNode,
} from 'react'
import { cn } from '../cn'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface VirtualListProps<T = unknown> {
  /** Array of items to render */
  items: T[]
  /**
   * Height of each item in pixels.
   * Pass a number for fixed-height items, or a function for variable heights.
   */
  itemHeight: number | ((item: T, index: number) => number)
  /** Number of extra items to render above/below the viewport (default: 5) */
  overscan?: number
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode
  /** Height of the scrollable container (CSS value, e.g. 400 or '100%') */
  height: number | string
  /** Called when the user scrolls near the end of the list */
  onEndReached?: () => void
  /** Distance in px from the bottom to trigger `onEndReached` (default: 200) */
  endReachedThreshold?: number
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Pre-compute cumulative offsets for variable-height items. */
function buildOffsets<T>(
  items: T[],
  itemHeight: number | ((item: T, index: number) => number)
): { offsets: number[]; totalHeight: number } {
  const count = items.length
  const offsets = new Array<number>(count)
  let cumulative = 0

  if (typeof itemHeight === 'number') {
    for (let i = 0; i < count; i++) {
      offsets[i] = cumulative
      cumulative += itemHeight
    }
  } else {
    for (let i = 0; i < count; i++) {
      offsets[i] = cumulative
      cumulative += itemHeight(items[i], i)
    }
  }

  return { offsets, totalHeight: cumulative }
}

/** Binary search for the first item whose offset is >= scrollTop. */
function findStartIndex(offsets: number[], scrollTop: number): number {
  let lo = 0
  let hi = offsets.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1
    if (offsets[mid] < scrollTop) lo = mid + 1
    else hi = mid - 1
  }
  return Math.max(0, lo - 1)
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function VirtualListInner<T>(
  {
    items,
    itemHeight,
    overscan = 5,
    renderItem,
    height,
    onEndReached,
    endReachedThreshold = 200,
    className,
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const endReachedFired = useRef(false)

  // Merge external ref
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    },
    [ref]
  )

  // ---- measurements ------------------------------------------------ //

  const { offsets, totalHeight } = buildOffsets(items, itemHeight)

  // Observe container size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    setContainerHeight(el.clientHeight)

    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ---- scroll handling ---------------------------------------------- //

  const onScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    setScrollTop(el.scrollTop)
  }, [])

  // End-reached detection
  useEffect(() => {
    if (!onEndReached) return

    const distanceFromEnd = totalHeight - (scrollTop + containerHeight)

    if (distanceFromEnd <= endReachedThreshold && !endReachedFired.current) {
      endReachedFired.current = true
      onEndReached()
    }

    // Reset once the user scrolls back up
    if (distanceFromEnd > endReachedThreshold * 2) {
      endReachedFired.current = false
    }
  }, [scrollTop, containerHeight, totalHeight, endReachedThreshold, onEndReached])

  // Reset endReached flag when items change (new data loaded)
  useEffect(() => {
    endReachedFired.current = false
  }, [items.length])

  // ---- visible range ------------------------------------------------ //

  const startIdx = Math.max(0, findStartIndex(offsets, scrollTop) - overscan)

  // Find end index
  const viewportBottom = scrollTop + containerHeight
  let endIdx = startIdx
  while (endIdx < items.length && offsets[endIdx] < viewportBottom) {
    endIdx++
  }
  endIdx = Math.min(items.length, endIdx + overscan)

  // ---- render ------------------------------------------------------- //

  const visibleItems: ReactNode[] = []
  for (let i = startIdx; i < endIdx; i++) {
    const h =
      typeof itemHeight === 'number' ? itemHeight : itemHeight(items[i], i)

    visibleItems.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: h,
          transform: `translateY(${offsets[i]}px)`,
        }}
      >
        {renderItem(items[i], i)}
      </div>
    )
  }

  return (
    <div
      ref={setRefs}
      className={cn('scroll-area', className)}
      onScroll={onScroll}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* Spacer to maintain correct scrollbar size */}
      <div
        style={{
          height: totalHeight,
          position: 'relative',
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>{visibleItems}</div>
      </div>
    </div>
  )
}

// forwardRef with generic — use a type assertion to preserve the generic
export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => ReturnType<typeof VirtualListInner>
