import type { ReactNode } from 'react'
import { cn } from '../cn'

type KBDSize = 'sm' | 'md'

interface KBDProps {
  /** Key label (e.g., "Ctrl", "Shift", "A") */
  children: ReactNode
  /** Size variant */
  size?: KBDSize
  /** Additional class names */
  className?: string
}

export function KBD({ children, size = 'md', className }: KBDProps) {
  return (
    <kbd className={cn('kbd', size === 'sm' && 'kbd-sm', className)}>
      {children}
    </kbd>
  )
}

interface KBDGroupProps {
  /** Keys to display, joined by separator */
  keys: string[]
  /** Separator between keys (default: "+") */
  separator?: string
  /** Size variant */
  size?: KBDSize
  /** Additional class names */
  className?: string
}

export function KBDGroup({ keys, separator = '+', size = 'md', className }: KBDGroupProps) {
  return (
    <span className={cn('kbd-group', className)}>
      {keys.map((key, i) => (
        <span key={i}>
          {i > 0 && <span className="kbd-separator">{separator}</span>}
          <KBD size={size}>{key}</KBD>
        </span>
      ))}
    </span>
  )
}
