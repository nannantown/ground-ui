import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../cn'

/* ─── AppShell ─── */

interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Header content (rendered at top, sticky) */
  header?: ReactNode
  /** Sidebar content (left side, hidden on mobile) */
  sidebar?: ReactNode
  /** Footer content (bottom) */
  footer?: ReactNode
  /** Main content */
  children: ReactNode
  /** Sidebar collapsed to icon rail */
  sidebarCollapsed?: boolean
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      header,
      sidebar,
      footer,
      sidebarCollapsed = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('app-shell', className)}
        {...props}
      >
        {header}
        <div className="app-shell-body">
          {sidebar != null && (
            <aside
              className={cn(
                'app-shell-sidebar',
                sidebarCollapsed && 'app-shell-sidebar-collapsed'
              )}
            >
              {sidebar}
            </aside>
          )}
          <main className="app-shell-main">{children}</main>
        </div>
        {footer != null && (
          <footer className="app-shell-footer">{footer}</footer>
        )}
      </div>
    )
  }
)

AppShell.displayName = 'AppShell'

/* ─── Convenience sub-components ─── */

interface AppShellHeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** Make header sticky at top */
  sticky?: boolean
}

export const AppShellHeader = forwardRef<HTMLElement, AppShellHeaderProps>(
  ({ sticky = true, className, style, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={className}
        style={{
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-primary)',
          ...(sticky && {
            position: 'sticky',
            top: 0,
            zIndex: 'var(--z-sticky)' as unknown as number,
          }),
          ...style,
        }}
        {...props}
      >
        {children}
      </header>
    )
  }
)

AppShellHeader.displayName = 'AppShellHeader'

interface AppShellSidebarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export const AppShellSidebar = forwardRef<HTMLElement, AppShellSidebarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
        {...props}
      >
        {children}
      </nav>
    )
  }
)

AppShellSidebar.displayName = 'AppShellSidebar'

export type { AppShellProps, AppShellHeaderProps, AppShellSidebarProps }
