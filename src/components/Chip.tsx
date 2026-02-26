import { forwardRef, type ReactNode, type CSSProperties, type MouseEvent } from 'react'
import { cn } from '../cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChipVariant = 'filled' | 'outlined' | 'soft'
export type ChipSize = 'sm' | 'md'
export type ChipColor = 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface ChipProps {
  /** Visual variant */
  variant?: ChipVariant
  /** Size */
  size?: ChipSize
  /** Color theme */
  color?: ChipColor
  /** Content */
  children: ReactNode
  /** Show delete button and handler */
  deletable?: boolean
  /** Called when delete button is clicked */
  onDelete?: () => void
  /** Selected/toggle state */
  selected?: boolean
  /** Click handler — makes the chip interactive/selectable */
  onClick?: () => void
  /** Disabled state */
  disabled?: boolean
  /** Icon slot (rendered before text) */
  icon?: ReactNode
  /** Avatar slot (rendered before text, given circular treatment) */
  avatar?: ReactNode
  /** Additional className */
  className?: string
  /** Additional styles */
  style?: CSSProperties
}

// ---------------------------------------------------------------------------
// Color Map
// ---------------------------------------------------------------------------

interface ColorTokens {
  base: string
  bg: string
  bgStrong: string
  border: string
  text: string
}

const colorMap: Record<ChipColor, ColorTokens> = {
  accent: {
    base: 'var(--accent, #60a5fa)',
    bg: 'var(--accent-bg, rgba(96,165,250,0.12))',
    bgStrong: 'var(--accent-bg-strong, rgba(96,165,250,0.2))',
    border: 'var(--accent, #60a5fa)',
    text: 'var(--accent, #60a5fa)',
  },
  success: {
    base: 'var(--success)',
    bg: 'rgba(48,209,88,0.12)',
    bgStrong: 'rgba(48,209,88,0.2)',
    border: 'var(--success)',
    text: 'var(--success)',
  },
  warning: {
    base: 'var(--warning)',
    bg: 'rgba(255,214,10,0.12)',
    bgStrong: 'rgba(255,214,10,0.2)',
    border: 'var(--warning)',
    text: 'var(--warning)',
  },
  error: {
    base: 'var(--error)',
    bg: 'rgba(255,69,58,0.12)',
    bgStrong: 'rgba(255,69,58,0.2)',
    border: 'var(--error)',
    text: 'var(--error)',
  },
  info: {
    base: 'var(--info)',
    bg: 'rgba(100,210,255,0.12)',
    bgStrong: 'rgba(100,210,255,0.2)',
    border: 'var(--info)',
    text: 'var(--info)',
  },
  neutral: {
    base: 'var(--text-secondary)',
    bg: 'var(--p-white-6, rgba(255,255,255,0.06))',
    bgStrong: 'var(--p-white-10, rgba(255,255,255,0.10))',
    border: 'var(--border-default)',
    text: 'var(--text-secondary)',
  },
}

// ---------------------------------------------------------------------------
// Size Map
// ---------------------------------------------------------------------------

interface SizeTokens {
  height: number
  fontSize: string
  padding: string
  iconSize: number
  avatarSize: number
  deleteSize: number
  gap: number
}

const sizeMap: Record<ChipSize, SizeTokens> = {
  sm: {
    height: 24,
    fontSize: 'var(--text-xs)',
    padding: '0 8px',
    iconSize: 12,
    avatarSize: 16,
    deleteSize: 12,
    gap: 4,
  },
  md: {
    height: 30,
    fontSize: 'var(--text-sm)',
    padding: '0 12px',
    iconSize: 14,
    avatarSize: 20,
    deleteSize: 14,
    gap: 6,
  },
}

// ---------------------------------------------------------------------------
// Delete Button SVG
// ---------------------------------------------------------------------------

function DeleteIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      style={{ display: 'block' }}
    >
      <path
        d="M3 3L9 9M9 3L3 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVariantStyles(
  variant: ChipVariant,
  colors: ColorTokens,
  selected: boolean
): CSSProperties {
  if (selected) {
    return {
      background: colors.base,
      color: '#000',
      borderColor: colors.base,
    }
  }

  switch (variant) {
    case 'filled':
      return {
        background: colors.bg,
        color: colors.text,
        borderColor: 'transparent',
      }
    case 'outlined':
      return {
        background: 'transparent',
        color: colors.text,
        borderColor: colors.border,
      }
    case 'soft':
      return {
        background: colors.bg,
        color: colors.text,
        borderColor: colors.bg,
      }
  }
}

function getHoverStyles(
  variant: ChipVariant,
  colors: ColorTokens,
  selected: boolean
): CSSProperties {
  if (selected) {
    return {
      background: colors.text,
      borderColor: colors.text,
    }
  }

  switch (variant) {
    case 'filled':
      return {
        background: colors.bgStrong,
      }
    case 'outlined':
      return {
        background: colors.bg,
        borderColor: colors.text,
      }
    case 'soft':
      return {
        background: colors.bgStrong,
        borderColor: colors.bgStrong,
      }
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      variant = 'soft',
      size = 'md',
      color = 'neutral',
      children,
      deletable = false,
      onDelete,
      selected = false,
      onClick,
      disabled = false,
      icon,
      avatar,
      className,
      style,
    },
    ref
  ) => {
    const colors = colorMap[color]
    const s = sizeMap[size]
    const isInteractive = (!!onClick || deletable) && !disabled
    const variantStyles = getVariantStyles(variant, colors, selected)

    const rootStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: s.gap,
      height: s.height,
      padding: avatar ? `0 ${size === 'sm' ? 8 : 12}px 0 ${size === 'sm' ? 2 : 4}px` : s.padding,
      borderRadius: 'var(--radius-full)',
      border: '1px solid',
      fontSize: s.fontSize,
      fontWeight: 500,
      fontFamily: 'inherit',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      cursor: isInteractive ? 'pointer' : disabled ? 'not-allowed' : 'default',
      opacity: disabled ? 0.4 : 1,
      transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease',
      userSelect: isInteractive ? 'none' : undefined,
      outline: 'none',
      ...variantStyles,
      ...style,
    }

    const handleClick = onClick && !disabled ? onClick : undefined

    const handleDeleteClick = (e: MouseEvent) => {
      e.stopPropagation()
      if (!disabled && onDelete) {
        onDelete()
      }
    }

    const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) return
      const hoverStyles = getHoverStyles(variant, colors, selected)
      const el = e.currentTarget
      if (hoverStyles.background) el.style.background = hoverStyles.background as string
      if (hoverStyles.borderColor) el.style.borderColor = hoverStyles.borderColor as string
      if (hoverStyles.color) el.style.color = hoverStyles.color as string
    }

    const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) return
      const el = e.currentTarget
      el.style.background = (variantStyles.background as string) ?? ''
      el.style.borderColor = (variantStyles.borderColor as string) ?? ''
      el.style.color = (variantStyles.color as string) ?? ''
    }

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) return
      e.currentTarget.style.transform = 'scale(0.96)'
    }

    const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) return
      e.currentTarget.style.transform = 'scale(1)'
    }

    return (
      <div
        ref={ref}
        role={onClick ? 'button' : deletable ? 'group' : undefined}
        tabIndex={isInteractive && onClick ? 0 : undefined}
        aria-disabled={disabled || undefined}
        aria-pressed={onClick ? selected : undefined}
        className={cn('chip', `chip-${variant}`, `chip-${color}`, selected && 'chip-selected', className)}
        style={rootStyle}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onClick()
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Avatar slot */}
        {avatar && (
          <span
            style={{
              width: s.avatarSize,
              height: s.avatarSize,
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {avatar}
          </span>
        )}

        {/* Icon slot */}
        {icon && !avatar && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: s.iconSize,
              height: s.iconSize,
            }}
          >
            {icon}
          </span>
        )}

        {/* Label */}
        <span>{children}</span>

        {/* Delete button */}
        {deletable && (
          <button
            type="button"
            aria-label="Remove"
            tabIndex={-1}
            onClick={handleDeleteClick}
            disabled={disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: s.deleteSize + 4,
              height: s.deleteSize + 4,
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'transparent',
              color: 'inherit',
              opacity: 0.6,
              cursor: disabled ? 'not-allowed' : 'pointer',
              padding: 0,
              transition: 'opacity 0.15s ease, background-color 0.15s ease',
              marginLeft: -2,
              marginRight: -4,
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.6'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <DeleteIcon size={s.deleteSize} />
          </button>
        )}
      </div>
    )
  }
)

Chip.displayName = 'Chip'
