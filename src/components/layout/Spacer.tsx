import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../cn'

type SpacerSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  /** Fixed size using spacing tokens. Without this, spacer expands to fill available space (flex: 1). */
  size?: SpacerSize
  /** Direction for fixed spacer. Defaults to 'vertical'. */
  axis?: 'horizontal' | 'vertical'
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ size, axis = 'vertical', className, style, ...props }, ref) => {
    // Flexible spacer: fills available space in flex container
    if (!size) {
      return (
        <div
          ref={ref}
          className={className}
          style={{ flex: 1, ...style }}
          aria-hidden="true"
          {...props}
        />
      )
    }

    // Fixed spacer: renders space using design tokens
    const sizeVar = `var(--space-${size})`
    const fixedStyle: React.CSSProperties =
      axis === 'horizontal'
        ? { width: sizeVar, height: 0, flexShrink: 0 }
        : { height: sizeVar, width: 0, flexShrink: 0 }

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{ ...fixedStyle, ...style }}
        aria-hidden="true"
        {...props}
      />
    )
  }
)

Spacer.displayName = 'Spacer'
