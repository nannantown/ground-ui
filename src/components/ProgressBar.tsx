import { cn } from '../cn'

interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  value: number
  /** Height variant */
  size?: 'sm' | 'md' | 'lg'
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  /** Show percentage label next to the bar */
  showLabel?: boolean
  /** Accessible label describing what this progress bar represents */
  'aria-label'?: string
  className?: string
}

/**
 * ProgressBar — A linear progress indicator with ARIA progressbar semantics.
 * Uses CSS classes `.progress`, `.progress-sm`, `.progress-lg`, `.progress-bar`, `.progress-bar-{variant}`.
 */
export function ProgressBar({
  value,
  size = 'md',
  variant = 'default',
  showLabel = false,
  'aria-label': ariaLabel = 'Progress',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100)

  return (
    <div
      style={showLabel ? { display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' } : undefined}
    >
      <div
        className={cn(
          'progress',
          size === 'sm' && 'progress-sm',
          size === 'lg' && 'progress-lg',
          className,
        )}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <div
          className={cn(
            'progress-bar',
            variant !== 'default' && `progress-bar-${variant}`,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            minWidth: '3ch',
            textAlign: 'right',
          }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  )
}
