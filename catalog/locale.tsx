import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

type Locale = 'en' | 'ja'

const LocaleContext = createContext<{
  locale: Locale
  toggle: () => void
}>({ locale: 'en', toggle: () => {} })

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem('ground-ui-locale')
    if (saved === 'ja' || saved === 'en') return saved
  } catch { /* ignore */ }
  return navigator.language.startsWith('ja') ? 'ja' : 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale)

  // Sync <html lang="..."> attribute for :lang() CSS selectors
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const toggle = useCallback(() => {
    setLocale(prev => {
      const next = prev === 'en' ? 'ja' : 'en'
      try { localStorage.setItem('ground-ui-locale', next) } catch { /* ignore */ }
      return next
    })
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, toggle }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
