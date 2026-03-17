import type { ReactNode, CSSProperties } from 'react'
import { cn } from '../cn'

interface ToolbarButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  'aria-label'?: string
  className?: string
  style?: CSSProperties
}

export function ToolbarButton({
  children,
  onClick,
  disabled,
  'aria-label': ariaLabel,
  className,
  style,
}: ToolbarButtonProps) {
  return (
    <button
      className={cn('toolbar-button', className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </button>
  )
}
