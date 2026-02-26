import { forwardRef, createElement, type HTMLAttributes, type CSSProperties } from 'react'
import { cn } from '../../cn'

type StackDirection = 'vertical' | 'horizontal'
type StackGap = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection
  gap?: StackGap
  align?: StackAlign
  justify?: StackJustify
  wrap?: boolean
  /** Reverse direction on mobile (e.g., horizontal on desktop, vertical on mobile) */
  responsive?: boolean
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'nav' | 'header' | 'footer'
}

const alignMap: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const justifyMap: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'vertical',
      gap = 'md',
      align,
      justify,
      wrap = false,
      responsive = false,
      as = 'div',
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const inlineStyle: CSSProperties = {
      display: 'flex',
      flexDirection: responsive ? undefined : (direction === 'vertical' ? 'column' : 'row'),
      gap: `var(--space-${gap})`,
      ...(align && { alignItems: alignMap[align] }),
      ...(justify && { justifyContent: justifyMap[justify] }),
      ...(wrap && { flexWrap: 'wrap' }),
      ...style,
    }

    return createElement(
      as,
      {
        ref,
        className: cn(
          responsive && 'responsive-stack',
          className
        ) || undefined,
        style: inlineStyle,
        ...props,
      },
      children
    )
  }
)

Stack.displayName = 'Stack'

export type { StackProps, StackDirection, StackGap, StackAlign, StackJustify }
