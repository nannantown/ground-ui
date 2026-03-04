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

        {/* Crystal icon — isometric cube with crown facets */}
        <svg className="ds-navbar-icon" width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="GroundUI">
          {/* Top face — 4 crown facets (split by diagonals T→C and UL→UR at P(16,10)) */}
          <path d="M5 10 L16 3 L16 10 Z" fill="var(--accent)" opacity="0.5" />
          <path d="M16 3 L27 10 L16 10 Z" fill="var(--accent)" opacity="0.4" />
          <path d="M5 10 L16 10 L16 16 Z" fill="var(--accent)" opacity="0.6" />
          <path d="M16 10 L27 10 L16 16 Z" fill="var(--accent)" opacity="0.5" />
          {/* Left face — 2 facets (split by diagonal UL→B) */}
          <path d="M5 10 L16 16 L16 30 Z" fill="var(--accent-light)" opacity="0.4" />
          <path d="M5 10 L16 30 L5 23 Z" fill="var(--accent-light)" opacity="0.55" />
          {/* Right face — 2 facets (split by diagonal UR→B) */}
          <path d="M27 10 L16 16 L16 30 Z" fill="var(--accent)" opacity="0.7" />
          <path d="M27 10 L16 30 L27 23 Z" fill="var(--accent)" opacity="0.9" />
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
