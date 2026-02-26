import {
  useState,
  useEffect,
  useRef,
  Children,
  type ReactNode,
  type CSSProperties,
} from 'react'

interface CrossFadeProps {
  /** Which child to show — false = first child, true = second child */
  show: boolean
  /** Transition duration in milliseconds */
  duration?: number
  /** Additional class name for the container */
  className?: string
  /** Exactly 2 children */
  children: ReactNode
}

type Phase = 'idle' | 'transitioning'

export function CrossFade({
  show,
  duration = 200,
  className,
  children,
}: CrossFadeProps) {
  const childArray = Children.toArray(children)

  if (childArray.length !== 2) {
    console.warn(
      'CrossFade: expects exactly 2 children, received ' + childArray.length
    )
  }

  const first = childArray[0] ?? null
  const second = childArray[1] ?? null

  const [activeIndex, setActiveIndex] = useState(show ? 1 : 0)
  const [phase, setPhase] = useState<Phase>('idle')
  const prevShow = useRef(show)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect when `show` changes
  useEffect(() => {
    if (show === prevShow.current) return
    prevShow.current = show

    // Start transition
    setPhase('transitioning')

    // Clear any pending timer
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      setActiveIndex(show ? 1 : 0)
      setPhase('idle')
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [show, duration])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const isTransitioning = phase === 'transitioning'
  const targetIndex = show ? 1 : 0

  const containerStyle: CSSProperties = {
    position: 'relative',
    // When transitioning, use grid stacking so both children overlap
    ...(isTransitioning
      ? {
          display: 'grid',
        }
      : {}),
  }

  const layerStyle = (index: number): CSSProperties => {
    const isTarget = index === targetIndex
    const isVisible = isTransitioning || index === activeIndex

    if (!isVisible) {
      return { display: 'none' }
    }

    if (isTransitioning) {
      return {
        gridArea: '1 / 1',
        opacity: isTarget ? 1 : 0,
        transition: `opacity ${duration}ms ease`,
        pointerEvents: isTarget ? 'auto' : 'none',
      }
    }

    // idle — only active child shown
    return {
      opacity: 1,
    }
  }

  return (
    <div className={className} style={containerStyle}>
      <div style={layerStyle(0)}>
        {first}
      </div>
      <div style={layerStyle(1)}>
        {second}
      </div>
    </div>
  )
}

CrossFade.displayName = 'CrossFade'
