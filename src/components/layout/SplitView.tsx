import {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { cn } from '../../cn'

type SplitDirection = 'horizontal' | 'vertical'

interface SplitViewProps extends HTMLAttributes<HTMLDivElement> {
  /** Left/top content */
  primary: ReactNode
  /** Right/bottom content */
  secondary: ReactNode
  /** Split direction */
  direction?: SplitDirection
  /** Initial size of primary panel in pixels */
  defaultSize?: number
  /** Minimum size of primary panel */
  minSize?: number
  /** Maximum size of primary panel */
  maxSize?: number
  /** Allow user to drag divider to resize */
  resizable?: boolean
  /** Divider width/height in pixels */
  dividerSize?: number
}

export const SplitView = forwardRef<HTMLDivElement, SplitViewProps>(
  (
    {
      primary,
      secondary,
      direction = 'horizontal',
      defaultSize = 300,
      minSize = 100,
      maxSize = 800,
      resizable = false,
      dividerSize = 4,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [primarySize, setPrimarySize] = useState(defaultSize)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const isHorizontal = direction === 'horizontal'

    const clamp = useCallback(
      (value: number): number => Math.min(maxSize, Math.max(minSize, value)),
      [minSize, maxSize]
    )

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!resizable) return
        e.preventDefault()
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        setIsDragging(true)
      },
      [resizable]
    )

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()

        let newSize: number
        if (isHorizontal) {
          newSize = e.clientX - rect.left
        } else {
          newSize = e.clientY - rect.top
        }

        setPrimarySize(clamp(newSize))
      },
      [isDragging, isHorizontal, clamp]
    )

    const handlePointerUp = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
        setIsDragging(false)
      },
      [isDragging]
    )

    // Prevent text selection while dragging
    useEffect(() => {
      if (!isDragging) return

      const preventSelection = (e: Event) => e.preventDefault()
      document.addEventListener('selectstart', preventSelection)
      return () => {
        document.removeEventListener('selectstart', preventSelection)
      }
    }, [isDragging])

    // Merge external ref with internal ref
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [ref]
    )

    const containerStyle: CSSProperties = {
      '--divider-size': `${dividerSize}px`,
      ...style,
    } as CSSProperties

    // Non-resizable mode: use CSS classes for equal or fixed split
    if (!resizable) {
      const primaryStyle: CSSProperties = {
        ...(isHorizontal
          ? { width: defaultSize, flexShrink: 0 }
          : { height: defaultSize, flexShrink: 0 }),
      }

      return (
        <div
          ref={setRefs}
          className={cn(
            'split-view',
            !isHorizontal && 'split-view-vertical',
            className
          )}
          style={containerStyle}
          {...props}
        >
          <div className="split-view-panel" style={primaryStyle}>
            {primary}
          </div>
          <div className="split-view-panel" style={{ flex: 1 }}>
            {secondary}
          </div>
        </div>
      )
    }

    // Resizable mode: render draggable divider
    const primaryPanelStyle: CSSProperties = isHorizontal
      ? { width: primarySize, flexShrink: 0 }
      : { height: primarySize, flexShrink: 0 }

    return (
      <div
        ref={setRefs}
        className={cn(
          'split-view',
          !isHorizontal && 'split-view-vertical',
          className
        )}
        style={containerStyle}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        {...props}
      >
        <div className="split-view-panel" style={primaryPanelStyle}>
          {primary}
        </div>
        <div
          className={cn(
            'split-view-divider',
            isHorizontal
              ? 'split-view-divider-horizontal'
              : 'split-view-divider-vertical',
            isDragging && 'split-view-divider-active'
          )}
          onPointerDown={handlePointerDown}
          role="separator"
          aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
          aria-valuenow={primarySize}
          aria-valuemin={minSize}
          aria-valuemax={maxSize}
          tabIndex={0}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 50 : 10
            if (
              (isHorizontal && e.key === 'ArrowLeft') ||
              (!isHorizontal && e.key === 'ArrowUp')
            ) {
              e.preventDefault()
              setPrimarySize((prev) => clamp(prev - step))
            } else if (
              (isHorizontal && e.key === 'ArrowRight') ||
              (!isHorizontal && e.key === 'ArrowDown')
            ) {
              e.preventDefault()
              setPrimarySize((prev) => clamp(prev + step))
            } else if (e.key === 'Home') {
              e.preventDefault()
              setPrimarySize(minSize)
            } else if (e.key === 'End') {
              e.preventDefault()
              setPrimarySize(maxSize)
            }
          }}
        />
        <div className="split-view-panel" style={{ flex: 1 }}>
          {secondary}
        </div>
      </div>
    )
  }
)

SplitView.displayName = 'SplitView'

export type { SplitViewProps, SplitDirection }
