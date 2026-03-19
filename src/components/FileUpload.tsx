import { useRef, useState, useCallback, forwardRef, type DragEvent } from 'react'
import { cn } from '../cn'

interface FileUploadProps {
  /** Accepted file types (e.g., "image/*,.pdf") */
  accept?: string
  /** Allow multiple files */
  multiple?: boolean
  /** Called with selected files */
  onChange?: (files: File[]) => void
  /** Disabled state */
  disabled?: boolean
  /** Max file size in bytes */
  maxSize?: number
  /** Custom label text */
  label?: string
  /** Hint text below label */
  hint?: string
  /** Additional class names */
  className?: string
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      accept,
      multiple = false,
      onChange,
      disabled = false,
      maxSize,
      label = 'Drop files here or click to browse',
      hint,
      className,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragOver, setDragOver] = useState(false)

    const handleFiles = useCallback(
      (fileList: FileList | null) => {
        if (!fileList || disabled) return
        let files = Array.from(fileList)
        if (maxSize) {
          files = files.filter((f) => f.size <= maxSize)
        }
        onChange?.(files)
      },
      [onChange, disabled, maxSize]
    )

    const handleDragOver = useCallback(
      (e: DragEvent) => {
        e.preventDefault()
        if (!disabled) setDragOver(true)
      },
      [disabled]
    )

    const handleDragLeave = useCallback(() => {
      setDragOver(false)
    }, [])

    const handleDrop = useCallback(
      (e: DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        if (!disabled) handleFiles(e.dataTransfer.files)
      },
      [disabled, handleFiles]
    )

    return (
      <div
        className={cn('file-upload', dragOver && 'file-upload-active', disabled && 'file-upload-disabled', className)}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <input
          ref={(node) => {
            (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
          }}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          style={{ display: 'none' }}
          aria-hidden="true"
          tabIndex={-1}
        />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="file-upload-label">{label}</span>
        {hint && <span className="file-upload-hint">{hint}</span>}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
