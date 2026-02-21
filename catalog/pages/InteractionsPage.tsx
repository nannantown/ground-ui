import { SpatialDemos } from '../../src/interactions/SpatialDemos'
import { GridDemos } from '../../src/interactions/GridDemos'
import { SliderDemos } from '../../src/interactions/SliderDemos'
import { GestureDemos } from '../../src/interactions/GestureDemos'
import { CardDemos } from '../../src/interactions/CardDemos'
import { PhysicsDemos } from '../../src/interactions/PhysicsDemos'
import { SemanticDemos } from '../../src/interactions/SemanticDemos'
import { AmbientDemos } from '../../src/interactions/AmbientDemos'

const SECTIONS = [
  { id: 'spatial', title: 'Spatial', titleJa: '', component: SpatialDemos },
  { id: 'grid', title: 'Grid', titleJa: '', component: GridDemos },
  { id: 'slider', title: 'Slider', titleJa: '', component: SliderDemos },
  { id: 'gesture', title: 'Gesture', titleJa: '', component: GestureDemos },
  { id: 'card', title: 'Card', titleJa: '', component: CardDemos },
  { id: 'physics', title: 'Physics', titleJa: '', component: PhysicsDemos },
  { id: 'semantic', title: 'Semantic', titleJa: '', component: SemanticDemos },
  { id: 'ambient', title: 'Ambient', titleJa: '', component: AmbientDemos },
] as const

export function InteractionsPage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            2-Value Interaction Patterns
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              margin: '4px 0 0',
            }}
          >
            40 ways to capture two values from a single interaction
          </p>
        </div>
      </header>

      {/* Section Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 57,
          zIndex: 9,
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '10px 24px',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
        }}
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              padding: '5px 12px',
              borderRadius: 20,
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface-hover)'
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            {s.title}
          </a>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: '32px 24px 96px', maxWidth: 1200, margin: '0 auto' }}>
        {SECTIONS.map((section) => {
          const Component = section.component
          return (
            <section key={section.id} id={section.id} style={{ marginBottom: 64 }}>
              <div style={{ marginBottom: 24 }}>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {section.title}
                </h2>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: 16,
                }}
              >
                <Component />
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
