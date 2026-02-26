import { useEffect, useCallback, forwardRef, type ReactNode, type HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../cn'

type DrawerSide = 'left' | 'right' | 'bottom'

interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: DrawerSide
  children: ReactNode
  /** Width for left/right drawers */
  width?: string
  className?: string
  /** Show backdrop */
  backdrop?: boolean
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      side = 'right',
      children,
      width,
      className,
      backdrop = true,
    },
    ref
  ) => {
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

    const sideClass = `drawer-${side}`

    return createPortal(
      <>
        {backdrop && (
          <div
            className="drawer-backdrop"
            onClick={onClose}
          />
        )}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn('drawer', sideClass, className)}
          style={width ? { '--drawer-width': width } as React.CSSProperties : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </>,
      document.body
    )
  }
)

Drawer.displayName = 'Drawer'

/* Drawer sub-components for consistent layout */

export function DrawerHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('drawer-header', className)} {...props}>
      {children}
    </div>
  )
}

DrawerHeader.displayName = 'DrawerHeader'

export function DrawerBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('drawer-body', className)} {...props}>
      {children}
    </div>
  )
}

DrawerBody.displayName = 'DrawerBody'

export function DrawerFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('drawer-footer', className)} {...props}>
      {children}
    </div>
  )
}

DrawerFooter.displayName = 'DrawerFooter'
