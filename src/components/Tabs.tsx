import { cn } from '../cn'

export interface TabItem {
  value: string
  label: string
  count?: number
  disabled?: boolean
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
              className={cn('nav-tab', isActive && 'nav-tab-active')}
              onClick={() => onChange(tab.value)}
              disabled={tab.disabled}
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
                      fontSize: 'var(--text-xs)',
                      paddingLeft: 6,
                      paddingRight: 6,
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'var(--p-white-12)' : 'var(--p-white-6)',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
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
            disabled={tab.disabled}
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
