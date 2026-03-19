# Bundle Size Audit — Q-08

> Generated: 2026-03-19, Cycle 46

## Summary

| Entry Point | Raw | Gzipped | Purpose |
|-------------|-----|---------|---------|
| `index.js` | 337 KB | **62.3 KB** | All React components |
| `interactions/index.js` | 190 KB | **28.7 KB** | Interactive demos |
| `theme/index.js` | 1.2 KB | **0.4 KB** | Theme engine |
| `tokens/index.js` | 0.4 KB | **0.2 KB** | TS token values |
| `eslint/index.js` | 1.7 KB | — | ESLint plugin |
| `tokens.css` | 80 KB | **14.5 KB** | CSS tokens + classes |

## Total Consumer Payload

| Scenario | Gzipped |
|----------|---------|
| **Minimal** (CSS only) | 14.5 KB |
| **Standard** (CSS + components) | 76.8 KB |
| **Full** (CSS + components + theme + tokens) | 77.4 KB |
| **With interactions** | 106.1 KB |

## Tree-shaking

- Build format: **ESM** — enables tree-shaking in consumer bundlers
- Shared chunks: `chunk-GXHW7UQW.js` (28 KB) — shared utilities between entry points
- **Individual component import** works: `import { Button } from '@nannantown/ground-ui'` — bundler can tree-shake unused components

## Assessment

- **62.3 KB gzipped** for all 72 components is reasonable (< 1 KB/component average)
- **14.5 KB gzipped CSS** is compact for a full design system with 3-layer tokens
- **No runtime CSS-in-JS** — zero runtime overhead for styling
- **ESM-only** build — optimal for modern bundler tree-shaking
- interactions entry point (28.7 KB) is separate and optional — not loaded unless imported

## Recommendations

1. ~~Split large components into lazy-loadable chunks~~ — Not needed at current size
2. CSS can be further reduced by removing unused component classes per-project (PurgeCSS)
3. Consider adding `sideEffects: false` to package.json for better tree-shaking hints

## Verdict: PASS

Bundle size is well within acceptable range for a comprehensive design system.
No immediate optimization needed.
