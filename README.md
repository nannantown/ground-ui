# @nannantown/ground-ui

Minimal, dark-first React design system with cross-platform token support.

## Install

This package is published on **GitHub Packages**. Authentication is required.

### 1. Create `.npmrc` in your project root

```
@nannantown:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<GITHUB_PAT>
```

The PAT needs `read:packages` scope. Generate at: GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic).

Add `.npmrc` to `.gitignore`.

### 2. Install

```bash
npm install @nannantown/ground-ui
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `next-themes >= 0.4` (optional).

## Usage

### React / Next.js

```tsx
// Import CSS tokens + component classes (required)
import '@nannantown/ground-ui/css'

// Import components
import { Button, Modal, Input, Select, Toggle } from '@nannantown/ground-ui'

// Import theme engine (optional)
import { applyAccentTheme } from '@nannantown/ground-ui/theme'
```

### CSS only (non-React)

```css
@import '@nannantown/ground-ui/css';
```

```html
<button class="btn btn-primary">Submit</button>
```

### TypeScript tokens

```ts
import { spacing, typography } from '@nannantown/ground-ui/tokens'
```

### Flutter

```bash
cp node_modules/@nannantown/ground-ui/out/flutter/ground_tokens.dart lib/theme/
```

```dart
import 'theme/ground_tokens.dart';
MaterialApp(theme: GroundTheme.dark());
```

## Components

| Component | Description |
|---|---|
| `Avatar` | User avatar with fallback |
| `Badge` | Status badge (success, warning, error, info, accent, neutral) |
| `Button` | Button (primary, secondary, ghost, danger) with size variants |
| `ConfirmDialog` | Confirmation dialog with action buttons |
| `Divider` | Horizontal/vertical divider |
| `DropdownMenu` | Dropdown menu with `DropdownItem` and `DropdownDivider` |
| `EmptyState` | Empty state placeholder |
| `FormField` | Form field wrapper with label and error |
| `Input` | Text input with error state |
| `Modal` | Modal dialog with `ModalHeader`, `ModalBody`, `ModalFooter` |
| `ProgressRing` | Circular progress indicator |
| `Select` | Select dropdown |
| `Skeleton` | Loading skeleton |
| `Spinner` | Loading spinner |
| `StatCard` | Statistics display card |
| `Tabs` | Tab navigation |
| `Textarea` | Multi-line text input |
| `ThemeCustomizer` | Theme customization UI |
| `ThemeToggle` | Dark/light mode toggle |
| `Toast` / `useToast` | Toast notifications (wrap with `ToastProvider`) |
| `Toggle` | Toggle switch |
| `ToolbarButton` | Toolbar action button |

Utility: `cn()` - className merger.

## Theme System

Dark mode is the default. Light mode activates via `data-theme="light"` on the root element.

### Accent presets

sky, ocean, indigo, violet, rose, crimson, ember, amber, emerald, teal

### Surface presets

default, warm, cream, cool, mono

### Runtime theming

```ts
import { applyAccentTheme, ACCENT_PRESETS, SURFACE_PRESETS } from '@nannantown/ground-ui/theme'

applyAccentTheme({
  accentId: 'ocean',
  primaryStyle: 'accent',
  surfaceId: 'cool',
}, false) // false = dark mode, true = light mode
```

## CSS Classes

Components use CSS classes defined in the token stylesheet. Available for direct use in HTML:

- **Button**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-sm`, `.btn-lg`, `.btn-icon`
- **Card**: `.card`, `.card-elevated`, `.card-interactive`, `.card-stat`
- **Input**: `.input`, `.input-error`, `.textarea`, `.select`
- **Badge**: `.badge`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info`, `.badge-accent`, `.badge-neutral`
- **Other**: `.toggle-switch`, `.divider`, `.empty-state`, `.skeleton`, `.skeleton-text`, `.skeleton-title`, `.skeleton-card`
- **Animation**: `.animate-fade-in`, `.animate-scale-in`, `.animate-slide-up`, `.animate-slide-down`, `.stagger-1` ~ `.stagger-6`

## ESLint Plugin

```ts
import groundPlugin from '@nannantown/ground-ui/eslint'

export default [
  groundPlugin.configs.recommended, // enables no-emoji rule
]
```

## Export Map

| Import path | Content |
|---|---|
| `@nannantown/ground-ui` | React components + `cn` utility |
| `@nannantown/ground-ui/css` | CSS tokens + component classes |
| `@nannantown/ground-ui/tokens` | TypeScript token values |
| `@nannantown/ground-ui/tokens/css` | Generated CSS custom properties |
| `@nannantown/ground-ui/tokens/flutter` | Flutter Dart tokens |
| `@nannantown/ground-ui/theme` | Theme engine (presets, color math, runtime) |
| `@nannantown/ground-ui/interactions` | Interactive demo components |
| `@nannantown/ground-ui/eslint` | ESLint plugin (no-emoji rule) |

## License

MIT
