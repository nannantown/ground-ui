import {
  useState,
  useRef,
  useEffect,
  useCallback,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../cn'

type PopoverSide = 'top' | 'bottom' | 'left' | 'right'
type PopoverAlign = 'start' | 'center' | 'end'

interface PopoverProps {
  /** The element that triggers the popover on click */
  trigger: ReactElement
  /** Popover content */
  children: ReactNode
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Which side of the trigger to place the popover */
  side?: PopoverSide
  /** Alignment along the side axis */
  align?: PopoverAlign
  /** Additional class name for the popover panel */
  className?: string
}

/** Gap between the trigger and the popover panel (px) */
const OFFSET = 8

function computePosition(
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  side: PopoverSide,
  align: PopoverAlign
): { top: number; left: number } {
  let top = 0
  let left = 0

  // Position along the primary axis (side)
  switch (side) {
    case 'bottom':
      top = triggerRect.bottom + OFFSET
      break
    case 'top':
      top = triggerRect.top - popoverRect.height - OFFSET
      break
    case 'left':
      left = triggerRect.left - popoverRect.width - OFFSET
      break
    case 'right':
      left = triggerRect.right + OFFSET
      break
  }

  // Alignment along the cross axis
  if (side === 'bottom' || side === 'top') {
    switch (align) {
      case 'start':
        left = triggerRect.left
        break
      case 'center':
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
        break
      case 'end':
        left = triggerRect.right - popoverRect.width
        break
    }
  } else {
    // side is 'left' or 'right'
    switch (align) {
      case 'start':
        top = triggerRect.top
        break
      case 'center':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
        break
      case 'end':
        top = triggerRect.bottom - popoverRect.height
        break
    }
  }

  // Clamp to viewport bounds
  const padding = 8
  top = Math.max(padding, Math.min(top, window.innerHeight - popoverRect.height - padding))
  left = Math.max(padding, Math.min(left, window.innerWidth - popoverRect.width - padding))

  return { top, left }
}

export function Popover({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  className,
}: PopoverProps) {
  const isControlled = controlledOpen !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next)
      }
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  const toggle = useCallback(() => {
    setOpen(!isOpen)
  }, [isOpen, setOpen])

  // Calculate position when popover opens or side/align changes
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect()
      const popoverEl = popoverRef.current
      if (!popoverEl) return

      const popoverRect = popoverEl.getBoundingClientRect()
      setPosition(computePosition(triggerRect, popoverRect, side, align))
    }

    // Use rAF to ensure the popover is rendered and measurable
    const frameId = requestAnimationFrame(updatePosition)
    return () => cancelAnimationFrame(frameId)
  }, [isOpen, side, align])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    // Defer listener attachment to avoid catching the opening click
    const frameId = requestAnimationFrame(() => {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKey)
    })

    return () => {
      cancelAnimationFrame(frameId)
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, setOpen])

  // Clone trigger to attach ref wrapper and click handler
  const triggerElement = isValidElement(trigger) ? (
    <div
      ref={triggerRef}
      onClick={toggle}
      style={{ display: 'inline-block' }}
    >
      {cloneElement(trigger)}
    </div>
  ) : null

  return (
    <>
      {triggerElement}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className={cn('popover', className)}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  )
}
