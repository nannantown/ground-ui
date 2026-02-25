import { useState } from 'react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
}

const spinKeyframes = `
@keyframes confirm-dialog-spin {
  to { transform: rotate(360deg); }
}
`

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  const defaultConfirm = variant === 'danger' ? 'Delete' : 'Confirm'
  const defaultCancel = 'Cancel'

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <style>{spinKeyframes}</style>
      <div style={{ padding: 24, textAlign: 'center' }}>
        {variant === 'danger' && (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 16,
              background: 'var(--error-bg-strong)',
            }}
          >
            <svg
              style={{ width: 24, height: 24, color: 'var(--error)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )}

        {title && (
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </h3>
        )}

        <p style={{ fontSize: 14, marginBottom: 24, color: 'var(--text-primary)' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: 14, paddingTop: 10, paddingBottom: 10 }}
          >
            {cancelLabel || defaultCancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            style={{ flex: 1, fontSize: 14, paddingTop: 10, paddingBottom: 10 }}
          >
            {loading ? (
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: 'currentColor',
                  borderTopColor: 'transparent',
                  borderRadius: 9999,
                  animation: 'confirm-dialog-spin 1s linear infinite',
                }}
              />
            ) : (
              confirmLabel || defaultConfirm
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
