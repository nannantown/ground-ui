import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../cn'

/* ── Types ────────────────────────────────── */

export interface AutocompleteOption {
  /** Unique value */
  value: string
  /** Display label */
  label: string
  /** Optional description shown below label */
  description?: string
  /** Optional group name */
  group?: string
  /** Disabled state */
  disabled?: boolean
}

interface AutocompleteProps {
  /** Current input value (controlled) */
  value: string
  /** Callback when value changes */
  onChange: (value: string) => void
  /** Available options */
  options: AutocompleteOption[]
  /** Placeholder text */
  placeholder?: string
  /** Async search callback */
  onSearch?: (query: string) => void
  /** Loading state (e.g. during async search) */
  loading?: boolean
  /** Multiple selection mode */
  multiple?: boolean
  /** Selected values in multiple mode */
  selectedValues?: string[]
  /** Callback for multiple selection changes */
  onSelectedChange?: (values: string[]) => void
  /** Allow creating new options */
  creatable?: boolean
  /** Callback when creating a new option */
  onCreate?: (value: string) => void
  /** Custom empty state message */
  emptyMessage?: string
  /** Custom option renderer */
  renderOption?: (option: AutocompleteOption, state: { highlighted: boolean; selected: boolean }) => ReactNode
  /** Group options by a key */
  groupBy?: (option: AutocompleteOption) => string
  /** Show error styling */
  error?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Additional class name */
  className?: string
  /** Additional styles */
  style?: CSSProperties
}

/* ── SVG Icons ────────────────────────────── */

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

/* ── Highlight matching text ──────────────── */

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} style={{ color: 'var(--accent)', fontWeight: 600 }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

/* ── Component ────────────────────────────── */

export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder = 'Search...',
      onSearch,
      loading = false,
      multiple = false,
      selectedValues = [],
      onSelectedChange,
      creatable = false,
      onCreate,
      emptyMessage = 'No results found',
      renderOption,
      groupBy,
      error = false,
      disabled = false,
      className,
      style,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false)
    const [highlightIndex, setHighlightIndex] = useState(-1)
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })

    /* ── Filtered options ──────────────────── */

    const filteredOptions = useMemo(() => {
      if (onSearch) return options // async filtering handled externally
      const q = value.toLowerCase().trim()
      if (!q) return options
      return options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(q) ||
          opt.description?.toLowerCase().includes(q),
      )
    }, [value, options, onSearch])

    /* ── Grouped options ───────────────────── */

    const groupedOptions = useMemo(() => {
      const groupFn = groupBy ?? ((opt: AutocompleteOption) => opt.group ?? '')
      const groups = new Map<string, AutocompleteOption[]>()

      filteredOptions.forEach((opt) => {
        const key = groupFn(opt)
        const existing = groups.get(key) ?? []
        existing.push(opt)
        groups.set(key, existing)
      })

      return groups
    }, [filteredOptions, groupBy])

    /** Flat list for keyboard navigation */
    const flatOptions = useMemo(() => {
      const result: AutocompleteOption[] = []
      groupedOptions.forEach((opts) => result.push(...opts))
      return result
    }, [groupedOptions])

    /** Whether value matches an option not in options (for creatable) */
    const canCreate = creatable && value.trim().length > 0 && !options.some(
      (opt) => opt.label.toLowerCase() === value.toLowerCase(),
    )

    /* ── Positioning ───────────────────────── */

    useEffect(() => {
      if (!open || !triggerRef.current) return

      const updatePosition = () => {
        const rect = triggerRef.current!.getBoundingClientRect()
        const dropdownHeight = 280
        const spaceBelow = window.innerHeight - rect.bottom - 8
        const top = spaceBelow >= dropdownHeight
          ? rect.bottom + 4
          : rect.top - dropdownHeight - 4

        setPosition({
          top: Math.max(8, top),
          left: rect.left,
          width: rect.width,
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
          listRef.current?.contains(target)
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

    /* ── Reset highlight on filter change ──── */

    useEffect(() => {
      setHighlightIndex(-1)
    }, [value])

    /* ── Scroll highlighted item into view ──── */

    useEffect(() => {
      if (highlightIndex < 0 || !listRef.current) return
      const items = listRef.current.querySelectorAll('[data-option-index]')
      const el = items[highlightIndex] as HTMLElement | undefined
      el?.scrollIntoView({ block: 'nearest' })
    }, [highlightIndex])

    /* ── Handlers ──────────────────────────── */

    const handleInputChange = useCallback(
      (val: string) => {
        onChange(val)
        onSearch?.(val)
        if (!open) setOpen(true)
      },
      [onChange, onSearch, open],
    )

    const selectOption = useCallback(
      (opt: AutocompleteOption) => {
        if (opt.disabled) return

        if (multiple && onSelectedChange) {
          const isSelected = selectedValues.includes(opt.value)
          if (isSelected) {
            onSelectedChange(selectedValues.filter((v) => v !== opt.value))
          } else {
            onSelectedChange([...selectedValues, opt.value])
          }
          // Keep dropdown open in multiple mode
          onChange('')
          inputRef.current?.focus()
        } else {
          onChange(opt.label)
          setOpen(false)
        }
      },
      [multiple, onSelectedChange, selectedValues, onChange],
    )

    const handleCreate = useCallback(() => {
      onCreate?.(value.trim())
      if (!multiple) {
        setOpen(false)
      } else {
        onChange('')
        inputRef.current?.focus()
      }
    }, [onCreate, value, multiple, onChange])

    const removeTag = useCallback(
      (val: string) => {
        onSelectedChange?.(selectedValues.filter((v) => v !== val))
        inputRef.current?.focus()
      },
      [onSelectedChange, selectedValues],
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (!open) {
            setOpen(true)
            return
          }
          const totalItems = flatOptions.length + (canCreate ? 1 : 0)
          setHighlightIndex((prev) => (prev + 1) % totalItems)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (!open) return
          const totalItems = flatOptions.length + (canCreate ? 1 : 0)
          setHighlightIndex((prev) => (prev - 1 + totalItems) % totalItems)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (highlightIndex >= 0 && highlightIndex < flatOptions.length) {
            selectOption(flatOptions[highlightIndex])
          } else if (canCreate && highlightIndex === flatOptions.length) {
            handleCreate()
          }
        } else if (e.key === 'Escape') {
          setOpen(false)
        } else if (e.key === 'Backspace' && !value && multiple && selectedValues.length > 0) {
          // Remove last tag on backspace with empty input
          removeTag(selectedValues[selectedValues.length - 1])
        }
      },
      [open, highlightIndex, flatOptions, canCreate, selectOption, handleCreate, value, multiple, selectedValues, removeTag],
    )

    /* ── Render ────────────────────────────── */

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
          className={cn('autocomplete', className)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            flexWrap: multiple ? 'wrap' : undefined,
            gap: multiple ? 4 : 0,
            minHeight: 38,
            padding: multiple && selectedValues.length > 0 ? '4px 8px' : 0,
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
          onClick={() => {
            if (!disabled) inputRef.current?.focus()
          }}
        >
          {/* Multiple mode: selected tags */}
          {multiple &&
            selectedValues.map((val) => {
              const opt = options.find((o) => o.value === val)
              return (
                <span
                  key={val}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-bg)',
                    border: '1px solid var(--accent-border)',
                    color: 'var(--accent-light)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {opt?.label ?? val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTag(val)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'inherit',
                      cursor: 'pointer',
                      opacity: 0.7,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.7'
                    }}
                    aria-label={`Remove ${opt?.label ?? val}`}
                  >
                    <ClearIcon />
                  </button>
                </span>
              )
            })}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              setFocused(true)
              if (value || options.length > 0) setOpen(true)
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={multiple && selectedValues.length > 0 ? '' : placeholder}
            disabled={disabled}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            style={{
              flex: 1,
              minWidth: multiple ? 80 : 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              padding: multiple && selectedValues.length > 0 ? '4px 0' : '10px 12px',
              height: multiple && selectedValues.length > 0 ? 28 : undefined,
            }}
          />

          {/* Right side icon */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              paddingRight: 10,
              color: 'var(--text-muted)',
              transition: 'transform 0.15s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {loading ? <LoadingSpinner /> : <ChevronDown />}
          </span>
        </div>

        {/* Dropdown */}
        {open &&
          createPortal(
            <div
              ref={listRef}
              role="listbox"
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: 280,
                overflowY: 'auto',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                zIndex: 'var(--z-dropdown)' as unknown as number,
                padding: '4px 0',
              }}
            >
              {loading && flatOptions.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '16px 12px',
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <LoadingSpinner />
                  Loading...
                </div>
              ) : flatOptions.length === 0 && !canCreate ? (
                <div
                  style={{
                    padding: '16px 12px',
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center',
                  }}
                >
                  {emptyMessage}
                </div>
              ) : (
                <>
                  {(() => {
                    let idx = 0
                    const elements: ReactNode[] = []

                    groupedOptions.forEach((opts, groupName) => {
                      if (groupName) {
                        elements.push(
                          <div
                            key={`group-${groupName}`}
                            style={{
                              padding: '8px 12px 4px',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 600,
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {groupName}
                          </div>,
                        )
                      }

                      opts.forEach((opt) => {
                        const currentIdx = idx
                        const isHighlighted = currentIdx === highlightIndex
                        const isSelected = multiple
                          ? selectedValues.includes(opt.value)
                          : false

                        elements.push(
                          <div
                            key={opt.value}
                            data-option-index={currentIdx}
                            role="option"
                            aria-selected={isSelected}
                            aria-disabled={opt.disabled}
                            onClick={() => selectOption(opt)}
                            onMouseEnter={() => setHighlightIndex(currentIdx)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '8px 12px',
                              fontSize: 'var(--text-sm)',
                              cursor: opt.disabled ? 'not-allowed' : 'pointer',
                              opacity: opt.disabled ? 0.4 : 1,
                              background: isHighlighted
                                ? 'var(--hover-bg)'
                                : 'transparent',
                              transition: 'background 0.1s ease',
                            }}
                          >
                            {/* Checkmark for multiple mode */}
                            {multiple && (
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 18,
                                  height: 18,
                                  borderRadius: 'var(--radius-sm)',
                                  border: isSelected
                                    ? '1px solid var(--accent)'
                                    : '1px solid var(--border-default)',
                                  background: isSelected
                                    ? 'var(--accent)'
                                    : 'transparent',
                                  color: isSelected ? '#fff' : 'transparent',
                                  flexShrink: 0,
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <CheckIcon />
                              </span>
                            )}

                            {/* Option content */}
                            {renderOption ? (
                              renderOption(opt, { highlighted: isHighlighted, selected: isSelected })
                            ) : (
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  <HighlightText text={opt.label} query={value} />
                                </div>
                                {opt.description && (
                                  <div
                                    style={{
                                      fontSize: 'var(--text-xs)',
                                      color: 'var(--text-muted)',
                                      marginTop: 2,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    <HighlightText text={opt.description} query={value} />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Single mode selected check */}
                            {!multiple && !renderOption && opt.label === value && (
                              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>
                                <CheckIcon />
                              </span>
                            )}
                          </div>,
                        )

                        idx++
                      })
                    })

                    return elements
                  })()}

                  {/* Creatable option */}
                  {canCreate && (
                    <div
                      data-option-index={flatOptions.length}
                      role="option"
                      onClick={handleCreate}
                      onMouseEnter={() => setHighlightIndex(flatOptions.length)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                        color: 'var(--accent)',
                        borderTop: flatOptions.length > 0 ? '1px solid var(--border-subtle)' : undefined,
                        background: highlightIndex === flatOptions.length
                          ? 'var(--hover-bg)'
                          : 'transparent',
                        transition: 'background 0.1s ease',
                      }}
                    >
                      <PlusIcon />
                      Create &ldquo;{value.trim()}&rdquo;
                    </div>
                  )}
                </>
              )}
            </div>,
            document.body,
          )}
      </>
    )
  },
)

Autocomplete.displayName = 'Autocomplete'
