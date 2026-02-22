## Design System (@nannantown/ground-ui)

This project uses `@nannantown/ground-ui` as its design system.
Source repository: https://github.com/nannantown/ground-ui

### Setup

Requires `.npmrc` in project root (gitignored):
```
@nannantown:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<GITHUB_PAT>
```

### Import Patterns

```tsx
import '@nannantown/ground-ui/css'                            // Required: CSS tokens + component classes
import { Button, Modal, Input } from '@nannantown/ground-ui'  // React components
import { applyAccentTheme } from '@nannantown/ground-ui/theme' // Theme engine
import { spacing, typography } from '@nannantown/ground-ui/tokens' // TS token values
```

### Rules

- Always import `@nannantown/ground-ui/css` once at the app root (layout.tsx or main.tsx)
- Use components from `@nannantown/ground-ui` instead of building custom UI for: Button, Modal, Input, Select, Textarea, Badge, Tabs, Toast, Spinner, Avatar, Toggle, DropdownMenu, FormField, Divider, EmptyState, Skeleton, StatCard, ConfirmDialog, ProgressRing
- Use CSS custom properties (`var(--bg-primary)`, `var(--text-secondary)`, etc.) for colors — never hardcode hex values
- Use token variables for spacing (`var(--space-sm)`, `var(--space-md)`) and typography (`var(--text-base)`, `var(--text-lg)`)
- Dark mode is the default. Light mode activates via `data-theme="light"` on `<html>`
- For accent theming, use `applyAccentTheme()` from `@nannantown/ground-ui/theme`
- The font family "Ground Sans" handles Japanese/English mixed text automatically — no special markup needed
- To update: `npm update @nannantown/ground-ui`
