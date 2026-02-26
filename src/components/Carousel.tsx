import {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  Children,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { cn } from '../cn'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CarouselProps {
  children: ReactNode
  /** Enable auto-play (default: false) */
  autoPlay?: boolean
  /** Auto-play interval in milliseconds (default: 5000) */
  autoPlayInterval?: number
  /** Loop from last slide back to first (default: false) */
  loop?: boolean
  /** Show dot indicators (default: true) */
  showDots?: boolean
  /** Show prev/next arrow buttons (default: true) */
  showArrows?: boolean
  /** Number of slides visible at once (default: 1) */
  slidesPerView?: number
  /** Gap between slides in pixels (default: 0) */
  gap?: number
  /** Callback when the active slide changes */
  onChange?: (index: number) => void
  /** Enable touch/mouse drag to swipe (default: true) */
  draggable?: boolean
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SWIPE_THRESHOLD = 40 // px – minimum drag to trigger slide change
const SWIPE_VELOCITY = 0.3 // px/ms
const TRANSITION_DURATION = 400 // ms

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      autoPlay = false,
      autoPlayInterval = 5000,
      loop = false,
      showDots = true,
      showArrows = true,
      slidesPerView = 1,
      gap = 0,
      onChange,
      draggable = true,
      className,
    },
    ref
  ) => {
    const slides = Children.toArray(children)
    const slideCount = slides.length
    const maxIndex = Math.max(0, slideCount - slidesPerView)

    const [current, setCurrent] = useState(0)
    const [dragOffset, setDragOffset] = useState(0)
    const [transitioning, setTransitioning] = useState(false)
    const [paused, setPaused] = useState(false)

    const trackRef = useRef<HTMLDivElement>(null)
    const draggingRef = useRef(false)
    const startXRef = useRef(0)
    const startTimeRef = useRef(0)
    const containerWidthRef = useRef(0)

    // ---- navigation ------------------------------------------------- //

    const goTo = useCallback(
      (index: number) => {
        let next = index
        if (loop) {
          if (next < 0) next = maxIndex
          else if (next > maxIndex) next = 0
        } else {
          next = Math.max(0, Math.min(next, maxIndex))
        }
        if (next === current && index === current) return
        setTransitioning(true)
        setCurrent(next)
        onChange?.(next)
        setTimeout(() => setTransitioning(false), TRANSITION_DURATION)
      },
      [current, loop, maxIndex, onChange]
    )

    const prev = useCallback(() => goTo(current - 1), [current, goTo])
    const next = useCallback(() => goTo(current + 1), [current, goTo])

    // ---- auto-play -------------------------------------------------- //

    useEffect(() => {
      if (!autoPlay || paused || slideCount <= slidesPerView) return
      const timer = setInterval(() => {
        goTo(current + 1)
      }, autoPlayInterval)
      return () => clearInterval(timer)
    }, [autoPlay, autoPlayInterval, current, goTo, paused, slideCount, slidesPerView])

    // ---- keyboard --------------------------------------------------- //

    const onKeyDown = useCallback(
      (e: ReactKeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          prev()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          next()
        }
      },
      [prev, next]
    )

    // ---- drag / swipe ----------------------------------------------- //

    const measureContainer = useCallback(() => {
      if (trackRef.current?.parentElement) {
        containerWidthRef.current = trackRef.current.parentElement.offsetWidth
      }
    }, [])

    const onPointerDown = useCallback(
      (e: ReactPointerEvent) => {
        if (!draggable || e.button !== 0) return
        draggingRef.current = true
        startXRef.current = e.clientX
        startTimeRef.current = e.timeStamp
        measureContainer()
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      },
      [draggable, measureContainer]
    )

    const onPointerMove = useCallback(
      (e: ReactPointerEvent) => {
        if (!draggingRef.current) return
        const dx = e.clientX - startXRef.current
        setDragOffset(dx)
      },
      []
    )

    const onPointerUp = useCallback(
      (e: ReactPointerEvent) => {
        if (!draggingRef.current) return
        draggingRef.current = false

        const dx = e.clientX - startXRef.current
        const dt = e.timeStamp - startTimeRef.current
        const v = Math.abs(dx) / dt // px/ms

        if (Math.abs(dx) > SWIPE_THRESHOLD || v > SWIPE_VELOCITY) {
          if (dx < 0) next()
          else prev()
        }

        setDragOffset(0)
      },
      [next, prev]
    )

    // ---- computed transform ----------------------------------------- //

    const slideWidth = `calc((100% - ${gap * (slidesPerView - 1)}px) / ${slidesPerView})`
    const translateX =
      current === 0 && slidesPerView === 1
        ? `calc(-${current * 100 / slidesPerView}% - ${current * gap}px + ${dragOffset}px)`
        : `calc(-${current * (100 / slidesPerView)}% - ${current * gap}px + ${dragOffset}px)`

    // ---- render ----------------------------------------------------- //

    const canGoPrev = loop || current > 0
    const canGoNext = loop || current < maxIndex

    return (
      <div
        ref={ref}
        className={cn(className)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: 'relative',
          width: '100%',
          outline: 'none',
        }}
        onFocus={(e) => {
          if (e.currentTarget === e.target) {
            e.currentTarget.style.outline = '2px solid var(--accent)'
            e.currentTarget.style.outlineOffset = '2px'
          }
        }}
        onBlur={(e) => {
          if (e.currentTarget === e.target) {
            e.currentTarget.style.outline = 'none'
          }
        }}
      >
        {/* Slide viewport */}
        <div
          style={{
            overflow: 'hidden',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
              display: 'flex',
              gap: gap,
              transform: translateX,
              transition:
                dragOffset !== 0
                  ? 'none'
                  : `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`,
              touchAction: 'pan-y pinch-zoom',
              cursor: draggable ? (draggingRef.current ? 'grabbing' : 'grab') : 'default',
              userSelect: 'none',
              willChange: transitioning ? 'transform' : 'auto',
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${slideCount}`}
                style={{
                  flex: `0 0 ${slideWidth}`,
                  minWidth: 0,
                }}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        {showArrows && slideCount > slidesPerView && (
          <>
            <CarouselArrow
              direction="prev"
              onClick={prev}
              disabled={!canGoPrev}
            />
            <CarouselArrow
              direction="next"
              onClick={next}
              disabled={!canGoNext}
            />
          </>
        )}

        {/* Dots */}
        {showDots && slideCount > slidesPerView && (
          <div
            role="tablist"
            aria-label="Slide indicators"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 12,
            }}
          >
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? 20 : 8,
                  height: 8,
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  background:
                    i === current
                      ? 'var(--accent, var(--text-primary))'
                      : 'var(--p-white-20)',
                  transition: `all ${TRANSITION_DURATION / 2}ms ease`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

Carousel.displayName = 'Carousel'

/* ------------------------------------------------------------------ */
/*  Arrow sub-component                                                */
/* ------------------------------------------------------------------ */

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
}) {
  const isPrev = direction === 'prev'

  return (
    <button
      aria-label={isPrev ? 'Previous slide' : 'Next slide'}
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'absolute',
        top: '50%',
        ...(isPrev ? { left: 8 } : { right: 8 }),
        transform: 'translateY(calc(-50% - 12px))',
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-elevated)',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        transition: 'all 0.15s ease',
        padding: 0,
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = 'var(--hover-bg)'
          e.currentTarget.style.borderColor = 'var(--border-default)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-elevated)'
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isPrev ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  )
}
