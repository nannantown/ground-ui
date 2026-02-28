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
  const { resolvedTheme } = useTheme()
  const { locale, toggle: toggleLocale } = useLocale()

  // Apply saved theme on mount and when dark/light mode changes.
  // Also re-apply when navigating back from Theme page (config may have changed).
  useEffect(() => {
    const config = loadThemeConfig()
    applyAccentTheme(config, resolvedTheme === 'dark')
  }, [resolvedTheme, page])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-md) var(--space-xl)',
        borderBottom: 'var(--border-width-thin) solid var(--border-subtle)',
        background: 'var(--bg-primary)',
        zIndex: 'var(--z-sticky)',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 'var(--text-md)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginRight: 'var(--space-sm)',
          letterSpacing: '-0.02em',
        }}>GroundUI</span>

        {(['components', 'theme'] as const).map(id => (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              padding: 'var(--space-xs) var(--space-lg)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              background: page === id ? 'var(--selected-bg)' : 'transparent',
              color: page === id ? 'var(--selected-text)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            {TAB_LABELS[id][locale]}
          </button>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Language toggle — shows current locale, click to switch */}
        <button
          onClick={toggleLocale}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            padding: 'var(--space-xs) var(--space-sm)',
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-width-thin) solid var(--border-subtle)',
            background: 'none',
            cursor: 'pointer',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease',
            letterSpacing: '0.02em',
            fontFamily: 'inherit',
          }}
          title={locale === 'en' ? 'Switch to Japanese' : '英語に切り替え'}
        >
          <span style={{ color: locale === 'en' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>EN</span>
          <span style={{ color: 'var(--text-disabled)', fontSize: 'var(--text-xs)' }}>/</span>
          <span style={{ color: locale === 'ja' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>JA</span>
        </button>

        {/* Theme toggle (dark/light) */}
        <ThemeToggle />
      </nav>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {page === 'components' && <ComponentsPage />}
        {page === 'theme' && <ThemePage />}
      </div>
    </div>
  )
}
