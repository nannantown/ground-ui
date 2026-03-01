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
          {/* Crown */}
          <path d="M16 1 L7 10 L16 12 Z" fill="var(--accent)" />
          <path d="M16 1 L25 10 L16 12 Z" fill="var(--accent-light)" />
          {/* Upper body */}
          <path d="M7 10 L5 17 L16 19 L16 12 Z" fill="var(--accent)" opacity="0.7" />
          <path d="M25 10 L27 17 L16 19 L16 12 Z" fill="var(--accent-light)" opacity="0.7" />
          {/* Lower body */}
          <path d="M5 17 L9 23 L16 19 Z" fill="var(--accent)" opacity="0.5" />
          <path d="M27 17 L23 23 L16 19 Z" fill="var(--accent-light)" opacity="0.5" />
          {/* Pavilion */}
          <path d="M9 23 L16 31 L16 19 Z" fill="var(--accent)" opacity="0.35" />
          <path d="M23 23 L16 31 L16 19 Z" fill="var(--accent-light)" opacity="0.35" />
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
