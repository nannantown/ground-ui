import { useCallback, useId, useState } from 'react'
import { cn } from '../cn'

interface CheckboxProps {
  /** Controlled checked state */
  checked?: boolean
  /** Initial checked state for uncontrolled mode */
  defaultChecked?: boolean
  /** Called when checked state changes */
  onChange?: (checked: boolean) => void
  /** Disable the checkbox */
  disabled?: boolean
  /** Visible label text */
  label?: string
  /** Additional class names */
  className?: string
  /** HTML id for the input element */
  id?: string
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  className,
  id,
}: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  const isControlled = controlledChecked !== undefined
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = isControlled ? controlledChecked : internalChecked

  const handleChange = useCallback(() => {
    if (disabled) return
    const next = !isChecked
    if (!isControlled) {
      setInternalChecked(next)
    }
    onChange?.(next)
  }, [disabled, isChecked, isControlled, onChange])

  return (
    <label
      className={cn('checkbox-wrapper', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Hidden native input for accessibility */}
      <input
        type="checkbox"
        id={inputId}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        aria-checked={isChecked}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          margin: '-1px',
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
      {/* Visual checkbox */}
      <span
        className={cn(
          'checkbox',
          isChecked && 'checkbox-checked',
        )}
        aria-hidden="true"
        aria-disabled={disabled || undefined}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </span>
      {label && (
        <span
          style={{
            fontSize: 'var(--text-sm)',
            color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      )}
    </label>
  )
}
