
import { useState, useRef, useCallback, useEffect } from 'react'
import { DemoCard, type DemoProps } from './DemoCard'

// ─── #31 Mood Tags ─────────────────────────────────────────────
const MOOD_TAGS: { label: string; valueA: number; valueB: number }[] = [
  { label: 'Calm', valueA: 0.1, valueB: 0.3 },
  { label: 'Energetic', valueA: 0.9, valueB: 0.7 },
  { label: 'Minimal', valueA: 0.2, valueB: 0.2 },
  { label: 'Playful', valueA: 0.7, valueB: 0.8 },
  { label: 'Bold', valueA: 0.95, valueB: 0.5 },
  { label: 'Subtle', valueA: 0.15, valueB: 0.4 },
  { label: 'Warm', valueA: 0.5, valueB: 0.85 },
  { label: 'Cool', valueA: 0.5, valueB: 0.15 },
  { label: 'Natural', valueA: 0.35, valueB: 0.6 },
  { label: 'Urban', valueA: 0.65, valueB: 0.35 },
  { label: 'Retro', valueA: 0.4, valueB: 0.7 },
  { label: 'Future', valueA: 0.8, valueB: 0.2 },
]

function MoodTagsDemo({ onChange }: DemoProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const handleClick = useCallback(
    (index: number) => {
      setSelected(index)
      const tag = MOOD_TAGS[index]
      onChange({ valueA: tag.valueA, valueB: tag.valueB })
    },
    [onChange]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        maxWidth: 240,
        justifyContent: 'center',
      }}
    >
      {MOOD_TAGS.map((tag, i) => {
        const isSelected = selected === i
        return (
          <button
            key={tag.label}
            onClick={() => handleClick(i)}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              border: isSelected
                ? '1px solid #fff'
                : '1px solid rgba(255,255,255,0.15)',
              background: isSelected ? '#fff' : 'transparent',
              color: isSelected ? '#000' : 'rgba(255,255,255,0.7)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
                e.currentTarget.style.color = '#fff'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }
            }}
          >
            {tag.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── #32 Semantic XY ───────────────────────────────────────────
function SemanticXYDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 })
  const [dragging, setDragging] = useState(false)

  const W = 220
  const H = 200
  const padding = 8

  const updatePos = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (clientX - rect.left - padding) / (W - padding * 2)))
      const y = Math.max(0, Math.min(1, (clientY - rect.top - padding) / (H - padding * 2)))
      setPos({ x, y })
      onChange({ valueA: x, valueB: y })
    },
    [onChange]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setDragging(true)
      updatePos(e.clientX, e.clientY)
    },
    [updatePos]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      updatePos(e.clientX, e.clientY)
    },
    [dragging, updatePos]
  )

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  const pixelX = padding + pos.x * (W - padding * 2)
  const pixelY = padding + pos.y * (H - padding * 2)

  const quadrantLabels = [
    { label: 'Warm & Calm', x: 4, y: 14, anchor: 'start' as const },
    { label: 'Warm & Bold', x: W - 4, y: 14, anchor: 'end' as const },
    { label: 'Cool & Calm', x: 4, y: H - 6, anchor: 'start' as const },
    { label: 'Cool & Bold', x: W - 4, y: H - 6, anchor: 'end' as const },
  ]

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'relative',
        width: W,
        height: H,
        touchAction: 'none',
        userSelect: 'none',
        cursor: 'crosshair',
      }}
    >
      <svg width={W} height={H}>
        {/* Grid */}
        <rect
          x={padding}
          y={padding}
          width={W - padding * 2}
          height={H - padding * 2}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          rx={4}
        />

        {/* Center cross */}
        <line
          x1={W / 2}
          y1={padding}
          x2={W / 2}
          y2={H - padding}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <line
          x1={padding}
          y1={H / 2}
          x2={W - padding}
          y2={H / 2}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />

        {/* Axis labels */}
        <text
          x={padding + 2}
          y={H / 2 - 6}
          fill="rgba(255,255,255,0.35)"
          fontSize={9}
          fontWeight={600}
        >
          Calm
        </text>
        <text
          x={W - padding - 2}
          y={H / 2 - 6}
          fill="rgba(255,255,255,0.35)"
          fontSize={9}
          fontWeight={600}
          textAnchor="end"
        >
          Bold
        </text>
        <text
          x={W / 2}
          y={padding + 14}
          fill="rgba(255,255,255,0.35)"
          fontSize={9}
          fontWeight={600}
          textAnchor="middle"
        >
          Warm
        </text>
        <text
          x={W / 2}
          y={H - padding - 4}
          fill="rgba(255,255,255,0.35)"
          fontSize={9}
          fontWeight={600}
          textAnchor="middle"
        >
          Cool
        </text>

        {/* Quadrant labels */}
        {quadrantLabels.map((q) => (
          <text
            key={q.label}
            x={q.x}
            y={q.y}
            fill="rgba(255,255,255,0.12)"
            fontSize={8}
            textAnchor={q.anchor}
          >
            {q.label}
          </text>
        ))}

        {/* Crosshair */}
        <line
          x1={pixelX}
          y1={padding}
          x2={pixelX}
          y2={H - padding}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1}
        />
        <line
          x1={padding}
          y1={pixelY}
          x2={W - padding}
          y2={pixelY}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1}
        />

        {/* Indicator dot */}
        <circle
          cx={pixelX}
          cy={pixelY}
          r={6}
          fill="rgba(255,255,255,0.9)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={2}
        />
      </svg>
    </div>
  )
}

// ─── #33 Comparison Vote ───────────────────────────────────────
function generateOption(): { hueA: number; hueB: number; valueA: number; valueB: number } {
  return {
    hueA: Math.floor(Math.random() * 360),
    hueB: Math.floor(Math.random() * 360),
    valueA: Math.random(),
    valueB: Math.random(),
  }
}

function ComparisonVoteDemo({ onChange }: DemoProps) {
  const [optionL, setOptionL] = useState(generateOption)
  const [optionR, setOptionR] = useState(generateOption)
  const [votes, setVotes] = useState(0)
  const [sumA, setSumA] = useState(0)
  const [sumB, setSumB] = useState(0)
  const maxVotes = 5

  const handleVote = useCallback(
    (option: typeof optionL) => {
      const newVotes = votes + 1
      const newSumA = sumA + option.valueA
      const newSumB = sumB + option.valueB
      setVotes(newVotes)
      setSumA(newSumA)
      setSumB(newSumB)

      onChange({
        valueA: newSumA / newVotes,
        valueB: newSumB / newVotes,
      })

      if (newVotes < maxVotes) {
        setOptionL(generateOption())
        setOptionR(generateOption())
      }
    },
    [votes, sumA, sumB, onChange]
  )

  const reset = useCallback(() => {
    setVotes(0)
    setSumA(0)
    setSumB(0)
    setOptionL(generateOption())
    setOptionR(generateOption())
    onChange({ valueA: 0.5, valueB: 0.5 })
  }, [onChange])

  const renderCard = (opt: typeof optionL, side: 'left' | 'right') => (
    <button
      onClick={() => handleVote(opt)}
      disabled={votes >= maxVotes}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: 12,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        cursor: votes >= maxVotes ? 'default' : 'pointer',
        transition: 'all 0.15s ease',
        opacity: votes >= maxVotes ? 0.4 : 1,
        flex: 1,
      }}
      onMouseEnter={(e) => {
        if (votes < maxVotes) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
          e.currentTarget.style.background = 'var(--bg-surface-hover)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.background = 'var(--bg-surface)'
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: `hsl(${opt.hueA}, 60%, 50%)`,
          }}
        />
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: `hsl(${opt.hueB}, 60%, 50%)`,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 9,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {side}
      </span>
    </button>
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        maxWidth: 240,
      }}
    >
      <div style={{ display: 'flex', gap: 10, width: '100%' }}>
        {renderCard(optionL, 'left')}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 10,
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }}
        >
          VS
        </div>
        {renderCard(optionR, 'right')}
      </div>

      {/* Vote progress */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
        }}
      >
        <div
          style={{
            flex: 1,
            height: 3,
            background: 'var(--bg-surface)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(votes / maxVotes) * 100}%`,
              height: '100%',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 2,
              transition: 'width 0.2s ease',
            }}
          />
        </div>
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            minWidth: 30,
          }}
        >
          {votes}/{maxVotes}
        </span>
      </div>

      {votes >= maxVotes && (
        <button
          onClick={reset}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 10,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
          }}
        >
          Reset
        </button>
      )}
    </div>
  )
}

// ─── #34 Chord Selector ────────────────────────────────────────
const CHORDS: { name: string; valueA: number; valueB: number }[] = [
  { name: 'Major', valueA: 0.7, valueB: 0.8 },
  { name: 'Minor', valueA: 0.3, valueB: 0.4 },
  { name: 'Dim', valueA: 0.1, valueB: 0.15 },
  { name: 'Aug', valueA: 0.85, valueB: 0.6 },
  { name: 'Sus2', valueA: 0.45, valueB: 0.65 },
  { name: 'Sus4', valueA: 0.55, valueB: 0.55 },
  { name: '7th', valueA: 0.6, valueB: 0.35 },
  { name: 'Maj7', valueA: 0.75, valueB: 0.7 },
  { name: 'Min7', valueA: 0.35, valueB: 0.3 },
  { name: 'Add9', valueA: 0.65, valueB: 0.85 },
]

function ChordSelectorDemo({ onChange }: DemoProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const handleClick = useCallback(
    (index: number) => {
      setSelected(index)
      const chord = CHORDS[index]
      onChange({ valueA: chord.valueA, valueB: chord.valueB })
    },
    [onChange]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        maxWidth: 240,
      }}
    >
      {/* Selected chord name */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: selected !== null ? '#fff' : 'rgba(255,255,255,0.2)',
          letterSpacing: -0.5,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.2s ease',
        }}
      >
        {selected !== null ? CHORDS[selected].name : '--'}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 4,
          width: '100%',
        }}
      >
        {CHORDS.map((chord, i) => {
          const isSelected = selected === i
          return (
            <button
              key={chord.name}
              onClick={() => handleClick(i)}
              style={{
                padding: '6px 2px',
                borderRadius: 6,
                border: isSelected
                  ? '1px solid var(--accent, #fff)'
                  : '1px solid var(--border-subtle)',
                background: isSelected
                  ? 'var(--accent-bg-strong, rgba(255,255,255,0.15))'
                  : 'var(--bg-surface)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                fontSize: 9,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
                  e.currentTarget.style.background = 'var(--bg-surface-hover)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.background = 'var(--bg-surface)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              {chord.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── #35 Radar Chart ───────────────────────────────────────────
const RADAR_AXES = ['Energy', 'Warmth', 'Depth', 'Clarity', 'Edge']

function RadarChartDemo({ onChange }: DemoProps) {
  const [values, setValues] = useState([0.5, 0.5, 0.5, 0.5, 0.5])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const W = 220
  const H = 200
  const cx = W / 2
  const cy = H / 2 + 5
  const maxR = 75
  const axisCount = RADAR_AXES.length

  const getPoint = useCallback(
    (index: number, value: number) => {
      const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2
      return {
        x: cx + Math.cos(angle) * maxR * value,
        y: cy + Math.sin(angle) * maxR * value,
      }
    },
    [cx, cy, maxR, axisCount]
  )

  const getAxisEnd = useCallback(
    (index: number) => {
      const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2
      return {
        x: cx + Math.cos(angle) * (maxR + 5),
        y: cy + Math.sin(angle) * (maxR + 5),
      }
    },
    [cx, cy, maxR, axisCount]
  )

  const getLabelPos = useCallback(
    (index: number) => {
      const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2
      return {
        x: cx + Math.cos(angle) * (maxR + 20),
        y: cy + Math.sin(angle) * (maxR + 20),
      }
    },
    [cx, cy, maxR, axisCount]
  )

  const updateFromMouse = useCallback(
    (clientX: number, clientY: number, index: number) => {
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const mx = clientX - rect.left - cx
      const my = clientY - rect.top - cy

      const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2
      const axisX = Math.cos(angle)
      const axisY = Math.sin(angle)

      // Project mouse onto axis
      const proj = mx * axisX + my * axisY
      const newVal = Math.max(0, Math.min(1, proj / maxR))

      const newValues = [...values]
      newValues[index] = newVal
      setValues(newValues)

      // Top half: indices 0 (Energy), 1 (Warmth), 4 (Edge)
      // Bottom half: indices 2 (Depth), 3 (Clarity)
      const topAvg = (newValues[0] + newValues[1] + newValues[4]) / 3
      const bottomAvg = (newValues[2] + newValues[3]) / 2
      onChange({ valueA: topAvg, valueB: bottomAvg })
    },
    [values, onChange, cx, cy, maxR, axisCount]
  )

  const handlePointerDown = useCallback(
    (index: number, e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as SVGElement).setPointerCapture?.(e.pointerId)
      setDraggingIndex(index)
      updateFromMouse(e.clientX, e.clientY, index)
    },
    [updateFromMouse]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingIndex === null) return
      updateFromMouse(e.clientX, e.clientY, draggingIndex)
    },
    [draggingIndex, updateFromMouse]
  )

  const handlePointerUp = useCallback(() => {
    setDraggingIndex(null)
  }, [])

  // Build polygon path
  const polygonPoints = values
    .map((v, i) => {
      const p = getPoint(i, v)
      return `${p.x},${p.y}`
    })
    .join(' ')

  return (
    <svg
      ref={svgRef}
      width={W}
      height={H}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1.0].map((ring) => (
        <polygon
          key={ring}
          points={Array.from({ length: axisCount })
            .map((_, i) => {
              const p = getPoint(i, ring)
              return `${p.x},${p.y}`
            })
            .join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {RADAR_AXES.map((_, i) => {
        const end = getAxisEnd(i)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        )
      })}

      {/* Filled polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Draggable vertices */}
      {values.map((v, i) => {
        const p = getPoint(i, v)
        const isDragging = draggingIndex === i
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={isDragging ? 7 : 5}
            fill={isDragging ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)'}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1.5}
            cursor="grab"
            onPointerDown={(e) => handlePointerDown(i, e)}
            style={{ transition: isDragging ? 'none' : 'r 0.1s ease' }}
          />
        )
      })}

      {/* Labels */}
      {RADAR_AXES.map((label, i) => {
        const lp = getLabelPos(i)
        return (
          <text
            key={label}
            x={lp.x}
            y={lp.y}
            fill="rgba(255,255,255,0.4)"
            fontSize={9}
            fontWeight={500}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}

// ─── Export ──────────────────────────────────────────────────────
export function SemanticDemos() {
  return (
    <>
      <DemoCard number={31} title="Mood Tags">
        {(props) => <MoodTagsDemo {...props} />}
      </DemoCard>
      <DemoCard number={32} title="Semantic XY">
        {(props) => <SemanticXYDemo {...props} />}
      </DemoCard>
      <DemoCard number={33} title="Comparison Vote">
        {(props) => <ComparisonVoteDemo {...props} />}
      </DemoCard>
      <DemoCard number={34} title="Chord Selector">
        {(props) => <ChordSelectorDemo {...props} />}
      </DemoCard>
      <DemoCard number={35} title="Radar Chart">
        {(props) => <RadarChartDemo {...props} />}
      </DemoCard>
    </>
  )
}
