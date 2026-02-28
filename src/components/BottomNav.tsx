import { forwardRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../cn'

export interface BottomNavItem {
  /** Icon element (Lucide icon, SVG, etc.) */
  icon: ReactNode
  /** Label text */
  label: string
  /** Unique identifier */
  value: string
  /** Badge count or indicator */
  badge?: number | boolean
}

interface BottomNavProps {
  /** Navigation items (3-5 recommended) */
  items: BottomNavItem[]
  /** Currently selected value */
  value?: string
  /** Called when an item is selected */
  onChange?: (value: string) => void
  /** Hide text labels, show icons only */
  hideLabels?: boolean
  className?: string
}

function BottomNavBadge({ badge }: { badge: number | boolean }) {
  if (badge === true) {
    return (
      <span
        style={{
          position: 'absolute',
          top: -2,
          right: -6,
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
          top: -4,
          right: -8,
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

export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(
  ({ items, value, onChange, hideLabels = false, className }, ref) => {
    const rootStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%',
      height: 56,
      minHeight: 56,
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-subtle)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }

    return (
      <nav
        ref={ref}
        className={cn('bottom-nav', className)}
        style={rootStyle}
        aria-label="Bottom navigation"
      >
        {items.map((item) => {
          const isActive = item.value === value

          const buttonStyle: CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: hideLabels ? 0 : 2,
            flex: '1 1 0',
            height: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 0',
            position: 'relative',
            transition: 'all 0.15s ease',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            fontFamily: 'inherit',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
          }

          const iconWrapperStyle: CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 28,
            borderRadius: 14,
            background: isActive ? 'var(--accent-bg)' : 'transparent',
            transition: 'background 0.2s ease',
            position: 'relative',
          }

          const labelSpanStyle: CSSProperties = {
            fontSize: 11,
            fontWeight: isActive ? 600 : 500,
            lineHeight: 1,
            transition: 'color 0.15s ease',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 72,
          }

          return (
            <button
              key={item.value}
              type="button"
              style={buttonStyle}
              onClick={() => onChange?.(item.value)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={hideLabels ? item.label : undefined}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid var(--accent)'
                e.currentTarget.style.outlineOffset = '-2px'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              <span style={iconWrapperStyle}>
                {item.icon}
                {item.badge !== undefined && <BottomNavBadge badge={item.badge} />}
              </span>
              {!hideLabels && <span style={labelSpanStyle}>{item.label}</span>}
            </button>
          )
        })}
      </nav>
    )
  }
)

BottomNav.displayName = 'BottomNav'
