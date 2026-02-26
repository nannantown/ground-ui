import {
  useState,
  useCallback,
  useRef,
  type FormEvent,
  type ReactNode,
} from 'react'

type FormValues = Record<string, string>
type FormErrors = Record<string, string>
type FormTouched = Record<string, boolean>

interface FormState {
  /** Current field values */
  values: FormValues
  /** Current field errors */
  errors: FormErrors
  /** Which fields have been interacted with */
  touched: FormTouched
  /** Update a field value — can be used as onChange handler target */
  handleChange: (
    nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    value?: string
  ) => void
  /** Mark a field as touched — can be used as onBlur handler target */
  handleBlur: (
    nameOrEvent: string | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  /** Submit the form programmatically */
  handleSubmit: () => void
  /** Whether all fields pass validation */
  isValid: boolean
  /** Whether any value differs from initialValues */
  isDirty: boolean
  /** Reset form to initialValues, clearing errors and touched */
  reset: () => void
  /** Whether a submit is currently in progress */
  isSubmitting: boolean
}

interface FormProps {
  /** Initial field values */
  initialValues?: FormValues
  /** Validation function — return an object of field name to error message */
  validate?: (values: FormValues) => FormErrors
  /** Called with current values when validation passes */
  onSubmit?: (values: FormValues) => void | Promise<void>
  /** Called when the form is reset */
  onReset?: () => void
  /** Render prop providing form state and helpers */
  children: (state: FormState) => ReactNode
  /** Additional class name for the form element */
  className?: string
}

export function Form({
  initialValues = {},
  validate,
  onSubmit,
  onReset,
  children,
  className,
}: FormProps) {
  const [values, setValues] = useState<FormValues>({ ...initialValues })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<FormTouched>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const initialRef = useRef(initialValues)

  const runValidation = useCallback(
    (vals: FormValues): FormErrors => {
      if (!validate) return {}
      return validate(vals)
    },
    [validate]
  )

  const handleChange = useCallback(
    (
      nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      value?: string
    ) => {
      let fieldName: string
      let fieldValue: string

      if (typeof nameOrEvent === 'string') {
        fieldName = nameOrEvent
        fieldValue = value ?? ''
      } else {
        fieldName = nameOrEvent.target.name
        fieldValue = nameOrEvent.target.value
      }

      setValues((prev) => {
        const next = { ...prev, [fieldName]: fieldValue }
        // Re-validate on change if field was already touched
        setErrors((prevErrors) => {
          const newErrors = runValidation(next)
          // Only update errors for touched fields
          const merged = { ...prevErrors }
          for (const key of Object.keys(newErrors)) {
            if (touched[key]) {
              merged[key] = newErrors[key]
            }
          }
          // Clear error if fixed
          if (!newErrors[fieldName]) {
            delete merged[fieldName]
          } else if (touched[fieldName]) {
            merged[fieldName] = newErrors[fieldName]
          }
          return merged
        })
        return next
      })
    },
    [runValidation, touched]
  )

  const handleBlur = useCallback(
    (
      nameOrEvent: string | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const fieldName =
        typeof nameOrEvent === 'string'
          ? nameOrEvent
          : nameOrEvent.target.name

      setTouched((prev) => ({ ...prev, [fieldName]: true }))

      // Validate on blur
      setValues((currentValues) => {
        const newErrors = runValidation(currentValues)
        setErrors((prev) => {
          const merged = { ...prev }
          if (newErrors[fieldName]) {
            merged[fieldName] = newErrors[fieldName]
          } else {
            delete merged[fieldName]
          }
          return merged
        })
        return currentValues
      })
    },
    [runValidation]
  )

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    const allTouched: FormTouched = {}
    for (const key of Object.keys(values)) {
      allTouched[key] = true
    }
    setTouched(allTouched)

    // Run validation
    const validationErrors = runValidation(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    if (onSubmit) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [values, runValidation, onSubmit])

  const reset = useCallback(() => {
    setValues({ ...initialRef.current })
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
    onReset?.()
  }, [onReset])

  const handleFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      handleSubmit()
    },
    [handleSubmit]
  )

  const handleFormReset = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      reset()
    },
    [reset]
  )

  const currentErrors = errors
  const isValid = Object.keys(currentErrors).length === 0
  const isDirty = Object.keys(values).some(
    (key) => values[key] !== (initialRef.current[key] ?? '')
  )

  const formState: FormState = {
    values,
    errors: currentErrors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    isDirty,
    reset,
    isSubmitting,
  }

  return (
    <form
      className={className}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      noValidate
    >
      {children(formState)}
    </form>
  )
}

Form.displayName = 'Form'
