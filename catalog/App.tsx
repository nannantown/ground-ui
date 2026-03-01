import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ComponentsPage } from './pages/ComponentsPage'
import { ThemeToggle } from '../src/components/ThemeToggle'
import { loadThemeConfig, applyAccentTheme } from '../src/theme'

export function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const config = loadThemeConfig()
    applyAccentTheme(config, resolvedTheme === 'dark')
  }, [resolvedTheme])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <nav className="ds-navbar">
        <div className="ds-navbar-start">
          <button
            className="ds-menu-btn ds-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 5h12M3 9h12M3 13h12" />
            </svg>
          </button>
        </div>

        <span className="ds-navbar-brand">GroundUI</span>

        {/* Crystal icon — visible only on mobile, replaces brand text */}
        <svg className="ds-navbar-icon" width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="GroundUI">
          <path d="M16 1 L7 10 L16 12 Z" fill="var(--accent)" />
          <path d="M16 1 L25 10 L16 12 Z" fill="var(--accent-light)" />
          <path d="M7 10 L5 17 L16 19 L16 12 Z" fill="var(--accent)" opacity="0.7" />
          <path d="M25 10 L27 17 L16 19 L16 12 Z" fill="var(--accent-light)" opacity="0.7" />
          <path d="M5 17 L9 23 L16 19 Z" fill="var(--accent)" opacity="0.5" />
          <path d="M27 17 L23 23 L16 19 Z" fill="var(--accent-light)" opacity="0.5" />
          <path d="M9 23 L16 31 L16 19 Z" fill="var(--accent)" opacity="0.35" />
          <path d="M23 23 L16 31 L16 19 Z" fill="var(--accent-light)" opacity="0.35" />
        </svg>

        <div className="ds-navbar-utils">
          <ThemeToggle />
        </div>
      </nav>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <ComponentsPage
          drawerOpen={drawerOpen}
          onDrawerClose={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  )
}
