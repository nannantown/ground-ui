import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../cn'

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Scroll direction */
  direction?: 'vertical' | 'horizontal' | 'both'
  /** Max height (required for vertical scroll to work) */
  maxHeight?: string
  /** Max width (for horizontal scroll) */
  maxWidth?: string
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      direction = 'vertical',
      maxHeight,
      maxWidth,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isVertical = direction === 'vertical' || direction === 'both'
    const isHorizontal = direction === 'horizontal' || direction === 'both'

    return (
      <div
        ref={ref}
        className={cn(
          isVertical && 'scroll-area',
          isHorizontal && 'scroll-x',
          className
        )}
        style={{
          ...(maxHeight ? { maxHeight } : undefined),
          ...(maxWidth ? { maxWidth } : undefined),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'
