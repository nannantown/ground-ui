# WCAG AA Accessibility Audit — Q-07

> Generated: 2026-03-19, Cycle 49

## Summary

| Component | ARIA | Keyboard | Labels | Focus | Grade |
|-----------|------|----------|--------|-------|-------|
| Button | ⚠️ | ✅ | ✅ | ✅ | B (loading lacks aria-busy) |
| Input | ✅ | ✅ | ⚠️ | ✅ | B (no aria-describedby for errors) |
| Select | ✅ | ✅ | ✅ | ✅ | A |
| Modal | ✅ | ✅ | ✅ | ⚠️ | B (no focus trap/restore) |
| Tabs | ⚠️ | ⚠️ | ⚠️ | ✅ | C (missing tablist pattern) |
| Toggle | ✅ | ✅ | ⚠️ | ✅ | A- |
| Checkbox | ⚠️ | ✅ | ✅ | ✅ | B (duplicate ARIA on visual span) |
| RadioGroup | ✅ | ✅ | ✅ | ✅ | A- |
| DropdownMenu | ⚠️ | ⚠️ | ⚠️ | ⚠️ | C (missing menu pattern) |
| Accordion | ✅ | ✅ | ✅ | ✅ | A- |

**Pass Rate: 6/10 Grade A/A-**

## Critical Fixes (Priority Order)

1. **Button**: Add `aria-busy={loading}` ← Cycle 49 で修正
2. **Checkbox**: Remove duplicate ARIA from visual `<span>`
3. **Tabs**: Add `role="tablist"` / `aria-selected` / arrow key nav
4. **DropdownMenu**: Add `aria-haspopup` on trigger
5. **Modal**: Focus trap on open / focus restore on close
