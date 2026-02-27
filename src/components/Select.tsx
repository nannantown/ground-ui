import { useState, useRef, useEffect, useCallback, forwardRef, type KeyboardEvent } from 'react'
import { cn } from '../cn'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  /** Show error styling */
  error?: boolean
  /** Options array */
  options?: SelectOption[]
  /** Placeholder text */
  placeholder?: string
  /** Current value */
  value?: string
  /** Default value (uncontrolled) */
  defaultValue?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Disabled state */
  disabled?: boolean
  /** Additional class names */
  className?: string
  /** id for label association */
  id?: string
  /** name for form submission */
  name?: string
  children?: React.ReactNode
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ error, options: optionsProp, placeholder, value: controlledValue, defaultValue, onChange, disabled, className, id, name, children }, ref) => {
    const [open, setOpen] = useState(false)
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const value = controlledValue !== undefined ? controlledValue : internalValue

    // Parse children <option> elements into options array
    const options: SelectOption[] = optionsProp ?? parseChildOptions(children)

    const selectedOption = options.find(opt => opt.value === value)
    const displayText = selectedOption?.label ?? placeholder ?? ''
    const isPlaceholder = !selectedOption

    const selectValue = useCallback((val: string) => {
      if (controlledValue === undefined) {
        setInternalValue(val)
      }
      onChange?.(val)
      setOpen(false)
    }, [controlledValue, onChange])

    // Close on outside click
    useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    // Reset focused index when opening
    useEffect(() => {
      if (open) {
        const idx = options.findIndex(opt => opt.value === value)
        setFocusedIndex(idx >= 0 ? idx : 0)
      }
    }, [open, options, value])

    // Scroll focused item into view
    useEffect(() => {
      if (!open || focusedIndex < 0 || !listRef.current) return
      const item = listRef.current.children[focusedIndex] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }, [open, focusedIndex])

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (!open) {
            setOpen(true)
          } else if (focusedIndex >= 0 && !options[focusedIndex]?.disabled) {
            selectValue(options[focusedIndex].value)
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!open) {
            setOpen(true)
          } else {
            setFocusedIndex(prev => {
              let next = prev + 1
              while (next < options.length && options[next]?.disabled) next++
              return next < options.length ? next : prev
            })
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (open) {
            setFocusedIndex(prev => {
              let next = prev - 1
              while (next >= 0 && options[next]?.disabled) next--
              return next >= 0 ? next : prev
            })
          }
          break
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          break
      }
    }

    return (
      <div ref={containerRef} className={cn('select-container', className)} style={{ position: 'relative' }}>
        {name && <input type="hidden" name={name} value={value} />}
        <div
          ref={ref}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          className={cn('select', error && 'input-error', disabled && 'select-disabled')}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleKeyDown}
        >
          <span className={cn('select-value', isPlaceholder && 'select-placeholder')}>
            {displayText}
          </span>
          <svg className={cn('select-chevron', open && 'select-chevron-open')} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {open && (
          <ul
            ref={listRef}
            role="listbox"
            className="select-dropdown"
          >
            {options.map((opt, i) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                aria-disabled={opt.disabled || undefined}
                className={cn(
                  'select-option',
                  opt.value === value && 'select-option-selected',
                  opt.disabled && 'select-option-disabled',
                  i === focusedIndex && 'select-option-focused',
                )}
                onMouseEnter={() => !opt.disabled && setFocusedIndex(i)}
                onClick={() => {
                  if (!opt.disabled) selectValue(opt.value)
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

function parseChildOptions(children: React.ReactNode): SelectOption[] {
  const result: SelectOption[] = []
  if (!children) return result

  const childArray = Array.isArray(children) ? children : [children]
  for (const child of childArray) {
    if (child && typeof child === 'object' && 'props' in child) {
      const props = child.props as { value?: string; disabled?: boolean; children?: React.ReactNode }
      if (props.value !== undefined) {
        result.push({
          value: String(props.value),
          label: String(props.children ?? props.value),
          disabled: props.disabled,
        })
      }
    }
  }
  return result
}
