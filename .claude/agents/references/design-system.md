# GroundUI Design System — Canonical Reference

This is the **single source of truth** for the GroundUI design system.
All consumer projects (Centra, etc.) should reference this file.

Source: `src/css/tokens.css`

## Token Architecture (3 Layers)

```
Primitive (--p-*)    Raw palette values. Never use directly in components.
    ↓
Semantic (--bg-*, --text-*, ...)   Meaning-based. Use these in components.
    ↓
Component (--modal-*, --input-*, ...)   Component shortcuts. Use for specific components.
```

## 1. Primitive Tokens

### Gray Scale
```
--p-gray-950: #0a0a0a    --p-gray-900: #111111    --p-gray-850: #141414
--p-gray-800: #1a1a1a    --p-gray-700: #333333    --p-gray-600: #666666
--p-gray-500: #888888    --p-gray-400: #a0a0a0    --p-gray-300: #cccccc
--p-gray-200: #e0e0e0    --p-gray-100: #f0f0f0    --p-gray-50:  #fafafa
```

### White Alpha Scale
```
--p-white-2:  0.02    --p-white-3:  0.03    --p-white-5:  0.05
--p-white-6:  0.06    --p-white-8:  0.08    --p-white-10: 0.10
--p-white-12: 0.12    --p-white-15: 0.15    --p-white-20: 0.20
--p-white-25: 0.25    --p-white-30: 0.30    --p-white-35: 0.35
--p-white-50: 0.50    --p-white-70: 0.70
```

### Colors
```
Green:   --p-green-400: #4ade80    --p-green-500: #22c55e    --p-green-600: #16a34a
Emerald: --p-emerald-500: #10b981
Amber:   --p-amber-400: #fbbf24    --p-amber-500: #f59e0b    --p-amber-600: #d97706
Red:     --p-red-400: #f87171      --p-red-500: #ef4444      --p-red-600: #dc2626
Blue:    --p-blue-400: #60a5fa     --p-blue-500: #3b82f6     --p-blue-600: #2563eb
Sky:     --p-sky-400: #38bdf8      --p-sky-500: #0ea5e9      --p-sky-600: #0284c7
Slate:   --p-slate-500: #64748b    --p-slate-600: #475569
```

## 2. Semantic Tokens

### Backgrounds
| Token | Dark Value | Purpose |
|-------|-----------|---------|
| `--bg-primary` | #0a0a0a (gray-950) | Page background |
| `--bg-secondary` | #111111 (gray-900) | Secondary surfaces |
| `--bg-card` | #141414 (gray-850) | Card background |
| `--bg-elevated` | #1a1a1a (gray-800) | Elevated elements |
| `--bg-overlay` | rgba(17,24,39, 0.95) | Modal/dialog background |
| `--bg-scrim` | rgba(0,0,0, 0.60) | Backdrop overlay |
| `--bg-translucent` | rgba(17,24,39, 0.40) | Translucent overlay |
| `--bg-surface` | white-alpha 5% | Subtle surface tint |
| `--bg-surface-hover` | white-alpha 8% | Surface hover |
| `--bg-surface-active` | white-alpha 10% | Surface active |

### Text
| Token | Dark Value | Purpose |
|-------|-----------|---------|
| `--text-primary` | #ffffff | Primary text |
| `--text-secondary` | #a0a0a0 (gray-400) | Secondary text |
| `--text-muted` | #888888 (gray-500) | Muted/label text |
| `--text-disabled` | #666666 (gray-600) | Disabled text |
| `--text-inverse` | #000000 | Text on light backgrounds |

### Borders
| Token | Dark Value | Purpose |
|-------|-----------|---------|
| `--border-subtle` | white-alpha 12% | Card borders, dividers |
| `--border-default` | white-alpha 20% | Input borders, secondary btn |
| `--border-strong` | white-alpha 35% | Hover state, emphasis |

### Interactive States
| Token | Dark Value | Purpose |
|-------|-----------|---------|
| `--hover-bg` | white-alpha 3% | Hover background |
| `--active-bg` | white-alpha 6% | Active/pressed background |
| `--selected-bg` | #ffffff | Selected item background |
| `--selected-text` | #000000 | Selected item text |
| `--selected-hover-bg` | #e0e0e0 (gray-200) | Selected + hover |
| `--disabled-opacity` | 0.4 | Disabled element opacity |
| `--focus-ring` | #a0a0a0 (gray-400) | Focus outline color |

### Semantic Colors
| Family | Base | Hover | Light | BG (10%) | BG Strong (20%) | Border (30%) |
|--------|------|-------|-------|----------|-----------------|--------------|
| Success | #22c55e | #16a34a | #4ade80 | `--success-bg` | `--success-bg-strong` | `--success-border` |
| Warning | #f59e0b | #d97706 | #fbbf24 | `--warning-bg` | `--warning-bg-strong` | `--warning-border` |
| Error | #ef4444 | #dc2626 | #f87171 | `--error-bg` | `--error-bg-strong` | `--error-border` |
| Info | #3b82f6 | #2563eb | #60a5fa | `--info-bg` | `--info-bg-strong` | `--info-border` |

### Accent System
| Token | Default | Purpose |
|-------|---------|---------|
| `--accent` | #0ea5e9 (sky-500) | Primary accent |
| `--accent-hover` | #0284c7 (sky-600) | Accent hover |
| `--accent-light` | #38bdf8 (sky-400) | Accent light variant |
| `--accent-bg` | sky 10% | Accent background |
| `--accent-bg-strong` | sky 20% | Accent background strong |
| `--accent-border` | sky 50% | Accent border |
| `--accent-secondary-*` | fallback to primary | Secondary accent (6 tokens) |
| `--accent-tertiary-*` | fallback to secondary | Tertiary accent (3 tokens) |
| `--surface-tint` | transparent | Surface color tint |
| `--surface-tint-strong` | transparent | Strong surface tint |
| `--neutral` | #64748b (slate-500) | Neutral color |

### Spacing
```
--space-xs: 4px     --space-sm: 8px      --space-md: 12px
--space-lg: 16px    --space-xl: 24px     --space-2xl: 32px
--space-3xl: 48px   --space-4xl: 64px    --space-page: clamp(24px, 5vw, 80px)
--container-max: 640px   --container-wide: 960px   --header-height: 56px
```

### Border Radius
```
--radius-none: 0px   --radius-xs: 2px    --radius-sm: 4px
--radius-md: 8px     --radius-lg: 12px   --radius-xl: 16px   --radius-full: 9999px
```

### Typography
```
--font-family: Inter, Noto Sans JP, Hiragino Sans, ...sans-serif
--font-mono: SF Mono, Fira Code, monospace
--text-xs: 10px   --text-sm: 12px   --text-base: 13px   --text-md: 14px
--text-lg: 16px   --text-xl: 20px   --text-2xl: 24px    --text-3xl: 32px
--letter-spacing-tight: 0.02em   --letter-spacing-normal: 0.04em   --letter-spacing-wide: 0.1em
```

### Transitions
```
--transition-fast: 150ms ease    (light interactions)
--transition-base: 200ms ease    (buttons, cards)
--transition-slow: 300ms ease    (modals, panels)
```

### Z-Index Scale
```
--z-base: 0        --z-dropdown: 100    --z-sticky: 200
--z-overlay: 9998  --z-modal: 9999      --z-toast: 10000
```

## 3. Component Tokens

### Modal
```
--modal-bg: var(--bg-overlay)        --modal-border: var(--border-default)
--modal-radius: var(--radius-lg)     --modal-scrim: var(--bg-scrim)
```

### Input
```
--input-bg: var(--bg-secondary)           --input-border: var(--border-default)
--input-border-hover: var(--border-strong) --input-border-focus: var(--text-secondary)
--input-radius: var(--radius-md)          --input-text: var(--text-primary)
--input-placeholder: var(--text-muted)
```

### Card
```
--card-bg: var(--bg-card)                 --card-border: var(--border-subtle)
--card-border-hover: var(--border-default) --card-radius: var(--radius-md)
```

### Stat Card
```
--stat-bg: var(--bg-surface)     --stat-border: var(--border-default)
--stat-label: var(--text-muted)  --stat-value: var(--text-primary)
```

### Button Primary
```
--btn-primary-hover: var(--p-gray-100)    --btn-primary-active: var(--p-gray-200)
```

### Shadows (dark = none, light = subtle)
```
--shadow-sm: none    --shadow-md: none    --shadow-lg: none
```

## Component Classes

### Buttons
| Class | Background | Color | Border | Sizes |
|-------|-----------|-------|--------|-------|
| `.btn` | — (base) | — | none | `.btn-sm`, `.btn-lg`, `.btn-icon` |
| `.btn-primary` | selected-bg (#fff) | selected-text (#000) | none | |
| `.btn-secondary` | transparent | text-secondary | border-default | |
| `.btn-ghost` | transparent | text-muted | none | |
| `.btn-danger` | error | #fff | none | |

### Cards
| Class | Background | Border | Behavior |
|-------|-----------|--------|----------|
| `.card` | card-bg | card-border | Hover: border-color change |
| `.card-elevated` | bg-elevated | border-default | Static |
| `.card-interactive` | card-bg | card-border | Hover: bg + border change, Active: active-bg |
| `.card-stat` | stat-bg | stat-border | Static |

### Form Elements
| Class | Description |
|-------|------------|
| `.input` | Text input with hover/focus/disabled states |
| `.input-error` | Error state for input |
| `.textarea` | Multi-line input, resize: vertical, min-height: 80px |
| `.select` | Native select with custom chevron icon |
| `.label` | 10px uppercase muted label |
| `.label-md` | 12px normal-case secondary label |

### Badges
| Class | Color |
|-------|-------|
| `.badge` | Base badge (pill shape) |
| `.badge-success` | success-bg / success |
| `.badge-warning` | warning-bg / warning |
| `.badge-error` | error-bg / error |
| `.badge-info` | info-bg / info |
| `.badge-accent` | accent-bg / accent |
| `.badge-neutral` | white-6 / text-secondary |

### Other Components
| Class | Description |
|-------|------------|
| `.pill-filter` / `.pill-filter-active` | Filter tabs (pill style) |
| `.toggle-switch` / `.toggle-switch.active` | Toggle switch |
| `.divider` | Horizontal divider (border-default) |
| `.empty-state` | Centered empty state container |
| `.skeleton` / `.skeleton-text` / `.skeleton-title` / `.skeleton-card` | Loading skeletons |

### Animations
| Class | Effect |
|-------|--------|
| `.animate-fade-in` | Fade in + translateY(8px → 0) |
| `.animate-scale-in` | Fade in + scale(0.96 → 1) |
| `.animate-slide-up` | Fade in + translateY(16px → 0) |
| `.animate-slide-down` | Fade in + translateY(-8px → 0) |
| `.stagger-1` ~ `.stagger-6` | 0.05s increments |

## Interactive States (5-State Rule)

All interactive elements MUST define these 5 states:

### Primary Button (.btn-primary)
| State | Background | Color | Effect |
|-------|-----------|-------|--------|
| Default | #fff (selected-bg) | #000 (selected-text) | — |
| Hover | gray-100 (btn-primary-hover) | #000 | translateY(-1px) |
| Active | gray-200 (btn-primary-active) | #000 | translateY(0) |
| Disabled | #fff | #000 | opacity: 0.4, cursor: not-allowed |
| Focus | — | — | outline: 2px solid focus-ring, offset: 2px |

### Secondary Button (.btn-secondary)
| State | Background | Color | Border |
|-------|-----------|-------|--------|
| Default | transparent | text-secondary | border-default |
| Hover | hover-bg | text-primary | border-strong |
| Active | active-bg | text-primary | border-strong |
| Disabled | transparent | — | opacity: 0.4 |

### Ghost Button (.btn-ghost)
| State | Background | Color |
|-------|-----------|-------|
| Default | transparent | text-muted |
| Hover | hover-bg | text-secondary |
| Active | active-bg | — |
| Disabled | transparent | opacity: 0.4 |

### Danger Button (.btn-danger)
| State | Background | Color |
|-------|-----------|-------|
| Default | error | #fff |
| Hover | error-hover | #fff |
| Active | red-600 | #fff |
| Disabled | error | opacity: 0.4 |

### Interactive Card (.card-interactive)
| State | Background | Border |
|-------|-----------|--------|
| Default | card-bg | card-border |
| Hover | bg-elevated | card-border-hover |
| Active | active-bg | — |

### Pill Filter (.pill-filter)
| State | Background | Color | Border |
|-------|-----------|-------|--------|
| Default | transparent | text-secondary | border-default |
| Hover | hover-bg | text-primary | border-strong |
| **Selected** | **selected-bg (#fff)** | **selected-text (#000)** | **selected-bg** |
| Selected+Hover | selected-hover-bg | selected-text | selected-hover-bg |
| Disabled | transparent | — | opacity: 0.3 |

### Toggle Switch (.toggle-switch)
| State | Background | Knob |
|-------|-----------|------|
| Default (off) | border-strong | text-primary |
| Hover (off) | text-muted | — |
| Active (on) | success | translateX(16px) |
| Active+Hover | success-hover | — |
| Disabled | opacity: 0.4 | cursor: not-allowed |
| Focus | — | outline: 2px solid focus-ring |

## Light Mode

Light mode is activated via `:root[data-theme="light"]`.

**Mechanism**: Override `--p-white-*` primitives to `rgba(0,0,0,*)`. All semantic tokens referencing `--p-white-*` (borders, surfaces, hover/active states) automatically cascade to light mode without individual overrides.

Additional light-mode overrides:
- Backgrounds: `--bg-primary: #ffffff`, `--bg-secondary: #f8f8f8`, etc.
- Text: `--text-primary: #0a0a0a`, `--text-secondary: #555555`, etc.
- Interactive: `--selected-bg: #0a0a0a`, `--selected-text: #ffffff` (inverted)
- Shadows: `--shadow-sm/md/lg` gain subtle box-shadows
- Cards: gain `box-shadow: var(--shadow-sm)` in light mode

## Prohibited Patterns

- Color emoji in UI (use Lucide icons or SVG)
- Gradients on backgrounds
- Glow / decorative box-shadow effects
- Marketing-style superlatives in copy
- Using primitive tokens (`--p-*`) directly in components
- Changing text color without changing background in active/selected states
