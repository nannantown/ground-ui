# 5-State Rule Audit — Full Component Report

> Generated: 2026-03-17, Cycle 1
> Rule: default / hover / active(selected) / disabled / focus-visible

---

## Summary

| Category | Total | Interactive | N/A | Avg Score |
|----------|-------|-------------|-----|-----------|
| Input/Form | 19 | 15 | 4 | 82% |
| Navigation | 8 | 8 | 0 | 75% |
| Overlay | 7 | 7 | 0 | 54% |
| Display | 8 | 0 | 8 | N/A |
| Advanced | 9 | 7 | 2 | 63% |
| Feedback | 4 | 2 | 2 | 50% |
| Layout | 11 | 2 | 9 | 60% |
| **Total** | **66** | **41** | **25** | **69%** |

---

## Non-Interactive Components (N/A — display/layout only)

| # | Component | Category | Reason |
|---|-----------|----------|--------|
| 1 | AppBar | Navigation | Container with slots (actions/leading/title) |
| 2 | Avatar | Display | Presentational (img/div) |
| 3 | Badge | Display | Presentational (.badge CSS class) |
| 4 | Typography | Display | Polymorphic text, no interactivity |
| 5 | Skeleton | Display | Loading placeholder |
| 6 | ProgressBar | Display | ARIA progressbar, no interaction |
| 7 | ProgressRing | Display | SVG circular progress |
| 8 | Spinner | Display | SVG animation |
| 9 | StatCard | Display | Presentational card |
| 10 | Form | Form | Render-prop wrapper, no DOM |
| 11 | FormField | Form | Layout for label+input+error |
| 12 | EmptyState | Feedback | Presentational with action slot |
| 13 | Divider | Feedback | Visual separator |
| 14 | CrossFade | Advanced | Animation component |
| 15 | VirtualList | Advanced | Scroll container only |
| 16 | Stack | Layout | Flex container |
| 17 | Grid | Layout | CSS Grid container |
| 18 | Container | Layout | Width constraint |
| 19 | Center | Layout | Flexbox centering |
| 20 | AspectRatio | Layout | Ratio container |
| 21 | Spacer | Layout | Flex spacer |
| 22 | ScrollArea | Layout | Scroll container |
| 23 | VisuallyHidden | Layout | a11y utility |
| 24 | AppShell | Layout | Layout wrapper |
| 25 | Tooltip | Overlay | Wraps trigger; hover/focus show only |

---

## Interactive Components — 5-State Compliance

### Legend
- **Y** = Present and working
- **P** = Partial (some variants/sub-elements covered, others not)
- **N** = Missing
- **CSS** = Handled via tokens.css classes
- **JS** = Handled via inline styles / React state
- Score = (Y count + P×0.5) / 5 × 100%

---

### Input Components (11)

| # | Component | default | hover | active | disabled | focus-visible | Score | Source | Notes |
|---|-----------|---------|-------|--------|----------|---------------|-------|--------|-------|
| 1 | Button | Y | Y | Y | Y | N | 80% | CSS | .btn-* classes lack :focus-visible in tokens.css |
| 2 | Input | Y | Y | — | Y | Y | 100% | CSS | :active N/A for text input; :focus + :focus-visible defined |
| 3 | Textarea | Y | Y | — | Y | Y | 100% | CSS | Same as Input |
| 4 | Checkbox | Y | Y | — | Y | Y | 100% | CSS | Hidden native + custom span; :focus-visible on input |
| 5 | RadioGroup | Y | Y | — | Y | Y | 100% | CSS | .radio + .radio-checked; :focus-visible defined |
| 6 | Select | Y | Y | — | Y | Y | 100% | CSS+JS | Custom dropdown; JS for option hover/focus |
| 7 | Slider | Y | Y | Y | Y | Y | 100% | JS | Full JS state: hovered, active, focused, disabled |
| 8 | Toggle | Y | Y | Y | Y | Y | 100% | CSS | .toggle-switch; all 5 states in CSS |
| 9 | Autocomplete | Y | Y | — | Y | Y | 100% | JS | JS state mgmt for hover/focus; inherits .input CSS |
| 10 | DatePicker | Y | Y | Y | Y | P | 90% | CSS+JS | Calendar buttons use CSS; focus partial on some sub-elements |
| 11 | TimePicker | Y | Y | P | Y | P | 80% | CSS+JS | ScrollColumn hover JS; focus partial on period buttons |

**Input Average: 95%**

---

### Form Components (4 interactive / 4 total)

| # | Component | default | hover | active | disabled | focus-visible | Score | Source | Notes |
|---|-----------|---------|-------|--------|----------|---------------|-------|--------|-------|
| 12 | Chip | Y | Y | Y | Y | Y | 100% | JS | onMouseEnter/Leave + onMouseDown/Up + tabIndex+onKeyDown |
| 13 | SegmentedControl | Y | Y | Y | Y | Y | 100% | CSS | .segmented-control-active; all states in CSS |
| 14 | SearchBar | Y | Y | N | Y | Y | 80% | JS | Input + button; no explicit active/pressed state |
| 15 | ToolbarButton | Y | Y | N | N | N | 40% | JS | JS hover only; missing disabled, active, focus-visible |

**Form Average: 80%**

---

### Navigation Components (8 interactive / 8 total, excluding AppBar=N/A above)

| # | Component | default | hover | active | disabled | focus-visible | Score | Source | Notes |
|---|-----------|---------|-------|--------|----------|---------------|-------|--------|-------|
| 16 | BottomNav | Y | Y | Y | N | P | 70% | JS+CSS | JS hover; CSS active class; no disabled; focus partial |
| 17 | NavigationRail | Y | Y | Y | N | Y | 80% | JS+CSS | JS hover; CSS active; no disabled prop |
| 18 | Sidebar | Y | Y | Y | Y | Y | 100% | CSS | .sidebar-item all 5 states in CSS |
| 19 | Breadcrumb | Y | Y | Y | N | N | 60% | CSS | <a> links; no disabled; no focus-visible in CSS |
| 20 | Pagination | Y | Y | Y | Y | Y | 100% | CSS | .pagination-item; all states; disabled on prev/next |
| 21 | Stepper | Y | N | Y | N | Y | 60% | JS | Inline styles; no hover; no disabled; focus via tabIndex |
| 22 | Tabs | Y | Y | Y | N | N | 60% | CSS | .pill-filter classes; no disabled; no focus-visible |

**Navigation Average: 76% (excluding AppBar)**

---

### Overlay Components (6 interactive / 7 total, excluding Tooltip=N/A above)

| # | Component | default | hover | active | disabled | focus-visible | Score | Source | Notes |
|---|-----------|---------|-------|--------|----------|---------------|-------|--------|-------|
| 23 | Modal | Y | P | N | N | N | 30% | JS | Close button: JS hover; no active/disabled/focus |
| 24 | Popover | Y | N | N | N | N | 20% | — | Trigger wrapper; positioning only |
| 25 | DropdownMenu | Y | Y | N | Y | N | 60% | JS | DropdownItem: disabled + hover; no active/focus |
| 26 | CascadingMenu | Y | Y | Y | Y | Y | 100% | JS+CSS | Full keyboard nav; disabled on items; focus ring |
| 27 | BottomSheet | Y | N | N | N | P | 30% | JS | Drag handle; Escape key; minimal states |
| 28 | ConfirmDialog | Y | P | N | P | N | 30% | — | Wraps Modal; confirm has loading; inherits Modal issues |

**Overlay Average: 45%**

---

### Advanced Components (7 interactive / 9 total)

| # | Component | default | hover | active | disabled | focus-visible | Score | Source | Notes |
|---|-----------|---------|-------|--------|----------|---------------|-------|--------|-------|
| 29 | Accordion | Y | Y | N | N | Y | 60% | CSS+JS | .accordion-trigger: hover+focus; no disabled/active in CSS |
| 30 | Timeline | Y | N | N | N | Y | 40% | JS | Clickable items: tabIndex+onKeyDown; no hover/active/disabled |
| 31 | Carousel | Y | Y | N | Y | Y | 80% | JS | Arrow buttons: disabled at bounds; hover JS; focus JS |
| 32 | DragAndDrop | Y | Y | Y | Y | N | 80% | JS | isDragging/isOver render props; no focus-visible |
| 33 | Dismissible | Y | N | N | Y | N | 40% | JS | Swipe gesture; disabled stops drag; minimal visual states |
| 34 | DataTable | Y | Y | Y | N | N | 60% | JS | Sortable headers; row hover/active; no disabled/focus |
| 35 | ListTile | Y | Y | Y | Y | Y | 100% | JS | Full 5-state; selected accent; keyboard Enter/Space |

**Advanced Average: 66%**

---

### Feedback Components (2 interactive / 4 total)

| # | Component | default | hover | active | disabled | focus-visible | Score | Source | Notes |
|---|-----------|---------|-------|--------|----------|---------------|-------|--------|-------|
| 36 | Alert | Y | P | N | N | N | 30% | CSS | Close button uses .btn; inherits btn issues |
| 37 | Toast | Y | N | N | N | N | 20% | — | Dismiss button minimal styling |

**Feedback Average: 25%**

---

### Layout Components (2 interactive / 11 total)

| # | Component | default | hover | active | disabled | focus-visible | Score | Source | Notes |
|---|-----------|---------|-------|--------|----------|---------------|-------|--------|-------|
| 38 | Drawer | Y | N | N | N | N | 20% | — | Escape key + backdrop click; no visual states |
| 39 | SplitView | Y | N | Y | N | Y | 60% | JS | Resizable divider; pointer events; keyboard arrows |
| 40 | ThemeToggle | Y | Y | N | N | N | 40% | JS | Wraps ToolbarButton; inherits its gaps |
| 41 | ThemeCustomizer | Y | Y | P | P | N | 50% | JS | Many sub-elements; partial disabled; no focus-visible |

**Layout/Utility Average: 43%**

---

## Top 10 Priority Fixes

Ranked by impact (usage frequency × gap severity × accessibility risk):

| Rank | Component | Current | Gap | Impact | Fix Effort |
|------|-----------|---------|-----|--------|------------|
| 1 | **Button** | 80% | :focus-visible missing in .btn-* CSS | CRITICAL — most used component, WCAG 2.4.7 | Low — add :focus-visible to CSS |
| 2 | **Tabs** | 60% | disabled + :focus-visible missing | HIGH — common nav pattern | Medium — CSS + prop |
| 3 | **BottomNav** | 70% | disabled + :focus-visible partial | HIGH — mobile nav | Medium — CSS + prop |
| 4 | **Breadcrumb** | 60% | disabled + :focus-visible missing | HIGH — nav pattern | Medium — CSS |
| 5 | **DropdownMenu** | 60% | active + :focus-visible missing | HIGH — frequent use | Medium — JS + CSS |
| 6 | **Modal** | 30% | hover/active/disabled/focus on close btn | MEDIUM — overlay pattern | Medium — CSS classes |
| 7 | **Accordion** | 60% | disabled + active missing | MEDIUM — content pattern | Low — CSS + prop |
| 8 | **ToolbarButton** | 40% | disabled + active + focus-visible missing | MEDIUM — toolbar pattern | Medium — prop + CSS |
| 9 | **DataTable** | 60% | disabled + :focus-visible missing | MEDIUM — data display | Medium — JS + CSS |
| 10 | **Toast** | 20% | Most states missing on dismiss btn | LOW — auto-dismisses | Low — use .btn classes |

---

## Cross-Cutting Issues

### 1. :focus-visible in tokens.css
The `.btn-*` classes (primary, secondary, ghost, danger) do **not** define `:focus-visible`. This affects every component that uses Button internally (Alert close, Modal close, ConfirmDialog, Carousel arrows, etc.).

**Fix**: Add `.btn:focus-visible` rule to tokens.css → cascading fix for ~10 components.

### 2. No disabled prop on nav components
BottomNav, NavigationRail, Breadcrumb, Tabs, Stepper lack `disabled` prop/styling.

**Fix**: Add `disabled` prop + `:disabled` / `aria-disabled` styling.

### 3. Overlay close buttons
Modal, BottomSheet, Toast, Alert all have close/dismiss buttons with minimal state handling. Most would benefit from using the shared `.btn` / `.btn-ghost` CSS classes.

### 4. Inconsistent state implementation
Some components use CSS classes (Button, Toggle, Sidebar), others use inline JS styles (Slider, Chip, ListTile). This creates maintenance burden. Consider standardizing on CSS classes where possible.

---

## Overall Score

**Interactive components: 41/66**
**Average 5-state compliance: 69%**
**Components at 100%: 14/41 (34%)**
**Components below 50%: 9/41 (22%)**

Target: 100% of interactive components at 100% compliance.
