import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ToastProvider, useToast } from './Toast'

afterEach(cleanup)

function TestConsumer() {
  const { toast } = useToast()
  return (
    <div>
      <button onClick={() => toast('Hello')}>Info</button>
      <button onClick={() => toast('OK', 'success')}>Success</button>
      <button onClick={() => toast('Bad', 'error')}>Error</button>
    </div>
  )
}

describe('Toast', () => {
  it('renders provider children', () => {
    render(
      <ToastProvider>
        <span>App</span>
      </ToastProvider>
    )
    expect(screen.getByText('App')).toBeTruthy()
  })

  it('shows no toasts initially', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    )
    expect(screen.queryByText('Hello')).toBeNull()
  })

  it('shows toast when triggered', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    )
    fireEvent.click(screen.getByText('Info'))
    expect(screen.getByText('Hello')).toBeTruthy()
  })

  it('shows toast with correct variant text', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    )
    fireEvent.click(screen.getByText('Error'))
    expect(screen.getByText('Bad')).toBeTruthy()
  })

  it('dismiss button uses .btn CSS classes (Cycle 9)', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    )
    fireEvent.click(screen.getByText('Info'))
    const dismissBtn = screen.getByRole('button', { name: 'Dismiss' })
    expect(dismissBtn.className).toContain('btn')
    expect(dismissBtn.className).toContain('btn-ghost')
  })

  it('dismisses toast on dismiss button click', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    )
    fireEvent.click(screen.getByText('Info'))
    expect(screen.getByText('Hello')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByText('Hello')).toBeNull()
  })

  it('can show multiple toasts', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    )
    fireEvent.click(screen.getByText('Info'))
    fireEvent.click(screen.getByText('Success'))
    expect(screen.getByText('Hello')).toBeTruthy()
    expect(screen.getByText('OK')).toBeTruthy()
  })

  it('throws when useToast is called outside provider', () => {
    function Bad() {
      useToast()
      return null
    }
    expect(() => {
      render(<Bad />)
    }).toThrow('useToast must be used within ToastProvider')
  })
})
