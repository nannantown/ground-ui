import {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../cn'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BottomSheetProps {
  /** Whether the sheet is open */
  open: boolean
  /** Called when the sheet should close */
  onClose: () => void
  children: ReactNode
  /** Snap points as fractions of viewport height (0-1). Must be sorted ascending. */
  snapPoints?: number[]
  /** Index into `snapPoints` for the initial snap position (default: 0) */
  defaultSnap?: number
  /** Optional header rendered above the scrollable content */
  header?: ReactNode
  /** Allow dismissing by dragging down or tapping the backdrop (default: true) */
  dismissible?: boolean
  /** Show a backdrop scrim behind the sheet (default: true) */
  modal?: boolean
  /** Show the drag handle bar (default: true) */
  handle?: boolean
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DISMISS_THRESHOLD_VH = 0.12 // drag past 12 vh below the lowest snap → dismiss
const VELOCITY_DISMISS = 800 // px/s downward → instant dismiss
const SPRING_DURATION = 320 // ms – animation duration for snapping

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Return the closest snap point index to a given fractional height. */
function closestSnap(snapPoints: number[], fraction: number): number {
  let minDist = Infinity
  let idx = 0
  for (let i = 0; i < snapPoints.length; i++) {
    const d = Math.abs(snapPoints[i] - fraction)
    if (d < minDist) {
      minDist = d
      idx = i
    }
  }
  return idx
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onClose,
      children,
      snapPoints = [0.4, 0.85],
      defaultSnap = 0,
      header,
      dismissible = true,
      modal = true,
      handle = true,
      className,
    },
    ref
  ) => {
    // ---- state ----------------------------------------------------- //
    const [mounted, setMounted] = useState(false)
    const [snapIdx, setSnapIdx] = useState(defaultSnap)
    const animatingRef = useRef(false)

    // Drag tracking (stored in refs because we need them during pointer events)
    const dragging = useRef(false)
    const startY = useRef(0)
    const startFraction = useRef(0)
    const currentFraction = useRef(snapPoints[defaultSnap])
    const lastTimestamp = useRef(0)
    const lastClientY = useRef(0)
    const velocity = useRef(0)

    const sheetRef = useRef<HTMLDivElement>(null)

    // ---- lifecycle -------------------------------------------------- //

    // Mount / unmount
    useEffect(() => {
      if (open) {
        setMounted(true)
        setSnapIdx(defaultSnap)
        currentFraction.current = snapPoints[defaultSnap]
      }
    }, [open, defaultSnap, snapPoints])

    // Body scroll lock + Escape key
    useEffect(() => {
      if (!open) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && dismissible) onClose()
      }

      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }, [open, onClose, dismissible])

    // Animate out, then unmount
    const handleClose = useCallback(() => {
      // Animate to 0 (off-screen)
      animatingRef.current = true
      currentFraction.current = 0
      applyTransform(0, true)
      const timer = setTimeout(() => {
        animatingRef.current = false
        setMounted(false)
        onClose()
      }, SPRING_DURATION)
      return () => clearTimeout(timer)
    }, [onClose])

    // Animate in when mounted
    useEffect(() => {
      if (!mounted || !sheetRef.current) return
      // Start from off-screen, animate to target snap
      const target = snapPoints[snapIdx]
      requestAnimationFrame(() => {
        applyTransform(0, false)
        requestAnimationFrame(() => {
          applyTransform(target, true)
          currentFraction.current = target
        })
      })
    }, [mounted]) // intentionally run only when mounted changes

    // ---- transform helpers ----------------------------------------- //

    /** Apply translateY to the sheet element. fraction is 0-1 of viewport height. */
    function applyTransform(fraction: number, animate: boolean) {
      const el = sheetRef.current
      if (!el) return
      const translateY = (1 - fraction) * 100 // % from bottom
      el.style.transition = animate
        ? `transform ${SPRING_DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`
        : 'none'
      el.style.transform = `translateY(${translateY}%)`
    }

    // ---- drag handlers ---------------------------------------------- //

    const onPointerDown = useCallback(
      (e: ReactPointerEvent) => {
        // Only primary pointer
        if (e.button !== 0) return
        dragging.current = true
        startY.current = e.clientY
        startFraction.current = currentFraction.current
        lastTimestamp.current = e.timeStamp
        lastClientY.current = e.clientY
        velocity.current = 0

        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      },
      []
    )

    const onPointerMove = useCallback(
      (e: ReactPointerEvent) => {
        if (!dragging.current) return

        const deltaY = startY.current - e.clientY
        const vh = window.innerHeight
        const deltaFraction = deltaY / vh
        let newFraction = startFraction.current + deltaFraction

        // Clamp between 0 and max snap, with rubber-band over max
        const maxSnap = snapPoints[snapPoints.length - 1]
        if (newFraction > maxSnap) {
          const over = newFraction - maxSnap
          newFraction = maxSnap + over * 0.2 // rubber band
        }
        if (newFraction < 0) {
          newFraction = newFraction * 0.2 // rubber band below
        }

        currentFraction.current = newFraction
        applyTransform(newFraction, false)

        // Compute velocity (px/s)
        const dt = e.timeStamp - lastTimestamp.current
        if (dt > 0) {
          velocity.current = (e.clientY - lastClientY.current) / (dt / 1000)
        }
        lastTimestamp.current = e.timeStamp
        lastClientY.current = e.clientY
      },
      [snapPoints]
    )

    const onPointerUp = useCallback(
      () => {
        if (!dragging.current) return
        dragging.current = false

        const v = velocity.current // positive = downward
        const frac = currentFraction.current
        const lowestSnap = snapPoints[0]

        // Fast swipe down → dismiss
        if (dismissible && v > VELOCITY_DISMISS) {
          handleClose()
          return
        }

        // Dragged past dismiss threshold below lowest snap
        if (dismissible && frac < lowestSnap - DISMISS_THRESHOLD_VH) {
          handleClose()
          return
        }

        // Snap to nearest
        const targetIdx = closestSnap(snapPoints, frac)
        setSnapIdx(targetIdx)
        currentFraction.current = snapPoints[targetIdx]
        applyTransform(snapPoints[targetIdx], true)
      },
      [snapPoints, dismissible, handleClose]
    )

    // ---- render ------------------------------------------------------ //

    if (!mounted) return null

    return createPortal(
      <>
        {/* Backdrop */}
        {modal && (
          <div
            onClick={dismissible ? handleClose : undefined}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 'var(--z-overlay)' as unknown as number,
              background: 'var(--bg-scrim)',
              backdropFilter: 'blur(4px)',
              animation: `fade-in 0.2s ease-out forwards`,
              cursor: dismissible ? 'pointer' : 'default',
            }}
          />
        )}

        {/* Sheet */}
        <div
          ref={(node) => {
            (sheetRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          }}
          role="dialog"
          aria-modal={modal}
          className={cn(className)}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            height: '100dvh',
            zIndex: 'var(--z-modal)' as unknown as number,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pointerEvents: 'none',
            transform: 'translateY(100%)',
          }}
        >
          <div
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: `${(snapPoints[snapPoints.length - 1]) * 100}%`,
              height: '100%',
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border-subtle)',
              borderRadius: '12px 12px 0 0',
              overflow: 'hidden',
              willChange: 'transform',
            }}
          >
            {/* Handle area — the drag target */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                flexShrink: 0,
                touchAction: 'none',
                cursor: 'grab',
                userSelect: 'none',
                paddingTop: handle ? 12 : 0,
                paddingBottom: handle ? 8 : 0,
              }}
            >
              {handle && (
                <div
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--p-white-25)',
                    margin: '0 auto',
                  }}
                />
              )}
            </div>

            {/* Header */}
            {header && (
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{
                  flexShrink: 0,
                  touchAction: 'none',
                  cursor: 'grab',
                  userSelect: 'none',
                  padding: '0 var(--space-lg) var(--space-md)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {header}
              </div>
            )}

            {/* Content — scrollable */}
            <div
              className="scroll-area"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--space-lg)',
                overscrollBehavior: 'contain',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  }
)

BottomSheet.displayName = 'BottomSheet'

/* ------------------------------------------------------------------ */
/*  Sub-components for consistent layout                               */
/* ------------------------------------------------------------------ */

export function BottomSheetHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(className)}
      style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        color: 'var(--text-primary)',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

BottomSheetHeader.displayName = 'BottomSheetHeader'

export function BottomSheetBody({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

BottomSheetBody.displayName = 'BottomSheetBody'
