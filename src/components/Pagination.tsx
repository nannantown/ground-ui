import { cn } from '../cn'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  /** How many pages to show around current page (default: 1) */
  siblingCount?: number
  /** Show first/last page buttons (default: true) */
  showFirstLast?: boolean
  className?: string
}

/**
 * Build the list of page indicators to render.
 * Returns an array of page numbers and `'ellipsis'` markers.
 *
 * Example with totalPages=10, currentPage=5, siblingCount=1:
 *   [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 */
function buildPageRange(
  totalPages: number,
  currentPage: number,
  siblingCount: number
): (number | 'ellipsis')[] {
  // Total page indicators that are always visible:
  //   first + last + current + 2*siblings + 2 potential ellipses
  const totalSlots = siblingCount * 2 + 5

  // If total pages fit within the slots, show every page
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1)
  const rightSibling = Math.min(currentPage + siblingCount, totalPages)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    // Near the start: show first several pages + ellipsis + last
    const leftCount = siblingCount * 2 + 3
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1)
    return [...leftRange, 'ellipsis', totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    // Near the end: first + ellipsis + last several pages
    const rightCount = siblingCount * 2 + 3
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages - rightCount + 1 + i
    )
    return [1, 'ellipsis', ...rightRange]
  }

  // Middle: first + ellipsis + siblings + ellipsis + last
  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  )
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
}

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = buildPageRange(totalPages, currentPage, siblingCount)
  const isFirst = currentPage === 1
  const isLast = currentPage === totalPages

  return (
    <nav aria-label="Pagination" className={cn('pagination', className)}>
      {showFirstLast && (
        <button
          type="button"
          className="pagination-item"
          disabled={isFirst}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 18L5 12l6-6" />
            <path d="M19 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <button
        type="button"
        className="pagination-item"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          )
        }

        const isActive = page === currentPage
        return (
          <button
            key={page}
            type="button"
            className={cn('pagination-item', isActive && 'pagination-item-active')}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        className="pagination-item"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>

      {showFirstLast && (
        <button
          type="button"
          className="pagination-item"
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 6l6 6-6 6" />
            <path d="M5 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </nav>
  )
}
