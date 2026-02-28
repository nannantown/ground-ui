import { useId, type ReactNode } from 'react'
import { cn } from '../cn'

export interface SidebarItem {
  value: string
  label: string
  icon?: ReactNode
  /** Badge count (number) or dot indicator (true) */
  badge?: number | boolean
  /** Colored dot — pass a CSS color string */
  dot?: string
}

export interface SidebarSection {
  /** Optional section heading */
  label?: string
  items: SidebarItem[]
}

export interface SidebarUser {
  name: string
  email?: string
  /** URL string or ReactNode for custom avatar content */
  avatar?: string | ReactNode
}

interface SidebarProps {
  /** Grouped navigation items */
  sections: SidebarSection[]
  /** Currently active item value */
  value?: string
  /** Called when a navigation item is selected */
  onChange?: (value: string) => void
  /** Custom header content (e.g. logo) */
  header?: ReactNode
  /** Custom footer content (rendered in sidebar-utils area) */
  footer?: ReactNode
  /** User profile displayed at bottom */
  user?: SidebarUser
  /** Accessible label for the nav element */
  'aria-label'?: string
  className?: string
}

/**
 * Sidebar — Application sidebar navigation with sections, icons, badges, and user profile.
 * Uses CSS classes `.sidebar`, `.sidebar-nav`, `.sidebar-item`, `.sidebar-section`, `.sidebar-user`, etc.
 */
export function Sidebar({
  sections,
  value,
  onChange,
  header,
  footer,
  user,
  'aria-label': ariaLabel = 'Sidebar navigation',
  className,
}: SidebarProps) {
  const sectionIdPrefix = useId()

  return (
    <aside className={cn('sidebar', className)}>
      {header && <div className="sidebar-logo">{header}</div>}

      <nav aria-label={ariaLabel} className="sidebar-spaces">
        {sections.map((section, si) => {
          const sectionId = section.label ? `${sectionIdPrefix}-s${si}` : undefined
          return (
            <div key={si} role="group" aria-labelledby={sectionId}>
              {section.label && (
                <div id={sectionId} className="sidebar-section">
                  {section.label}
                </div>
              )}
              <div className="sidebar-nav">
                {section.items.map((item) => {
                  const isActive = item.value === value
                  return (
                    <button
                      key={item.value}
                      className={cn('sidebar-item', isActive && 'sidebar-item-active')}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => onChange?.(item.value)}
                    >
                      {item.icon && <span className="sidebar-item-icon">{item.icon}</span>}
                      {item.dot && (
                        <span className="sidebar-dot" style={{ background: item.dot }} />
                      )}
                      <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                      {typeof item.badge === 'number' && (
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {(footer || user) && (
        <div className="sidebar-utils">
          {footer}
          {user && <SidebarUserBlock user={user} />}
        </div>
      )}
    </aside>
  )
}

function SidebarUserBlock({ user }: { user: SidebarUser }) {
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="sidebar-user">
      <div className="sidebar-user-avatar">
        {typeof user.avatar === 'string' ? (
          <img src={user.avatar} alt={user.name} />
        ) : user.avatar ? (
          user.avatar
        ) : (
          <span className="sidebar-user-avatar-text">{initials}</span>
        )}
      </div>
      <div className="sidebar-user-info">
        <div className="sidebar-user-name">{user.name}</div>
        {user.email && <div className="sidebar-user-email">{user.email}</div>}
      </div>
    </div>
  )
}
