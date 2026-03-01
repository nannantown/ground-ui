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
  const { locale } = useLocale()

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

        {/* Crystal icon — visible only on mobile, replaces brand text */}
        <svg className="ds-navbar-icon" width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="GroundUI">
          <path d="M16 2 L7 13 L16 17 Z" fill="var(--accent)" />
          <path d="M16 2 L25 13 L16 17 Z" fill="var(--accent-light)" />
          <path d="M7 13 L16 17 L16 30 Z" fill="var(--accent)" opacity="0.55" />
          <path d="M25 13 L16 17 L16 30 Z" fill="var(--accent-light)" opacity="0.55" />
        </svg>

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

        <div className="ds-navbar-utils">
          <ThemeToggle />
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
