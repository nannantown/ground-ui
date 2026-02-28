import { useState, useCallback, useMemo, forwardRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  key: string
  direction: SortDirection
}

export interface DataTableColumn<T = Record<string, unknown>> {
  /** Unique key matching the data field */
  key: string
  /** Column header label */
  label: string
  /** Enable sorting for this column */
  sortable?: boolean
  /** Fixed column width (CSS value) */
  width?: string | number
  /** Custom cell renderer */
  render?: (value: unknown, row: T, rowIndex: number) => ReactNode
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Custom header renderer */
  headerRender?: (column: DataTableColumn<T>) => ReactNode
}

export interface DataTableProps<T = Record<string, unknown>> {
  /** Column definitions */
  columns: DataTableColumn<T>[]
  /** Row data */
  data: T[]
  /** Enable sorting (all columns with sortable flag) */
  sortable?: boolean
  /** Controlled sort state */
  sort?: SortState
  /** Sort change handler */
  onSort?: (sort: SortState) => void
  /** Row click handler */
  onRowClick?: (row: T, rowIndex: number) => void
  /** Message shown when data is empty */
  emptyMessage?: string
  /** Alternate row shading */
  striped?: boolean
  /** Reduced row padding */
  compact?: boolean
  /** Sticky header on scroll */
  stickyHeader?: boolean
  /** Row key extractor — defaults to index */
  rowKey?: (row: T, index: number) => string | number
  /** Additional className on the wrapper */
  className?: string
  /** Additional styles on the wrapper */
  style?: CSSProperties
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

// ---------------------------------------------------------------------------
// Sort Indicator SVG
// ---------------------------------------------------------------------------

function SortIndicator({ direction }: { direction: SortDirection }) {
  const upColor = direction === 'asc' ? 'var(--text-primary)' : 'var(--text-secondary)'
  const downColor = direction === 'desc' ? 'var(--text-primary)' : 'var(--text-secondary)'

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        flexShrink: 0,
        marginLeft: 4,
        opacity: direction === null ? 0.35 : 1,
        transition: 'opacity 0.15s ease',
      }}
    >
      <path d="M6 2L9 5.5H3L6 2Z" fill={upColor} />
      <path d="M6 10L3 6.5H9L6 10Z" fill={downColor} />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const wrapperStyle: CSSProperties = {
  width: '100%',
  overflow: 'auto',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-card)',
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'inherit',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-primary)',
}

const thBaseStyle: CSSProperties = {
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 'var(--text-xs)',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  background: 'var(--bg-secondary)',
  borderBottom: '1px solid var(--border-default)',
  whiteSpace: 'nowrap',
  userSelect: 'none',
}

const tdBaseStyle: CSSProperties = {
  borderBottom: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  verticalAlign: 'middle',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function DataTableInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    sortable = false,
    sort: controlledSort,
    onSort,
    onRowClick,
    emptyMessage = 'No data',
    striped = false,
    compact = false,
    stickyHeader = false,
    rowKey,
    className,
    style,
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  // -- Internal sort state (used when uncontrolled) --
  const [internalSort, setInternalSort] = useState<SortState>({ key: '', direction: null })
  const currentSort = controlledSort ?? internalSort

  const handleSort = useCallback(
    (key: string) => {
      const next: SortState = (() => {
        if (currentSort.key !== key) return { key, direction: 'asc' as const }
        if (currentSort.direction === 'asc') return { key, direction: 'desc' as const }
        return { key: '', direction: null }
      })()

      if (onSort) {
        onSort(next)
      } else {
        setInternalSort(next)
      }
    },
    [currentSort, onSort]
  )

  // -- Sorted data --
  const sortedData = useMemo(() => {
    if (!currentSort.key || currentSort.direction === null) return data
    const dir = currentSort.direction === 'asc' ? 1 : -1
    return [...data].sort((a, b) => {
      const va = getNestedValue(a, currentSort.key)
      const vb = getNestedValue(b, currentSort.key)
      return defaultCompare(va, vb) * dir
    })
  }, [data, currentSort])

  // -- Cell padding --
  const cellPadding = compact
    ? '6px 12px'
    : '10px 16px'

  return (
    <div
      ref={ref}
      className={cn('data-table-wrapper', className)}
      style={{ ...wrapperStyle, ...style }}
      role="region"
      aria-label="Data table"
      tabIndex={0}
    >
      <table style={tableStyle}>
        {/* Header */}
        <thead>
          <tr>
            {columns.map((col) => {
              const isSortable = sortable && col.sortable !== false
              const isSorted = currentSort.key === col.key
              const align = col.align ?? 'left'

              return (
                <th
                  key={col.key}
                  style={{
                    ...thBaseStyle,
                    padding: cellPadding,
                    width: col.width,
                    textAlign: align,
                    cursor: isSortable ? 'pointer' : 'default',
                    ...(stickyHeader
                      ? {
                          position: 'sticky',
                          top: 0,
                          zIndex: 2,
                        }
                      : {}),
                  }}
                  onClick={isSortable ? () => handleSort(col.key) : undefined}
                  aria-sort={
                    isSorted && currentSort.direction === 'asc'
                      ? 'ascending'
                      : isSorted && currentSort.direction === 'desc'
                        ? 'descending'
                        : 'none'
                  }
                  onMouseEnter={(e) => {
                    if (isSortable) {
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isSortable) {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    {col.headerRender ? col.headerRender(col) : col.label}
                    {isSortable && (
                      <SortIndicator direction={isSorted ? currentSort.direction : null} />
                    )}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIdx) => {
              const key = rowKey ? rowKey(row, rowIdx) : rowIdx
              const isClickable = !!onRowClick
              const isStriped = striped && rowIdx % 2 === 1

              return (
                <tr
                  key={key}
                  onClick={isClickable ? () => onRowClick!(row, rowIdx) : undefined}
                  style={{
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease',
                    background: isStriped ? 'var(--p-white-4, rgba(255,255,255,0.04))' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--hover-bg)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isStriped
                      ? 'var(--p-white-4, rgba(255,255,255,0.04))'
                      : 'transparent'
                  }}
                  onMouseDown={(e) => {
                    if (isClickable) {
                      e.currentTarget.style.background = 'var(--p-white-8, rgba(255,255,255,0.08))'
                    }
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.background = 'var(--hover-bg)'
                  }}
                >
                  {columns.map((col) => {
                    const value = getNestedValue(row, col.key)
                    const align = col.align ?? 'left'

                    return (
                      <td
                        key={col.key}
                        style={{
                          ...tdBaseStyle,
                          padding: cellPadding,
                          textAlign: align,
                        }}
                      >
                        {col.render
                          ? col.render(value, row, rowIdx)
                          : (value as ReactNode) ?? '\u2014'}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export const DataTable = forwardRef(DataTableInner) as <T extends Record<string, unknown>>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => ReturnType<typeof DataTableInner>

;(DataTable as { displayName?: string }).displayName = 'DataTable'
