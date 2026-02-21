# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GroundUI (`@ground/ui`) is a minimal, dark-first React design system. It provides CSS design tokens (3-layer architecture), React components, and a theming system for building dark-themed applications.

## Commands

```bash
npm run dev            # Watch mode (tsup)
npm run build          # Production build (tsup)
npm run typecheck      # TypeScript type check
npm run catalog        # Vite dev server for component catalog (port 6100)
npm run catalog:build  # Build component catalog
```

## Tech Stack

- **Language**: TypeScript 5 (strict mode)
- **Framework**: React 18+ (peer dependency)
- **Build**: tsup (ESM output)
- **Catalog**: Vite + React
- **CSS**: Pure CSS custom properties (no preprocessor)

## Architecture

### Directory Structure

```
src/
├── css/
│   └── tokens.css          # Design tokens (3-layer: Primitive → Semantic → Component)
├── components/             # React components (Avatar, Button, Modal, etc.)
├── tokens/                 # TypeScript token exports
│   ├── colors.ts
│   ├── radius.ts
│   ├── spacing.ts
│   ├── transitions.ts
│   ├── typography.ts
│   └── z-index.ts
├── theme/                  # Theme system (ThemeProvider, presets)
├── interactions/           # Interactive demo components
├── cn.ts                   # Utility: className merger
└── index.ts                # Main entry point
```

### Export Map

| Import Path | Content |
|------------|---------|
| `@ground/ui` | React components + cn utility |
| `@ground/ui/css` | CSS tokens (tokens.css) |
| `@ground/ui/tokens` | TypeScript token values |
| `@ground/ui/theme` | Theme system (provider, presets) |
| `@ground/ui/interactions` | Interactive demo components |

### Token Architecture (3 Layers)

All CSS variables are defined in `src/css/tokens.css`:

1. **Primitive** (`--p-*`) — Raw palette values (gray scale, white-alpha, colors). Never use directly in components.
2. **Semantic** (`--bg-*`, `--text-*`, `--border-*`, `--hover-*`, etc.) — Meaning-based tokens referencing primitives. Use these in components.
3. **Component** (`--modal-*`, `--input-*`, `--card-*`, `--stat-*`, `--btn-*`) — Component-specific shortcuts referencing semantics.

### Theme System

- Dark mode: Default (`:root`)
- Light mode: `:root[data-theme="light"]` — flips `--p-white-*` to `rgba(0,0,0,*)` for automatic cascade
- Accent presets override `--accent-*`, `--accent-secondary-*`, `--accent-tertiary-*`, `--surface-tint-*`

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

## Key Patterns

- Tokens use CSS custom properties only (no JS runtime)
- Light mode works by overriding `--p-white-*` primitives to `rgba(0,0,0,*)`, causing all semantic tokens to automatically cascade
- Components are React wrappers around the CSS class system
- All interactive elements follow the 5-state rule (default, hover, active, disabled, focus-visible)
- No color emoji in UI — use Lucide icons or SVG
