
import { useState, useRef, useCallback, useEffect } from 'react'
import { DemoCard, type DemoProps } from './DemoCard'

// ─────────────────────────────────────────────
// #23 Tinder Swipe
// ─────────────────────────────────────────────
const CARD_COLORS = [
  'rgba(255, 69, 58, 0.15)',
  'rgba(48, 209, 88, 0.15)',
  'rgba(100, 210, 255, 0.15)',
  'rgba(255, 214, 10, 0.15)',
  'rgba(191, 90, 242, 0.15)',
]

const CARD_BORDERS = [
  'rgba(255, 69, 58, 0.3)',
  'rgba(48, 209, 88, 0.3)',
  'rgba(100, 210, 255, 0.3)',
  'rgba(255, 214, 10, 0.3)',
  'rgba(191, 90, 242, 0.3)',
]

function TinderSwipeDemo({ onChange }: DemoProps) {
  const [cardIndex, setCardIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [flyOff, setFlyOff] = useState<'left' | 'right' | null>(null)
  const draggingRef = useRef(false)
  const startXRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const W = 240
  const H = 160
  const CARD_W = 140
  const CARD_H = 100
  const THRESHOLD = 80

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (flyOff) return
    e.preventDefault()
    draggingRef.current = true
    setIsDragging(true)
    startXRef.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [flyOff])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return
      const dx = e.clientX - startXRef.current
      setDragX(dx)
      const normalizedX = Math.max(0, Math.min(1, 0.5 + dx / (THRESHOLD * 2)))
      const rotation = Math.abs(dx / THRESHOLD)
      onChange({ valueA: normalizedX, valueB: Math.min(1, rotation) })
    },
    [onChange],
  )

  const handlePointerUp = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setIsDragging(false)

    if (Math.abs(dragX) > THRESHOLD) {
      const direction = dragX > 0 ? 'right' : 'left'
      setFlyOff(direction)
      setTimeout(() => {
        setFlyOff(null)
        setDragX(0)
        setCardIndex((prev) => prev + 1)
        onChange({ valueA: 0.5, valueB: 0 })
      }, 300)
    } else {
      setDragX(0)
      onChange({ valueA: 0.5, valueB: 0 })
    }
  }, [dragX, onChange])

  const getCardStyle = (offset: number): React.CSSProperties => {
    const colorIdx = (cardIndex + offset) % CARD_COLORS.length
    const scale = 1 - offset * 0.06
    const translateY = offset * 6

    if (offset === 0) {
      const rotation = (dragX / THRESHOLD) * 12
      const translateX = flyOff === 'left' ? -400 : flyOff === 'right' ? 400 : dragX

      return {
        position: 'absolute',
        width: CARD_W,
        height: CARD_H,
        borderRadius: 10,
        background: CARD_COLORS[colorIdx],
        border: `1px solid ${CARD_BORDERS[colorIdx]}`,
        transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        zIndex: 10 - offset,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }

    return {
      position: 'absolute',
      width: CARD_W,
      height: CARD_H,
      borderRadius: 10,
      background: CARD_COLORS[colorIdx],
      border: `1px solid ${CARD_BORDERS[colorIdx]}`,
      transform: `translateY(${translateY}px) scale(${scale})`,
      transition: 'transform 0.3s ease',
      pointerEvents: 'none',
      zIndex: 10 - offset,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: W,
        height: H,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Render cards bottom to top */}
      {[2, 1, 0].map((offset) => (
        <div
          key={`${cardIndex + offset}`}
          style={getCardStyle(offset)}
          {...(offset === 0
            ? {
                onPointerDown: handlePointerDown,
                onPointerMove: handlePointerMove,
                onPointerUp: handlePointerUp,
              }
            : {})}
        >
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          >
            #{(cardIndex + offset) % CARD_COLORS.length + 1}
          </span>
        </div>
      ))}

      {/* Direction hints */}
      <span
        style={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 16,
          color: 'var(--text-muted)',
          opacity: dragX < -20 ? Math.min(1, Math.abs(dragX) / THRESHOLD) : 0.15,
          pointerEvents: 'none',
          transition: 'opacity 0.1s',
        }}
      >
        ←
      </span>
      <span
        style={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 16,
          color: 'var(--text-muted)',
          opacity: dragX > 20 ? Math.min(1, dragX / THRESHOLD) : 0.15,
          pointerEvents: 'none',
          transition: 'opacity 0.1s',
        }}
      >
        →
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// #24 2D Card Swipe
// ─────────────────────────────────────────────
function CardSwipe2DDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const draggingRef = useRef(false)
  const startRef = useRef({ x: 0, y: 0 })

  const W = 240
  const H = 160
  const CARD_W = 120
  const CARD_H = 80
  const MAX_DISP = 60

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    draggingRef.current = true
    setIsDragging(true)
    startRef.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return
      const dx = Math.max(-MAX_DISP, Math.min(MAX_DISP, e.clientX - startRef.current.x))
      const dy = Math.max(-MAX_DISP, Math.min(MAX_DISP, e.clientY - startRef.current.y))
      setPos({ x: dx, y: dy })
      onChange({
        valueA: 0.5 + dx / (2 * MAX_DISP),
        valueB: 0.5 + dy / (2 * MAX_DISP),
      })
    },
    [onChange],
  )

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false
    setIsDragging(false)
    setPos({ x: 0, y: 0 })
    onChange({ valueA: 0.5, valueB: 0.5 })
  }, [onChange])

  const arrowOpacity = (threshold: number, value: number) =>
    Math.abs(value) > threshold ? Math.min(0.6, (Math.abs(value) - threshold) / (MAX_DISP - threshold)) : 0.1

  return (
    <div
      ref={containerRef}
      style={{
        width: W,
        height: H,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Directional arrows */}
      <span
        style={{
          position: 'absolute',
          left: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 14,
          color: 'var(--text-muted)',
          opacity: arrowOpacity(10, pos.x < 0 ? pos.x : 0),
          pointerEvents: 'none',
        }}
      >
        ←
      </span>
      <span
        style={{
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 14,
          color: 'var(--text-muted)',
          opacity: arrowOpacity(10, pos.x > 0 ? pos.x : 0),
          pointerEvents: 'none',
        }}
      >
        →
      </span>
      <span
        style={{
          position: 'absolute',
          top: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 14,
          color: 'var(--text-muted)',
          opacity: arrowOpacity(10, pos.y < 0 ? pos.y : 0),
          pointerEvents: 'none',
        }}
      >
        ↑
      </span>
      <span
        style={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 14,
          color: 'var(--text-muted)',
          opacity: arrowOpacity(10, pos.y > 0 ? pos.y : 0),
          pointerEvents: 'none',
        }}
      >
        ↓
      </span>

      {/* Card */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: 10,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: isDragging
            ? 'none'
            : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" style={{ opacity: 0.2 }}>
          <circle cx="16" cy="16" r="3" fill="white" />
          <circle cx="16" cy="16" r="10" stroke="white" strokeWidth={0.5} fill="none" />
          <line x1="16" y1="2" x2="16" y2="30" stroke="white" strokeWidth={0.3} />
          <line x1="2" y1="16" x2="30" y2="16" stroke="white" strokeWidth={0.3} />
        </svg>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// #25 Sync Carousel
// ─────────────────────────────────────────────
const SWATCH_COLORS = [
  '#FF453A', '#FF9F0A', '#FFD60A', '#30D158',
  '#64D2FF', '#0A84FF', '#BF5AF2', '#FF375F',
]

const SWATCH_PATTERNS = [
  'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 6px)',
  'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 5px)',
  'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
  'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 5px)',
  'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.12) 3px, rgba(255,255,255,0.12) 6px)',
  'repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, transparent 0% 50%)',
  'linear-gradient(135deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%)',
  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 2px, transparent 2px)',
]

function SyncCarouselDemo({ onChange }: DemoProps) {
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const STRIP_W = 240
  const SWATCH_SIZE = 48
  const GAP = 6

  const handleScroll = useCallback(
    (strip: 'top' | 'bottom') => () => {
      const topEl = topRef.current
      const bottomEl = bottomRef.current
      if (!topEl || !bottomEl) return

      const getScrollRatio = (el: HTMLDivElement) => {
        const maxScroll = el.scrollWidth - el.clientWidth
        return maxScroll > 0 ? el.scrollLeft / maxScroll : 0
      }

      const topRatio = getScrollRatio(topEl)
      const bottomRatio = getScrollRatio(bottomEl)

      onChange({
        valueA: strip === 'top' ? topRatio : topRatio,
        valueB: strip === 'bottom' ? bottomRatio : bottomRatio,
      })
    },
    [onChange],
  )

  useEffect(() => {
    const topEl = topRef.current
    const bottomEl = bottomRef.current
    if (!topEl || !bottomEl) return

    const topHandler = handleScroll('top')
    const bottomHandler = handleScroll('bottom')

    topEl.addEventListener('scroll', topHandler, { passive: true })
    bottomEl.addEventListener('scroll', bottomHandler, { passive: true })

    return () => {
      topEl.removeEventListener('scroll', topHandler)
      bottomEl.removeEventListener('scroll', bottomHandler)
    }
  }, [handleScroll])

  const renderStrip = (
    ref: React.RefObject<HTMLDivElement | null>,
    items: { bg: string; label: string }[],
  ) => (
    <div
      ref={ref}
      style={{
        width: STRIP_W,
        overflowX: 'auto',
        overflowY: 'hidden',
        display: 'flex',
        gap: GAP,
        padding: '4px 0',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            width: SWATCH_SIZE,
            height: SWATCH_SIZE,
            borderRadius: 8,
            background: item.bg,
            border: '1px solid var(--border-subtle)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              opacity: 0.6,
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )

  const colorItems = SWATCH_COLORS.map((c, i) => ({
    bg: c,
    label: `C${i + 1}`,
  }))

  // Build pattern items with both background-image and background-color
  const patternItemsRendered = SWATCH_PATTERNS.map((p, i) => ({
    bg: p,
    bgColor: 'var(--bg-surface)',
    label: `P${i + 1}`,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Top: Color swatches */}
      <div>
        <span
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            opacity: 0.5,
            marginBottom: 2,
            display: 'block',
          }}
        >
          colors
        </span>
        {renderStrip(topRef, colorItems)}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-subtle)' }} />

      {/* Bottom: Pattern swatches */}
      <div>
        <span
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            opacity: 0.5,
            marginBottom: 2,
            display: 'block',
          }}
        >
          patterns
        </span>
        <div
          ref={bottomRef}
          style={{
            width: STRIP_W,
            overflowX: 'auto',
            overflowY: 'hidden',
            display: 'flex',
            gap: GAP,
            padding: '4px 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {patternItemsRendered.map((item, i) => (
            <div
              key={i}
              style={{
                width: SWATCH_SIZE,
                height: SWATCH_SIZE,
                borderRadius: 8,
                background: item.bg,
                backgroundColor: item.bgColor,
                backgroundSize: i === 2 || i === 7 ? '8px 8px' : i === 5 ? '10px 10px' : i === 6 ? '10px 10px' : undefined,
                border: '1px solid var(--border-subtle)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  opacity: 0.6,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// #26 Split Screen
// ─────────────────────────────────────────────
function SplitScreenDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dividerPos, setDividerPos] = useState(0.5)
  const [isDraggingDivider, setIsDraggingDivider] = useState(false)
  const draggingDividerRef = useRef(false)

  const W = 240
  const H = 160

  const handleDividerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    draggingDividerRef.current = true
    setIsDraggingDivider(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handleDividerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingDividerRef.current) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width))
      setDividerPos(x)
      onChange({ valueA: x, valueB: 0.5 })
    },
    [onChange],
  )

  const handleDividerUp = useCallback(() => {
    draggingDividerRef.current = false
    setIsDraggingDivider(false)
  }, [])

  const handlePanelClick = useCallback(
    (e: React.MouseEvent) => {
      if (draggingDividerRef.current) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const y = (e.clientY - rect.top) / rect.height
      onChange({ valueA: dividerPos, valueB: Math.max(0, Math.min(1, y)) })
    },
    [dividerPos, onChange],
  )

  const leftW = dividerPos * W
  const rightW = W - leftW

  return (
    <div
      ref={containerRef}
      onClick={handlePanelClick}
      style={{
        width: W,
        height: H,
        position: 'relative',
        display: 'flex',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: leftW,
          height: H,
          background: 'linear-gradient(180deg, rgba(100, 210, 255, 0.12) 0%, rgba(10, 132, 255, 0.12) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {leftW > 40 && (
          <span
            style={{
              fontSize: 9,
              color: 'var(--text-muted)',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          >
            L
          </span>
        )}
      </div>

      {/* Divider */}
      <div
        onPointerDown={handleDividerDown}
        onPointerMove={handleDividerMove}
        onPointerUp={handleDividerUp}
        style={{
          width: 12,
          marginLeft: -6,
          marginRight: -6,
          height: H,
          position: 'relative',
          zIndex: 10,
          cursor: isDraggingDivider ? 'grabbing' : 'col-resize',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Visible divider line */}
        <div
          style={{
            width: 2,
            height: '100%',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: 1,
          }}
        />
        {/* Grab handle */}
        <div
          style={{
            position: 'absolute',
            width: 16,
            height: 32,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 1,
                borderRadius: 0.5,
                background: 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          height: H,
          background: 'linear-gradient(180deg, rgba(191, 90, 242, 0.12) 0%, rgba(255, 55, 95, 0.12) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {rightW > 40 && (
          <span
            style={{
              fontSize: 9,
              color: 'var(--text-muted)',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          >
            R
          </span>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────
export function CardDemos() {
  return (
    <>
      <DemoCard number={23} title="Tinder Swipe">
        {(props) => <TinderSwipeDemo {...props} />}
      </DemoCard>
      <DemoCard number={24} title="2D Card Swipe">
        {(props) => <CardSwipe2DDemo {...props} />}
      </DemoCard>
      <DemoCard number={25} title="Sync Carousel">
        {(props) => <SyncCarouselDemo {...props} />}
      </DemoCard>
      <DemoCard number={26} title="Split Screen">
        {(props) => <SplitScreenDemo {...props} />}
      </DemoCard>
    </>
  )
}
