import { createContext, useCallback, useContext, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../cn'

/* ─── Context ─── */

interface RadioGroupContextValue {
  name: string
  value: string | undefined
  disabled: boolean
  onChange: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) {
    throw new Error('RadioGroupItem must be used within a RadioGroup')
  }
  return ctx
}

/* ─── RadioGroup ─── */

interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
  children: ReactNode
  className?: string
}

export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onChange: onChangeProp,
  name: nameProp,
  disabled = false,
  orientation = 'vertical',
  children,
  className,
}: RadioGroupProps) {
  const generatedId = useId()
  const name = nameProp ?? `radio-group-${generatedId}`

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : uncontrolledValue

  const onChangeRef = useRef(onChangeProp)
  onChangeRef.current = onChangeProp

  const handleChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }
      onChangeRef.current?.(nextValue)
    },
    [isControlled],
  )

  return (
    <RadioGroupContext.Provider
      value={{ name, value: currentValue, disabled, onChange: handleChange }}
    >
      <div
        role="radiogroup"
        className={className}
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: orientation === 'vertical' ? 8 : 16,
        }}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

/* ─── RadioGroupItem ─── */

interface RadioGroupItemProps {
  value: string
  label?: string
  disabled?: boolean
  className?: string
}

export function RadioGroupItem({
  value,
  label,
  disabled: itemDisabled = false,
  className,
}: RadioGroupItemProps) {
  const ctx = useRadioGroupContext()
  const isChecked = ctx.value === value
  const isDisabled = ctx.disabled || itemDisabled
  const inputId = useId()

  return (
    <label
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.4 : 1,
      }}
    >
      <input
        type="radio"
        name={ctx.name}
        id={inputId}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() => {
          if (!isDisabled) ctx.onChange(value)
        }}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
      <span
        role="radio"
        aria-checked={isChecked}
        className={cn('radio', isChecked && 'radio-checked')}
        aria-disabled={isDisabled || undefined}
      />
      {label && (
        <span
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </span>
      )}
    </label>
  )
}
