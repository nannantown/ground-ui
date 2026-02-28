import { forwardRef, type HTMLAttributes, type ElementType } from 'react'
import { cn } from '../cn'

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'label'

type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'error'
  | 'success'

type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'

type TypographyAlign = 'left' | 'center' | 'right'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** Text style variant */
  variant?: TypographyVariant
  /** Text color mapped to design tokens */
  color?: TypographyColor
  /** Font weight override */
  weight?: TypographyWeight
  /** Text alignment */
  align?: TypographyAlign
  /** Truncate text — true for single line, number for line clamp */
  truncate?: boolean | number
  /** Polymorphic tag override */
  as?: ElementType
}

/** Default HTML element for each variant */
const variantTagMap: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
  label: 'label',
}

/** Font size token for each variant */
const variantFontSize: Record<TypographyVariant, string> = {
  h1: 'var(--text-4xl)',
  h2: 'var(--text-3xl)',
  h3: 'var(--text-2xl)',
  h4: 'var(--text-xl)',
  h5: 'var(--text-lg)',
  h6: 'var(--text-md)',
  body1: 'var(--text-base)',
  body2: 'var(--text-sm)',
  caption: 'var(--text-xs)',
  overline: 'var(--text-xs)',
  label: 'var(--text-sm)',
}

/** Default font weight for each variant */
const variantFontWeight: Record<TypographyVariant, number> = {
  h1: 700,
  h2: 700,
  h3: 600,
  h4: 600,
  h5: 600,
  h6: 600,
  body1: 400,
  body2: 400,
  caption: 400,
  overline: 600,
  label: 500,
}

/** Line height for each variant */
const variantLineHeight: Record<TypographyVariant, number> = {
  h1: 1.2,
  h2: 1.25,
  h3: 1.3,
  h4: 1.35,
  h5: 1.4,
  h6: 1.4,
  body1: 1.6,
  body2: 1.5,
  caption: 1.4,
  overline: 1.4,
  label: 1.4,
}

/** Letter spacing for each variant */
const variantLetterSpacing: Record<TypographyVariant, string | undefined> = {
  h1: '-0.02em',
  h2: '-0.015em',
  h3: '-0.01em',
  h4: '-0.005em',
  h5: undefined,
  h6: undefined,
  body1: undefined,
  body2: undefined,
  caption: undefined,
  overline: '0.08em',
  label: '0.01em',
}

const colorMap: Record<TypographyColor, string> = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  muted: 'var(--text-secondary)',
  accent: 'var(--accent)',
  error: 'var(--error)',
  success: 'var(--success)',
}

const weightMap: Record<TypographyWeight, number> = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body1',
      color,
      weight,
      align,
      truncate,
      as,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as ?? variantTagMap[variant]

    const truncateStyles: React.CSSProperties =
      truncate === true
        ? {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }
        : typeof truncate === 'number'
          ? {
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: truncate,
              WebkitBoxOrient: 'vertical',
            }
          : {}

    return (
      <Component
        ref={ref}
        className={cn(
          variant === 'overline' && 'typography-overline',
          className
        )}
        style={{
          margin: 0,
          fontSize: variantFontSize[variant],
          fontWeight: weight ? weightMap[weight] : variantFontWeight[variant],
          lineHeight: variantLineHeight[variant],
          letterSpacing: variantLetterSpacing[variant],
          color: color ? colorMap[color] : undefined,
          textAlign: align,
          textTransform: variant === 'overline' ? 'uppercase' : undefined,
          ...truncateStyles,
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = 'Typography'
