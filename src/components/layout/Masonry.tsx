import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../cn'

type MasonryColumns = 2 | 3 | 4

interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns (responsive: collapses on smaller screens) */
  columns?: MasonryColumns
}

const columnClass: Record<MasonryColumns, string> = {
  2: 'masonry-2',
  3: 'masonry-3',
  4: 'masonry-4',
}

export const Masonry = forwardRef<HTMLDivElement, MasonryProps>(
  ({ columns = 3, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(columnClass[columns], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Masonry.displayName = 'Masonry'
