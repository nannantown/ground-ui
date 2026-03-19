import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Pagination } from './Pagination'

afterEach(cleanup)

describe('Pagination', () => {
  it('renders pagination nav', () => {
    render(<Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />)
    expect(screen.getByRole('navigation')).toBeTruthy()
  })

  it('renders page buttons', () => {
    render(<Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('5')).toBeTruthy()
  })

  it('highlights current page with active class', () => {
    render(<Pagination totalPages={5} currentPage={3} onPageChange={() => {}} />)
    const btn = screen.getByText('3')
    expect(btn.className).toContain('pagination-item-active')
  })

  it('calls onPageChange when page is clicked', () => {
    const handler = vi.fn()
    render(<Pagination totalPages={5} currentPage={1} onPageChange={handler} />)
    fireEvent.click(screen.getByText('3'))
    expect(handler).toHaveBeenCalledWith(3)
  })

  it('has previous button', () => {
    render(<Pagination totalPages={5} currentPage={3} onPageChange={() => {}} />)
    const buttons = screen.getAllByRole('button')
    // First button should be prev
    expect(buttons[0]).toBeTruthy()
  })

  it('disables previous button on first page', () => {
    render(<Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect((buttons[0] as HTMLButtonElement).disabled).toBe(true)
  })

  it('disables next button on last page', () => {
    render(<Pagination totalPages={5} currentPage={5} onPageChange={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect((buttons[buttons.length - 1] as HTMLButtonElement).disabled).toBe(true)
  })

  it('shows ellipsis for many pages', () => {
    render(<Pagination totalPages={20} currentPage={10} onPageChange={() => {}} />)
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('shows all pages when total is small', () => {
    render(<Pagination totalPages={5} currentPage={3} onPageChange={() => {}} />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeTruthy()
    }
  })

  it('merges custom className', () => {
    render(<Pagination totalPages={3} currentPage={1} onPageChange={() => {}} className="custom" />)
    expect(screen.getByRole('navigation').className).toContain('custom')
  })
})
