import {
  useState,
  useRef,
  useEffect,
  useCallback,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type FocusEvent as ReactFocusEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../cn'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

/** Props shape that trigger children are expected to accept */
interface TriggerChildProps {
  onMouseEnter?: (e: ReactMouseEvent) => void
  onMouseLeave?: (e: ReactMouseEvent) => void
  onFocus?: (e: ReactFocusEvent) => void
  onBlur?: (e: ReactFocusEvent) => void
  [key: string]: unknown
}

interface TooltipProps {
  /** Tooltip text or content */
  content: ReactNode
  /** Trigger element — must accept ref and event handlers */
  children: ReactElement<TriggerChildProps>
  /** Placement side relative to the trigger */
  side?: TooltipSide
  /** Delay in ms before showing the tooltip */
  delay?: number
  /** Additional class name for the tooltip content */
  className?: string
}

const GAP = 8

function calcPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  side: TooltipSide
): { top: number; left: number } {
  let top: number
  let left: number

  switch (side) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - GAP
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = triggerRect.bottom + GAP
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - GAP
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + GAP
      break
  }

  // Viewport clamping
  const padding = 8
  top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding))
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding))

  return { top, left }
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 300,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (delayTimer.current !== null) {
      clearTimeout(delayTimer.current)
      delayTimer.current = null
    }
  }, [])

  const show = useCallback(() => {
    clearTimer()
    delayTimer.current = setTimeout(() => {
      setVisible(true)
    }, delay)
  }, [delay, clearTimer])

  const hide = useCallback(() => {
    clearTimer()
    setVisible(false)
  }, [clearTimer])

  // Recalculate position when tooltip becomes visible
  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      setPosition(calcPosition(triggerRect, tooltipRect, side))
    }
  }, [visible, side])

  // Cleanup timer on unmount
  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  // Hide on Escape key
  useEffect(() => {
    if (!visible) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [visible, hide])

  // Hide on scroll (the trigger may have moved)
  useEffect(() => {
    if (!visible) return
    const handleScroll = () => hide()
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [visible, hide])

  const childProps = children.props as TriggerChildProps

  const trigger = cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: (e: ReactMouseEvent) => {
      childProps.onMouseEnter?.(e)
      show()
    },
    onMouseLeave: (e: ReactMouseEvent) => {
      childProps.onMouseLeave?.(e)
      hide()
    },
    onFocus: (e: ReactFocusEvent) => {
      childProps.onFocus?.(e)
      show()
    },
    onBlur: (e: ReactFocusEvent) => {
      childProps.onBlur?.(e)
      hide()
    },
  } as TriggerChildProps)

  return (
    <>
      {trigger}
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={cn('tooltip-content', className)}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  )
}

Tooltip.displayName = 'Tooltip'
