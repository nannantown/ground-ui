import { Children, cloneElement, isValidElement, type ReactNode } from 'react'
import { cn } from '../cn'

interface BreadcrumbProps {
  children: ReactNode
  /** Separator rendered between items. Defaults to '/'. */
  separator?: ReactNode
  className?: string
}

interface BreadcrumbItemProps {
  /** If provided, renders as an anchor element. */
  href?: string
  /** Marks this item as the current page. */
  active?: boolean
  /** Disable this breadcrumb item */
  disabled?: boolean
  children: ReactNode
  className?: string
}

export function BreadcrumbItem({ href, active, disabled, children, className }: BreadcrumbItemProps) {
  const classes = cn(
    'breadcrumb-item',
    active && 'breadcrumb-item-active',
    disabled && 'breadcrumb-item-disabled',
    className
  )

  if (href && !active && !disabled) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <span
      className={classes}
      aria-disabled={disabled || undefined}
      {...(active ? { 'aria-current': 'page' as const } : undefined)}
    >
      {children}
    </span>
  )
}

export function Breadcrumb({ children, separator = '/', className }: BreadcrumbProps) {
  const items = Children.toArray(children).filter(isValidElement)
  const lastIndex = items.length - 1

  return (
    <nav aria-label="Breadcrumb" className={cn('breadcrumb', className)}>
      {items.map((child, index) => {
        const isLast = index === lastIndex
        // Auto-mark the last item as active unless it already has an explicit active prop
        const element =
          isLast &&
          isValidElement<BreadcrumbItemProps>(child) &&
          child.props.active === undefined
            ? cloneElement(child, { active: true })
            : child

        return (
          <span key={index} style={{ display: 'contents' }}>
            {element}
            {!isLast && (
              <span className="breadcrumb-separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
