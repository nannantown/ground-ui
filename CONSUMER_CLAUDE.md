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
- Use components from `@nannantown/ground-ui` instead of building custom UI (see Component API below)
- Use CSS custom properties (`var(--bg-primary)`, `var(--text-secondary)`, etc.) for colors — never hardcode hex values
- Use token variables for spacing (`var(--space-sm)`, `var(--space-md)`) and typography (`var(--text-base)`, `var(--text-lg)`)
- Dark mode is the default. Light mode activates via `data-theme="light"` on `<html>`
- For accent theming, use `applyAccentTheme()` from `@nannantown/ground-ui/theme`
- The font family "Ground Sans" handles Japanese/English mixed text automatically — no special markup needed
- To update: `npm update @nannantown/ground-ui`

---

### Component API

#### Button
```tsx
<Button variant="primary" size="md" loading={false} leftIcon={<Icon />} rightIcon={<Icon />}>Label</Button>
```
| Prop | Type | Default |
|---|---|---|
| variant | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` |
| icon | `boolean` | `false` (renders as square icon-only button) |
| loading | `boolean` | `false` (shows spinner, disables button) |
| leftIcon | `ReactNode` | — |
| rightIcon | `ReactNode` | — |
Extends `ButtonHTMLAttributes<HTMLButtonElement>`.

#### Input
```tsx
<Input error={false} leftIcon={<Icon />} rightIcon={<Icon />} placeholder="Text..." />
```
| Prop | Type | Default |
|---|---|---|
| error | `boolean` | `false` |
| leftIcon | `ReactNode` | — |
| rightIcon | `ReactNode` | — |
Extends `InputHTMLAttributes<HTMLInputElement>`. Supports `ref` (forwardRef).

#### Textarea
```tsx
<Textarea error={false} autosize rows={3} />
```
| Prop | Type | Default |
|---|---|---|
| error | `boolean` | `false` |
| autosize | `boolean` | `false` (auto-resize to fit content) |
Extends `TextareaHTMLAttributes<HTMLTextAreaElement>`. Supports `ref` (forwardRef).

#### Select
```tsx
<Select error={false} options={[{ value: 'a', label: 'A' }]} placeholder="Choose..." />
```
| Prop | Type | Default |
|---|---|---|
| error | `boolean` | `false` |
| options | `{ value: string; label: string; disabled?: boolean }[]` | — |
| placeholder | `string` | — |
| children | `ReactNode` | — (alternative to options) |
Extends `SelectHTMLAttributes<HTMLSelectElement>`. Supports `ref` (forwardRef).

#### FormField
```tsx
<FormField label="Email" error="Required" hint="We'll never share it" required htmlFor="email">
  <Input id="email" />
</FormField>
```
| Prop | Type | Default |
|---|---|---|
| label | `string` | **required** |
| error | `string` | — |
| hint | `string` | — |
| required | `boolean` | `false` |
| htmlFor | `string` | — |
| children | `ReactNode` | **required** |

#### Modal
```tsx
<Modal open={isOpen} onClose={() => setOpen(false)} size="md" showClose>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter><Button>OK</Button></ModalFooter>
</Modal>
```
| Prop | Type | Default |
|---|---|---|
| open | `boolean` | **required** |
| onClose | `() => void` | **required** |
| size | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| showClose | `boolean` | `false` |
Sub-components: `ModalHeader`, `ModalBody`, `ModalFooter`.

#### ConfirmDialog
```tsx
<ConfirmDialog open={isOpen} onClose={close} onConfirm={handleDelete} message="Delete this item?" variant="danger" />
```
| Prop | Type | Default |
|---|---|---|
| open | `boolean` | **required** |
| onClose | `() => void` | **required** |
| onConfirm | `() => Promise<void> \| void` | **required** |
| message | `string` | **required** |
| title | `string` | — |
| confirmLabel | `string` | — |
| cancelLabel | `string` | — |
| variant | `'danger' \| 'default'` | `'danger'` |

#### Tabs
```tsx
<Tabs items={[{ value: 'all', label: 'All', count: 5 }]} value={tab} onChange={setTab} variant="pill" />
```
| Prop | Type | Default |
|---|---|---|
| items | `{ value: string; label: string; count?: number }[]` | **required** |
| value | `string` | **required** |
| onChange | `(value: string) => void` | **required** |
| variant | `'pill' \| 'underline'` | `'pill'` |

#### Badge
```tsx
<Badge variant="success">Active</Badge>
<Badge color="#ff6600">Custom</Badge>
```
| Prop | Type | Default |
|---|---|---|
| children | `ReactNode` | **required** |
| variant | `'success' \| 'warning' \| 'error' \| 'info' \| 'accent' \| 'neutral'` | `'neutral'` |
| color | `string` | — (custom hex, overrides variant) |

#### Avatar
```tsx
<Avatar src={url} name="John Doe" size="md" />
```
| Prop | Type | Default |
|---|---|---|
| src | `string \| null` | — |
| name | `string` | — (used for initials fallback) |
| size | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` (sm=24, md=32, lg=40, xl=56 px) |

#### Toggle
```tsx
<Toggle checked={isOn} onChange={setIsOn} label="Enable notifications" />
```
| Prop | Type | Default |
|---|---|---|
| checked | `boolean` | **required** |
| onChange | `(checked: boolean) => void` | **required** |
| disabled | `boolean` | `false` |
| label | `string` | — |

#### DropdownMenu
```tsx
<DropdownMenu trigger={<Button>Menu</Button>} align="right">
  <DropdownItem onClick={handleEdit}>Edit</DropdownItem>
  <DropdownDivider />
  <DropdownItem variant="danger" onClick={handleDelete}>Delete</DropdownItem>
</DropdownMenu>
```
| Prop | Type | Default |
|---|---|---|
| trigger | `ReactNode` | **required** |
| children | `ReactNode` | **required** |
| align | `'left' \| 'right'` | `'right'` |

**DropdownItem**: `onClick?: () => void`, `variant?: 'default' \| 'danger'`, `disabled?: boolean`

#### Toast
```tsx
// Wrap app with provider
<ToastProvider><App /></ToastProvider>

// Use in any component
const { toast } = useToast()
toast('Saved!', 'success')  // variants: 'success' | 'error' | 'info' | 'warning'
```

#### StatCard
```tsx
<StatCard label="Revenue" value="$12,345" trend={{ value: '+12%', direction: 'up' }} icon={<DollarIcon />} />
```
| Prop | Type | Default |
|---|---|---|
| label | `string` | **required** |
| value | `string \| number` | **required** |
| trend | `{ value: string; direction: 'up' \| 'down' \| 'neutral' }` | — |
| icon | `ReactNode` | — |

#### EmptyState
```tsx
<EmptyState icon={<InboxIcon />} title="No items" description="Create your first item" action={<Button>Create</Button>} />
```
| Prop | Type | Default |
|---|---|---|
| title | `string` | **required** |
| icon | `ReactNode` | — |
| description | `string` | — |
| action | `ReactNode` | — |

#### Divider
```tsx
<Divider direction="horizontal" label="OR" />
```
| Prop | Type | Default |
|---|---|---|
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| label | `string` | — |

#### Spinner
```tsx
<Spinner size={20} />
```
| Prop | Type | Default |
|---|---|---|
| size | `number` | `20` (px) |

#### ProgressRing
```tsx
<ProgressRing value={75} size={48} strokeWidth={3} color="var(--success)" showLabel />
```
| Prop | Type | Default |
|---|---|---|
| value | `number` | **required** (0–100) |
| size | `number` | `48` (px) |
| strokeWidth | `number` | `3` (px) |
| color | `string` | `'var(--success)'` |
| showLabel | `boolean` | `false` |

#### Skeleton
```tsx
<Skeleton variant="text" count={3} />
<Skeleton variant="card" />
<Skeleton variant="circle" width={40} height={40} />
```
| Prop | Type | Default |
|---|---|---|
| variant | `'text' \| 'title' \| 'card' \| 'circle' \| 'custom'` | `'text'` |
| width | `string \| number` | — |
| height | `string \| number` | — |
| count | `number` | `1` |

#### ToolbarButton
```tsx
<ToolbarButton onClick={handleClick} aria-label="Settings"><GearIcon /></ToolbarButton>
```
32x32px icon button for toolbars.

#### ThemeToggle
```tsx
<ThemeToggle />
```
Dark/light mode toggle button. Requires `next-themes`.

#### ThemeCustomizer
```tsx
<ThemeCustomizer language="ja" />
```
Full theme customization UI with presets, color picker, and surface selector.

---

### CSS Custom Properties (quick reference)

Use these in CSS or inline `style={{ color: 'var(--text-primary)' }}`.

#### Backgrounds
`--bg-primary` `--bg-secondary` `--bg-card` `--bg-elevated` `--bg-overlay` `--bg-scrim` `--bg-translucent` `--bg-surface` `--bg-surface-hover` `--bg-surface-active`

#### Text
`--text-primary` `--text-secondary` `--text-muted` `--text-disabled` `--text-inverse`

#### Borders
`--border-subtle` `--border-default` `--border-strong`

#### Interactive States
`--hover-bg` `--active-bg` `--selected-bg` `--selected-text` `--selected-hover-bg` `--disabled-opacity` `--focus-ring`

#### Semantic Colors
Each has: `--{name}`, `--{name}-hover`, `--{name}-light`, `--{name}-bg`, `--{name}-bg-strong`, `--{name}-border`
- **success** (green), **warning** (amber), **error** (red), **info** (blue), **accent** (theme accent)
- Also: `--neutral`, `--neutral-hover`

#### Spacing
`--space-xs` (4) `--space-sm` (8) `--space-md` (12) `--space-lg` (16) `--space-xl` (24) `--space-2xl` (32) `--space-3xl` (48) `--space-4xl` (64) `--space-page` (clamp 24–80)

#### Layout
`--container-max` (640px) `--container-wide` (960px) `--header-height` (56px)

#### Border Radius
`--radius-none` (0) `--radius-xs` (2) `--radius-sm` (4) `--radius-md` (8) `--radius-lg` (12) `--radius-xl` (16) `--radius-full` (9999)

#### Typography
`--font-family` `--font-mono`
`--text-xs` (11–12) `--text-sm` (12–13) `--text-base` (13–14) `--text-md` (14–15) `--text-lg` (16–18) `--text-xl` (20–22) `--text-2xl` (24–28) `--text-3xl` (30–36)
`--letter-spacing-tight` (0.02em) `--letter-spacing-normal` (0.04em) `--letter-spacing-wide` (0.1em)

#### Transitions
`--transition-fast` (150ms) `--transition-base` (200ms) `--transition-slow` (300ms)

#### Z-Index
`--z-base` (0) `--z-dropdown` (100) `--z-sticky` (200) `--z-overlay` (9998) `--z-modal` (9999) `--z-toast` (10000)

#### Shadows
`--shadow-sm` `--shadow-md` `--shadow-lg` (all `none` by default in dark theme)

#### Component Tokens
- **Modal**: `--modal-bg` `--modal-border` `--modal-radius` `--modal-scrim`
- **Input**: `--input-bg` `--input-border` `--input-border-hover` `--input-border-focus` `--input-radius` `--input-text` `--input-placeholder`
- **Card**: `--card-bg` `--card-border` `--card-border-hover` `--card-radius`
- **Stat**: `--stat-bg` `--stat-border` `--stat-label` `--stat-value`
- **Button**: `--btn-primary-hover` `--btn-primary-active`

---

### CSS Component Classes

For non-React usage or custom elements:

- **Button**: `.btn` `.btn-primary` `.btn-secondary` `.btn-ghost` `.btn-danger` `.btn-sm` `.btn-lg` `.btn-icon`
- **Card**: `.card` `.card-elevated` `.card-interactive` `.card-stat`
- **Input**: `.input` `.input-error` `.textarea` `.select`
- **Label**: `.label` `.label-md`
- **Badge**: `.badge` `.badge-success` `.badge-warning` `.badge-error` `.badge-info` `.badge-accent` `.badge-neutral`
- **Filter Pill**: `.pill-filter` `.pill-filter-active`
- **Toggle**: `.toggle-switch` (+ `.active`)
- **Misc**: `.divider` `.empty-state`
- **Skeleton**: `.skeleton` `.skeleton-text` `.skeleton-title` `.skeleton-card`
- **Animation**: `.animate-fade-in` `.animate-scale-in` `.animate-slide-up` `.animate-slide-down` `.stagger-1`~`.stagger-6`

---

### Theme System

#### Accent Presets (10)
`sky` (#0EA5E9), `ocean` (#3B82F6), `indigo` (#6366F1), `violet` (#8B5CF6), `rose` (#F43F5E), `crimson` (#E11D48), `ember` (#F97316), `amber` (#F59E0B), `emerald` (#10B981), `teal` (#14B8A6)

#### Surface Presets (5)
`default`, `warm`, `cream`, `cool`, `mono`

#### Theme Pairings (8 curated)
`midnight` (default+sky), `monochrome` (mono+indigo), `arctic` (cool+ocean), `aurora` (cool+emerald), `ember` (warm+ember), `sandstone` (cream+amber), `rosewood` (warm+rose), `twilight` (cream+violet)

#### Usage
```tsx
import { applyAccentTheme, loadThemeConfig, saveThemeConfig, accentPresets, surfacePresets } from '@nannantown/ground-ui/theme'

// Apply a preset
applyAccentTheme({ accentId: 'sky', primaryStyle: 'mono' })

// Apply custom color
applyAccentTheme({ accentId: 'custom', customColor: '#ff6600', primaryStyle: 'accent', surfaceId: 'warm' })

// With light mode
applyAccentTheme(config, /* isDark */ false)

// Persistence
saveThemeConfig(config)
const config = loadThemeConfig()
```

#### ThemeConfig Shape
```typescript
{
  accentId: string            // preset id or 'custom'
  customColor?: string        // hex when accentId === 'custom'
  primaryStyle: 'mono' | 'accent'
  surfaceId?: string | null   // surface preset id
  pairingId?: string | null   // active pairing id
}
```

#### Color Utilities
```tsx
import { hexToHsl, hslToHex, contrastRatio, ensureContrast, getContrastColor } from '@nannantown/ground-ui/theme'
```

---

### TypeScript Token Values

```tsx
import { spacing, containerWidth, headerHeight, radius, fontFamily, fontSize, fontWeight, letterSpacing, transition, zIndex } from '@nannantown/ground-ui/tokens'

spacing.md      // '12px'
radius.lg       // '12px'
fontSize.base   // '13px'
zIndex.modal    // 9999
```
