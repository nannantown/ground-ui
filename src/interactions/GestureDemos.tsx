
import { useState, useRef, useCallback, useEffect } from 'react'
import { DemoCard, type DemoProps } from './DemoCard'

// ─────────────────────────────────────────────
// #17 Pinch
// ─────────────────────────────────────────────
function PinchDemo({ onChange }: DemoProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [pointA, setPointA] = useState<{ x: number; y: number }>({ x: 60, y: 80 })
  const [pointB, setPointB] = useState<{ x: number; y: number }>({ x: 180, y: 80 })
  const [isDragging, setIsDragging] = useState(false)
  const centerRef = useRef<{ x: number; y: number }>({ x: 120, y: 80 })
  const draggingRef = useRef(false)
  const shiftRef = useRef(false)

  const W = 240
  const H = 160
  const maxDist = Math.sqrt(W * W + H * H)

  const update = useCallback(
    (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
      const midX = (a.x + b.x) / 2
      onChange({
        valueA: Math.min(1, dist / maxDist),
        valueB: Math.max(0, Math.min(1, midX / W)),
      })
    },
    [onChange, maxDist],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      draggingRef.current = true
      setIsDragging(true)

      if (e.shiftKey) {
        shiftRef.current = true
        centerRef.current = { x, y }
        setPointA({ x, y })
        setPointB({ x, y })
      } else {
        shiftRef.current = false
        setPointB({ x, y })
        update(pointA, { x, y })
      }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [pointA, update],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return
      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(W, e.clientX - rect.left))
      const y = Math.max(0, Math.min(H, e.clientY - rect.top))

      if (shiftRef.current) {
        const c = centerRef.current
        const dx = x - c.x
        const dy = y - c.y
        const newA = { x: c.x - dx, y: c.y - dy }
        const newB = { x: c.x + dx, y: c.y + dy }
        setPointA(newA)
        setPointB(newB)
        update(newA, newB)
      } else {
        setPointB({ x, y })
        update(pointA, { x, y })
      }
    },
    [pointA, update],
  )

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false
    setIsDragging(false)
    shiftRef.current = false
  }, [])

  // Touch handling for real pinch
  const touchesRef = useRef<Map<number, { x: number; y: number }>>(new Map())

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]
      touchesRef.current.set(t.identifier, {
        x: t.clientX - rect.left,
        y: t.clientY - rect.top,
      })
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        touchesRef.current.set(t.identifier, {
          x: t.clientX - rect.left,
          y: t.clientY - rect.top,
        })
      }
      const points = Array.from(touchesRef.current.values())
      if (points.length >= 2) {
        const a = points[0]
        const b = points[1]
        setPointA(a)
        setPointB(b)
        update(a, b)
      }
    },
    [update],
  )

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      touchesRef.current.delete(e.changedTouches[i].identifier)
    }
  }, [])

  return (
    <div
      ref={areaRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: W,
        height: H,
        position: 'relative',
        background: 'var(--bg-surface)',
        borderRadius: 8,
        border: '1px solid var(--border-subtle)',
        cursor: 'grab',
        touchAction: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Hint */}
      <span
        style={{
          position: 'absolute',
          top: 6,
          right: 8,
          fontSize: 9,
          color: 'var(--text-muted)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      >
        Shift+drag
      </span>

      {/* Line between points */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <line
          x1={pointA.x}
          y1={pointA.y}
          x2={pointB.x}
          y2={pointB.y}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
      </svg>

      {/* Point A */}
      <div
        style={{
          position: 'absolute',
          left: pointA.x - 10,
          top: pointA.y - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '2px solid rgba(255,255,255,0.5)',
          pointerEvents: 'none',
          transition: isDragging ? 'none' : 'left 0.1s, top 0.1s',
        }}
      />

      {/* Point B */}
      <div
        style={{
          position: 'absolute',
          left: pointB.x - 10,
          top: pointB.y - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '2px solid rgba(255,255,255,0.5)',
          pointerEvents: 'none',
          transition: isDragging ? 'none' : 'left 0.1s, top 0.1s',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// #18 Two-Zone
// ─────────────────────────────────────────────
function Zone({
  zone,
  value,
  isDragging,
  width,
  height,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  zone: 'left' | 'right'
  value: number
  isDragging: boolean
  width: number
  height: number
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: () => void
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        width,
        height,
        position: 'relative',
        background: 'var(--bg-surface)',
        borderRadius: 8,
        border: '1px solid var(--border-subtle)',
        cursor: 'grab',
        touchAction: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Fill */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${value * 100}%`,
          background: 'rgba(255,255,255,0.08)',
          borderTop: '2px solid rgba(255,255,255,0.3)',
          transition: isDragging ? 'none' : 'height 0.1s ease',
        }}
      />
      {/* Label */}
      <span
        style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
      >
        {zone === 'left' ? 'L' : 'R'}: {value.toFixed(2)}
      </span>
    </div>
  )
}

function TwoZoneDemo({ onChange }: DemoProps) {
  const [left, setLeft] = useState(0.5)
  const [right, setRight] = useState(0.5)
  const [activeDragZone, setActiveDragZone] = useState<'left' | 'right' | null>(null)
  const draggingZone = useRef<'left' | 'right' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const W = 240
  const H = 160
  const halfW = W / 2 - 4

  const updateValue = useCallback(
    (zone: 'left' | 'right', clientY: number, el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      const y = clientY - rect.top
      const value = 1 - Math.max(0, Math.min(1, y / rect.height))
      if (zone === 'left') {
        setLeft(value)
        onChange({ valueA: value, valueB: right })
      } else {
        setRight(value)
        onChange({ valueA: left, valueB: value })
      }
    },
    [left, right, onChange],
  )

  const handlePointerDown = useCallback(
    (zone: 'left' | 'right') => (e: React.PointerEvent) => {
      e.preventDefault()
      draggingZone.current = zone
      setActiveDragZone(zone)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updateValue(zone, e.clientY, e.currentTarget as HTMLElement)
    },
    [updateValue],
  )

  const handlePointerMove = useCallback(
    (zone: 'left' | 'right') => (e: React.PointerEvent) => {
      if (draggingZone.current !== zone) return
      updateValue(zone, e.clientY, e.currentTarget as HTMLElement)
    },
    [updateValue],
  )

  const handlePointerUp = useCallback(() => {
    draggingZone.current = null
    setActiveDragZone(null)
  }, [])

  return (
    <div ref={containerRef} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Zone
        zone="left"
        value={left}
        isDragging={activeDragZone === 'left'}
        width={halfW}
        height={H}
        onPointerDown={handlePointerDown('left')}
        onPointerMove={handlePointerMove('left')}
        onPointerUp={handlePointerUp}
      />
      {/* Divider */}
      <div
        style={{
          width: 1,
          height: H - 20,
          background: 'var(--border-subtle)',
          flexShrink: 0,
        }}
      />
      <Zone
        zone="right"
        value={right}
        isDragging={activeDragZone === 'right'}
        width={halfW}
        height={H}
        onPointerDown={handlePointerDown('right')}
        onPointerMove={handlePointerMove('right')}
        onPointerUp={handlePointerUp}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// #19 Pressure + Position
// ─────────────────────────────────────────────
function PressurePositionDemo({ onChange }: DemoProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [posX, setPosX] = useState(0.5)
  const [pressure, setPressure] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const pressedRef = useRef(false)
  const startTimeRef = useRef(0)
  const animFrameRef = useRef<number>(0)

  const W = 240
  const H = 160

  const startPressure = useCallback(() => {
    pressedRef.current = true
    setIsPressed(true)
    startTimeRef.current = Date.now()

    const tick = () => {
      if (!pressedRef.current) return
      const elapsed = Date.now() - startTimeRef.current
      const p = Math.min(1, elapsed / 2000)
      setPressure(p)
      onChange({ valueA: posX, valueB: p })
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
  }, [posX, onChange])

  const stopPressure = useCallback(() => {
    pressedRef.current = false
    setIsPressed(false)
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    setPressure(0)
    onChange({ valueA: posX, valueB: 0 })
  }, [posX, onChange])

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = (e.clientX - rect.left) / rect.width
      setPosX(Math.max(0, Math.min(1, x)))
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      startPressure()
    },
    [startPressure],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pressedRef.current) return
      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      setPosX(x)
    },
    [],
  )

  const handlePointerUp = useCallback(() => {
    stopPressure()
  }, [stopPressure])

  const ringSize = 20 + pressure * 60

  return (
    <div
      ref={areaRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: W,
        height: H,
        position: 'relative',
        background: 'var(--bg-surface)',
        borderRadius: 8,
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        touchAction: 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Pulsing ring */}
      <div
        style={{
          position: 'absolute',
          left: `${posX * 100}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `2px solid rgba(255,255,255,${0.15 + pressure * 0.4})`,
          background: `rgba(255,255,255,${pressure * 0.06})`,
          transition: isPressed ? 'none' : 'all 0.3s ease',
        }}
      />

      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          left: `${posX * 100}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: `rgba(255,255,255,${0.4 + pressure * 0.6})`,
        }}
      />

      {/* Label */}
      <span
        style={{
          position: 'absolute',
          bottom: 6,
          right: 8,
          fontSize: 9,
          color: 'var(--text-muted)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      >
        hold to pressure
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// #20 Gyroscope
// ─────────────────────────────────────────────
function GyroscopeDemo({ onChange }: DemoProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [tiltX, setTiltX] = useState(0.5)
  const [tiltY, setTiltY] = useState(0.5)
  const [usingGyro, setUsingGyro] = useState(false)

  const W = 240
  const H = 160

  // DeviceOrientation for mobile
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      setUsingGyro(true)
      // beta: -180..180 (front-back tilt), gamma: -90..90 (left-right tilt)
      const normalizedX = Math.max(0, Math.min(1, (e.gamma + 45) / 90))
      const normalizedY = Math.max(0, Math.min(1, (e.beta + 45) / 90))
      setTiltX(normalizedX)
      setTiltY(normalizedY)
      onChange({ valueA: normalizedX, valueB: normalizedY })
    }

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handler)
    }
    return () => {
      window.removeEventListener('deviceorientation', handler)
    }
  }, [onChange])

  // Mouse fallback for desktop
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (usingGyro) return
      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
      setTiltX(x)
      setTiltY(y)
      onChange({ valueA: x, valueB: y })
    },
    [usingGyro, onChange],
  )

  // Map 0-1 to rotation degrees (-20 to 20)
  const rotateY = (tiltX - 0.5) * 40
  const rotateX = -(tiltY - 0.5) * 40

  return (
    <div
      ref={areaRef}
      onPointerMove={handlePointerMove}
      style={{
        width: W,
        height: H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 400,
        cursor: 'crosshair',
        touchAction: 'none',
      }}
    >
      <div
        style={{
          width: 140,
          height: 100,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.1s ease-out',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          boxShadow: `${rotateY * 0.5}px ${rotateX * 0.5}px 20px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Grid pattern on card */}
        <svg width="60" height="40" viewBox="0 0 60 40" style={{ opacity: 0.2 }}>
          {[0, 15, 30, 45, 60].map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={40} stroke="white" strokeWidth={0.5} />
          ))}
          {[0, 10, 20, 30, 40].map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={60} y2={y} stroke="white" strokeWidth={0.5} />
          ))}
        </svg>
        <span
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            opacity: 0.5,
          }}
        >
          {usingGyro ? 'gyroscope' : 'mouse'}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// #21 Path Draw
// ─────────────────────────────────────────────
function PathDrawDemo({ onChange }: DemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const startRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const endRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const W = 240
  const H = 160

  const getCtx = useCallback(() => {
    return canvasRef.current?.getContext('2d') ?? null
  }, [])

  const clearCanvas = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    ctx.clearRect(0, 0, W, H)
  }, [getCtx])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      clearCanvas()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      startRef.current = { x, y }
      endRef.current = { x, y }
      drawingRef.current = true

      const ctx = getCtx()
      if (!ctx) return
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [clearCanvas, getCtx],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawingRef.current) return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      endRef.current = { x, y }

      const ctx = getCtx()
      if (!ctx) return
      ctx.lineTo(x, y)
      ctx.stroke()
    },
    [getCtx],
  )

  const handlePointerUp = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current = false
    onChange({
      valueA: Math.max(0, Math.min(1, startRef.current.x / W)),
      valueB: Math.max(0, Math.min(1, endRef.current.y / H)),
    })
  }, [onChange])

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: W,
          height: H,
          background: 'var(--bg-surface)',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
          cursor: 'crosshair',
          touchAction: 'none',
          display: 'block',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: 6,
          right: 8,
          fontSize: 9,
          color: 'var(--text-muted)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      >
        draw a stroke
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// #22 Joystick
// ─────────────────────────────────────────────
function JoystickDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const draggingRef = useRef(false)

  const BOUNDARY_R = 80
  const KNOB_R = 20

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      draggingRef.current = true
      setIsDragging(true)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      let dx = e.clientX - cx
      let dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = BOUNDARY_R - KNOB_R
      if (dist > maxDist) {
        dx = (dx / dist) * maxDist
        dy = (dy / dist) * maxDist
      }
      setKnobPos({ x: dx, y: dy })
      onChange({
        valueA: 0.5 + dx / (2 * maxDist),
        valueB: 0.5 + dy / (2 * maxDist),
      })
    },
    [onChange],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      let dx = e.clientX - cx
      let dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = BOUNDARY_R - KNOB_R
      if (dist > maxDist) {
        dx = (dx / dist) * maxDist
        dy = (dy / dist) * maxDist
      }
      setKnobPos({ x: dx, y: dy })
      onChange({
        valueA: 0.5 + dx / (2 * maxDist),
        valueB: 0.5 + dy / (2 * maxDist),
      })
    },
    [onChange],
  )

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false
    setIsDragging(false)
    setKnobPos({ x: 0, y: 0 })
    onChange({ valueA: 0.5, valueB: 0.5 })
  }, [onChange])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: BOUNDARY_R * 2,
        height: BOUNDARY_R * 2,
        position: 'relative',
        borderRadius: '50%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        cursor: 'grab',
        touchAction: 'none',
      }}
    >
      {/* Crosshairs */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <line
          x1={BOUNDARY_R}
          y1={10}
          x2={BOUNDARY_R}
          y2={BOUNDARY_R * 2 - 10}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
        <line
          x1={10}
          y1={BOUNDARY_R}
          x2={BOUNDARY_R * 2 - 10}
          y2={BOUNDARY_R}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
      </svg>

      {/* Knob */}
      <div
        style={{
          position: 'absolute',
          left: BOUNDARY_R + knobPos.x - KNOB_R,
          top: BOUNDARY_R + knobPos.y - KNOB_R,
          width: KNOB_R * 2,
          height: KNOB_R * 2,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: '2px solid rgba(255,255,255,0.4)',
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging
            ? 'none'
            : 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: isDragging ? '0 0 12px rgba(255,255,255,0.1)' : 'none',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────
export function GestureDemos() {
  return (
    <>
      <DemoCard number={17} title="Pinch">
        {(props) => <PinchDemo {...props} />}
      </DemoCard>
      <DemoCard number={18} title="Two-Zone">
        {(props) => <TwoZoneDemo {...props} />}
      </DemoCard>
      <DemoCard number={19} title="Pressure + Position">
        {(props) => <PressurePositionDemo {...props} />}
      </DemoCard>
      <DemoCard number={20} title="Gyroscope">
        {(props) => <GyroscopeDemo {...props} />}
      </DemoCard>
      <DemoCard number={21} title="Path Draw">
        {(props) => <PathDrawDemo {...props} />}
      </DemoCard>
      <DemoCard number={22} title="Joystick">
        {(props) => <JoystickDemo {...props} />}
      </DemoCard>
    </>
  )
}
