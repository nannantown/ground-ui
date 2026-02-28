
import { useState, useRef, useCallback, useEffect } from 'react'
import { DemoCard, type DemoProps } from './DemoCard'

// ─── #8 Scatter Grid ─────────────────────────────────────────────
function ScatterGridDemo({ onChange }: DemoProps) {
  const cols = 5
  const rows = 8
  const cellSize = 28
  const gap = 2
  const [selected, setSelected] = useState<{ col: number; row: number } | null>(null)

  const handleClick = useCallback(
    (col: number, row: number) => {
      setSelected({ col, row })
      onChange({ valueA: col / (cols - 1), valueB: row / (rows - 1) })
    },
    [onChange]
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gap,
      }}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const isSelected = selected?.col === col && selected?.row === row
          const hue = (col / (cols - 1)) * 360
          const lightness = 20 + (row / (rows - 1)) * 25
          return (
            <button
              key={`${col}-${row}`}
              onClick={() => handleClick(col, row)}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 4,
                border: isSelected
                  ? '2px solid var(--accent)'
                  : '1px solid var(--border-subtle)',
                background: `hsl(${hue}, 40%, ${lightness}%)`,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, transform 0.1s ease',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                padding: 0,
              }}
            />
          )
        })
      )}
    </div>
  )
}

// ─── #9 Ableton Grid ────────────────────────────────────────────
function AbletonGridDemo({ onChange }: DemoProps) {
  const cols = 5
  const rows = 10
  const cellW = 36
  const cellH = 18
  const gap = 2
  const [selectedCell, setSelectedCell] = useState<{
    col: number
    row: number
  } | null>(null)

  const handleClick = useCallback(
    (col: number, row: number) => {
      setSelectedCell({ col, row })
      onChange({ valueA: row / (rows - 1), valueB: col / (cols - 1) })
    },
    [onChange]
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellH}px)`,
        gap,
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const isSelectedRow = selectedCell?.row === row
          const isSelectedCell =
            selectedCell?.col === col && selectedCell?.row === row
          return (
            <button
              key={`${col}-${row}`}
              onClick={() => handleClick(col, row)}
              style={{
                width: cellW,
                height: cellH,
                border: 'none',
                borderRadius: 2,
                background: isSelectedCell
                  ? 'var(--accent)'
                  : isSelectedRow
                    ? 'var(--accent-bg-strong)'
                    : 'var(--bg-surface)',
                cursor: 'pointer',
                transition: 'background 0.1s ease',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                if (!isSelectedCell && !isSelectedRow) {
                  e.currentTarget.style.background =
                    'var(--bg-surface-hover)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelectedCell && !isSelectedRow) {
                  e.currentTarget.style.background = 'var(--bg-surface)'
                } else if (isSelectedRow && !isSelectedCell) {
                  e.currentTarget.style.background =
                    'var(--accent-bg-strong)'
                }
              }}
            />
          )
        })
      )}
    </div>
  )
}

// ─── #10 Node Connection ────────────────────────────────────────
function NodeConnectionDemo({ onChange }: DemoProps) {
  const leftCount = 5
  const rightCount = 10
  const nodeRadius = 10
  const leftLabels = ['A', 'B', 'C', 'D', 'E']
  const containerRef = useRef<HTMLDivElement>(null)
  const [connection, setConnection] = useState<{
    left: number
    right: number
  } | null>(null)
  const [dragging, setDragging] = useState<{
    leftIndex: number
    mouseX: number
    mouseY: number
  } | null>(null)

  const leftNodesRef = useRef<(HTMLDivElement | null)[]>([])
  const rightNodesRef = useRef<(HTMLDivElement | null)[]>([])

  const getNodeCenter = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el || !containerRef.current) return { x: 0, y: 0 }
      const containerRect = containerRef.current.getBoundingClientRect()
      const rect = el.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      }
    },
    []
  )

  const handlePointerDown = useCallback(
    (leftIndex: number, e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return
      setDragging({
        leftIndex,
        mouseX: e.clientX - containerRect.left,
        mouseY: e.clientY - containerRect.top,
      })
    },
    []
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      setDragging((prev) =>
        prev
          ? {
              ...prev,
              mouseX: e.clientX - containerRect.left,
              mouseY: e.clientY - containerRect.top,
            }
          : null
      )
    },
    [dragging]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top

      // Find closest right node
      let closestRight = -1
      let closestDist = Infinity
      for (let i = 0; i < rightCount; i++) {
        const center = getNodeCenter(rightNodesRef.current[i])
        const dist = Math.hypot(center.x - mouseX, center.y - mouseY)
        if (dist < closestDist && dist < 30) {
          closestDist = dist
          closestRight = i
        }
      }

      if (closestRight >= 0) {
        setConnection({ left: dragging.leftIndex, right: closestRight })
        onChange({
          valueA: dragging.leftIndex / (leftCount - 1),
          valueB: closestRight / (rightCount - 1),
        })
      }
      setDragging(null)
    },
    [dragging, getNodeCenter, onChange]
  )

  // Build SVG path
  const connectionPath = (() => {
    if (!connection) return null
    const start = getNodeCenter(leftNodesRef.current[connection.left])
    const end = getNodeCenter(rightNodesRef.current[connection.right])
    const cpOffset = (end.x - start.x) * 0.5
    return `M ${start.x} ${start.y} C ${start.x + cpOffset} ${start.y}, ${end.x - cpOffset} ${end.y}, ${end.x} ${end.y}`
  })()

  const draggingPath = (() => {
    if (!dragging) return null
    const start = getNodeCenter(leftNodesRef.current[dragging.leftIndex])
    const end = { x: dragging.mouseX, y: dragging.mouseY }
    const cpOffset = (end.x - start.x) * 0.5
    return `M ${start.x} ${start.y} C ${start.x + cpOffset} ${start.y}, ${end.x - cpOffset} ${end.y}, ${end.x} ${end.y}`
  })()

  // Force re-render after mount to calculate positions
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'relative',
        width: '100%',
        height: 200,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* SVG overlay for connection lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {mounted && connectionPath && (
          <path
            d={connectionPath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            opacity={0.8}
          />
        )}
        {mounted && draggingPath && (
          <path
            d={draggingPath}
            fill="none"
            stroke="var(--accent-light)"
            strokeWidth={2}
            strokeDasharray="4 4"
            opacity={0.6}
          />
        )}
      </svg>

      {/* Left nodes */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        {leftLabels.map((label, i) => (
          <div
            key={label}
            ref={(el) => {
              leftNodesRef.current[i] = el
            }}
            onPointerDown={(e) => handlePointerDown(i, e)}
            style={{
              width: nodeRadius * 2,
              height: nodeRadius * 2,
              borderRadius: '50%',
              background:
                connection?.left === i
                  ? 'var(--accent)'
                  : 'var(--bg-surface)',
              border:
                connection?.left === i
                  ? '2px solid var(--accent-light)'
                  : '2px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 600,
              color:
                connection?.left === i
                  ? '#fff'
                  : 'var(--text-secondary)',
              cursor: 'grab',
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Right nodes */}
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: rightCount }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              rightNodesRef.current[i] = el
            }}
            style={{
              width: nodeRadius * 2,
              height: nodeRadius * 2,
              borderRadius: '50%',
              background:
                connection?.right === i
                  ? 'var(--accent)'
                  : 'var(--bg-surface)',
              border:
                connection?.right === i
                  ? '2px solid var(--accent-light)'
                  : '2px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 600,
              color:
                connection?.right === i
                  ? '#fff'
                  : 'var(--text-secondary)',
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Export ──────────────────────────────────────────────────────
export function GridDemos() {
  return (
    <>
      <DemoCard number={8} title="Scatter Grid">
        {(props) => <ScatterGridDemo {...props} />}
      </DemoCard>
      <DemoCard number={9} title="Ableton Grid">
        {(props) => <AbletonGridDemo {...props} />}
      </DemoCard>
      <DemoCard number={10} title="Node Connection">
        {(props) => <NodeConnectionDemo {...props} />}
      </DemoCard>
    </>
  )
}
