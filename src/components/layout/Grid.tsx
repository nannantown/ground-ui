import { forwardRef, createElement, type HTMLAttributes, type CSSProperties } from 'react'
import { cn } from '../../cn'

type GridGap = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

interface GridResponsive {
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: GridGap
  /** Responsive columns: adjusts grid-template-columns at breakpoints */
  responsive?: GridResponsive
  /** Auto-fill mode with min column width (e.g., "250px") */
  autoFill?: string
  as?: 'div' | 'section' | 'ul'
}

/**
 * Build a <style> string for responsive breakpoints.
 * We use CSS custom properties scoped to the element via inline style,
 * so responsive overrides are handled through a generated className + inline media query style tag.
 *
 * Since inline styles cannot express media queries, responsive columns
 * are applied via a unique CSS class injected into a <style> element.
 * To avoid that complexity, we instead use CSS custom properties
 * with the auto-grid pattern for responsive behavior.
 *
 * For simple responsive grids, use `autoFill` which leverages CSS auto-fill.
 * For explicit breakpoint control, the `responsive` prop sets a CSS variable
 * `--grid-cols` that changes at each breakpoint.
 */

// Breakpoint values matching tokens.css media queries
const breakpoints: Record<keyof GridResponsive, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

// Counter for unique class names
let gridIdCounter = 0

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 1,
      gap = 'lg',
      responsive,
      autoFill,
      as = 'div',
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const hasResponsive = responsive && Object.keys(responsive).length > 0

    const inlineStyle: CSSProperties = {
      display: 'grid',
      gap: `var(--space-${gap})`,
      ...style,
    }

    // Auto-fill mode: repeat(auto-fill, minmax(min, 1fr))
    if (autoFill) {
      inlineStyle.gridTemplateColumns = `repeat(auto-fill, minmax(${autoFill}, 1fr))`
    } else if (!hasResponsive) {
      // Fixed columns mode
      inlineStyle.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`
    }

    // For responsive mode, we generate a unique class and inject a <style> tag
    if (hasResponsive && !autoFill) {
      const uniqueClass = `grid-r-${++gridIdCounter}`

      // Build media query CSS
      // Sort breakpoints from small to large for mobile-first approach
      const sortedKeys = (Object.keys(responsive) as (keyof GridResponsive)[])
        .sort((a, b) => parseInt(breakpoints[a]) - parseInt(breakpoints[b]))

      let mediaCSS = `.${uniqueClass} { grid-template-columns: repeat(${columns}, minmax(0, 1fr)); }\n`
      for (const bp of sortedKeys) {
        const cols = responsive[bp]
        if (cols !== undefined) {
          mediaCSS += `@media (min-width: ${breakpoints[bp]}) { .${uniqueClass} { grid-template-columns: repeat(${cols}, minmax(0, 1fr)); } }\n`
        }
      }

      return createElement(
        as,
        {
          ref,
          className: cn(uniqueClass, className) || undefined,
          style: inlineStyle,
          ...props,
        },
        <>
          <style dangerouslySetInnerHTML={{ __html: mediaCSS }} />
          {children}
        </>
      )
    }

    return createElement(
      as,
      {
        ref,
        className: className || undefined,
        style: inlineStyle,
        ...props,
      },
      children
    )
  }
)

Grid.displayName = 'Grid'

export type { GridProps, GridGap, GridResponsive }
