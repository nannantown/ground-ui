import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { LocaleProvider, useLocale } from '../catalog/locale'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Test consumer component
function TestConsumer() {
  const { locale, toggle } = useLocale()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button data-testid="toggle" onClick={toggle}>Toggle</button>
    </div>
  )
}

describe('LocaleProvider', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    document.documentElement.lang = 'en'
  })

  afterEach(() => {
    cleanup()
  })

  it('provides locale to consumers', () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    )
    const el = screen.getByTestId('locale')
    expect(['en', 'ja']).toContain(el.textContent)
  })

  it('toggles locale from en to ja', () => {
    localStorageMock.getItem.mockReturnValue('en')
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    )
    expect(screen.getByTestId('locale').textContent).toBe('en')

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'))
    })

    expect(screen.getByTestId('locale').textContent).toBe('ja')
  })

  it('toggles locale from ja to en', () => {
    localStorageMock.getItem.mockReturnValue('ja')
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    )
    expect(screen.getByTestId('locale').textContent).toBe('ja')

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'))
    })

    expect(screen.getByTestId('locale').textContent).toBe('en')
  })

  it('persists to localStorage on toggle', () => {
    localStorageMock.getItem.mockReturnValue('en')
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    )

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'))
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('ground-ui-locale', 'ja')
  })

  it('syncs document.documentElement.lang', () => {
    localStorageMock.getItem.mockReturnValue('en')
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    )

    expect(document.documentElement.lang).toBe('en')

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'))
    })

    expect(document.documentElement.lang).toBe('ja')
  })

  it('multiple consumers share the same locale', () => {
    function SecondConsumer() {
      const { locale } = useLocale()
      return <span data-testid="locale2">{locale}</span>
    }

    localStorageMock.getItem.mockReturnValue('en')
    render(
      <LocaleProvider>
        <TestConsumer />
        <SecondConsumer />
      </LocaleProvider>
    )

    expect(screen.getByTestId('locale').textContent).toBe('en')
    expect(screen.getByTestId('locale2').textContent).toBe('en')

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'))
    })

    expect(screen.getByTestId('locale').textContent).toBe('ja')
    expect(screen.getByTestId('locale2').textContent).toBe('ja')
  })
})
