import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../cn'

interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  as?: 'span' | 'div'
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Component = 'span', className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLSpanElement & HTMLDivElement>}
        className={cn('sr-only', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

VisuallyHidden.displayName = 'VisuallyHidden'
