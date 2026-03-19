import { useState, useCallback, useMemo } from 'react'
import { cn } from '../cn'

interface CalendarProps {
  /** Selected date */
  value?: Date
  /** Called when a date is selected */
  onChange?: (date: Date) => void
  /** Minimum selectable date */
  min?: Date
  /** Maximum selectable date */
  max?: Date
  /** Additional class names */
  className?: string
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isToday(d: Date) {
  return isSameDay(d, new Date())
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function Calendar({ value, onChange, min, max, className }: CalendarProps) {
  const [viewDate, setViewDate] = useState(() => value ?? new Date())
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = useCallback(() => {
    setViewDate(new Date(year, month - 1, 1))
  }, [year, month])

  const nextMonth = useCallback(() => {
    setViewDate(new Date(year, month + 1, 1))
  }, [year, month])

  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfWeek(year, month)
    const cells: (Date | null)[] = []

    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

    return cells
  }, [year, month])

  const isDisabled = useCallback(
    (d: Date) => {
      if (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true
      if (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true
      return false
    },
    [min, max]
  )

  return (
    <div className={cn('calendar', className)}>
      <div className="calendar-header">
        <span className="calendar-header-title">{monthLabel}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="calendar-nav" onClick={prevMonth} aria-label="Previous month">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="calendar-nav" onClick={nextMonth} aria-label="Next month">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((d) => (
          <span key={d} className="calendar-weekday">{d}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, i) => {
          if (!day) return <span key={`empty-${i}`} />
          const selected = value ? isSameDay(day, value) : false
          const disabled = isDisabled(day)

          return (
            <button
              key={day.getDate()}
              className={cn(
                'calendar-cell',
                selected && 'calendar-cell-selected',
                isToday(day) && 'calendar-cell-today'
              )}
              disabled={disabled}
              onClick={() => !disabled && onChange?.(day)}
              aria-selected={selected || undefined}
              aria-label={day.toLocaleDateString()}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
