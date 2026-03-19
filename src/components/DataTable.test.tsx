import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { DataTable } from './DataTable'

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(cleanup)

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
]

const data = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
]

describe('DataTable', () => {
  it('renders a table', () => {
    const { container } = render(<DataTable columns={columns} data={data} />)
    expect(container.querySelector('table')).toBeTruthy()
  })

  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Age')).toBeTruthy()
  })

  it('renders data rows', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Alice')).toBeTruthy()
    expect(screen.getByText('Bob')).toBeTruthy()
    expect(screen.getByText('Charlie')).toBeTruthy()
  })

  it('renders cell values', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('30')).toBeTruthy()
    expect(screen.getByText('25')).toBeTruthy()
  })

  it('shows empty message when no data', () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText('No data')).toBeTruthy()
  })

  it('shows custom empty message', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Nothing found" />)
    expect(screen.getByText('Nothing found')).toBeTruthy()
  })

  // --- Sorting (Cycle 8: keyboard accessible) ---
  it('applies table-header-sortable class on sortable headers', () => {
    const { container } = render(<DataTable columns={columns} data={data} sortable />)
    expect(container.querySelector('.table-header-sortable')).toBeTruthy()
  })

  it('sorts by column on header click', () => {
    const handler = vi.fn()
    render(<DataTable columns={columns} data={data} sortable onSort={handler} />)
    fireEvent.click(screen.getByText('Name'))
    expect(handler).toHaveBeenCalledWith({ key: 'name', direction: 'asc' })
  })

  // --- Row click ---
  it('applies table-row-clickable class for clickable rows', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} onRowClick={() => {}} />
    )
    expect(container.querySelector('.table-row-clickable')).toBeTruthy()
  })

  it('calls onRowClick when row is clicked', () => {
    const handler = vi.fn()
    render(<DataTable columns={columns} data={data} onRowClick={handler} />)
    fireEvent.click(screen.getByText('Alice').closest('tr')!)
    expect(handler).toHaveBeenCalledWith(data[0], 0)
  })

  // --- className ---
  it('merges custom className', () => {
    const { container } = render(<DataTable columns={columns} data={data} className="custom" />)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
