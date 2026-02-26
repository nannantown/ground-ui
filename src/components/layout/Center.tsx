import { forwardRef, type HTMLAttributes, type ElementType } from 'react'
import { cn } from '../../cn'

interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Make it take full height of parent */
  fullHeight?: boolean
  /** Inline centering (inline-flex instead of flex) */
  inline?: boolean
  /** HTML element to render as */
  as?: 'div' | 'section' | 'span'
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ fullHeight = false, inline = false, as = 'div', className, style, children, ...props }, ref) => {
    const Tag = as as ElementType

    return (
      <Tag
        ref={ref}
        className={cn('center', className)}
        style={{
          ...(inline ? { display: 'inline-flex' } : undefined),
          ...(fullHeight ? { height: '100%' } : undefined),
          ...style,
        }}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

Center.displayName = 'Center'
