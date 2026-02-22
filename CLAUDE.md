# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GroundUI (`@nannantown/ground-ui`) is a minimal, dark-first React design system with cross-platform token support. It provides CSS design tokens (3-layer architecture), React components, a dynamic theming system, and a code generation pipeline that outputs tokens for Flutter (Dart) and raw CSS from a single JSON source of truth.

Published as a private package on **GitHub Packages** (`npm.pkg.github.com`).

## Commands

```bash
npm run dev              # Watch mode (tsup)
npm run build            # Production build (tsup)
npm run typecheck        # TypeScript type check
npm run catalog          # Vite dev server for component catalog (port 6100)
npm run catalog:build    # Build component catalog
npm run generate-tokens  # Generate TS / Dart / CSS from tokens.json
```

## Tech Stack

- **Language**: TypeScript 5 (strict mode)
- **Framework**: React 18+ (peer dependency)
- **Build**: tsup (ESM output)
- **Catalog**: Vite + React
- **CSS**: Pure CSS custom properties (no preprocessor)
- **Token codegen**: `scripts/generate-tokens.ts` (tsx)

## Architecture

### Directory Structure

```
ground-ui/
├── src/
│   ├── css/
│   │   └── tokens.css              # CSS tokens (3-layer) + component classes + @font-face
│   ├── components/                  # React components (22 components)
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Divider.tsx
│   │   ├── DropdownMenu.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FormField.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── Select.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Spinner.tsx
│   │   ├── StatCard.tsx
│   │   ├── Tabs.tsx
│   │   ├── Textarea.tsx
│   │   ├── ThemeCustomizer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Toast.tsx
│   │   ├── Toggle.tsx
│   │   └── ToolbarButton.tsx
│   ├── tokens/                      # Token definitions
│   │   ├── tokens.json              # ** Single Source of Truth for all tokens **
│   │   ├── _generated.ts            # Auto-generated from tokens.json (do not edit)
│   │   ├── colors.ts                # Hand-written color tokens (legacy, kept for API compat)
│   │   ├── radius.ts
│   │   ├── spacing.ts
│   │   ├── transitions.ts
│   │   ├── typography.ts
│   │   ├── z-index.ts
│   │   └── index.ts                 # Barrel re-export
│   ├── theme/
│   │   └── index.ts                 # Theme engine: presets, color math, runtime CSS application
│   ├── interactions/                # Interactive demo components (motion, gestures, physics)
│   ├── cn.ts                        # Utility: className merger (zero-dep)
│   └── index.ts                     # Main entry point
├── scripts/
│   └── generate-tokens.ts           # Token codegen: tokens.json → TS / Dart / CSS
├── out/                             # Generated platform outputs
│   ├── flutter/
│   │   └── ground_tokens.dart       # Flutter GroundTokens class + GroundTheme
│   └── css/
│       └── tokens.generated.css     # CSS custom properties snippet
├── catalog/                         # Component catalog (Vite app)
│   ├── index.html
│   ├── App.tsx
│   ├── main.tsx
│   └── pages/
│       ├── ComponentsPage.tsx
│       └── InteractionsPage.tsx
└── package.json
```

### Export Map (npm)

| Import Path | Content |
|---|---|
| `@nannantown/ground-ui` | React components + `cn` utility |
| `@nannantown/ground-ui/css` | CSS tokens file (`src/css/tokens.css`) |
| `@nannantown/ground-ui/tokens` | TypeScript token values |
| `@nannantown/ground-ui/tokens/css` | Generated CSS custom properties (`out/css/tokens.generated.css`) |
| `@nannantown/ground-ui/tokens/flutter` | Flutter Dart tokens (`out/flutter/ground_tokens.dart`) |
| `@nannantown/ground-ui/theme` | Theme system (presets, color math, runtime application) |
| `@nannantown/ground-ui/interactions` | Interactive demo components |

### Token Architecture (3 Layers)

All CSS variables are defined in `src/css/tokens.css`:

1. **Primitive** (`--p-*`) — Raw palette values (gray scale, white-alpha, colors). Never use directly in components.
2. **Semantic** (`--bg-*`, `--text-*`, `--border-*`, `--hover-*`, etc.) — Meaning-based tokens referencing primitives. Use these in components.
3. **Component** (`--modal-*`, `--input-*`, `--card-*`, `--stat-*`, `--btn-*`) — Component-specific shortcuts referencing semantics.

### Cross-Platform Token Pipeline

```
src/tokens/tokens.json          (Single Source of Truth)
        │
        ├─→  src/tokens/_generated.ts     (TypeScript consts)
        ├─→  out/flutter/ground_tokens.dart (Flutter Dart)
        └─→  out/css/tokens.generated.css   (CSS custom properties)
```

- Run `npm run generate-tokens` to regenerate all outputs.
- `tokens.json` uses `$ref` for cross-references (e.g., semantic tokens reference primitives).
- The generator resolves `$ref` at build time — no runtime resolution needed.
- **Do not manually edit** `_generated.ts`, `ground_tokens.dart`, or `tokens.generated.css`.

### Bilingual Font System (Japanese / English)

`tokens.css` defines a unified font family `"Ground Sans"` using `@font-face` with `unicode-range` + `size-adjust`:

| Script | Unicode Range | Font Source | `size-adjust` |
|---|---|---|---|
| Latin | U+0000-024F, U+0300-036F, U+2000-214F | Inter (local → Google Fonts CDN) | **108%** (scaled up) |
| Japanese (Hiragana, Katakana, Kanji, Fullwidth) | U+3000-9FFF, U+F900-FFEF, U+FE30-FE4F | Noto Sans JP / Hiragino Sans (local only) | 100% |
| Half-width Katakana | U+FF65-FF9F | Noto Sans JP / Hiragino Sans (local only) | 100% |

Latin (Inter) includes `url()` fallback to Google Fonts CDN, so it works on all devices without extra setup.
Japanese fonts use `local()` only. For web deployment where visitors may not have CJK fonts installed, consumers should add a Google Fonts `<link>` for Noto Sans JP.

The `--font-family` fallback chain includes cross-platform sans-serif fonts:
`"Ground Sans", 'Inter', 'Noto Sans JP', 'Noto Sans CJK JP', 'Hiragino Sans', 'Hiragino Kaku Gothic Pro', 'Yu Gothic', 'Meiryo', -apple-system, BlinkMacSystemFont, sans-serif`

This means at `font-size: 14px`, Latin renders at effectively 15.1px while CJK renders at 14px — no HTML markup changes needed for mixed-language text.

Additionally, `:lang()` selectors adjust line-height and letter-spacing per locale:
- `:lang(ja)` — `line-height: 1.8`, `letter-spacing: 0.04em`
- `:lang(en)` — `line-height: 1.5`, `letter-spacing: 0.02em`

### Theme System

- **Dark mode**: Default (`:root`)
- **Light mode**: `:root[data-theme="light"]` — flips `--p-white-*` to `rgba(0,0,0,*)` for automatic cascade
- **Accent presets**: 10 colors (sky, ocean, indigo, violet, rose, crimson, ember, amber, emerald, teal)
- **Surface presets**: 5 surfaces (default, warm, cream, cool, mono)
- **Theme pairings**: 8 curated accent+surface combinations
- **Color math** (`src/theme/index.ts`): All pure functions — `hexToHsl`, `hslToHex`, `contrastRatio`, `ensureContrast` (WCAG AA), `generateColorTokens`, `generateAccentTokens`, `generateLightSurface`, `generateDarkSurface`. No DOM dependency except `applyAccentTheme()`.
- **Runtime application**: `applyAccentTheme(config, isDark?)` sets CSS custom properties on `document.documentElement`
- **Persistence**: `loadThemeConfig()` / `saveThemeConfig()` use `localStorage`

### Component Pattern

All components follow a consistent pattern:

1. **CSS class system**: Components apply CSS class names defined in `tokens.css` (`.btn`, `.card`, `.input`, etc.)
2. **`cn()` utility**: Merges class names — `cn('btn', \`btn-${variant}\`, className)`
3. **`var()` for dynamic styles**: Inline `style` uses CSS custom property references (`var(--modal-bg)`)
4. **No direct token imports**: Components never import from `src/tokens/` — all visual decisions route through CSS custom properties

### Component Classes

All component classes are defined in `tokens.css` alongside the tokens:
`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-sm`, `.btn-lg`, `.btn-icon`,
`.card`, `.card-elevated`, `.card-interactive`, `.card-stat`,
`.input`, `.input-error`, `.textarea`, `.select`,
`.label`, `.label-md`,
`.badge`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info`, `.badge-accent`, `.badge-neutral`,
`.pill-filter`, `.pill-filter-active`,
`.toggle-switch`,
`.divider`, `.empty-state`,
`.skeleton`, `.skeleton-text`, `.skeleton-title`, `.skeleton-card`,
`.animate-fade-in`, `.animate-scale-in`, `.animate-slide-up`, `.animate-slide-down`,
`.stagger-1` ~ `.stagger-6`

## Design Principles

- **Minimal** — No unnecessary elements
- **Dark-first** — Dark theme as default, light mode via primitive flip
- **High contrast** — Important elements clearly stand out
- **Refined** — Subtle borders and shadows for depth
- **5-state rule** — All interactive elements must define: default, hover, active/selected, disabled, focus
- **Bilingual-ready** — Japanese/English mixed text handled at the font level, not markup level

## Key Patterns

- Tokens use CSS custom properties only (no JS runtime)
- Light mode works by overriding `--p-white-*` primitives to `rgba(0,0,0,*)`, causing all semantic tokens to automatically cascade
- Components are React wrappers around the CSS class system
- All interactive elements follow the 5-state rule (default, hover, active, disabled, focus-visible)
- No color emoji in UI — use Lucide icons or SVG
- `tokens.json` is the canonical token source — edit it, then run `npm run generate-tokens`
- Hand-written token files (`colors.ts`, `spacing.ts`, etc.) are kept for backward compatibility but `tokens.json` is the intended source of truth going forward

## Package Distribution (GitHub Packages)

This package is distributed via GitHub Packages as `@nannantown/ground-ui`.

### Publishing (from this repository)

```bash
npm version patch          # Bump version (0.1.0 → 0.1.1)
npm publish                # Runs prepublishOnly (generate-tokens → build → typecheck), then publishes
git push --tags            # Push version tag to remote
```

Requires `.npmrc` in project root (gitignored):
```
@nannantown:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<GITHUB_PAT>
```

The PAT needs `write:packages` and `read:packages` scopes. Generate at: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic).

### Consuming in Other Projects

#### 1. Setup (one-time per project)

Create `.npmrc` in the consuming project root:
```
@nannantown:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<GITHUB_PAT>
```

The PAT needs `read:packages` scope. Add `.npmrc` to `.gitignore` to avoid committing the token.

#### 2. Install

```bash
npm install @nannantown/ground-ui
```

#### 3. Usage by Platform

**React / Next.js:**
```tsx
import '@nannantown/ground-ui/css'                            // CSS tokens + component classes
import { Button, Modal, Input } from '@nannantown/ground-ui'  // React components
import { applyAccentTheme } from '@nannantown/ground-ui/theme' // Theme engine
```

**Non-React Web (CSS only):**
```css
@import '@nannantown/ground-ui/css';          /* Full tokens + component classes */
@import '@nannantown/ground-ui/tokens/css';   /* Generated primitives only */
```
```html
<button class="btn btn-primary">Submit</button>
```

**TypeScript token references:**
```ts
import { spacing, typography } from '@nannantown/ground-ui/tokens'
// spacing.md → '12px'
// typography['fontSize.base'] → '14px'
```

**Flutter:**
```bash
cp node_modules/@nannantown/ground-ui/out/flutter/ground_tokens.dart lib/theme/
```
```dart
import 'theme/ground_tokens.dart';
MaterialApp(theme: GroundTheme.dark());
```

#### 4. Updating

```bash
npm update @nannantown/ground-ui
```

### Responsive Typography

Font size tokens use `clamp()` for viewport-responsive scaling with CJK-safe minimums:

| Token | Value | Range |
|---|---|---|
| `--text-xs` | `clamp(11px, 0.6875rem + 0.1vw, 12px)` | 11px → 12px |
| `--text-sm` | `clamp(12px, 0.75rem + 0.1vw, 13px)` | 12px → 13px |
| `--text-base` | `clamp(13px, 0.8125rem + 0.1vw, 14px)` | 13px → 14px |
| `--text-md` | `clamp(14px, 0.875rem + 0.1vw, 15px)` | 14px → 15px |
| `--text-lg` | `clamp(16px, 1rem + 0.15vw, 18px)` | 16px → 18px |

The `tokens.json` static values reflect the desktop-max (clamp upper bound) for Dart/TS consumers.
