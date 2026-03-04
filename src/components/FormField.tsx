import { useId, type ReactNode } from 'react'

interface FormFieldProps {
  /** Field label */
  label: string
  /** Error message */
  error?: string
  /** Optional hint text */
  hint?: string
  /** Required indicator */
  required?: boolean
  /** Unique id linking label to input */
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  hint,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  const autoId = useId()
  const fieldId = htmlFor ?? autoId
  const errorId = error ? `${fieldId}-error` : undefined
  const hintId = hint && !error ? `${fieldId}-hint` : undefined

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
      <label
        htmlFor={fieldId}
        className="label-md"
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--error)', fontSize: 'var(--text-sm)' }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" style={{ color: 'var(--error)', fontSize: 'var(--text-sm)', margin: 0 }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
          {hint}
        </p>
      )}
    </div>
  )
}
