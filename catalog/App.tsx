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

        {/* Crystal icon */}
        <svg className="ds-navbar-icon" width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="GroundUI">
          <path d="M14 2 L27 9 L14 15 Z" fill="var(--accent)" opacity="0.4" />
          <path d="M27 9 L28 22 L14 15 Z" fill="var(--accent)" opacity="0.25" />
          <path d="M28 22 L16 30 L14 15 Z" fill="var(--accent)" opacity="0.15" />
          <path d="M16 30 L3 20 L14 15 Z" fill="var(--accent)" opacity="0.2" />
          <path d="M3 20 L8 10 L14 15 Z" fill="var(--accent)" opacity="0.8" />
          <path d="M14 2 L8 10 L14 15 Z" fill="var(--accent-light)" opacity="0.4" />
          <path d="M14 2 L3 20 L8 10 Z" fill="var(--accent-light)" opacity="0.65" />
        </svg>

        <span className="ds-navbar-brand">GroundUI</span>

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
