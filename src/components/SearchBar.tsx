import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { cn } from '../cn'

/* ── Types ────────────────────────────────── */

type SearchBarSize = 'sm' | 'md' | 'lg'

interface SearchBarProps {
  /** Current value */
  value: string
  /** Callback when value changes */
  onChange: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Callback when clear button is clicked */
  onClear?: () => void
  /** Callback when Enter is pressed */
  onSubmit?: (value: string) => void
  /** Show loading spinner */
  loading?: boolean
  /** Component size */
  size?: SearchBarSize
  /** Icon-only mode that expands on click */
  expandable?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Additional class name */
  className?: string
  /** Additional styles */
  style?: CSSProperties
}

/* ── Size config ──────────────────────────── */

const sizeConfig: Record<SearchBarSize, { height: number; iconSize: number; fontSize: string; padding: number }> = {
  sm: { height: 32, iconSize: 14, fontSize: 'var(--text-xs)', padding: 8 },
  md: { height: 38, iconSize: 16, fontSize: 'var(--text-sm)', padding: 12 },
  lg: { height: 44, iconSize: 18, fontSize: 'var(--text-base)', padding: 16 },
}

/* ── SVG Icons ────────────────────────────── */

function SearchIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ClearIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function LoadingSpinner({ size }: { size: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ── Component ────────────────────────────── */

export const SearchBar = forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Search...',
      onClear,
      onSubmit,
      loading = false,
      size = 'md',
      expandable = false,
      disabled = false,
      className,
      style,
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(false)
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const config = sizeConfig[size]
    const hasValue = value.length > 0

    /* ── Expandable: outside click to collapse ── */

    useEffect(() => {
      if (!expandable || !expanded) return

      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current?.contains(e.target as Node)) return
        if (!hasValue) {
          setExpanded(false)
        }
      }

      document.addEventListener('mousedown', handleOutsideClick)
      return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [expandable, expanded, hasValue])

    /* ── Focus input when expanding ─────────── */

    useEffect(() => {
      if (expandable && expanded) {
        requestAnimationFrame(() => inputRef.current?.focus())
      }
    }, [expandable, expanded])

    /* ── Handlers ──────────────────────────── */

    const handleClear = useCallback(() => {
      onChange('')
      onClear?.()
      inputRef.current?.focus()
    }, [onChange, onClear])

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          if (hasValue) {
            handleClear()
          } else if (expandable) {
            setExpanded(false)
            inputRef.current?.blur()
          }
        } else if (e.key === 'Enter') {
          onSubmit?.(value)
        }
      },
      [hasValue, handleClear, expandable, onSubmit, value],
    )

    const handleExpand = useCallback(() => {
      if (disabled) return
      setExpanded(true)
    }, [disabled])

    /* ── Expandable icon-only button ──────── */

    if (expandable && !expanded) {
      return (
        <div ref={ref} className={cn('search-bar', className)} style={style}>
          <button
            type="button"
            disabled={disabled}
            onClick={handleExpand}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: config.height,
              height: config.height,
              borderRadius: 'var(--radius-full)',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = 'var(--hover-bg)'
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
            aria-label="Open search"
          >
            <SearchIcon size={config.iconSize} />
          </button>
        </div>
      )
    }

    /* ── Full search bar ──────────────────── */

    const borderColor = disabled
      ? 'var(--border-subtle)'
      : focused
        ? 'var(--accent)'
        : hovered
          ? 'var(--border-default)'
          : 'var(--border-subtle)'

    const boxShadow = focused && !disabled
      ? '0 0 0 2px var(--accent-bg)'
      : 'none'

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn('search-bar', className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: config.height,
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-secondary)',
          border: `1px solid ${borderColor}`,
          boxShadow,
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.4 : 1,
          ...(expandable
            ? { animation: 'searchbar-expand 0.2s ease forwards' }
            : {}),
          ...style,
        }}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Search icon */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            color: focused ? 'var(--accent)' : 'var(--text-secondary)',
            paddingLeft: config.padding,
            transition: 'color 0.15s ease',
          }}
        >
          <SearchIcon size={config.iconSize} />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: config.fontSize,
            padding: `0 ${config.padding / 2}px`,
            minWidth: 0,
            height: '100%',
          }}
        />

        {/* Right side: loading spinner or clear button */}
        {loading ? (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              color: 'var(--text-secondary)',
              paddingRight: config.padding,
            }}
          >
            <LoadingSpinner size={config.iconSize} />
          </span>
        ) : hasValue && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: config.height - 8,
              height: config.height - 8,
              marginRight: 4,
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--hover-bg)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <ClearIcon size={config.iconSize - 2} />
          </button>
        ) : null}
      </div>
    )
  },
)

SearchBar.displayName = 'SearchBar'
