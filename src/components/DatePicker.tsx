import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../cn'

type DatePickerMode = 'date' | 'month'
type CalendarView = 'days' | 'months' | 'years'

interface DatePickerProps {
  /** Selected value — YYYY-MM-DD (date mode) or YYYY-MM (month mode) */
  value?: string
  /** Callback when value changes */
  onChange?: (value: string) => void
  /** Selection mode */
  mode?: DatePickerMode
  /** Minimum selectable date (YYYY-MM-DD or YYYY-MM) */
  min?: string
  /** Maximum selectable date (YYYY-MM-DD or YYYY-MM) */
  max?: string
  /** Placeholder text */
  placeholder?: string
  /** Show error styling */
  error?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Language for month/day names */
  locale?: 'ja' | 'en'
  /** Additional class name for the trigger */
  className?: string
  /** Additional style for the trigger */
  style?: CSSProperties
}

/* ── Locale data ──────────────────────────── */

const MONTHS_JA = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
]

const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const MONTHS_EN_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/* ── Helpers ──────────────────────────────── */

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function parseDate(value: string | undefined): { year: number; month: number; day: number } | null {
  if (!value) return null
  const parts = value.split('-').map(Number)
  if (parts.length === 2) return { year: parts[0], month: parts[1] - 1, day: 1 }
  if (parts.length === 3) return { year: parts[0], month: parts[1] - 1, day: parts[2] }
  return null
}

function formatDisplay(value: string | undefined, mode: DatePickerMode, locale: string): string {
  const parsed = parseDate(value)
  if (!parsed) return ''

  if (mode === 'month') {
    if (locale === 'ja') return `${parsed.year}年${parsed.month + 1}月`
    return `${MONTHS_EN_FULL[parsed.month]} ${parsed.year}`
  }

  if (locale === 'ja') return `${parsed.year}年${parsed.month + 1}月${parsed.day}日`
  return `${MONTHS_EN_FULL[parsed.month]} ${parsed.day}, ${parsed.year}`
}

function isDateDisabled(
  year: number,
  month: number,
  day: number,
  min: string | undefined,
  max: string | undefined,
): boolean {
  const date = new Date(year, month, day)
  if (min) {
    const minParsed = parseDate(min)
    if (minParsed && date < new Date(minParsed.year, minParsed.month, minParsed.day)) return true
  }
  if (max) {
    const maxParsed = parseDate(max)
    if (maxParsed && date > new Date(maxParsed.year, maxParsed.month, maxParsed.day)) return true
  }
  return false
}

function isMonthDisabled(
  year: number,
  month: number,
  min: string | undefined,
  max: string | undefined,
): boolean {
  if (min) {
    const minParsed = parseDate(min)
    if (minParsed && (year < minParsed.year || (year === minParsed.year && month < minParsed.month))) return true
  }
  if (max) {
    const maxParsed = parseDate(max)
    if (maxParsed && (year > maxParsed.year || (year === maxParsed.year && month > maxParsed.month))) return true
  }
  return false
}

/* ── Calendar icon SVG ────────────────────── */

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

/* ── Component ────────────────────────────── */

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      mode = 'date',
      min,
      max,
      placeholder,
      error,
      disabled,
      locale: localeProp,
      className,
      style,
    },
    ref,
  ) => {
    const locale = localeProp ?? (typeof document !== 'undefined' && document.documentElement.lang === 'ja' ? 'ja' : 'en')
    const months = locale === 'ja' ? MONTHS_JA : MONTHS_EN
    const weekdays = locale === 'ja' ? WEEKDAYS_JA : WEEKDAYS_EN

    const [open, setOpen] = useState(false)
    const [view, setView] = useState<CalendarView>(mode === 'month' ? 'months' : 'days')
    const [position, setPosition] = useState({ top: 0, left: 0 })

    const triggerRef = useRef<HTMLDivElement>(null)
    const calendarRef = useRef<HTMLDivElement>(null)

    // The "cursor" — what year/month the calendar is looking at
    const today = useMemo(() => new Date(), [])
    const parsed = parseDate(value)
    const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear())
    const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth())

    // Year range for year picker (show 12 years at a time)
    const yearRangeStart = Math.floor(viewYear / 12) * 12

    // Sync cursor when value changes externally
    useEffect(() => {
      const p = parseDate(value)
      if (p) {
        setViewYear(p.year)
        setViewMonth(p.month)
      }
    }, [value])

    // Reset view when opening
    useEffect(() => {
      if (open) {
        setView(mode === 'month' ? 'months' : 'days')
        const p = parseDate(value)
        if (p) {
          setViewYear(p.year)
          setViewMonth(p.month)
        }
      }
    }, [open, mode, value])

    // Position calculation
    useEffect(() => {
      if (!open || !triggerRef.current) return

      const updatePosition = () => {
        const rect = triggerRef.current!.getBoundingClientRect()
        const calEl = calendarRef.current
        if (!calEl) return

        const calRect = calEl.getBoundingClientRect()
        let top = rect.bottom + 4
        let left = rect.left

        // Flip up if no room below
        if (top + calRect.height > window.innerHeight - 8) {
          top = rect.top - calRect.height - 4
        }
        // Clamp horizontal
        if (left + calRect.width > window.innerWidth - 8) {
          left = window.innerWidth - calRect.width - 8
        }
        left = Math.max(8, left)

        setPosition({ top, left })
      }

      const frameId = requestAnimationFrame(updatePosition)
      return () => cancelAnimationFrame(frameId)
    }, [open, view, viewYear, viewMonth])

    // Close on outside click / Escape
    useEffect(() => {
      if (!open) return

      const handleClick = (e: MouseEvent) => {
        const target = e.target as Node
        if (
          triggerRef.current?.contains(target) ||
          calendarRef.current?.contains(target)
        ) return
        setOpen(false)
      }

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false)
      }

      const frameId = requestAnimationFrame(() => {
        document.addEventListener('mousedown', handleClick)
        document.addEventListener('keydown', handleKey)
      })

      return () => {
        cancelAnimationFrame(frameId)
        document.removeEventListener('mousedown', handleClick)
        document.removeEventListener('keydown', handleKey)
      }
    }, [open])

    const handleToggle = useCallback(() => {
      if (!disabled) setOpen((prev) => !prev)
    }, [disabled])

    /* ── Selection handlers ─────────────────── */

    const selectDate = useCallback(
      (day: number) => {
        const m = String(viewMonth + 1).padStart(2, '0')
        const d = String(day).padStart(2, '0')
        onChange?.(`${viewYear}-${m}-${d}`)
        setOpen(false)
      },
      [viewYear, viewMonth, onChange],
    )

    const selectMonth = useCallback(
      (month: number) => {
        if (mode === 'month') {
          const m = String(month + 1).padStart(2, '0')
          onChange?.(`${viewYear}-${m}`)
          setOpen(false)
        } else {
          setViewMonth(month)
          setView('days')
        }
      },
      [viewYear, mode, onChange],
    )

    const selectYear = useCallback(
      (year: number) => {
        setViewYear(year)
        setView('months')
      },
      [],
    )

    const handleClear = useCallback(() => {
      onChange?.('')
      setOpen(false)
    }, [onChange])

    const handleToday = useCallback(() => {
      const now = new Date()
      if (mode === 'month') {
        const m = String(now.getMonth() + 1).padStart(2, '0')
        onChange?.(`${now.getFullYear()}-${m}`)
      } else {
        const m = String(now.getMonth() + 1).padStart(2, '0')
        const d = String(now.getDate()).padStart(2, '0')
        onChange?.(`${now.getFullYear()}-${m}-${d}`)
      }
      setOpen(false)
    }, [mode, onChange])

    /* ── Navigation ─────────────────────────── */

    const goToPrevMonth = () => {
      if (viewMonth === 0) {
        setViewMonth(11)
        setViewYear((y) => y - 1)
      } else {
        setViewMonth((m) => m - 1)
      }
    }

    const goToNextMonth = () => {
      if (viewMonth === 11) {
        setViewMonth(0)
        setViewYear((y) => y + 1)
      } else {
        setViewMonth((m) => m + 1)
      }
    }

    /* ── Render helpers ─────────────────────── */

    const displayValue = formatDisplay(value, mode, locale)
    const defaultPlaceholder = mode === 'month'
      ? (locale === 'ja' ? '年月を選択' : 'Select month')
      : (locale === 'ja' ? '日付を選択' : 'Select date')

    const renderDaysView = () => {
      const daysInMonth = getDaysInMonth(viewYear, viewMonth)
      const firstDay = getFirstDayOfWeek(viewYear, viewMonth)
      const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1)
      const todayY = today.getFullYear()
      const todayM = today.getMonth()
      const todayD = today.getDate()

      const cells: React.ReactNode[] = []

      // Previous month fill
      for (let i = firstDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i
        cells.push(
          <button
            key={`prev-${day}`}
            type="button"
            className="calendar-cell calendar-cell-outside"
            disabled
          >
            {day}
          </button>,
        )
      }

      // Current month
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = viewYear === todayY && viewMonth === todayM && day === todayD
        const isSelected = parsed && viewYear === parsed.year && viewMonth === parsed.month && day === parsed.day
        const isDisabled = isDateDisabled(viewYear, viewMonth, day, min, max)

        cells.push(
          <button
            key={day}
            type="button"
            className={cn(
              'calendar-cell',
              isToday && 'calendar-cell-today',
              isSelected && 'calendar-cell-selected',
            )}
            disabled={isDisabled}
            onClick={() => selectDate(day)}
          >
            {day}
          </button>,
        )
      }

      // Next month fill
      const totalCells = cells.length
      const remaining = 7 - (totalCells % 7)
      if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
          cells.push(
            <button
              key={`next-${i}`}
              type="button"
              className="calendar-cell calendar-cell-outside"
              disabled
            >
              {i}
            </button>,
          )
        }
      }

      const headerTitle = locale === 'ja'
        ? `${viewYear}年${viewMonth + 1}月`
        : `${MONTHS_EN_FULL[viewMonth]} ${viewYear}`

      return (
        <>
          <div className="calendar-header">
            <button type="button" className="calendar-nav" onClick={goToPrevMonth}>
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="calendar-header-title"
              onClick={() => setView('months')}
            >
              {headerTitle}
            </button>
            <button type="button" className="calendar-nav" onClick={goToNextMonth}>
              <ChevronRight />
            </button>
          </div>

          <div className="calendar-weekdays">
            {weekdays.map((wd) => (
              <div key={wd} className="calendar-weekday">{wd}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {cells}
          </div>
        </>
      )
    }

    const renderMonthsView = () => {
      const todayM = today.getMonth()
      const todayY = today.getFullYear()

      return (
        <>
          <div className="calendar-header">
            <button type="button" className="calendar-nav" onClick={() => setViewYear((y) => y - 1)}>
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="calendar-header-title"
              onClick={() => setView('years')}
            >
              {viewYear}
            </button>
            <button type="button" className="calendar-nav" onClick={() => setViewYear((y) => y + 1)}>
              <ChevronRight />
            </button>
          </div>

          <div className="calendar-grid-months">
            {months.map((name, i) => {
              const isToday = viewYear === todayY && i === todayM
              const isSelected = parsed && viewYear === parsed.year && i === parsed.month
              const isDisabled = isMonthDisabled(viewYear, i, min, max)

              return (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    'calendar-cell calendar-cell-month',
                    isToday && 'calendar-cell-today',
                    isSelected && 'calendar-cell-selected',
                  )}
                  disabled={isDisabled}
                  onClick={() => selectMonth(i)}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </>
      )
    }

    const renderYearsView = () => {
      const years: number[] = []
      for (let y = yearRangeStart; y < yearRangeStart + 12; y++) {
        years.push(y)
      }

      return (
        <>
          <div className="calendar-header">
            <button type="button" className="calendar-nav" onClick={() => setViewYear((y) => y - 12)}>
              <ChevronLeft />
            </button>
            <span
              className="calendar-header-title"
              style={{ cursor: 'default' }}
            >
              {yearRangeStart}–{yearRangeStart + 11}
            </span>
            <button type="button" className="calendar-nav" onClick={() => setViewYear((y) => y + 12)}>
              <ChevronRight />
            </button>
          </div>

          <div className="calendar-grid-years">
            {years.map((year) => {
              const isToday = year === today.getFullYear()
              const isSelected = parsed && year === parsed.year

              return (
                <button
                  key={year}
                  type="button"
                  className={cn(
                    'calendar-cell calendar-cell-year',
                    isToday && 'calendar-cell-today',
                    isSelected && 'calendar-cell-selected',
                  )}
                  onClick={() => selectYear(year)}
                >
                  {year}
                </button>
              )
            })}
          </div>
        </>
      )
    }

    return (
      <>
        <div
          ref={(node) => {
            // Merge refs
            (triggerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          }}
          className={cn('datepicker-trigger', className)}
          style={style}
        >
          <input
            type="text"
            readOnly
            className={cn('input', error && 'input-error')}
            value={displayValue}
            placeholder={placeholder ?? defaultPlaceholder}
            disabled={disabled}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleToggle()
              }
            }}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer', paddingRight: 36 }}
          />
          <span className="datepicker-icon">
            <CalendarIcon />
          </span>
        </div>

        {open &&
          createPortal(
            <div
              ref={calendarRef}
              className="calendar"
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                zIndex: 'var(--z-dropdown)' as unknown as number,
              }}
            >
              {view === 'days' && renderDaysView()}
              {view === 'months' && renderMonthsView()}
              {view === 'years' && renderYearsView()}

              <div className="calendar-footer">
                <button
                  type="button"
                  className="calendar-footer-btn calendar-footer-btn-danger"
                  onClick={handleClear}
                >
                  {locale === 'ja' ? '削除' : 'Clear'}
                </button>
                <button
                  type="button"
                  className="calendar-footer-btn"
                  onClick={handleToday}
                >
                  {mode === 'month'
                    ? (locale === 'ja' ? '今月' : 'This month')
                    : (locale === 'ja' ? '今日' : 'Today')}
                </button>
              </div>
            </div>,
            document.body,
          )}
      </>
    )
  },
)

DatePicker.displayName = 'DatePicker'
