import { forwardRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ListTileProps {
  /** Content rendered before the text block (icon, avatar, etc.) */
  leading?: ReactNode
  /** Content rendered after the text block (icon, badge, switch, etc.) */
  trailing?: ReactNode
  /** Primary text */
  title: ReactNode
  /** Secondary text below title */
  subtitle?: ReactNode
  /** Tertiary text / description below subtitle */
  description?: ReactNode
  /** Click handler — makes the tile interactive */
  onClick?: () => void
  /** Disabled state */
  disabled?: boolean
  /** Selected/active state — shows accent indicator */
  selected?: boolean
  /** Reduced vertical padding */
  dense?: boolean
  /** Additional className */
  className?: string
  /** Additional styles */
  style?: CSSProperties
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ListTile = forwardRef<HTMLDivElement, ListTileProps>(
  (
    {
      leading,
      trailing,
      title,
      subtitle,
      description,
      onClick,
      disabled = false,
      selected = false,
      dense = false,
      className,
      style,
    },
    ref
  ) => {
    const isInteractive = !!onClick && !disabled

    const verticalPadding = dense ? 8 : 12
    const horizontalPadding = 16

    const rootStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: `${verticalPadding}px ${horizontalPadding}px`,
      borderRadius: 'var(--radius-md)',
      transition: 'background-color 0.15s ease, border-color 0.15s ease',
      cursor: isInteractive ? 'pointer' : disabled ? 'not-allowed' : 'default',
      opacity: disabled ? 0.4 : 1,
      position: 'relative',
      background: selected
        ? 'var(--accent-bg, rgba(255,255,255,0.08))'
        : 'transparent',
      border: '1px solid transparent',
      userSelect: isInteractive ? 'none' : undefined,
      ...style,
    }

    // Selected indicator — left accent bar
    const selectedIndicatorStyle: CSSProperties = {
      position: 'absolute',
      left: 0,
      top: '20%',
      bottom: '20%',
      width: 3,
      borderRadius: 'var(--radius-full)',
      background: 'var(--accent, #fff)',
      transition: 'opacity 0.15s ease',
      opacity: selected ? 1 : 0,
    }

    return (
      <div
        ref={ref}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-disabled={disabled || undefined}
        aria-selected={selected || undefined}
        className={cn('list-tile', selected && 'list-tile-selected', className)}
        style={rootStyle}
        onClick={isInteractive ? onClick : undefined}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onClick!()
          }
        }}
        onMouseEnter={(e) => {
          if (isInteractive) {
            e.currentTarget.style.background = selected
              ? 'var(--accent-bg-strong, rgba(255,255,255,0.12))'
              : 'var(--hover-bg)'
          }
        }}
        onMouseLeave={(e) => {
          if (isInteractive) {
            e.currentTarget.style.background = selected
              ? 'var(--accent-bg, rgba(255,255,255,0.08))'
              : 'transparent'
          }
        }}
        onMouseDown={(e) => {
          if (isInteractive) {
            e.currentTarget.style.background = selected
              ? 'var(--accent-bg-strong, rgba(255,255,255,0.16))'
              : 'var(--p-white-8, rgba(255,255,255,0.08))'
          }
        }}
        onMouseUp={(e) => {
          if (isInteractive) {
            e.currentTarget.style.background = selected
              ? 'var(--accent-bg-strong, rgba(255,255,255,0.12))'
              : 'var(--hover-bg)'
          }
        }}
      >
        {/* Selected indicator bar */}
        <div style={selectedIndicatorStyle} aria-hidden="true" />

        {/* Leading slot */}
        {leading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: selected ? 'var(--accent, var(--text-primary))' : 'var(--text-secondary)',
              transition: 'color 0.15s ease',
            }}
          >
            {leading}
          </div>
        )}

        {/* Text content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: dense ? 'var(--text-sm)' : 'var(--text-base)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subtitle}
            </div>
          )}

          {description && (
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginTop: 4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Trailing slot */}
        {trailing && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--text-muted)',
            }}
          >
            {trailing}
          </div>
        )}
      </div>
    )
  }
)

ListTile.displayName = 'ListTile'
