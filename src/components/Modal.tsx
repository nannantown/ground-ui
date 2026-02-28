import { useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Max width. Default: 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Show close button in top-right corner */
  showClose?: boolean
}

const sizeMap: Record<string, number> = {
  sm: 384,
  md: 448,
  lg: 512,
  xl: 576,
}

export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  showClose = false,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return createPortal(
    <>
      {/* Scrim */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 'var(--z-overlay)',
          background: 'var(--modal-scrim)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />
      {/* Container */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          zIndex: 'var(--z-modal)',
        }}
      >
        <div
          className="animate-scale-in"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: sizeMap[size],
            background: 'var(--modal-bg)',
            border: '1px solid var(--modal-border)',
            borderRadius: 'var(--modal-radius)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {showClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s ease, background-color 0.15s ease',
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {children}
        </div>
      </div>
    </>,
    document.body
  )
}

/* Modal sub-components for consistent layout */
export function ModalHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {children}
    </div>
  )
}

export function ModalBody({ children }: { children: ReactNode }) {
  return (
    <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16 }}>
      {children}
    </div>
  )
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 16,
        paddingBottom: 16,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {children}
    </div>
  )
}
