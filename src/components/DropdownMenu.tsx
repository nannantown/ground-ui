import { useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../cn'

interface DropdownMenuProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}

export function DropdownMenu({ trigger, children, align = 'right' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 4,
        left: align === 'right' ? rect.right : rect.left,
      })
    }
  }, [open, align])

  useEffect(() => {
    if (!open) return
    const handleClick = () => setOpen(false)
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <>
      <div ref={triggerRef} onClick={(e) => { e.stopPropagation(); setOpen(!open) }}>
        {trigger}
      </div>
      {open && createPortal(
        <div
          className="animate-slide-down"
          style={{
            position: 'fixed',
            top: position.top,
            ...(align === 'right'
              ? { right: window.innerWidth - position.left }
              : { left: position.left }),
            zIndex: 'var(--z-dropdown)',
            minWidth: 160,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              borderRadius: 8,
              overflow: 'hidden',
              paddingTop: 4,
              paddingBottom: 4,
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-default)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

interface DropdownItemProps {
  onClick?: () => void
  children: ReactNode
  variant?: 'default' | 'danger'
  disabled?: boolean
}

export function DropdownItem({ onClick, children, variant = 'default', disabled }: DropdownItemProps) {
  return (
    <button
      className={cn('dropdown-item', variant === 'danger' && 'dropdown-item-danger')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div style={{ marginTop: 4, marginBottom: 4, borderTop: '1px solid var(--border-subtle)' }} />
}
