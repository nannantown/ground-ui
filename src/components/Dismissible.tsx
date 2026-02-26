import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'

type DismissDirection = 'left' | 'right' | 'both'

interface DismissibleProps {
  /** Content that can be swiped away */
  children: ReactNode
  /** Called when the swipe threshold is exceeded and the item is dismissed */
  onDismiss: () => void
  /** Which direction(s) the swipe gesture is allowed */
  direction?: DismissDirection
  /** Fraction (0-1) of the element width to swipe before triggering dismiss */
  threshold?: number
  /** Whether the swipe gesture is disabled */
  disabled?: boolean
  /** Content revealed behind the swiped item */
  background?: ReactNode
  /** Additional class name */
  className?: string
}

interface SwipeState {
  isDragging: boolean
  startX: number
  currentX: number
  width: number
}

export function Dismissible({
  children,
  onDismiss,
  direction = 'right',
  threshold = 0.4,
  disabled = false,
  background,
  className,
}: DismissibleProps) {
  const [dismissed, setDismissed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<SwipeState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    width: 0,
  })
  const animFrameRef = useRef<number>(0)

  /** Constrain deltaX based on allowed direction */
  const constrainDelta = useCallback(
    (deltaX: number): number => {
      if (direction === 'left') return Math.min(0, deltaX)
      if (direction === 'right') return Math.max(0, deltaX)
      return deltaX // 'both'
    },
    [direction]
  )

  /** Apply transform + opacity to the content element */
  const applyTransform = useCallback((deltaX: number) => {
    if (!contentRef.current) return
    const state = stateRef.current
    const progress = state.width > 0 ? Math.abs(deltaX) / state.width : 0
    const opacity = Math.max(0, 1 - progress * 0.8)

    contentRef.current.style.transform = `translateX(${deltaX}px)`
    contentRef.current.style.opacity = String(opacity)
    contentRef.current.style.transition = 'none'
  }, [])

  /** Animate back to resting position */
  const springBack = useCallback(() => {
    if (!contentRef.current) return
    contentRef.current.style.transition =
      'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease'
    contentRef.current.style.transform = 'translateX(0)'
    contentRef.current.style.opacity = '1'
  }, [])

  /** Animate full dismissal */
  const animateDismiss = useCallback(
    (deltaX: number) => {
      if (!contentRef.current) return
      const sign = deltaX >= 0 ? 1 : -1
      const target = sign * stateRef.current.width

      contentRef.current.style.transition =
        'transform 0.25s ease-out, opacity 0.25s ease-out'
      contentRef.current.style.transform = `translateX(${target}px)`
      contentRef.current.style.opacity = '0'

      setTimeout(() => {
        setDismissed(true)
        onDismiss()
      }, 250)
    },
    [onDismiss]
  )

  // ─── Pointer start ──────────────────────────────────────

  const handleStart = useCallback(
    (clientX: number) => {
      if (disabled) return
      const el = containerRef.current
      if (!el) return

      stateRef.current = {
        isDragging: true,
        startX: clientX,
        currentX: clientX,
        width: el.getBoundingClientRect().width,
      }
    },
    [disabled]
  )

  // ─── Pointer move ───────────────────────────────────────

  const handleMove = useCallback(
    (clientX: number) => {
      const state = stateRef.current
      if (!state.isDragging) return

      state.currentX = clientX
      const deltaX = constrainDelta(clientX - state.startX)

      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = requestAnimationFrame(() => {
        applyTransform(deltaX)
      })
    },
    [constrainDelta, applyTransform]
  )

  // ─── Pointer end ────────────────────────────────────────

  const handleEnd = useCallback(() => {
    const state = stateRef.current
    if (!state.isDragging) return

    state.isDragging = false
    cancelAnimationFrame(animFrameRef.current)

    const deltaX = constrainDelta(state.currentX - state.startX)
    const progress = state.width > 0 ? Math.abs(deltaX) / state.width : 0

    if (progress >= threshold) {
      animateDismiss(deltaX)
    } else {
      springBack()
    }
  }, [constrainDelta, threshold, animateDismiss, springBack])

  // ─── Touch handlers ─────────────────────────────────────

  const onTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      handleStart(e.touches[0].clientX)
    },
    [handleStart]
  )

  const onTouchMove = useCallback(
    (e: ReactTouchEvent) => {
      handleMove(e.touches[0].clientX)
    },
    [handleMove]
  )

  const onTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // ─── Mouse handlers ─────────────────────────────────────

  const onMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault()
      handleStart(e.clientX)
    },
    [handleStart]
  )

  // Bind mouse move/up on document during drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX)
    }

    const handleMouseUp = () => {
      handleEnd()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMove, handleEnd])

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [])

  if (dismissed) return null

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background layer revealed during swipe */}
      {background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              direction === 'left'
                ? 'flex-end'
                : direction === 'right'
                  ? 'flex-start'
                  : 'center',
            padding: '0 var(--space-lg, 16px)',
          }}
        >
          {background}
        </div>
      )}

      {/* Swipeable content */}
      <div
        ref={contentRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        style={{
          position: 'relative',
          touchAction: 'pan-y',
          userSelect: 'none',
          willChange: 'transform',
          cursor: disabled ? 'default' : 'grab',
        }}
      >
        {children}
      </div>
    </div>
  )
}

Dismissible.displayName = 'Dismissible'
