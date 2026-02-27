import { useRef, useCallback, type KeyboardEvent } from 'react'
import { cn } from '../cn'

export interface SegmentedControlItem {
  value: string
  label: string
  disabled?: boolean
}

interface SegmentedControlProps {
  /** Array of selectable items */
  items: SegmentedControlItem[]
  /** Currently selected value */
  value: string
  /** Called when selection changes */
  onChange: (value: string) => void
  /** Size variant */
  size?: 'sm' | 'md'
  /** Disable all items */
  disabled?: boolean
  /** Accessible label for the control group */
  'aria-label'?: string
  className?: string
}

/**
 * SegmentedControl — A mutually exclusive toggle group (radio-group pattern).
 * Uses CSS classes `.segmented-control`, `.segmented-control-item`, `.segmented-control-active`.
 *
 * Keyboard: Arrow Left/Right to move focus, Home/End to jump, Space/Enter to select.
 */
export function SegmentedControl({
  items,
  value,
  onChange,
  size = 'md',
  disabled = false,
  'aria-label': ariaLabel = 'Options',
  className,
}: SegmentedControlProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const enabledIndices = items.reduce<number[]>((acc, item, i) => {
    if (!item.disabled && !disabled) acc.push(i)
    return acc
  }, [])

  const focusItem = useCallback((index: number) => {
    itemRefs.current[index]?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const pos = enabledIndices.indexOf(index)
      if (pos === -1) return

      let nextIndex: number | undefined

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          nextIndex = enabledIndices[(pos + 1) % enabledIndices.length]
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          nextIndex = enabledIndices[(pos - 1 + enabledIndices.length) % enabledIndices.length]
          break
        case 'Home':
          e.preventDefault()
          nextIndex = enabledIndices[0]
          break
        case 'End':
          e.preventDefault()
          nextIndex = enabledIndices[enabledIndices.length - 1]
          break
        case ' ':
        case 'Enter':
          e.preventDefault()
          onChange(items[index].value)
          return
      }

      if (nextIndex !== undefined) {
        focusItem(nextIndex)
        onChange(items[nextIndex].value)
      }
    },
    [enabledIndices, focusItem, items, onChange],
  )

  const smStyle = size === 'sm' ? { padding: '2px 8px', fontSize: 'var(--text-xs)' } as const : undefined

  return (
    <div
      className={cn('segmented-control', className)}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {items.map((item, i) => {
        const isSelected = item.value === value
        const isDisabled = disabled || !!item.disabled
        return (
          <button
            key={item.value}
            ref={(el) => { itemRefs.current[i] = el }}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={isDisabled}
            className={cn(
              'segmented-control-item',
              isSelected && 'segmented-control-active',
            )}
            style={smStyle}
            onClick={() => {
              if (!isDisabled) onChange(item.value)
            }}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
