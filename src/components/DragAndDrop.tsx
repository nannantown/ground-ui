import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ReactNode,
} from 'react'

// ─── DragItem ─────────────────────────────────────────────

interface DragItemProps {
  /** Unique identifier for this draggable */
  id: string
  /** Payload transferred to the drop zone */
  data?: unknown
  /** Render prop — receives isDragging state */
  children: (state: { isDragging: boolean }) => ReactNode
  /** Disable dragging */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

/** MIME type key for inter-component data transfer */
const MIME_TYPE = 'application/x-ground-drag'

export function DragItem({
  id,
  data,
  children,
  disabled = false,
  className,
}: DragItemProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (disabled) {
        e.preventDefault()
        return
      }

      const payload = JSON.stringify({ id, data })
      e.dataTransfer.setData(MIME_TYPE, payload)
      e.dataTransfer.effectAllowed = 'move'
      setIsDragging(true)
    },
    [id, data, disabled]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={className}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: disabled ? 'default' : 'grab',
        transition: 'opacity 0.15s ease',
      }}
    >
      {children({ isDragging })}
    </div>
  )
}

DragItem.displayName = 'DragItem'

// ─── DropZone ─────────────────────────────────────────────

interface DropPayload {
  id: string
  data: unknown
}

interface DropZoneProps {
  /** Called with the dragged payload when a valid item is dropped */
  onDrop: (payload: DropPayload) => void
  /** Render prop — receives isOver and canDrop states */
  children: (state: { isOver: boolean; canDrop: boolean }) => ReactNode
  /** Filter function to decide if a payload is acceptable */
  accept?: (payload: DropPayload) => boolean
  /** Additional class name */
  className?: string
}

export function DropZone({
  onDrop,
  children,
  accept,
  className,
}: DropZoneProps) {
  const [isOver, setIsOver] = useState(false)
  const [canDrop, setCanDrop] = useState(false)
  const enterCount = useRef(0)

  const extractPayload = useCallback(
    (e: DragEvent<HTMLDivElement>): DropPayload | null => {
      try {
        const raw = e.dataTransfer.getData(MIME_TYPE)
        if (!raw) return null
        return JSON.parse(raw) as DropPayload
      } catch {
        return null
      }
    },
    []
  )

  const checkAccept = useCallback(
    (e: DragEvent<HTMLDivElement>): boolean => {
      // During dragenter/dragover we cannot read getData (security),
      // so we check if the MIME type is present in the types list
      const hasType = e.dataTransfer.types.includes(MIME_TYPE)
      if (!hasType) return false
      // If no accept filter, allow all
      if (!accept) return true
      // We can only fully validate on drop
      return true
    },
    [accept]
  )

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      enterCount.current += 1

      const valid = checkAccept(e)
      setIsOver(true)
      setCanDrop(valid)
    },
    [checkAccept]
  )

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    },
    []
  )

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      enterCount.current -= 1
      if (enterCount.current <= 0) {
        enterCount.current = 0
        setIsOver(false)
        setCanDrop(false)
      }
    },
    []
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      enterCount.current = 0
      setIsOver(false)
      setCanDrop(false)

      const payload = extractPayload(e)
      if (!payload) return

      if (accept && !accept(payload)) return

      onDrop(payload)
    },
    [extractPayload, accept, onDrop]
  )

  const activeStyles: React.CSSProperties =
    isOver && canDrop
      ? {
          outline: '2px dashed var(--accent)',
          outlineOffset: -2,
          background: 'var(--accent-bg, rgba(99,102,241,0.08))',
        }
      : {}

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={className}
      style={{
        borderRadius: 'var(--radius-md, 8px)',
        transition: 'outline 0.15s ease, background-color 0.15s ease',
        ...activeStyles,
      }}
    >
      {children({ isOver, canDrop })}
    </div>
  )
}

DropZone.displayName = 'DropZone'
