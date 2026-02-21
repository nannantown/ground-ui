import { useState } from 'react'
import { ComponentsPage } from './pages/ComponentsPage'
import { InteractionsPage } from './pages/InteractionsPage'

type Page = 'components' | 'interactions'

export function App() {
  const [page, setPage] = useState<Page>('components')

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{
        display: 'flex',
        gap: 8,
        padding: '12px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        background: '#0a0a0a',
        zIndex: 100,
      }}>
        <button
          onClick={() => setPage('components')}
          style={{
            padding: '6px 16px',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            background: page === 'components' ? '#fff' : 'transparent',
            color: page === 'components' ? '#000' : 'rgba(255,255,255,0.6)',
          }}
        >
          Components
        </button>
        <button
          onClick={() => setPage('interactions')}
          style={{
            padding: '6px 16px',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            background: page === 'interactions' ? '#fff' : 'transparent',
            color: page === 'interactions' ? '#000' : 'rgba(255,255,255,0.6)',
          }}
        >
          Interactions
        </button>
      </nav>
      {page === 'components' ? <ComponentsPage /> : <InteractionsPage />}
    </div>
  )
}
