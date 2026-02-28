import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  /** Optional trend indicator: positive, negative, or neutral */
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: ReactNode
  className?: string
}

export function StatCard({ label, value, trend, icon, className = '' }: StatCardProps) {
  const trendColor = {
    up: 'var(--success)',
    down: 'var(--error)',
    neutral: 'var(--text-secondary)',
  }

  const trendIcon = {
    up: 'M5 10l7-7m0 0l7 7m-7-7v18',
    down: 'M19 14l-7 7m0 0l-7-7m7 7V3',
    neutral: 'M5 12h14',
  }

  return (
    <div className={`card-stat ${className}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 4,
              color: 'var(--stat-label)',
              margin: 0,
              marginBlockEnd: 4,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--stat-value)',
              margin: 0,
            }}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
            }}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          <svg
            style={{ width: 12, height: 12, color: trendColor[trend.direction] }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trendIcon[trend.direction]} />
          </svg>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: trendColor[trend.direction],
            }}
          >
            {trend.value}
          </span>
        </div>
      )}
    </div>
  )
}
