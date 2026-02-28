
import { useState, useRef, useCallback } from 'react'
import { DemoCard, type DemoProps } from './DemoCard'

// ─── Shared drag helpers ────────────────────────────────────────
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

// ─── #11 Dual Fader ─────────────────────────────────────────────
function DualFaderDemo({ onChange }: DemoProps) {
  const trackHeight = 180
  const thumbW = 12
  const thumbH = 28
  const trackW = 4
  const [valueA, setValueA] = useState(0.5)
  const [valueB, setValueB] = useState(0.5)
  const [draggingFader, setDraggingFader] = useState<'A' | 'B' | null>(null)
  const leftTrackRef = useRef<HTMLDivElement>(null)
  const rightTrackRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = useCallback(
    (fader: 'A' | 'B', e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setDraggingFader(fader)
    },
    []
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingFader) return
      const trackRef = draggingFader === 'A' ? leftTrackRef : rightTrackRef
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return
      // Top = 1, bottom = 0 (fader goes up)
      const ratio = 1 - clamp((e.clientY - rect.top) / rect.height, 0, 1)
      if (draggingFader === 'A') {
        setValueA(ratio)
        onChange({ valueA: ratio, valueB })
      } else {
        setValueB(ratio)
        onChange({ valueA, valueB: ratio })
      }
    },
    [draggingFader, valueA, valueB, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setDraggingFader(null)
  }, [])

  const renderFader = (
    label: string,
    value: number,
    fader: 'A' | 'B',
    trackRef: React.RefObject<HTMLDivElement | null>
  ) => {
    const thumbY = (1 - value) * (trackHeight - thumbH)
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {label}
        </span>
        <div
          ref={trackRef}
          style={{
            position: 'relative',
            width: 32,
            height: trackHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Track groove */}
          <div
            style={{
              width: trackW,
              height: '100%',
              borderRadius: trackW / 2,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              position: 'absolute',
            }}
          />
          {/* Filled portion */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: trackW,
              height: `${value * 100}%`,
              borderRadius: trackW / 2,
              background: 'var(--accent)',
              opacity: 0.5,
            }}
          />
          {/* Thumb */}
          <div
            onPointerDown={(e) => handlePointerDown(fader, e)}
            style={{
              position: 'absolute',
              top: thumbY,
              width: thumbW,
              height: thumbH,
              borderRadius: 4,
              background: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              cursor: draggingFader === fader ? 'grabbing' : 'grab',
              touchAction: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              transition: draggingFader === fader ? 'none' : 'top 0.05s ease',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        display: 'flex',
        gap: 40,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {renderFader('A', valueA, 'A', leftTrackRef)}
      {renderFader('B', valueB, 'B', rightTrackRef)}
    </div>
  )
}

// ─── #12 Dual Handle ────────────────────────────────────────────
function DualHandleDemo({ onChange }: DemoProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [valueA, setValueA] = useState(0.3)
  const [valueB, setValueB] = useState(0.7)
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null)

  const getValueFromX = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return 0
      return clamp((clientX - rect.left) / rect.width, 0, 1)
    },
    []
  )

  const handlePointerDown = useCallback(
    (handle: 'A' | 'B', e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setDragging(handle)
    },
    []
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      const v = getValueFromX(e.clientX)
      if (dragging === 'A') {
        setValueA(v)
        onChange({ valueA: v, valueB })
      } else {
        setValueB(v)
        onChange({ valueA, valueB: v })
      }
    },
    [dragging, valueA, valueB, onChange, getValueFromX]
  )

  const handlePointerUp = useCallback(() => {
    setDragging(null)
  }, [])

  const minVal = Math.min(valueA, valueB)
  const maxVal = Math.max(valueA, valueB)

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: '100%',
        padding: '0 8px',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          width: '100%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Track background */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: 4,
            borderRadius: 2,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        />
        {/* Colored range between handles */}
        <div
          style={{
            position: 'absolute',
            left: `${minVal * 100}%`,
            width: `${(maxVal - minVal) * 100}%`,
            height: 4,
            borderRadius: 2,
            background: 'var(--accent)',
            opacity: 0.6,
          }}
        />
        {/* Handle A */}
        <div
          onPointerDown={(e) => handlePointerDown('A', e)}
          style={{
            position: 'absolute',
            left: `${valueA * 100}%`,
            transform: 'translateX(-50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--accent)',
            border: '2px solid var(--text-primary)',
            cursor: dragging === 'A' ? 'grabbing' : 'grab',
            touchAction: 'none',
            zIndex: dragging === 'A' ? 2 : 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: dragging === 'A' ? 'none' : 'left 0.05s ease',
          }}
        />
        {/* Handle B */}
        <div
          onPointerDown={(e) => handlePointerDown('B', e)}
          style={{
            position: 'absolute',
            left: `${valueB * 100}%`,
            transform: 'translateX(-50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--accent-light)',
            border: '2px solid var(--text-primary)',
            cursor: dragging === 'B' ? 'grabbing' : 'grab',
            touchAction: 'none',
            zIndex: dragging === 'B' ? 2 : 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: dragging === 'B' ? 'none' : 'left 0.05s ease',
          }}
        />
      </div>
      {/* Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          A
        </span>
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          B
        </span>
      </div>
    </div>
  )
}

// ─── #13 Morph Scrubber ─────────────────────────────────────────
function MorphScrubberDemo({ onChange }: DemoProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(0.5)
  const [isDragging, setIsDragging] = useState(false)

  // Preset colors
  const hueA = 200
  const hueB = 30

  const currentHue = hueA + (hueB - hueA) * position
  const valueA = position
  const valueB = 1 - position

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setIsDragging(true)
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return
      const v = clamp((e.clientX - rect.left) / rect.width, 0, 1)
      setPosition(v)
      onChange({ valueA: v, valueB: 1 - v })
    },
    [onChange]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return
      const v = clamp((e.clientX - rect.left) / rect.width, 0, 1)
      setPosition(v)
      onChange({ valueA: v, valueB: 1 - v })
    },
    [isDragging, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        padding: '0 8px',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Color preview */}
      <div
        style={{
          width: '100%',
          height: 32,
          borderRadius: 8,
          background: `linear-gradient(to right, hsl(${hueA}, 70%, 55%), hsl(${hueB}, 70%, 55%))`,
          marginBottom: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Current color indicator */}
        <div
          style={{
            position: 'absolute',
            left: `${position * 100}%`,
            top: 0,
            bottom: 0,
            width: 3,
            background: '#fff',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 6px rgba(0,0,0,0.5)',
            transition: isDragging ? 'none' : 'left 0.05s ease',
          }}
        />
      </div>
      {/* Slider track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'relative',
          width: '100%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          cursor: isDragging ? 'grabbing' : 'pointer',
        }}
      >
        {/* Track */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(to right, hsl(${hueA}, 70%, 35%), hsl(${hueB}, 70%, 35%))`,
            border: '1px solid var(--border-subtle)',
          }}
        />
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `${position * 100}%`,
            transform: 'translateX(-50%)',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: `hsl(${currentHue}, 70%, 55%)`,
            border: '2px solid var(--text-primary)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            transition: isDragging ? 'none' : 'left 0.05s ease',
          }}
        />
      </div>
      {/* Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 2,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: `hsl(${hueA}, 70%, 55%)`,
            fontFamily: 'var(--font-mono)',
          }}
        >
          Color A
        </span>
        <span
          style={{
            fontSize: 10,
            color: `hsl(${hueB}, 70%, 55%)`,
            fontFamily: 'var(--font-mono)',
          }}
        >
          Color B
        </span>
      </div>
    </div>
  )
}

// ─── #14 Semantic Slider ────────────────────────────────────────
function SemanticSliderDemo({ onChange }: DemoProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [valueA, setValueA] = useState(0.5) // X: Cool-Warm
  const [valueB, setValueB] = useState(0.5) // Y: Subtle-Bold
  const [isDraggingX, setIsDraggingX] = useState(false)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
      const y = clamp((e.clientY - rect.top) / rect.height, 0, 1)
      setValueA(x)
      setValueB(y)
      setIsDraggingX(true)
      onChange({ valueA: x, valueB: y })
    },
    [onChange]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingX) return
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
      const y = clamp((e.clientY - rect.top) / rect.height, 0, 1)
      setValueA(x)
      setValueB(y)
      onChange({ valueA: x, valueB: y })
    },
    [isDraggingX, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setIsDraggingX(false)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        padding: '0 8px',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Top label */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Subtle
        </span>
      </div>
      {/* 2D area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Left label */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            writingMode: 'vertical-lr',
            textTransform: 'uppercase',
            letterSpacing: 1,
            transform: 'rotate(180deg)',
          }}
        >
          Cool
        </span>
        {/* Track area */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            flex: 1,
            height: 120,
            borderRadius: 8,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
            cursor: isDraggingX ? 'grabbing' : 'crosshair',
            overflow: 'hidden',
          }}
        >
          {/* Gradient hint */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, hsl(210, 50%, 30%), hsl(20, 50%, 30%))',
              opacity: 0.3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.15))',
            }}
          />
          {/* Crosshair lines */}
          <div
            style={{
              position: 'absolute',
              left: `${valueA * 100}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'var(--accent)',
              opacity: 0.3,
              transition: isDraggingX ? 'none' : 'left 0.05s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: `${valueB * 100}%`,
              left: 0,
              right: 0,
              height: 1,
              background: 'var(--accent)',
              opacity: 0.3,
              transition: isDraggingX ? 'none' : 'top 0.05s ease',
            }}
          />
          {/* Pointer dot */}
          <div
            style={{
              position: 'absolute',
              left: `${valueA * 100}%`,
              top: `${valueB * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: 'var(--accent)',
              border: '2px solid var(--text-primary)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              transition: isDraggingX ? 'none' : 'left 0.05s ease, top 0.05s ease',
            }}
          />
        </div>
        {/* Right label */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            writingMode: 'vertical-lr',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Warm
        </span>
      </div>
      {/* Bottom label */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 6,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Bold
        </span>
      </div>
    </div>
  )
}

// ─── #15 Tape Strip ─────────────────────────────────────────────
function TapeStripDemo({ onChange }: DemoProps) {
  const laneCount = 5
  const containerRef = useRef<HTMLDivElement>(null)
  const [playheadX, setPlayheadX] = useState(0.5)
  const [selectedLane, setSelectedLane] = useState(2)
  const [isDragging, setIsDragging] = useState(false)

  const laneColors = [
    'hsl(200, 40%, 30%)',
    'hsl(160, 40%, 28%)',
    'hsl(280, 35%, 30%)',
    'hsl(30, 45%, 28%)',
    'hsl(350, 40%, 30%)',
  ]

  const lanePatterns = [
    'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.03) 12px, rgba(255,255,255,0.03) 13px)',
    'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.04) 8px, rgba(255,255,255,0.04) 10px)',
    'repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(255,255,255,0.03) 16px, rgba(255,255,255,0.03) 17px)',
    'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.05) 6px, rgba(255,255,255,0.05) 7px)',
    'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)',
  ]

  const handlePlayheadDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setIsDragging(true)
    },
    []
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
      setPlayheadX(x)
      onChange({ valueA: x, valueB: selectedLane / (laneCount - 1) })
    },
    [isDragging, selectedLane, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleLaneClick = useCallback(
    (index: number) => {
      setSelectedLane(index)
      onChange({ valueA: playheadX, valueB: index / (laneCount - 1) })
    },
    [playheadX, onChange]
  )

  const laneHeight = 28

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: '100%',
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Lanes */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: laneCount }, (_, i) => (
          <div
            key={i}
            onClick={() => handleLaneClick(i)}
            style={{
              height: laneHeight,
              background: laneColors[i],
              backgroundImage: lanePatterns[i],
              cursor: 'pointer',
              position: 'relative',
              transition: 'opacity 0.15s ease',
              opacity: selectedLane === i ? 1 : 0.5,
              outline:
                selectedLane === i
                  ? '1px solid var(--accent-border)'
                  : 'none',
              outlineOffset: -1,
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 9,
                fontFamily: 'var(--font-mono)',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 500,
              }}
            >
              {i + 1}
            </span>
          </div>
        ))}
      </div>
      {/* Playhead */}
      <div
        onPointerDown={handlePlayheadDown}
        style={{
          position: 'absolute',
          left: `${playheadX * 100}%`,
          top: 0,
          bottom: 0,
          width: 2,
          background: 'var(--accent)',
          transform: 'translateX(-50%)',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 2,
          transition: isDragging ? 'none' : 'left 0.05s ease',
        }}
      >
        {/* Playhead top triangle */}
        <div
          style={{
            position: 'absolute',
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid var(--accent)',
          }}
        />
      </div>
    </div>
  )
}

// ─── #16 Parallel Coordinates ───────────────────────────────────
function ParallelCoordinatesDemo({ onChange }: DemoProps) {
  const axisHeight = 160
  const handleRadius = 8
  const axisSpacing = 120
  const padding = 24
  const [valueA, setValueA] = useState(0.5)
  const [valueB, setValueB] = useState(0.5)
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const handlePointerDown = useCallback(
    (axis: 'A' | 'B', e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as Element).setPointerCapture(e.pointerId)
      setDragging(axis)
    },
    []
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      // Map clientY to 0-1 within the axis range (padding to padding+axisHeight)
      const svgY = e.clientY - rect.top
      const ratio = clamp((svgY - padding) / axisHeight, 0, 1)
      if (dragging === 'A') {
        setValueA(ratio)
        onChange({ valueA: ratio, valueB })
      } else {
        setValueB(ratio)
        onChange({ valueA, valueB: ratio })
      }
    },
    [dragging, valueA, valueB, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setDragging(null)
  }, [])

  const leftY = valueA * axisHeight
  const rightY = valueB * axisHeight
  const svgW = axisSpacing + padding * 2
  const svgH = axisHeight + 40

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <svg
        ref={svgRef}
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
      >
        {/* Axis labels */}
        <text
          x={padding}
          y={14}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize={10}
          fontWeight={600}
          fontFamily="var(--font-mono)"
        >
          Axis A
        </text>
        <text
          x={padding + axisSpacing}
          y={14}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize={10}
          fontWeight={600}
          fontFamily="var(--font-mono)"
        >
          Axis B
        </text>

        {/* Left axis line */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={padding + axisHeight}
          stroke="var(--border-default)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Right axis line */}
        <line
          x1={padding + axisSpacing}
          y1={padding}
          x2={padding + axisSpacing}
          y2={padding + axisHeight}
          stroke="var(--border-default)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Tick marks - left */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={`lt-${t}`}
            x1={padding - 6}
            y1={padding + t * axisHeight}
            x2={padding + 6}
            y2={padding + t * axisHeight}
            stroke="var(--border-subtle)"
            strokeWidth={1}
          />
        ))}
        {/* Tick marks - right */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={`rt-${t}`}
            x1={padding + axisSpacing - 6}
            y1={padding + t * axisHeight}
            x2={padding + axisSpacing + 6}
            y2={padding + t * axisHeight}
            stroke="var(--border-subtle)"
            strokeWidth={1}
          />
        ))}

        {/* Connection line */}
        <line
          x1={padding}
          y1={padding + leftY}
          x2={padding + axisSpacing}
          y2={padding + rightY}
          stroke="var(--accent)"
          strokeWidth={2}
          opacity={0.6}
        />

        {/* Left handle */}
        <circle
          cx={padding}
          cy={padding + leftY}
          r={handleRadius}
          fill="var(--accent)"
          stroke="var(--text-primary)"
          strokeWidth={2}
          style={{
            cursor: dragging === 'A' ? 'grabbing' : 'grab',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
          onPointerDown={(e) =>
            handlePointerDown('A', e as unknown as React.PointerEvent)
          }
        />

        {/* Right handle */}
        <circle
          cx={padding + axisSpacing}
          cy={padding + rightY}
          r={handleRadius}
          fill="var(--accent-light)"
          stroke="var(--text-primary)"
          strokeWidth={2}
          style={{
            cursor: dragging === 'B' ? 'grabbing' : 'grab',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
          onPointerDown={(e) =>
            handlePointerDown('B', e as unknown as React.PointerEvent)
          }
        />
      </svg>
    </div>
  )
}

// ─── Export ──────────────────────────────────────────────────────
export function SliderDemos() {
  return (
    <>
      <DemoCard number={11} title="Dual Fader">
        {(props) => <DualFaderDemo {...props} />}
      </DemoCard>
      <DemoCard number={12} title="Dual Handle">
        {(props) => <DualHandleDemo {...props} />}
      </DemoCard>
      <DemoCard number={13} title="Morph Scrubber">
        {(props) => <MorphScrubberDemo {...props} />}
      </DemoCard>
      <DemoCard number={14} title="Semantic Slider">
        {(props) => <SemanticSliderDemo {...props} />}
      </DemoCard>
      <DemoCard number={15} title="Tape Strip">
        {(props) => <TapeStripDemo {...props} />}
      </DemoCard>
      <DemoCard number={16} title="Parallel Coordinates">
        {(props) => <ParallelCoordinatesDemo {...props} />}
      </DemoCard>
    </>
  )
}
