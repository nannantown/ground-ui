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
        className="flex gap-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {items.map((tab) => {
          const isActive = tab.value === value
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className="px-4 py-2.5 text-sm font-medium transition-colors relative"
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                background: 'transparent',
              }}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className="text-xs px-1.5 rounded-full"
                    style={{
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
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: 'var(--text-primary)' }}
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
    <div className="flex gap-2 flex-wrap">
      {items.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`pill-filter ${isActive ? 'pill-filter-active' : ''}`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-xs opacity-70">
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
