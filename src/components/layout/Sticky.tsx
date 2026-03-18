import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../cn'

type StickyPosition = 'top' | 'top-header' | 'bottom'

interface StickyProps extends HTMLAttributes<HTMLDivElement> {
  /** Stick position */
  position?: StickyPosition
  /** Custom offset from the sticky edge (CSS value, e.g., "60px") */
  offset?: string
}

const positionClass: Record<StickyPosition, string> = {
  top: 'sticky-top',
  'top-header': 'sticky-top-header',
  bottom: 'sticky-bottom',
}

export const Sticky = forwardRef<HTMLDivElement, StickyProps>(
  ({ position = 'top', offset, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(positionClass[position], className)}
        style={offset ? { ...style, [position === 'bottom' ? 'bottom' : 'top']: offset } : style}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Sticky.displayName = 'Sticky'
