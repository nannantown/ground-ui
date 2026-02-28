import type { ReactNode, CSSProperties } from 'react'

interface ToolbarButtonProps {
  children: ReactNode
  onClick?: () => void
  'aria-label'?: string
  className?: string
  style?: CSSProperties
}

export function ToolbarButton({
  children,
  onClick,
  'aria-label': ariaLabel,
  className,
  style,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-md)',
        background: 'transparent',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        fontSize: 11,
        fontWeight: 500,
        padding: 0,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-surface-hover)'
        e.currentTarget.style.color = 'var(--text-primary)'
        e.currentTarget.style.borderColor = 'var(--border-default)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--text-secondary)'
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
      }}
    >
      {children}
    </button>
  )
}
