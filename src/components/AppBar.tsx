import { forwardRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../cn'

type AppBarSize = 'sm' | 'md' | 'lg'

interface AppBarProps {
  /** Title content */
  title?: ReactNode
  /** Subtitle text below the title */
  subtitle?: string
  /** Leading area (back button, menu icon, etc.) */
  leading?: ReactNode
  /** Action elements on the right side */
  actions?: ReactNode[]
  /** Show bottom shadow / border for elevation */
  elevated?: boolean
  /** Transparent background (for hero sections) */
  transparent?: boolean
  /** Sticky positioning */
  sticky?: boolean
  /** Height variant */
  size?: AppBarSize
  /** Center the title */
  centerTitle?: boolean
  className?: string
  children?: ReactNode
}

const sizeHeights: Record<AppBarSize, number> = {
  sm: 44,
  md: 56,
  lg: 64,
}

const titleSizes: Record<AppBarSize, string> = {
  sm: 'var(--text-sm)',
  md: 'var(--text-base)',
  lg: 'var(--text-lg)',
}

export const AppBar = forwardRef<HTMLElement, AppBarProps>(
  (
    {
      title,
      subtitle,
      leading,
      actions,
      elevated = false,
      transparent = false,
      sticky = false,
      size = 'md',
      centerTitle = false,
      className,
      children,
    },
    ref
  ) => {
    const height = sizeHeights[size]

    const rootStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      height,
      minHeight: height,
      paddingLeft: 'var(--space-lg)',
      paddingRight: 'var(--space-lg)',
      gap: 'var(--space-sm)',
      background: transparent ? 'transparent' : 'var(--bg-primary)',
      borderBottom: elevated
        ? '1px solid var(--border-default)'
        : '1px solid var(--border-subtle)',
      transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      ...(sticky
        ? {
            position: 'sticky' as const,
            top: 0,
            zIndex: 40,
          }
        : {}),
      ...(elevated && !transparent
        ? {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          }
        : {}),
    }

    const leadingStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    }

    const titleBlockStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flex: centerTitle ? '1 1 0' : '1 1 auto',
      minWidth: 0,
      textAlign: centerTitle ? 'center' : 'left',
    }

    const titleStyle: CSSProperties = {
      fontSize: titleSizes[size],
      fontWeight: 600,
      color: 'var(--text-primary)',
      lineHeight: 1.3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }

    const subtitleStyle: CSSProperties = {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      lineHeight: 1.3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      marginTop: 1,
    }

    const actionsStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-xs)',
      flexShrink: 0,
    }

    return (
      <header
        ref={ref}
        className={cn('app-bar', className)}
        style={rootStyle}
      >
        {leading && <div style={leadingStyle}>{leading}</div>}

        <div style={titleBlockStyle}>
          {title && <div style={titleStyle}>{title}</div>}
          {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
          {children}
        </div>

        {/* If centerTitle, add a spacer to match leading width */}
        {centerTitle && !actions?.length && leading && (
          <div style={leadingStyle} aria-hidden="true" />
        )}

        {actions && actions.length > 0 && (
          <div style={actionsStyle}>
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        )}
      </header>
    )
  }
)

AppBar.displayName = 'AppBar'
