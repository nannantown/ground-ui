import type { ReactNode } from 'react'
import { useLocale } from '../locale'
import { Button } from '../../src/components/Button'
import { ACCENT_PRESETS, SURFACE_PRESETS } from '../../src/theme'

/* ============================================
   System Overview Page
   Architecture visualization for GroundUI
   ============================================ */

const T = {
  en: {
    heroTitle: 'System Architecture',
    heroSub: 'How primitives, semantic tokens, component tokens, CSS classes, and React components stack up.',
    statLayers: '3 Token Layers',
    statComponents: '22+ Components',
    statAccents: '10 Accents',
    statEffects: '7 Effects',
    // Principles
    principlesTitle: 'Design Principles',
    principlesDesc: 'Core values that guide every decision in the system.',
    minimal: 'Minimal',
    minimalDesc: 'Remove unnecessary elements, focus on content.',
    dark: 'Dark-first',
    darkDesc: 'Dark theme as default, light as complement.',
    contrast: 'High Contrast',
    contrastDesc: 'Important elements stand out clearly.',
    refined: 'Refined',
    refinedDesc: 'Subtle borders and shadows add depth.',
    // Token Layers
    tokenTitle: 'Token Layers',
    tokenDesc: '3-layer cascade: raw values flow into meaning, then into component scope.',
    primitive: 'Primitive',
    primitiveDesc: 'Raw palette values. Never use directly in components.',
    primitivePrefix: '--p-*',
    semantic: 'Semantic',
    semanticDesc: 'Meaning-based tokens referencing primitives.',
    semanticPrefix: '--bg-*, --text-*, --border-*',
    component: 'Component',
    componentDesc: 'Scoped shortcuts referencing semantics.',
    componentPrefix: '--card-*, --btn-*, --input-*',
    // Build-Up
    buildupTitle: 'Build-Up',
    buildupDesc: 'Tracing a single UI element through each layer.',
    stepRaw: 'Step 1 / Raw Values',
    stepSemantic: 'Step 2 / Semantic Tokens',
    stepClass: 'Step 3 / CSS Class',
    stepReact: 'Step 4 / React Component',
    // Cross-Cutting
    crossTitle: 'Cross-Cutting',
    crossDesc: 'Features that span the entire system.',
    modeTitle: 'Light / Dark Mode',
    modeDesc: 'Flip --p-white-* from rgba(255,...) to rgba(0,...). All semantic tokens cascade automatically.',
    themeTitle: 'Theme Engine',
    themeDesc: 'Runtime accent + surface application via CSS custom properties.',
    typoTitle: 'Bilingual Typography',
    typoDesc: 'Ground Sans unifies Inter (Latin) and Noto Sans JP (CJK) via unicode-range + size-adjust.',
    effectsTitle: 'Effects',
    effectsDesc: 'Gradient, glow, glass, aurora, grain CSS utility classes.',
    // Pipeline
    pipelineTitle: 'Token Pipeline',
    pipelineDesc: 'Single source of truth generates all platform outputs.',
    source: 'Source',
    outputs: 'Outputs',
  },
  ja: {
    heroTitle: 'システムアーキテクチャ',
    heroSub: 'プリミティブ、セマンティック、コンポーネントトークン、CSSクラス、Reactコンポーネントの積み上げ構造。',
    statLayers: '3トークンレイヤー',
    statComponents: '22+ コンポーネント',
    statAccents: '10 アクセント',
    statEffects: '7 エフェクト',
    // Principles
    principlesTitle: '設計原則',
    principlesDesc: 'システム全体の意思決定を導くコアバリュー。',
    minimal: 'ミニマル',
    minimalDesc: '不要な要素を排除し、コンテンツに集中する。',
    dark: 'ダークファースト',
    darkDesc: 'ダークテーマをデフォルトに、ライトは補完。',
    contrast: 'ハイコントラスト',
    contrastDesc: '重要な要素が明確に際立つ。',
    refined: '洗練',
    refinedDesc: '繊細なボーダーとシャドウで奥行きを加える。',
    // Token Layers
    tokenTitle: 'トークンレイヤー',
    tokenDesc: '3層カスケード: 生の値が意味に、さらにコンポーネントスコープに流れる。',
    primitive: 'プリミティブ',
    primitiveDesc: '生のパレット値。コンポーネントで直接使用しない。',
    primitivePrefix: '--p-*',
    semantic: 'セマンティック',
    semanticDesc: 'プリミティブを参照する意味ベースのトークン。',
    semanticPrefix: '--bg-*, --text-*, --border-*',
    component: 'コンポーネント',
    componentDesc: 'セマンティックを参照するスコープ付きショートカット。',
    componentPrefix: '--card-*, --btn-*, --input-*',
    // Build-Up
    buildupTitle: 'ビルドアップ',
    buildupDesc: '1つのUI要素を各レイヤーで追跡する。',
    stepRaw: 'Step 1 / 生の値',
    stepSemantic: 'Step 2 / セマンティックトークン',
    stepClass: 'Step 3 / CSSクラス',
    stepReact: 'Step 4 / Reactコンポーネント',
    // Cross-Cutting
    crossTitle: '横断的機能',
    crossDesc: 'システム全体にまたがる機能。',
    modeTitle: 'ライト / ダークモード',
    modeDesc: '--p-white-* を rgba(255,...) から rgba(0,...) にフリップ。全セマンティックトークンが自動カスケード。',
    themeTitle: 'テーマエンジン',
    themeDesc: 'CSS custom properties でアクセント + サーフェスをランタイム適用。',
    typoTitle: 'バイリンガルタイポグラフィ',
    typoDesc: 'Ground Sans が Inter (Latin) と Noto Sans JP (CJK) を unicode-range + size-adjust で統合。',
    effectsTitle: 'エフェクト',
    effectsDesc: 'グラデーション、グロー、グラス、オーロラ、グレインのCSSユーティリティクラス。',
    // Pipeline
    pipelineTitle: 'トークンパイプライン',
    pipelineDesc: '単一の信頼できるソースから全プラットフォーム出力を生成。',
    source: 'ソース',
    outputs: '出力',
  },
}

function useT() {
  const { locale } = useLocale()
  return T[locale]
}

/* --- Local Helpers --- */

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <>
      <h2 className="ds-section-title">{title}</h2>
      <p className="ds-section-desc">{desc}</p>
    </>
  )
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ds-group">
      <h3 className="ds-group-label">{label}</h3>
      {children}
    </div>
  )
}

/* --- Connector Arrow --- */
function LayerConnector() {
  return (
    <div className="ds-layer-connector">
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v16M4 14l4 4 4-4" />
      </svg>
    </div>
  )
}

/* --- Token Map Row --- */
function TokenMapRow({ name, ref, cssVar }: { name: string; ref: string; cssVar: string }) {
  return (
    <div className="ds-token-map">
      <div className="ds-token-map-swatch" style={{ background: `var(${cssVar})` }} />
      <span className="ds-token-map-name">{name}</span>
      <span className="ds-token-map-arrow">&rarr;</span>
      <span className="ds-token-map-ref">{ref}</span>
    </div>
  )
}

/* === Page Component === */

export function SystemOverviewPage() {
  const t = useT()

  return (
    <>
      {/* Hero */}
      <div className="ds-hero">
        <h1 className="ds-hero-title">{t.heroTitle}</h1>
        <p className="ds-hero-subtitle">{t.heroSub}</p>
        <div className="ds-hero-stats">
          <span className="ds-hero-stat">{t.statLayers}</span>
          <span className="ds-hero-stat">{t.statComponents}</span>
          <span className="ds-hero-stat">{t.statAccents}</span>
          <span className="ds-hero-stat">{t.statEffects}</span>
        </div>
      </div>

      <div className="ds-section-divider" />

      {/* Section 1: Design Principles */}
      <SectionHeader title={t.principlesTitle} desc={t.principlesDesc} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-4xl)' }}>
        {([
          { title: t.minimal, desc: t.minimalDesc },
          { title: t.dark, desc: t.darkDesc },
          { title: t.contrast, desc: t.contrastDesc },
          { title: t.refined, desc: t.refinedDesc },
        ] as const).map(p => (
          <div key={p.title} className="ds-card">
            <div className="ds-card-title">{p.title}</div>
            <div className="ds-card-desc">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="ds-section-divider" />

      {/* Section 2: Token Layers */}
      <SectionHeader title={t.tokenTitle} desc={t.tokenDesc} />

      {/* Primitive Layer */}
      <Group label={`${t.primitive} — ${t.primitivePrefix}`}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 var(--space-md)', lineHeight: 'var(--leading-relaxed)' }}>
          {t.primitiveDesc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {[
            { name: '--p-gray-950', var: '--p-gray-950' },
            { name: '--p-gray-900', var: '--p-gray-900' },
            { name: '--p-gray-800', var: '--p-gray-800' },
            { name: '--p-gray-700', var: '--p-gray-700' },
            { name: '--p-gray-600', var: '--p-gray-600' },
            { name: '--p-gray-400', var: '--p-gray-400' },
            { name: '--p-white-5', var: '--p-white-5' },
            { name: '--p-white-10', var: '--p-white-10' },
            { name: '--p-white-20', var: '--p-white-20' },
          ].map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <div style={{ width: 20, height: 20, borderRadius: 'var(--radius-sm)', background: `var(${s.var})`, border: '1px solid var(--border-subtle)', flexShrink: 0 }} />
              <code className="ds-code" style={{ fontSize: 'var(--text-xs)' }}>{s.name}</code>
            </div>
          ))}
        </div>
      </Group>

      <LayerConnector />

      {/* Semantic Layer */}
      <Group label={`${t.semantic} — ${t.semanticPrefix}`}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 var(--space-md)', lineHeight: 'var(--leading-relaxed)' }}>
          {t.semanticDesc}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <TokenMapRow name="--bg-primary" ref="var(--p-gray-950)" cssVar="--bg-primary" />
          <TokenMapRow name="--bg-secondary" ref="var(--p-gray-900)" cssVar="--bg-secondary" />
          <TokenMapRow name="--bg-card" ref="var(--p-white-5)" cssVar="--bg-card" />
          <TokenMapRow name="--text-primary" ref="var(--p-white-90)" cssVar="--text-primary" />
          <TokenMapRow name="--text-secondary" ref="var(--p-white-60)" cssVar="--text-secondary" />
          <TokenMapRow name="--border-subtle" ref="var(--p-white-8)" cssVar="--border-subtle" />
        </div>
      </Group>

      <LayerConnector />

      {/* Component Layer */}
      <Group label={`${t.component} — ${t.componentPrefix}`}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 var(--space-md)', lineHeight: 'var(--leading-relaxed)' }}>
          {t.componentDesc}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <TokenMapRow name="--card-bg" ref="var(--bg-card)" cssVar="--card-bg" />
          <TokenMapRow name="--input-bg" ref="var(--bg-secondary)" cssVar="--input-bg" />
          <TokenMapRow name="--modal-bg" ref="var(--bg-elevated)" cssVar="--modal-bg" />
        </div>
      </Group>

      <div style={{ marginBottom: 'var(--space-4xl)' }} />
      <div className="ds-section-divider" />

      {/* Section 3: Build-Up */}
      <SectionHeader title={t.buildupTitle} desc={t.buildupDesc} />
      <div className="ds-buildup-stack" style={{ marginBottom: 'var(--space-4xl)' }}>
        {/* Step 1: Raw Values */}
        <div className="ds-buildup-step">
          <div className="ds-buildup-label">{t.stepRaw}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-sm)', background: '#ededed', border: '1px solid var(--border-subtle)' }} />
              <code className="ds-code">#ededed</code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-sm)', background: '#000000', border: '1px solid var(--border-subtle)' }} />
              <code className="ds-code">#000000</code>
            </div>
          </div>
        </div>

        {/* Step 2: Semantic Tokens */}
        <div className="ds-buildup-step">
          <div className="ds-buildup-label">{t.stepSemantic}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <code className="ds-code-tag">--selected-bg: #ededed</code>
            <code className="ds-code-tag">--selected-text: #000000</code>
          </div>
        </div>

        {/* Step 3: CSS Class */}
        <div className="ds-buildup-step">
          <div className="ds-buildup-label">{t.stepClass}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <code className="ds-code-tag" style={{ alignSelf: 'flex-start' }}>{'<button class="btn btn-primary">'}</code>
            <div>
              <button className="btn btn-primary">Button</button>
            </div>
          </div>
        </div>

        {/* Step 4: React Component */}
        <div className="ds-buildup-step">
          <div className="ds-buildup-label">{t.stepReact}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <code className="ds-code-tag" style={{ alignSelf: 'flex-start' }}>{'<Button variant="primary">Button</Button>'}</code>
            <div>
              <Button variant="primary">Button</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="ds-section-divider" />

      {/* Section 4: Cross-Cutting */}
      <SectionHeader title={t.crossTitle} desc={t.crossDesc} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-4xl)' }}>
        {/* Light/Dark Mode */}
        <div className="ds-card">
          <div className="ds-card-title">{t.modeTitle}</div>
          <div className="ds-card-desc" style={{ marginBottom: 'var(--space-md)' }}>{t.modeDesc}</div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <div style={{ flex: 1, padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.6)' }}>Dark</span>
            </div>
            <div style={{ flex: 1, padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', background: '#fafafa', border: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.6)' }}>Light</span>
            </div>
          </div>
        </div>

        {/* Theme Engine */}
        <div className="ds-card">
          <div className="ds-card-title">{t.themeTitle}</div>
          <div className="ds-card-desc" style={{ marginBottom: 'var(--space-md)' }}>{t.themeDesc}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
            {ACCENT_PRESETS.slice(0, 10).map(a => (
              <div
                key={a.id}
                title={a.name}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: a.color,
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)' }}>
            {SURFACE_PRESETS.slice(0, 4).map(s => (
              <div
                key={s.id}
                title={s.name}
                style={{
                  flex: 1,
                  height: 12,
                  borderRadius: 'var(--radius-xs)',
                  background: s.tintStrength === 0 ? 'var(--bg-primary)' : `var(--bg-secondary)`,
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Bilingual Typography */}
        <div className="ds-card">
          <div className="ds-card-title">{t.typoTitle}</div>
          <div className="ds-card-desc" style={{ marginBottom: 'var(--space-md)' }}>{t.typoDesc}</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0, lineHeight: 1.8 }}>
            Design meets {'\u30C7\u30B6\u30A4\u30F3'}
          </p>
          <code className="ds-code" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-xs)', display: 'block' }}>
            "Ground Sans", Inter, Noto Sans JP
          </code>
        </div>

        {/* Effects */}
        <div className="ds-card">
          <div className="ds-card-title">{t.effectsTitle}</div>
          <div className="ds-card-desc" style={{ marginBottom: 'var(--space-md)' }}>{t.effectsDesc}</div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            {['gradient-bg-primary', 'glow-soft', 'glass-panel', 'aurora-bg', 'grain-surface'].map(cls => (
              <div
                key={cls}
                className={cls}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="ds-section-divider" />

      {/* Section 5: Token Pipeline */}
      <SectionHeader title={t.pipelineTitle} desc={t.pipelineDesc} />
      <div className="ds-pipeline">
        <div className="ds-pipeline-source">
          <code style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
            tokens.json
          </code>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-disabled)', marginTop: 'var(--space-xs)' }}>
            {t.source}
          </div>
        </div>

        <div className="ds-layer-connector" style={{ padding: 0, transform: 'rotate(-90deg)' }}>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v16M4 14l4 4 4-4" />
          </svg>
        </div>

        <div className="ds-pipeline-outputs">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2xs)' }}>
            {t.outputs}
          </div>
          {[
            { name: '_generated.ts', desc: 'TypeScript' },
            { name: 'tokens.generated.css', desc: 'CSS' },
            { name: 'ground_tokens.dart', desc: 'Flutter (Dart)' },
          ].map(out => (
            <div key={out.name} className="ds-card" style={{ padding: 'var(--space-sm) var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <code style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {out.name}
              </code>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{out.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
