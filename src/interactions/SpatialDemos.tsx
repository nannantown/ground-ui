
import { useRef, useState, useCallback, useEffect } from 'react'
import { DemoCard, type DemoProps } from './DemoCard'

// ─── #1 XY Pad ───────────────────────────────────────────────

function XYPadDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 })
  const dragging = useRef(false)

  const updatePosition = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
      setPos({ x, y })
      onChange({ valueA: x, valueB: y })
    },
    [onChange],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updatePosition(e)
    },
    [updatePosition],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      updatePosition(e)
    },
    [updatePosition],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 240,
        height: 240,
        borderRadius: 8,
        position: 'relative',
        cursor: 'crosshair',
        touchAction: 'none',
        background:
          'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent), linear-gradient(to right, hsl(0,70%,50%), hsl(120,70%,50%), hsl(240,70%,50%), hsl(360,70%,50%))',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Crosshair */}
      <div
        style={{
          position: 'absolute',
          left: pos.x * 240 - 10,
          top: pos.y * 240 - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '2px solid #fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ─── #2 Polar Disk ───────────────────────────────────────────

function PolarDiskDemo({ onChange }: DemoProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [angle, setAngle] = useState(0)
  const [distance, setDistance] = useState(0.5)
  const dragging = useRef(false)
  const R = 100
  const cx = 110
  const cy = 110

  const updateFromEvent = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const px = e.clientX - rect.left - cx * (rect.width / 220)
      const py = e.clientY - rect.top - cy * (rect.height / 220)
      const a = Math.atan2(py, px)
      const normalizedAngle = ((a * 180) / Math.PI + 360) % 360
      const dist = Math.min(1, Math.sqrt(px * px + py * py) / (R * (rect.width / 220)))
      setAngle(normalizedAngle)
      setDistance(dist)
      onChange({ valueA: normalizedAngle / 360, valueB: dist })
    },
    [onChange],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      ;(e.target as SVGElement).setPointerCapture(e.pointerId)
      updateFromEvent(e)
    },
    [updateFromEvent],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      updateFromEvent(e)
    },
    [updateFromEvent],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const handleX = cx + Math.cos((angle * Math.PI) / 180) * distance * R
  const handleY = cy + Math.sin((angle * Math.PI) / 180) * distance * R

  // Generate conic-gradient-like segments
  const segments = 36
  const segmentPaths: React.ReactNode[] = []
  for (let i = 0; i < segments; i++) {
    const a1 = (i * 360) / segments
    const a2 = ((i + 1) * 360) / segments
    const r1 = (a1 * Math.PI) / 180
    const r2 = (a2 * Math.PI) / 180
    const hue = Math.round((i / segments) * 360)
    const d = `M${cx},${cy} L${cx + Math.cos(r1) * R},${cy + Math.sin(r1) * R} A${R},${R} 0 0,1 ${cx + Math.cos(r2) * R},${cy + Math.sin(r2) * R} Z`
    segmentPaths.push(<path key={i} d={d} fill={`hsl(${hue}, 60%, 45%)`} />)
  }

  return (
    <svg
      ref={svgRef}
      width={220}
      height={220}
      viewBox="0 0 220 220"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ cursor: 'crosshair', touchAction: 'none' }}
    >
      <circle cx={cx} cy={cy} r={R} fill="var(--bg-surface)" />
      {segmentPaths}
      {/* Center fade overlay for distance visualization */}
      <radialGradient id="polar-center-fade">
        <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>
      <circle cx={cx} cy={cy} r={R} fill="url(#polar-center-fade)" />
      {/* Handle dot */}
      <circle
        cx={handleX}
        cy={handleY}
        r={7}
        fill="#fff"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={2}
        style={{ pointerEvents: 'none' }}
      />
    </svg>
  )
}

// ─── #3 Harmony Wheel ────────────────────────────────────────

function HarmonyWheelDemo({ onChange }: DemoProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [angleA, setAngleA] = useState(0)
  const dragging = useRef(false)
  const R = 90
  const cx = 110
  const cy = 110
  const OFFSET = 60

  const angleB = (angleA + OFFSET) % 360

  const updateAngle = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const px = e.clientX - rect.left - cx * (rect.width / 220)
      const py = e.clientY - rect.top - cy * (rect.height / 220)
      const a = ((Math.atan2(py, px) * 180) / Math.PI + 360) % 360
      setAngleA(a)
      onChange({ valueA: a / 360, valueB: ((a + OFFSET) % 360) / 360 })
    },
    [onChange],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      ;(e.target as SVGElement).setPointerCapture(e.pointerId)
      updateAngle(e)
    },
    [updateAngle],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      updateAngle(e)
    },
    [updateAngle],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const axA = cx + Math.cos((angleA * Math.PI) / 180) * R
  const ayA = cy + Math.sin((angleA * Math.PI) / 180) * R
  const axB = cx + Math.cos((angleB * Math.PI) / 180) * R
  const ayB = cy + Math.sin((angleB * Math.PI) / 180) * R

  const hueA = Math.round((angleA / 360) * 360)
  const hueB = Math.round((angleB / 360) * 360)

  // Ring segments
  const segments = 60
  const ringPaths: React.ReactNode[] = []
  const innerR = 70
  for (let i = 0; i < segments; i++) {
    const a1 = (i * 360) / segments
    const a2 = ((i + 1) * 360) / segments
    const r1 = (a1 * Math.PI) / 180
    const r2 = (a2 * Math.PI) / 180
    const hue = Math.round((i / segments) * 360)
    const d = [
      `M${cx + Math.cos(r1) * innerR},${cy + Math.sin(r1) * innerR}`,
      `L${cx + Math.cos(r1) * R},${cy + Math.sin(r1) * R}`,
      `A${R},${R} 0 0,1 ${cx + Math.cos(r2) * R},${cy + Math.sin(r2) * R}`,
      `L${cx + Math.cos(r2) * innerR},${cy + Math.sin(r2) * innerR}`,
      `A${innerR},${innerR} 0 0,0 ${cx + Math.cos(r1) * innerR},${cy + Math.sin(r1) * innerR}`,
      'Z',
    ].join(' ')
    ringPaths.push(<path key={i} d={d} fill={`hsl(${hue}, 55%, 45%)`} />)
  }

  return (
    <svg
      ref={svgRef}
      width={220}
      height={220}
      viewBox="0 0 220 220"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      {/* Background */}
      <circle cx={cx} cy={cy} r={R + 2} fill="var(--bg-surface)" />
      {/* Ring */}
      {ringPaths}
      {/* Inner circle */}
      <circle cx={cx} cy={cy} r={innerR - 2} fill="var(--bg-secondary)" />
      {/* Connecting line */}
      <line x1={axA} y1={ayA} x2={axB} y2={ayB} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      {/* Center lines */}
      <line x1={cx} y1={cy} x2={axA} y2={ayA} stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={cx} y1={cy} x2={axB} y2={ayB} stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4 3" />
      {/* Handle A */}
      <circle cx={axA} cy={ayA} r={9} fill={`hsl(${hueA}, 70%, 55%)`} stroke="#fff" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <text x={axA} y={ayA + 1} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill="#fff" style={{ pointerEvents: 'none' }}>
        A
      </text>
      {/* Handle B */}
      <circle cx={axB} cy={ayB} r={9} fill={`hsl(${hueB}, 70%, 55%)`} stroke="#fff" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <text x={axB} y={ayB + 1} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill="#fff" style={{ pointerEvents: 'none' }}>
        B
      </text>
      {/* Offset label */}
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="var(--text-muted)" style={{ pointerEvents: 'none' }}>
        +{OFFSET}°
      </text>
    </svg>
  )
}

// ─── #4 Gravity Well ────────────────────────────────────────

interface Attractor {
  x: number
  y: number
  valueA: number
  valueB: number
  color: string
}

const ATTRACTORS: Attractor[] = [
  { x: 50, y: 50, valueA: 0.0, valueB: 0.0, color: 'hsl(0, 65%, 50%)' },
  { x: 190, y: 50, valueA: 1.0, valueB: 0.0, color: 'hsl(120, 65%, 45%)' },
  { x: 190, y: 190, valueA: 1.0, valueB: 1.0, color: 'hsl(240, 65%, 55%)' },
  { x: 50, y: 190, valueA: 0.0, valueB: 1.0, color: 'hsl(45, 80%, 50%)' },
]

function GravityWellDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ballPos, setBallPos] = useState({ x: 120, y: 120 })
  const dragging = useRef(false)

  const computeIDW = useCallback(
    (px: number, py: number) => {
      let sumWA = 0
      let sumWB = 0
      let sumW = 0
      const power = 2
      for (const att of ATTRACTORS) {
        const dx = px - att.x
        const dy = py - att.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1) {
          return { valueA: att.valueA, valueB: att.valueB }
        }
        const w = 1 / Math.pow(dist, power)
        sumWA += w * att.valueA
        sumWB += w * att.valueB
        sumW += w
      }
      return { valueA: sumWA / sumW, valueB: sumWB / sumW }
    },
    [],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(240, e.clientX - rect.left))
      const y = Math.max(0, Math.min(240, e.clientY - rect.top))
      setBallPos({ x, y })
    },
    [],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(240, e.clientX - rect.left))
      const y = Math.max(0, Math.min(240, e.clientY - rect.top))
      setBallPos({ x, y })
    },
    [],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
    // Snap to nearest attractor
    let minDist = Infinity
    let nearest = ATTRACTORS[0]
    for (const att of ATTRACTORS) {
      const dx = ballPos.x - att.x
      const dy = ballPos.y - att.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < minDist) {
        minDist = dist
        nearest = att
      }
    }
    setBallPos({ x: nearest.x, y: nearest.y })
    const idw = computeIDW(nearest.x, nearest.y)
    onChange(idw)
  }, [ballPos, computeIDW, onChange])

  // Update values while dragging
  useEffect(() => {
    if (dragging.current) {
      const idw = computeIDW(ballPos.x, ballPos.y)
      onChange(idw)
    }
  }, [ballPos, computeIDW, onChange])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 240,
        height: 240,
        borderRadius: 8,
        position: 'relative',
        cursor: 'grab',
        touchAction: 'none',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Attractor fields - subtle radial glow */}
      {ATTRACTORS.map((att, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: att.x - 40,
            top: att.y - 40,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${att.color}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      ))}
      {/* Attractor points */}
      {ATTRACTORS.map((att, i) => (
        <div
          key={`dot-${i}`}
          style={{
            position: 'absolute',
            left: att.x - 8,
            top: att.y - 8,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: att.color,
            border: '2px solid rgba(255,255,255,0.3)',
            pointerEvents: 'none',
          }}
        />
      ))}
      {/* Draggable ball */}
      <div
        style={{
          position: 'absolute',
          left: ballPos.x - 10,
          top: ballPos.y - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          border: '2px solid rgba(0,0,0,0.3)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          transition: dragging.current ? 'none' : 'left 0.3s ease, top 0.3s ease',
        }}
      />
    </div>
  )
}

// ─── #5 Voronoi ──────────────────────────────────────────────

interface VoronoiSeed {
  x: number
  y: number
  valueA: number
  valueB: number
  color: string
}

const VORONOI_SEEDS: VoronoiSeed[] = [
  { x: 40, y: 40, valueA: 0.0, valueB: 0.1, color: 'hsl(0, 55%, 40%)' },
  { x: 160, y: 30, valueA: 0.3, valueB: 0.0, color: 'hsl(45, 55%, 40%)' },
  { x: 200, y: 120, valueA: 0.6, valueB: 0.4, color: 'hsl(120, 45%, 35%)' },
  { x: 120, y: 100, valueA: 0.5, valueB: 0.5, color: 'hsl(180, 45%, 35%)' },
  { x: 50, y: 180, valueA: 0.2, valueB: 0.8, color: 'hsl(210, 50%, 40%)' },
  { x: 180, y: 200, valueA: 0.8, valueB: 0.9, color: 'hsl(270, 50%, 40%)' },
  { x: 100, y: 210, valueA: 0.4, valueB: 1.0, color: 'hsl(320, 50%, 40%)' },
]

function VoronoiDemo({ onChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  // Draw Voronoi regions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = 240
    const h = 240
    const imageData = ctx.createImageData(w, h)

    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        let minDist = Infinity
        let closestIdx = 0
        for (let i = 0; i < VORONOI_SEEDS.length; i++) {
          const dx = px - VORONOI_SEEDS[i].x
          const dy = py - VORONOI_SEEDS[i].y
          const dist = dx * dx + dy * dy
          if (dist < minDist) {
            minDist = dist
            closestIdx = i
          }
        }
        const seed = VORONOI_SEEDS[closestIdx]
        // Parse hsl color to approximate RGB
        const hue = parseFloat(seed.color.match(/hsl\((\d+)/)?.[1] || '0')
        const sat = parseFloat(seed.color.match(/,\s*(\d+)%/)?.[1] || '50') / 100
        const lit = parseFloat(seed.color.match(/,\s*\d+%,\s*(\d+)%/)?.[1] || '40') / 100

        // Highlight selected
        const isSelected = closestIdx === selectedIdx
        const finalLit = isSelected ? lit + 0.15 : lit

        const rgb = hslToRgb(hue / 360, sat, finalLit)
        const idx = (py * w + px) * 4
        imageData.data[idx] = rgb[0]
        imageData.data[idx + 1] = rgb[1]
        imageData.data[idx + 2] = rgb[2]
        imageData.data[idx + 3] = 255
      }
    }
    ctx.putImageData(imageData, 0, 0)

    // Draw seed points
    for (let i = 0; i < VORONOI_SEEDS.length; i++) {
      const seed = VORONOI_SEEDS[i]
      ctx.beginPath()
      ctx.arc(seed.x, seed.y, i === selectedIdx ? 5 : 3, 0, Math.PI * 2)
      ctx.fillStyle = i === selectedIdx ? '#fff' : 'rgba(255,255,255,0.6)'
      ctx.fill()
      if (i === selectedIdx) {
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }
  }, [selectedIdx])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const px = (e.clientX - rect.left) * (240 / rect.width)
      const py = (e.clientY - rect.top) * (240 / rect.height)
      // Find closest seed
      let minDist = Infinity
      let closestIdx = 0
      for (let i = 0; i < VORONOI_SEEDS.length; i++) {
        const dx = px - VORONOI_SEEDS[i].x
        const dy = py - VORONOI_SEEDS[i].y
        const dist = dx * dx + dy * dy
        if (dist < minDist) {
          minDist = dist
          closestIdx = i
        }
      }
      setSelectedIdx(closestIdx)
      const seed = VORONOI_SEEDS[closestIdx]
      onChange({ valueA: seed.valueA, valueB: seed.valueB })
    },
    [onChange],
  )

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={240}
      onClick={handleClick}
      style={{
        width: 240,
        height: 240,
        borderRadius: 8,
        cursor: 'crosshair',
        border: '1px solid var(--border-subtle)',
      }}
    />
  )
}

// HSL to RGB helper
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

// ─── #6 2D Gradient Field ────────────────────────────────────

function GradientFieldDemo({ onChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const dragging = useRef(false)
  const painted = useRef(false)

  // Paint gradient once
  useEffect(() => {
    if (painted.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    painted.current = true
    const w = 240
    const h = 240
    const imageData = ctx.createImageData(w, h)

    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const hue = (px / w) * 360
        const lightness = 0.25 + (1 - py / h) * 0.45
        const rgb = hslToRgb(hue / 360, 0.65, lightness)
        const idx = (py * w + px) * 4
        imageData.data[idx] = rgb[0]
        imageData.data[idx + 1] = rgb[1]
        imageData.data[idx + 2] = rgb[2]
        imageData.data[idx + 3] = 255
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }, [])

  const updatePosition = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
      setPos({ x, y })
      onChange({ valueA: x, valueB: y })
    },
    [onChange],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updatePosition(e)
    },
    [updatePosition],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      updatePosition(e)
    },
    [updatePosition],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 240,
        height: 240,
        borderRadius: 8,
        position: 'relative',
        cursor: 'crosshair',
        touchAction: 'none',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        style={{
          width: 240,
          height: 240,
          display: 'block',
          pointerEvents: 'none',
        }}
      />
      {/* Indicator */}
      {pos && (
        <div
          style={{
            position: 'absolute',
            left: pos.x * 240 - 10,
            top: pos.y * 240 - 10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

// ─── #7 Map Nav ──────────────────────────────────────────────

function MapNavDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const dragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })

  const MAP_SIZE = 800
  const VIEWPORT = 240
  const MIN_SCALE = 0.5
  const MAX_SCALE = 3

  const normalizeValues = useCallback(
    (px: number, zoom: number) => {
      // Pan range depends on scale: at scale=1, max pan is -(MAP_SIZE - VIEWPORT)
      const maxPan = MAP_SIZE * zoom - VIEWPORT
      const normalizedPan = maxPan > 0 ? Math.max(0, Math.min(1, -px / maxPan)) : 0.5
      const normalizedZoom = (zoom - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)
      return { valueA: normalizedPan, valueB: normalizedZoom }
    },
    [],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      lastPointer.current = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - lastPointer.current.x
      const dy = e.clientY - lastPointer.current.y
      lastPointer.current = { x: e.clientX, y: e.clientY }

      setPan((prev) => {
        const maxPan = MAP_SIZE * scale - VIEWPORT
        const newX = Math.max(-maxPan, Math.min(0, prev.x + dx))
        const newY = Math.max(-maxPan, Math.min(0, prev.y + dy))
        const vals = normalizeValues(newX, scale)
        onChange(vals)
        return { x: newX, y: newY }
      })
    },
    [scale, onChange, normalizeValues],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.stopPropagation()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setScale((prev) => {
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta))
        const vals = normalizeValues(pan.x, newScale)
        onChange(vals)
        return newScale
      })
    },
    [pan.x, onChange, normalizeValues],
  )

  // Grid lines for the map
  const gridLines: React.ReactNode[] = []
  const gridSpacing = 80
  for (let i = 0; i <= MAP_SIZE; i += gridSpacing) {
    gridLines.push(
      <line key={`h-${i}`} x1={0} y1={i} x2={MAP_SIZE} y2={i} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />,
    )
    gridLines.push(
      <line key={`v-${i}`} x1={i} y1={0} x2={i} y2={MAP_SIZE} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />,
    )
  }

  // Landmark dots
  const landmarks = [
    { x: 200, y: 200, r: 4 },
    { x: 400, y: 100, r: 6 },
    { x: 600, y: 400, r: 5 },
    { x: 150, y: 600, r: 4 },
    { x: 500, y: 700, r: 7 },
    { x: 700, y: 300, r: 5 },
  ]

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{
        width: VIEWPORT,
        height: VIEWPORT,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: dragging.current ? 'grabbing' : 'grab',
        touchAction: 'none',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        background: 'var(--bg-surface)',
      }}
    >
      <svg
        width={MAP_SIZE}
        height={MAP_SIZE}
        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
        }}
      >
        <rect width={MAP_SIZE} height={MAP_SIZE} fill="var(--bg-primary)" />
        {gridLines}
        {/* Landmarks */}
        {landmarks.map((lm, i) => (
          <circle key={i} cx={lm.x} cy={lm.y} r={lm.r} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        ))}
        {/* Center marker */}
        <circle cx={MAP_SIZE / 2} cy={MAP_SIZE / 2} r={3} fill="rgba(255,255,255,0.3)" />
        <text x={MAP_SIZE / 2 + 8} y={MAP_SIZE / 2 + 4} fontSize={10} fill="rgba(255,255,255,0.2)">
          center
        </text>
      </svg>
      {/* Zoom indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          background: 'var(--bg-secondary)',
          padding: '2px 6px',
          borderRadius: 4,
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'none',
        }}
      >
        {scale.toFixed(1)}x
      </div>
    </div>
  )
}

// ─── Export ──────────────────────────────────────────────────

export function SpatialDemos() {
  return (
    <>
      <DemoCard number={1} title="XY Pad">
        {(props) => <XYPadDemo {...props} />}
      </DemoCard>
      <DemoCard number={2} title="Polar Disk">
        {(props) => <PolarDiskDemo {...props} />}
      </DemoCard>
      <DemoCard number={3} title="Harmony Wheel">
        {(props) => <HarmonyWheelDemo {...props} />}
      </DemoCard>
      <DemoCard number={4} title="Gravity Well">
        {(props) => <GravityWellDemo {...props} />}
      </DemoCard>
      <DemoCard number={5} title="Voronoi">
        {(props) => <VoronoiDemo {...props} />}
      </DemoCard>
      <DemoCard number={6} title="2D Gradient Field">
        {(props) => <GradientFieldDemo {...props} />}
      </DemoCard>
      <DemoCard number={7} title="Map Nav">
        {(props) => <MapNavDemo {...props} />}
      </DemoCard>
    </>
  )
}
