
import { useState, useRef, useCallback, useEffect } from 'react'
import { DemoCard, type DemoProps } from './DemoCard'

// ─── #36 Scroll + Cursor ───────────────────────────────────────
function ScrollCursorDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [cursorX, setCursorX] = useState(0.5)

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const maxScroll = el.scrollHeight - el.clientHeight
      const normalized = maxScroll > 0 ? el.scrollTop / maxScroll : 0
      setScrollY(normalized)
      onChange({ valueA: normalized, valueB: cursorX })
    },
    [cursorX, onChange]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const normalized = (e.clientX - rect.left) / rect.width
      const clamped = Math.max(0, Math.min(1, normalized))
      setCursorX(clamped)
      onChange({ valueA: scrollY, valueB: clamped })
    },
    [scrollY, onChange]
  )

  // Generate gradient stops based on scroll position
  const gradientOffset = scrollY * 100

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      onMouseMove={handleMouseMove}
      style={{
        width: 240,
        height: 180,
        overflow: 'auto',
        borderRadius: 8,
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        cursor: 'crosshair',
      }}
    >
      <div
        style={{
          height: 800,
          background: `linear-gradient(
            180deg,
            hsla(${200 + gradientOffset}, 60%, 15%, 1) 0%,
            hsla(${260 + gradientOffset}, 60%, 12%, 1) 33%,
            hsla(${320 + gradientOffset}, 60%, 10%, 1) 66%,
            hsla(${30 + gradientOffset}, 60%, 8%, 1) 100%
          )`,
          position: 'relative',
          transition: 'background 0.1s ease',
        }}
      >
        {/* Scroll indicators */}
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: i * 80,
              left: 0,
              right: 0,
              height: 1,
              background: 'rgba(255,255,255,0.06)',
            }}
          />
        ))}

        {/* Cursor trail dot */}
        <div
          style={{
            position: 'sticky',
            top: '50%',
            left: `${cursorX * 100}%`,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            boxShadow: '0 0 12px rgba(255,255,255,0.3)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            transition: 'left 0.05s ease',
          }}
        />

        {/* Instruction */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            width: '100%',
            textAlign: 'center',
            fontSize: 10,
            color: 'rgba(255,255,255,0.25)',
            pointerEvents: 'none',
          }}
        >
          Scroll and move cursor
        </div>
      </div>
    </div>
  )
}

// ─── #37 Camera Color ──────────────────────────────────────────
function CameraColorDemo({ onChange }: DemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const [hasCamera, setHasCamera] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imgCanvasRef = useRef<HTMLCanvasElement>(null)

  const sampleColors = useCallback(
    (sourceCanvas: HTMLCanvasElement, width: number, height: number) => {
      const ctx = sourceCanvas.getContext('2d')
      if (!ctx) return

      // Sample left half
      const leftData = ctx.getImageData(0, 0, Math.floor(width / 2), height).data
      let lR = 0, lG = 0, lB = 0, lCount = 0
      for (let i = 0; i < leftData.length; i += 16) {
        lR += leftData[i]
        lG += leftData[i + 1]
        lB += leftData[i + 2]
        lCount++
      }
      if (lCount > 0) {
        lR /= lCount; lG /= lCount; lB /= lCount
      }

      // Sample right half
      const rightData = ctx.getImageData(Math.floor(width / 2), 0, Math.ceil(width / 2), height).data
      let rR = 0, rG = 0, rB = 0, rCount = 0
      for (let i = 0; i < rightData.length; i += 16) {
        rR += rightData[i]
        rG += rightData[i + 1]
        rB += rightData[i + 2]
        rCount++
      }
      if (rCount > 0) {
        rR /= rCount; rG /= rCount; rB /= rCount
      }

      // Convert to approximate hue (0-1)
      const rgbToHue = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const d = max - min
        if (d === 0) return 0
        let h = 0
        if (max === r) h = ((g - b) / d) % 6
        else if (max === g) h = (b - r) / d + 2
        else h = (r - g) / d + 4
        h /= 6
        if (h < 0) h += 1
        return h
      }

      onChange({
        valueA: rgbToHue(lR, lG, lB),
        valueB: rgbToHue(rR, rG, rB),
      })
    },
    [onChange]
  )

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 160, height: 120 } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setHasCamera(true)
        setPermissionDenied(false)
      }
    } catch {
      setPermissionDenied(true)
    }
  }, [])

  // Camera frame sampling loop
  useEffect(() => {
    if (!hasCamera) return

    const sample = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const w = 40
      const h = 30
      canvas.width = w
      canvas.height = h
      ctx.drawImage(video, 0, 0, w, h)
      sampleColors(canvas, w, h)
      rafRef.current = requestAnimationFrame(sample)
    }

    rafRef.current = requestAnimationFrame(sample)
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [hasCamera, sampleColors])

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const img = new Image()
      img.onload = () => {
        const canvas = imgCanvasRef.current
        if (!canvas) return
        const w = 40
        const h = 30
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0, w, h)
        sampleColors(canvas, w, h)
        setImageLoaded(true)
      }
      img.src = URL.createObjectURL(file)
    },
    [sampleColors]
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
      {hasCamera ? (
        <div
          style={{
            width: 200,
            height: 140,
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
          }}
        >
          <video
            ref={videoRef}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            playsInline
            muted
          />
          {/* Dividing line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 1,
              height: '100%',
              background: 'rgba(255,255,255,0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: 8,
              fontSize: 8,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            L
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              right: 8,
              fontSize: 8,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            R
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}
          >
            {permissionDenied
              ? 'Camera access denied'
              : 'Camera access needed'}
          </div>
          <button
            onClick={startCamera}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            Enable Camera
          </button>
          <div
            style={{
              width: '100%',
              height: 1,
              background: 'rgba(255,255,255,0.08)',
              margin: '4px 0',
            }}
          />
          <label
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 10,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'center',
            }}
          >
            {imageLoaded ? 'Image loaded' : 'Upload image instead'}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}

      {/* Hidden canvases for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={imgCanvasRef} style={{ display: 'none' }} />
    </div>
  )
}

// ─── #38 Time-Based ────────────────────────────────────────────
function TimeBasedDemo({ onChange }: DemoProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now)
      onChange({
        valueA: now.getHours() / 23,
        valueB: now.getMinutes() / 59,
      })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [onChange])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  // Clock angles
  const hourAngle = ((hours % 12) + minutes / 60) * 30 - 90
  const minuteAngle = (minutes + seconds / 60) * 6 - 90
  const secondAngle = seconds * 6 - 90

  const cx = 80
  const cy = 70
  const r = 55

  const angleToPoint = (angle: number, length: number) => ({
    x: cx + Math.cos((angle * Math.PI) / 180) * length,
    y: cy + Math.sin((angle * Math.PI) / 180) * length,
  })

  const hourEnd = angleToPoint(hourAngle, r * 0.5)
  const minuteEnd = angleToPoint(minuteAngle, r * 0.72)
  const secondEnd = angleToPoint(secondAngle, r * 0.8)

  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <svg width={160} height={140}>
        {/* Face */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1.5}
        />

        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30 - 90
          const outer = angleToPoint(angle, r - 2)
          const inner = angleToPoint(angle, r - (i % 3 === 0 ? 10 : 6))
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={
                i % 3 === 0
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.1)'
              }
              strokeWidth={i % 3 === 0 ? 1.5 : 1}
            />
          )
        })}

        {/* Hour hand */}
        <line
          x1={cx}
          y1={cy}
          x2={hourEnd.x}
          y2={hourEnd.y}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={cx}
          y1={cy}
          x2={minuteEnd.x}
          y2={minuteEnd.y}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1={cx}
          y1={cy}
          x2={secondEnd.x}
          y2={secondEnd.y}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={0.8}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={2.5} fill="rgba(255,255,255,0.6)" />
      </svg>

      {/* Digital display */}
      <span
        style={{
          fontSize: 16,
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: 2,
        }}
      >
        {timeStr}
      </span>
    </div>
  )
}

// ─── #39 Audio Input ───────────────────────────────────────────
function AudioInputDemo({ onChange }: DemoProps) {
  const [hasAudio, setHasAudio] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      setHasAudio(true)
      setPermissionDenied(false)
    } catch {
      setPermissionDenied(true)
    }
  }, [])

  // Visualization loop
  useEffect(() => {
    if (!hasAudio) return

    const draw = () => {
      const analyser = analyserRef.current
      const canvas = canvasRef.current
      if (!analyser || !canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const W = 200
      const H = 100
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, W, H)

      // Calculate RMS volume
      const timeData = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(timeData)
      let rms = 0
      for (let i = 0; i < timeData.length; i++) {
        const val = (timeData[i] - 128) / 128
        rms += val * val
      }
      rms = Math.sqrt(rms / timeData.length)
      const normalizedVolume = Math.min(1, rms * 4)

      // Find dominant frequency
      let maxVal = 0
      let maxIndex = 0
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxVal) {
          maxVal = dataArray[i]
          maxIndex = i
        }
      }
      const normalizedFreq = maxIndex / bufferLength

      onChange({
        valueA: normalizedFreq,
        valueB: normalizedVolume,
      })

      // Draw bars
      const barCount = 16
      const barWidth = (W - (barCount - 1) * 3) / barCount
      const step = Math.floor(bufferLength / barCount)

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i * step] / 255
        const barHeight = Math.max(2, val * H * 0.85)
        const x = i * (barWidth + 3)
        const y = H - barHeight

        const alpha = 0.2 + val * 0.6
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hasAudio, onChange])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      audioCtxRef.current?.close()
    }
  }, [])

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
      {hasAudio ? (
        <canvas
          ref={canvasRef}
          width={200}
          height={100}
          style={{ borderRadius: 6 }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}
          >
            {permissionDenied
              ? 'Microphone access denied'
              : 'Microphone access needed'}
          </div>
          <button
            onClick={startAudio}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            Enable Microphone
          </button>
        </div>
      )}
    </div>
  )
}

// ─── #40 Gaze Simulation ───────────────────────────────────────
function GazeSimulationDemo({ onChange }: DemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gazePos, setGazePos] = useState({ x: 0.5, y: 0.5 })
  const [dwellTime, setDwellTime] = useState(0)
  const lastMoveRef = useRef(Date.now())
  const lastPosRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)

  const W = 240
  const H = 200
  const maxDwell = 3000 // 3 seconds for full dwell

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const elapsed = now - lastMoveRef.current
      const newDwell = Math.min(maxDwell, elapsed)
      setDwellTime(newDwell)

      const normalizedDwell = newDwell / maxDwell
      onChange({
        valueA: lastPosRef.current.x,
        valueB: normalizedDwell,
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onChange])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

      // Check if mouse has moved significantly
      const dx = x - lastPosRef.current.x
      const dy = y - lastPosRef.current.y
      if (Math.hypot(dx, dy) > 0.02) {
        lastMoveRef.current = Date.now()
        setDwellTime(0)
      }

      lastPosRef.current = { x, y }
      setGazePos({ x, y })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    lastMoveRef.current = Date.now()
    setDwellTime(0)
  }, [])

  const normalizedDwell = dwellTime / maxDwell
  const heatSize = 40 + normalizedDwell * 80
  const heatOpacity = 0.1 + normalizedDwell * 0.4

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: W,
        height: H,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'none',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Heatmap radial gradient */}
      <div
        style={{
          position: 'absolute',
          left: gazePos.x * W - heatSize / 2,
          top: gazePos.y * H - heatSize / 2,
          width: heatSize,
          height: heatSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,200,100,${heatOpacity}) 0%, rgba(255,100,50,${heatOpacity * 0.5}) 40%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'width 0.3s ease, height 0.3s ease, opacity 0.1s ease',
        }}
      />

      {/* Gaze cursor */}
      <div
        style={{
          position: 'absolute',
          left: gazePos.x * W - 4,
          top: gazePos.y * H - 4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: `rgba(255,255,255,${0.4 + normalizedDwell * 0.5})`,
          pointerEvents: 'none',
          boxShadow: `0 0 ${4 + normalizedDwell * 12}px rgba(255,255,255,${0.2 + normalizedDwell * 0.3})`,
          transition: 'box-shadow 0.3s ease',
        }}
      />

      {/* Dwell indicator ring */}
      <svg
        style={{
          position: 'absolute',
          left: gazePos.x * W - 16,
          top: gazePos.y * H - 16,
          width: 32,
          height: 32,
          pointerEvents: 'none',
        }}
      >
        <circle
          cx={16}
          cy={16}
          r={12}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1}
        />
        <circle
          cx={16}
          cy={16}
          r={12}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={1.5}
          strokeDasharray={`${normalizedDwell * 75.4} 75.4`}
          strokeLinecap="round"
          transform="rotate(-90, 16, 16)"
        />
      </svg>

      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          width: '100%',
          textAlign: 'center',
          fontSize: 9,
          color: 'rgba(255,255,255,0.2)',
          pointerEvents: 'none',
        }}
      >
        Hold gaze to increase dwell
      </div>
    </div>
  )
}

// ─── Export ──────────────────────────────────────────────────────
export function AmbientDemos() {
  return (
    <>
      <DemoCard number={36} title="Scroll + Cursor">
        {(props) => <ScrollCursorDemo {...props} />}
      </DemoCard>
      <DemoCard number={37} title="Camera Color">
        {(props) => <CameraColorDemo {...props} />}
      </DemoCard>
      <DemoCard number={38} title="Time-Based">
        {(props) => <TimeBasedDemo {...props} />}
      </DemoCard>
      <DemoCard number={39} title="Audio Input">
        {(props) => <AudioInputDemo {...props} />}
      </DemoCard>
      <DemoCard number={40} title="Gaze Simulation">
        {(props) => <GazeSimulationDemo {...props} />}
      </DemoCard>
    </>
  )
}
