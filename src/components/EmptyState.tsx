import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && (
        <div style={{ color: 'var(--text-muted)' }}>
          {icon}
        </div>
      )}
      <div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 4,
            color: 'var(--text-secondary)',
            margin: 0,
            marginBlockEnd: 4,
          }}
        >
          {title}
        </p>
        {description && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}
