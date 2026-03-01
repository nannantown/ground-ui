import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ComponentsPage } from './pages/ComponentsPage'
import { ThemePage } from './pages/ThemePage'
import { ThemeToggle } from '../src/components/ThemeToggle'
import { loadThemeConfig, applyAccentTheme } from '../src/theme'
import { useLocale } from './locale'

type Page = 'components' | 'theme'

const TAB_LABELS: Record<Page, { en: string; ja: string }> = {
  components: { en: 'Design System', ja: 'デザインシステム' },
  theme: { en: 'Theme', ja: 'テーマ' },
}

export function App() {
  const [page, setPage] = useState<Page>('components')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const { locale, toggle: toggleLocale } = useLocale()

  // Apply saved theme on mount and when dark/light mode changes.
  // Also re-apply when navigating back from Theme page (config may have changed).
  useEffect(() => {
    const config = loadThemeConfig()
    applyAccentTheme(config, resolvedTheme === 'dark')
  }, [resolvedTheme, page])

  const handlePageChange = (id: Page) => {
    setPage(id)
    setDrawerOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <nav className="ds-navbar">
        <div className="ds-navbar-start">
          {page === 'components' && (
            <button
              className="ds-menu-btn ds-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 5h12M3 9h12M3 13h12" />
              </svg>
            </button>
          )}
        </div>

        <span className="ds-navbar-brand">GroundUI</span>

        <div className="ds-navbar-utils">
          <button
            className="ds-lang-toggle"
            onClick={toggleLocale}
            title={locale === 'en' ? 'Switch to Japanese' : '英語に切り替え'}
          >
            <span className={locale === 'en' ? 'lang-active' : undefined}>EN</span>
            <span className="lang-divider">/</span>
            <span className={locale === 'ja' ? 'lang-active' : undefined}>JA</span>
          </button>
          <ThemeToggle />
        </div>

        <div className="ds-navbar-tabs">
          {(['components', 'theme'] as const).map(id => (
            <button
              key={id}
              className="ds-nav-tab"
              data-active={page === id}
              onClick={() => handlePageChange(id)}
            >
              {TAB_LABELS[id][locale]}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {page === 'components' && (
          <ComponentsPage
            drawerOpen={drawerOpen}
            onDrawerClose={() => setDrawerOpen(false)}
          />
        )}
        {page === 'theme' && <ThemePage />}
      </div>
    </div>
  )
}
