import { forwardRef, createElement, type HTMLAttributes, type CSSProperties } from 'react'
import { cn } from '../../cn'

type ContainerSize = 'xs' | 'sm' | 'md' | 'article' | 'default' | 'wide' | 'lg' | 'xl' | 'full'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  /** Remove horizontal padding */
  noPadding?: boolean
  as?: 'div' | 'section' | 'main' | 'article'
}

/**
 * Maps size values to existing CSS classes from tokens.css / utilities.css.
 * Sizes that have dedicated CSS classes use those directly.
 * Sizes without dedicated classes (xs, sm, md) use inline styles
 * referencing the corresponding CSS custom properties.
 */
const sizeToClass: Partial<Record<ContainerSize, string>> = {
  default: 'container-page',
  article: 'container-article',
  wide: 'container-wide',
  lg: 'container-lg',
  xl: 'container-xl',
  full: 'container-full',
}

/** Sizes that need inline max-width via CSS custom properties */
const sizeToVar: Partial<Record<ContainerSize, string>> = {
  xs: 'var(--container-xs)',
  sm: 'var(--container-sm)',
  md: 'var(--container-md)',
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'default',
      noPadding = false,
      as = 'div',
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const cssClass = sizeToClass[size]
    const cssVar = sizeToVar[size]

    const inlineStyle: CSSProperties = {
      ...(cssVar && {
        maxWidth: cssVar,
        marginInline: 'auto',
        ...(!noPadding && { paddingInline: 'var(--space-page)' }),
      }),
      ...(noPadding && {
        paddingLeft: 0,
        paddingRight: 0,
        paddingInline: 0,
      }),
      ...style,
    }

    // Only pass style if it has properties
    const hasInlineStyle = Object.keys(inlineStyle).length > 0

    return createElement(
      as,
      {
        ref,
        className: cn(cssClass, className) || undefined,
        ...(hasInlineStyle && { style: inlineStyle }),
        ...props,
      },
      children
    )
  }
)

Container.displayName = 'Container'

export type { ContainerProps, ContainerSize }
