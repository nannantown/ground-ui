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

/* ── Types ────────────────────────────────── */

type TimeFormat = '12h' | '24h'
type MinuteStep = 1 | 5 | 10 | 15 | 30

interface TimePickerProps {
  /** Current value in "HH:mm" format (24h) */
  value?: string
  /** Callback when value changes — receives "HH:mm" (24h) */
  onChange?: (value: string) => void
  /** Display format */
  format?: TimeFormat
  /** Minute increment */
  minuteStep?: MinuteStep
  /** Disabled state */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Minimum time "HH:mm" */
  min?: string
  /** Maximum time "HH:mm" */
  max?: string
  /** Show error styling */
  error?: boolean
  /** Additional class name */
  className?: string
  /** Additional styles */
  style?: CSSProperties
}

/* ── Helpers ──────────────────────────────── */

function parseTime(value: string | undefined): { hour: number; minute: number } | null {
  if (!value) return null
  const parts = value.split(':').map(Number)
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null
  return { hour: parts[0], minute: parts[1] }
}

function formatTime24(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function formatDisplay(hour: number, minute: number, format: TimeFormat): string {
  if (format === '24h') {
    return formatTime24(hour, minute)
  }
  const period = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${h12}:${String(minute).padStart(2, '0')} ${period}`
}

function timeToMinutes(hour: number, minute: number): number {
  return hour * 60 + minute
}

function isTimeDisabled(
  hour: number,
  minute: number,
  min?: string,
  max?: string,
): boolean {
  const t = timeToMinutes(hour, minute)
  const minParsed = parseTime(min)
  const maxParsed = parseTime(max)
  if (minParsed && t < timeToMinutes(minParsed.hour, minParsed.minute)) return true
  if (maxParsed && t > timeToMinutes(maxParsed.hour, maxParsed.minute)) return true
  return false
}

/* ── SVG Icons ────────────────────────────── */

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

/* ── Scroll column sub-component ──────────── */

interface ColumnProps {
  items: { value: number; label: string; disabled: boolean }[]
  selected: number
  onSelect: (value: number) => void
}

function ScrollColumn({ items, selected, onSelect }: ColumnProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll selected item into view on mount and selection change
  useEffect(() => {
    if (!listRef.current) return
    const selectedEl = listRef.current.querySelector('[data-selected="true"]') as HTMLElement | null
    selectedEl?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  return (
    <div
      ref={listRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: 240,
        scrollbarWidth: 'thin',
      }}
    >
      {items.map((item) => {
        const isSelected = item.value === selected
        return (
          <button
            key={item.value}
            type="button"
            data-selected={isSelected}
            disabled={item.disabled}
            onClick={() => onSelect(item.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '6px 8px',
              fontSize: 'var(--text-sm)',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: isSelected ? 600 : 400,
              color: isSelected
                ? '#fff'
                : item.disabled
                  ? 'var(--text-disabled)'
                  : 'var(--text-secondary)',
              background: isSelected ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.4 : 1,
              transition: 'all 0.1s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isSelected && !item.disabled) {
                e.currentTarget.style.background = 'var(--hover-bg)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected && !item.disabled) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }
            }}
            onFocus={(e) => {
              if (!isSelected && !item.disabled) {
                e.currentTarget.style.background = 'var(--hover-bg)'
              }
            }}
            onBlur={(e) => {
              if (!isSelected && !item.disabled) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── Main component ───────────────────────── */

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      onChange,
      format = '24h',
      minuteStep = 1,
      disabled = false,
      placeholder,
      min,
      max,
      error = false,
      className,
      style,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false)
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const triggerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })

    const parsed = parseTime(value)

    /* ── Build hour/minute items ───────────── */

    const hourItems = useMemo(() => {
      const items: { value: number; label: string; disabled: boolean }[] = []
      const maxHour = format === '12h' ? 12 : 23
      const startHour = format === '12h' ? 1 : 0

      for (let h = startHour; h <= maxHour; h++) {
        const label = format === '12h' ? String(h) : String(h).padStart(2, '0')
        items.push({ value: h, label, disabled: false })
      }
      return items
    }, [format])

    const minuteItems = useMemo(() => {
      const items: { value: number; label: string; disabled: boolean }[] = []
      for (let m = 0; m < 60; m += minuteStep) {
        items.push({
          value: m,
          label: String(m).padStart(2, '0'),
          disabled: false,
        })
      }
      return items
    }, [minuteStep])

    /* ── Derived state for selection ───────── */

    // For 12h, track period separately
    const [period, setPeriod] = useState<'AM' | 'PM'>(() => {
      if (parsed && parsed.hour >= 12) return 'PM'
      return 'AM'
    })

    // Sync period with value prop
    useEffect(() => {
      if (parsed) {
        setPeriod(parsed.hour >= 12 ? 'PM' : 'AM')
      }
    }, [parsed])

    // Convert 24h value to 12h display hour
    const selectedHour12 = parsed
      ? parsed.hour === 0 ? 12 : parsed.hour > 12 ? parsed.hour - 12 : parsed.hour
      : -1

    const selectedHour = format === '12h' ? selectedHour12 : (parsed?.hour ?? -1)
    const selectedMinute = parsed?.minute ?? -1

    /* ── Sync inputValue with external value ── */

    useEffect(() => {
      if (parsed) {
        setInputValue(formatDisplay(parsed.hour, parsed.minute, format))
      } else {
        setInputValue('')
      }
    }, [value, format, parsed])

    /* ── Positioning ───────────────────────── */

    useEffect(() => {
      if (!open || !triggerRef.current) return

      const updatePosition = () => {
        const rect = triggerRef.current!.getBoundingClientRect()
        const dropdownHeight = 300
        const spaceBelow = window.innerHeight - rect.bottom - 8
        const top = spaceBelow >= dropdownHeight
          ? rect.bottom + 4
          : rect.top - dropdownHeight - 4

        setPosition({
          top: Math.max(8, top),
          left: rect.left,
          width: Math.max(rect.width, 220),
        })
      }

      const frameId = requestAnimationFrame(updatePosition)
      return () => cancelAnimationFrame(frameId)
    }, [open])

    /* ── Close on outside click / Escape ───── */

    useEffect(() => {
      if (!open) return

      const handleClick = (e: MouseEvent) => {
        const target = e.target as Node
        if (
          triggerRef.current?.contains(target) ||
          dropdownRef.current?.contains(target)
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

    /* ── Selection handlers ────────────────── */

    const emitChange = useCallback(
      (hour24: number, minute: number) => {
        if (isTimeDisabled(hour24, minute, min, max)) return
        onChange?.(formatTime24(hour24, minute))
      },
      [onChange, min, max],
    )

    const handleHourSelect = useCallback(
      (h: number) => {
        const currentMinute = parsed?.minute ?? 0
        // Round minute to step
        const roundedMinute = Math.round(currentMinute / minuteStep) * minuteStep

        if (format === '12h') {
          let hour24: number
          if (period === 'AM') {
            hour24 = h === 12 ? 0 : h
          } else {
            hour24 = h === 12 ? 12 : h + 12
          }
          emitChange(hour24, roundedMinute)
        } else {
          emitChange(h, roundedMinute)
        }
      },
      [parsed, minuteStep, format, period, emitChange],
    )

    const handleMinuteSelect = useCallback(
      (m: number) => {
        const currentHour = parsed?.hour ?? (format === '24h' ? 0 : (period === 'AM' ? 0 : 12))
        emitChange(currentHour, m)
      },
      [parsed, format, period, emitChange],
    )

    const handlePeriodChange = useCallback(
      (newPeriod: 'AM' | 'PM') => {
        setPeriod(newPeriod)
        if (parsed) {
          let hour24: number
          if (newPeriod === 'AM') {
            hour24 = parsed.hour >= 12 ? parsed.hour - 12 : parsed.hour
          } else {
            hour24 = parsed.hour < 12 ? parsed.hour + 12 : parsed.hour
          }
          emitChange(hour24, parsed.minute)
        }
      },
      [parsed, emitChange],
    )

    /* ── Manual input parsing ──────────────── */

    const handleInputBlur = useCallback(() => {
      setFocused(false)

      const trimmed = inputValue.trim()
      if (!trimmed) {
        onChange?.('')
        return
      }

      // Try parsing various formats
      let match: RegExpMatchArray | null

      // 12h format: "1:30 PM", "1:30PM", "1:30pm"
      match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/)
      if (match) {
        let h = parseInt(match[1], 10)
        const m = parseInt(match[2], 10)
        const p = match[3].toUpperCase()
        if (h >= 1 && h <= 12 && m >= 0 && m <= 59) {
          if (p === 'AM' && h === 12) h = 0
          else if (p === 'PM' && h !== 12) h += 12
          emitChange(h, m)
          return
        }
      }

      // 24h format: "13:30", "9:05"
      match = trimmed.match(/^(\d{1,2}):(\d{2})$/)
      if (match) {
        const h = parseInt(match[1], 10)
        const m = parseInt(match[2], 10)
        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
          emitChange(h, m)
          return
        }
      }

      // If parsing fails, revert to previous value
      if (parsed) {
        setInputValue(formatDisplay(parsed.hour, parsed.minute, format))
      } else {
        setInputValue('')
      }
    }, [inputValue, parsed, format, onChange, emitChange])

    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleInputBlur()
          setOpen(false)
        } else if (e.key === 'Escape') {
          setOpen(false)
        } else if (e.key === 'ArrowDown' && !open) {
          e.preventDefault()
          setOpen(true)
        }
      },
      [handleInputBlur, open],
    )

    /* ── Render ────────────────────────────── */

    const defaultPlaceholder = format === '12h' ? '12:00 AM' : '00:00'

    const borderColor = disabled
      ? 'var(--border-subtle)'
      : error
        ? 'var(--error)'
        : focused
          ? 'var(--accent)'
          : hovered
            ? 'var(--border-default)'
            : 'var(--border-subtle)'

    const boxShadow = focused && !disabled && !error
      ? '0 0 0 2px var(--accent-bg)'
      : error && focused
        ? '0 0 0 2px rgba(255, 69, 58, 0.15)'
        : 'none'

    return (
      <>
        <div
          ref={(node) => {
            (triggerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          }}
          className={cn('timepicker', className)}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 38,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: `1px solid ${borderColor}`,
            boxShadow,
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            ...style,
          }}
          onMouseEnter={() => !disabled && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setFocused(true)
              if (!open) setOpen(true)
            }}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder ?? defaultPlaceholder}
            disabled={disabled}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              fontVariantNumeric: 'tabular-nums',
              padding: '10px 12px',
              paddingRight: 0,
              minWidth: 0,
            }}
          />

          {/* Clock icon */}
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => {
              if (!disabled) setOpen(!open)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              padding: '0 10px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!disabled) e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
            aria-label="Open time picker"
          >
            <ClockIcon />
          </button>
        </div>

        {/* Dropdown */}
        {open &&
          createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                width: position.width,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                zIndex: 'var(--z-dropdown)' as unknown as number,
                overflow: 'hidden',
              }}
            >
              {/* Column container */}
              <div
                style={{
                  display: 'flex',
                  padding: '8px 4px',
                  gap: 2,
                }}
              >
                {/* Hour column */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      padding: '4px 0 8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Hr
                  </div>
                  <ScrollColumn
                    items={hourItems}
                    selected={selectedHour}
                    onSelect={handleHourSelect}
                  />
                </div>

                {/* Separator */}
                <div
                  style={{
                    width: 1,
                    background: 'var(--border-subtle)',
                    margin: '28px 0 4px',
                  }}
                />

                {/* Minute column */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      padding: '4px 0 8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Min
                  </div>
                  <ScrollColumn
                    items={minuteItems}
                    selected={selectedMinute}
                    onSelect={handleMinuteSelect}
                  />
                </div>

                {/* AM/PM column for 12h format */}
                {format === '12h' && (
                  <>
                    <div
                      style={{
                        width: 1,
                        background: 'var(--border-subtle)',
                        margin: '28px 0 4px',
                      }}
                    />
                    <div
                      style={{
                        width: 52,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          padding: '4px 0 8px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {'\u00A0'}
                      </div>
                      {(['AM', 'PM'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePeriodChange(p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 8px',
                            fontSize: 'var(--text-sm)',
                            fontWeight: period === p ? 600 : 400,
                            color: period === p ? '#fff' : 'var(--text-secondary)',
                            background: period === p ? 'var(--accent)' : 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease',
                            outline: 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (period !== p) {
                              e.currentTarget.style.background = 'var(--hover-bg)'
                              e.currentTarget.style.color = 'var(--text-primary)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (period !== p) {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = 'var(--text-secondary)'
                            }
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Now button */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  padding: '6px 8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date()
                    const h = now.getHours()
                    const m = Math.round(now.getMinutes() / minuteStep) * minuteStep
                    emitChange(h, m >= 60 ? 0 : m)
                    setOpen(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    color: 'var(--accent)',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-bg)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Now
                </button>
              </div>
            </div>,
            document.body,
          )}
      </>
    )
  },
)

TimePicker.displayName = 'TimePicker'
