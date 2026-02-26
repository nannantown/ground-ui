import { forwardRef, type ReactNode } from 'react'
import { cn } from '../cn'

export interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  date: string
  icon?: ReactNode
  status?: 'completed' | 'current' | 'upcoming'
  onClick?: () => void
}

interface TimelineProps {
  items: TimelineItem[]
  variant?: 'default' | 'compact'
  className?: string
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, variant = 'default', className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'timeline',
          variant === 'compact' && 'timeline-compact',
          className
        )}
      >
        {items.map((item) => {
          const status = item.status ?? 'completed'
          const isClickable = !!item.onClick

          return (
            <div
              key={item.id}
              className={cn(
                'timeline-item',
                isClickable && 'timeline-item-clickable'
              )}
              onClick={item.onClick}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        item.onClick?.()
                      }
                    }
                  : undefined
              }
              tabIndex={isClickable ? 0 : undefined}
              role={isClickable ? 'button' : undefined}
            >
              <div className="timeline-marker">
                {item.icon ? (
                  <div className="timeline-dot-icon">{item.icon}</div>
                ) : (
                  <div className={cn('timeline-dot', `timeline-dot-${status}`)} />
                )}
              </div>

              <div className="timeline-content">
                <div className="timeline-title">{item.title}</div>

                {(item.subtitle || item.date) && (
                  <div className="timeline-meta">
                    {item.subtitle && <span>{item.subtitle}</span>}
                    {item.subtitle && item.date && (
                      <span className="timeline-meta-separator" />
                    )}
                    {item.date && <span>{item.date}</span>}
                  </div>
                )}

                {item.description && variant !== 'compact' && (
                  <div className="timeline-description">{item.description}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

Timeline.displayName = 'Timeline'
