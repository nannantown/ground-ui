import { forwardRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../cn'

export interface NavigationRailItem {
  /** Icon element (Lucide icon, SVG, etc.) */
  icon: ReactNode
  /** Label text */
  label: string
  /** Unique identifier */
  value: string
  /** Badge count or indicator */
  badge?: number | boolean
}

interface NavigationRailProps {
  /** Navigation items */
  items: NavigationRailItem[]
  /** Currently selected value */
  value?: string
  /** Called when an item is selected */
  onChange?: (value: string) => void
  /** Content rendered at the top of the rail (logo, FAB, etc.) */
  header?: ReactNode
  /** Content rendered at the bottom of the rail (settings, profile, etc.) */
  footer?: ReactNode
  /** Show labels alongside icons */
  expanded?: boolean
  className?: string
}

const collapsedWidth = 56
const expandedWidth = 200

function BadgeIndicator({ badge }: { badge: number | boolean }) {
  if (badge === true) {
    // Dot indicator
    return (
      <span
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--error)',
          border: '2px solid var(--bg-primary)',
        }}
      />
    )
  }

  if (typeof badge === 'number' && badge > 0) {
    return (
      <span
        style={{
          position: 'absolute',
          top: -2,
          right: -6,
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          background: 'var(--error)',
          color: '#fff',
          fontSize: 10,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
          lineHeight: 1,
        }}
      >
        {badge > 99 ? '99+' : badge}
      </span>
    )
  }

  return null
}

export const NavigationRail = forwardRef<HTMLElement, NavigationRailProps>(
  (
    {
      items,
      value,
      onChange,
      header,
      footer,
      expanded = false,
      className,
    },
    ref
  ) => {
    const width = expanded ? expandedWidth : collapsedWidth

    const rootStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width,
      minWidth: width,
      height: '100%',
      background: 'var(--bg-primary)',
      borderRight: '1px solid var(--border-subtle)',
      transition: 'width 0.2s ease, min-width 0.2s ease',
      overflow: 'hidden',
    }

    const headerStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: expanded ? 'flex-start' : 'center',
      padding: expanded ? '12px 16px' : '12px 0',
      flexShrink: 0,
      minHeight: 56,
    }

    const navListStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: '1 1 auto',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: expanded ? '4px 8px' : '4px',
    }

    const footerStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: expanded ? 'stretch' : 'center',
      padding: expanded ? '8px 8px 12px' : '8px 4px 12px',
      flexShrink: 0,
      borderTop: '1px solid var(--border-subtle)',
    }

    return (
      <nav
        ref={ref}
        className={cn('navigation-rail', className)}
        style={rootStyle}
        aria-label="Main navigation"
      >
        {header && <div style={headerStyle}>{header}</div>}

        <div role="list" style={navListStyle}>
          {items.map((item) => {
            const isActive = item.value === value

            const itemStyle: CSSProperties = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: expanded ? 'flex-start' : 'center',
              gap: expanded ? 12 : 0,
              width: '100%',
              height: expanded ? 40 : 44,
              padding: expanded ? '0 12px' : 0,
              borderRadius: 'var(--radius-md)',
              background: isActive ? 'var(--accent-bg)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.15s ease',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 600 : 500,
              fontFamily: 'inherit',
              textDecoration: 'none',
              outline: 'none',
            }

            const iconContainerStyle: CSSProperties = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              flexShrink: 0,
              position: 'relative',
            }

            const labelSpanStyle: CSSProperties = {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              opacity: expanded ? 1 : 0,
              width: expanded ? 'auto' : 0,
              transition: 'opacity 0.15s ease',
            }

            return (
              <button
                key={item.value}
                role="listitem"
                type="button"
                style={itemStyle}
                onClick={() => onChange?.(item.value)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={expanded ? undefined : item.label}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--hover-bg)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid var(--accent)'
                  e.currentTarget.style.outlineOffset = '2px'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none'
                }}
              >
                <span style={iconContainerStyle}>
                  {item.icon}
                  {item.badge !== undefined && <BadgeIndicator badge={item.badge} />}
                </span>
                <span style={labelSpanStyle}>{item.label}</span>
              </button>
            )
          })}
        </div>

        {footer && <div style={footerStyle}>{footer}</div>}
      </nav>
    )
  }
)

NavigationRail.displayName = 'NavigationRail'
