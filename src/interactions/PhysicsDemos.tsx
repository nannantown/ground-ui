
import { useState, useRef, useCallback, useEffect } from 'react'
import { DemoCard, type DemoProps } from './DemoCard'

// ─── #27 Pendulum ──────────────────────────────────────────────
function PendulumDemo({ onChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    angle: 0,
    velocity: 0,
    amplitude: 0,
    running: false,
  })
  const rafRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 240
    const H = 200
    const pivotX = W / 2
    const pivotY = 20
    const rodLength = 130
    const bobRadius = 12
    const g = 9.8
    const L = 1.5
    const damping = 0.995
    const dt = 0.03

    const s = stateRef.current

    if (s.running) {
      const accel = -(g / L) * Math.sin(s.angle) - 0.02 * s.velocity
      s.velocity += accel * dt
      s.velocity *= damping
      s.angle += s.velocity * dt
      s.amplitude = Math.abs(s.angle) + Math.abs(s.velocity) * 0.1

      // Normalize angle: -60deg to +60deg maps to 0-1
      const maxAngle = Math.PI / 3
      const normalizedAngle = (s.angle + maxAngle) / (2 * maxAngle)
      const clampedA = Math.max(0, Math.min(1, normalizedAngle))

      // Amplitude decays from initial max, normalize 0-1
      const normalizedAmp = Math.min(1, s.amplitude / (maxAngle + 2))
      const clampedB = Math.max(0, Math.min(1, normalizedAmp))

      onChange({ valueA: clampedA, valueB: clampedB })
    }

    ctx.clearRect(0, 0, W, H)

    // Bob position
    const bobX = pivotX + rodLength * Math.sin(s.angle)
    const bobY = pivotY + rodLength * Math.cos(s.angle)

    // Draw rod
    ctx.beginPath()
    ctx.moveTo(pivotX, pivotY)
    ctx.lineTo(bobX, bobY)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw pivot
    ctx.beginPath()
    ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fill()

    // Draw bob
    ctx.beginPath()
    ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2)
    const gradient = ctx.createRadialGradient(
      bobX - 3,
      bobY - 3,
      0,
      bobX,
      bobY,
      bobRadius
    )
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
    gradient.addColorStop(1, 'rgba(255,255,255,0.4)')
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw arc guide
    ctx.beginPath()
    ctx.arc(pivotX, pivotY, rodLength, Math.PI / 6, (5 * Math.PI) / 6, false)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Instruction text
    if (!s.running) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '11px -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Click to set angle', W / 2, H - 10)
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [onChange])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pivotX = 120
      const pivotY = 20

      // Calculate angle from click position relative to pivot
      const angle = Math.atan2(x - pivotX, 100)
      const clamped = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, angle))

      stateRef.current.angle = clamped
      stateRef.current.velocity = 0
      stateRef.current.amplitude = Math.abs(clamped)
      stateRef.current.running = true
    },
    []
  )

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={200}
      onClick={handleClick}
      style={{ cursor: 'pointer', borderRadius: 8 }}
    />
  )
}

// ─── #28 Particle Field ────────────────────────────────────────
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  hue: number
  alpha: number
  size: number
}

function ParticleFieldDemo({ onChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -100, y: -100, active: false })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Initialize particles
    const particles: Particle[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * 240,
        y: Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 360,
        alpha: 0.2 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 1.5,
      })
    }
    particlesRef.current = particles
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 240
    const H = 200
    ctx.clearRect(0, 0, W, H)

    const mouse = mouseRef.current
    const particles = particlesRef.current
    let nearCount = 0
    let nearSumX = 0
    let nearSumY = 0
    const attractRadius = 80

    for (const p of particles) {
      // Mouse attraction
      if (mouse.active) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < attractRadius && dist > 1) {
          const force = (attractRadius - dist) / attractRadius * 0.02
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
          nearCount++
          nearSumX += p.x
          nearSumY += p.y
        }
      }

      // Update position
      p.x += p.vx
      p.y += p.vy

      // Friction
      p.vx *= 0.98
      p.vy *= 0.98

      // Add slight random drift
      p.vx += (Math.random() - 0.5) * 0.05
      p.vy += (Math.random() - 0.5) * 0.05

      // Wrap around
      if (p.x < 0) p.x = W
      if (p.x > W) p.x = 0
      if (p.y < 0) p.y = H
      if (p.y > H) p.y = 0

      // Draw
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, 60%, 60%, ${p.alpha})`
      ctx.fill()
    }

    // Output based on nearby particles
    if (nearCount > 0) {
      const avgX = nearSumX / nearCount / W
      const avgY = nearSumY / nearCount / H
      onChange({
        valueA: Math.max(0, Math.min(1, avgX)),
        valueB: Math.max(0, Math.min(1, avgY)),
      })
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [onChange])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={200}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'crosshair', borderRadius: 8 }}
    />
  )
}

// ─── #29 Morphing Blob ─────────────────────────────────────────
function MorphingBlobDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [blobPos, setBlobPos] = useState({ x: 120, y: 100 })
  const [dragging, setDragging] = useState(false)

  const W = 240
  const H = 200
  const attractorL = { x: 40, y: 100 }
  const attractorR = { x: 200, y: 100 }
  const blobBaseRadius = 28

  const distL = Math.hypot(blobPos.x - attractorL.x, blobPos.y - attractorL.y)
  const distR = Math.hypot(blobPos.x - attractorR.x, blobPos.y - attractorR.y)
  const maxDist = Math.hypot(attractorR.x - attractorL.x, H)
  const proximityL = Math.max(0, Math.min(1, 1 - distL / maxDist))
  const proximityR = Math.max(0, Math.min(1, 1 - distR / maxDist))

  // Morph blob shape based on proximity to attractors
  const stretchL = proximityL * 0.6
  const stretchR = proximityR * 0.6
  const blobBorderRadius = `${
    50 - stretchL * 30
  }% ${50 - stretchR * 30}% ${50 - stretchR * 30}% ${50 - stretchL * 30}% / 50% 50% 50% 50%`

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(blobBaseRadius, Math.min(W - blobBaseRadius, e.clientX - rect.left))
      const y = Math.max(blobBaseRadius, Math.min(H - blobBaseRadius, e.clientY - rect.top))
      setBlobPos({ x, y })
      const dl = Math.hypot(x - attractorL.x, y - attractorL.y)
      const dr = Math.hypot(x - attractorR.x, y - attractorR.y)
      onChange({
        valueA: Math.max(0, Math.min(1, 1 - dl / maxDist)),
        valueB: Math.max(0, Math.min(1, 1 - dr / maxDist)),
      })
    },
    [dragging, onChange, maxDist]
  )

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'relative',
        width: W,
        height: H,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Left attractor */}
      <div
        style={{
          position: 'absolute',
          left: attractorL.x - 18,
          top: attractorL.y - 18,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.15)',
          background: `rgba(255,255,255,${0.03 + proximityL * 0.1})`,
          transition: 'background 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          L
        </span>
      </div>

      {/* Right attractor */}
      <div
        style={{
          position: 'absolute',
          left: attractorR.x - 18,
          top: attractorR.y - 18,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.15)',
          background: `rgba(255,255,255,${0.03 + proximityR * 0.1})`,
          transition: 'background 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          R
        </span>
      </div>

      {/* Connection lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <line
          x1={attractorL.x}
          y1={attractorL.y}
          x2={blobPos.x}
          y2={blobPos.y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <line
          x1={attractorR.x}
          y1={attractorR.y}
          x2={blobPos.x}
          y2={blobPos.y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      </svg>

      {/* Draggable blob */}
      <div
        onPointerDown={handlePointerDown}
        style={{
          position: 'absolute',
          left: blobPos.x - blobBaseRadius,
          top: blobPos.y - blobBaseRadius,
          width: blobBaseRadius * 2,
          height: blobBaseRadius * 2,
          borderRadius: blobBorderRadius,
          background: `radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,255,255,0.2))`,
          border: '1px solid rgba(255,255,255,0.3)',
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'border-radius 0.2s ease',
          boxShadow: '0 0 20px rgba(255,255,255,0.1)',
        }}
      />
    </div>
  )
}

// ─── #30 Overlap Transparency ──────────────────────────────────
function OverlapTransparencyDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const W = 240
  const H = 200
  const circleR = 60

  const [circleA, setCircleA] = useState({ x: 90, y: 100 })
  const [circleB, setCircleB] = useState({ x: 150, y: 100 })
  const [draggingId, setDraggingId] = useState<'A' | 'B' | null>(null)

  const handlePointerDown = useCallback(
    (id: 'A' | 'B', e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setDraggingId(id)
    },
    []
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingId || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(circleR, Math.min(W - circleR, e.clientX - rect.left))
      const y = Math.max(circleR, Math.min(H - circleR, e.clientY - rect.top))

      if (draggingId === 'A') {
        setCircleA({ x, y })
        onChange({
          valueA: x / W,
          valueB: circleB.y / H,
        })
      } else {
        setCircleB({ x, y })
        onChange({
          valueA: circleA.x / W,
          valueB: y / H,
        })
      }
    },
    [draggingId, circleA, circleB, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setDraggingId(null)
  }, [])

  const hueA = 200 // Blue
  const hueB = 340 // Pink

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'relative',
        width: W,
        height: H,
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        borderRadius: 8,
      }}
    >
      {/* Circle A */}
      <div
        onPointerDown={(e) => handlePointerDown('A', e)}
        style={{
          position: 'absolute',
          left: circleA.x - circleR,
          top: circleA.y - circleR,
          width: circleR * 2,
          height: circleR * 2,
          borderRadius: '50%',
          background: `hsla(${hueA}, 70%, 50%, 0.5)`,
          mixBlendMode: 'screen',
          cursor: draggingId === 'A' ? 'grabbing' : 'grab',
          transition: draggingId === 'A' ? 'none' : 'left 0.05s, top 0.05s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.8)',
            pointerEvents: 'none',
          }}
        >
          A
        </span>
      </div>

      {/* Circle B */}
      <div
        onPointerDown={(e) => handlePointerDown('B', e)}
        style={{
          position: 'absolute',
          left: circleB.x - circleR,
          top: circleB.y - circleR,
          width: circleR * 2,
          height: circleR * 2,
          borderRadius: '50%',
          background: `hsla(${hueB}, 70%, 50%, 0.5)`,
          mixBlendMode: 'screen',
          cursor: draggingId === 'B' ? 'grabbing' : 'grab',
          transition: draggingId === 'B' ? 'none' : 'left 0.05s, top 0.05s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.8)',
            pointerEvents: 'none',
          }}
        >
          B
        </span>
      </div>
    </div>
  )
}

// ─── Export ──────────────────────────────────────────────────────
export function PhysicsDemos() {
  return (
    <>
      <DemoCard number={27} title="Pendulum">
        {(props) => <PendulumDemo {...props} />}
      </DemoCard>
      <DemoCard number={28} title="Particle Field">
        {(props) => <ParticleFieldDemo {...props} />}
      </DemoCard>
      <DemoCard number={29} title="Morphing Blob">
        {(props) => <MorphingBlobDemo {...props} />}
      </DemoCard>
      <DemoCard number={30} title="Overlap Transparency">
        {(props) => <OverlapTransparencyDemo {...props} />}
      </DemoCard>
    </>
  )
}
