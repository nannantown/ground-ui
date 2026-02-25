import { cn } from '../cn'

export interface TabItem {
  value: string
  label: string
  count?: number
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  variant?: 'pill' | 'underline'
}

export function Tabs({ items, value, onChange, variant = 'pill' }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {items.map((tab) => {
          const isActive = tab.value === value
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 14,
                fontWeight: 500,
                transition: 'color 0.15s ease',
                position: 'relative',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: 12,
                      paddingLeft: 6,
                      paddingRight: 6,
                      borderRadius: 9999,
                      background: isActive ? 'var(--p-white-12)' : 'var(--p-white-6)',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'var(--text-primary)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Pill variant
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      {items.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn('pill-filter', isActive && 'pill-filter-active')}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: 12,
                    opacity: 0.7,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
