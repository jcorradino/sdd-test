---
trigger: always_on
---

# Accessibility Rules

WCAG 2.2 AA — Constitution §IV (NON-NEGOTIABLE).
Zero axe-core Serious/Critical findings is a merge blocker.

## Always

- Every `<img>` has `alt`. Decorative images use `alt=""` — never omit.
- Every form control has a `<label>` (visible) or an `aria-label`.
- Option groups use `<fieldset>` + `<legend>`; radio sets use
  `<RadioGroup>` from shadcn (Radix), not hand-rolled.
- Headings descend without skipping levels (`h1` → `h2` → `h3`).
- Every interactive element has a visible focus indicator. Never strip
  the ring; if you restyle it, keep ≥ 3:1 contrast against its
  background.
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and
  non-text UI components (borders, icons that convey state).
- Honor `prefers-reduced-motion: reduce` — disable non-essential
  transitions and any auto-playing motion.
- Live regions: status updates use `aria-live="polite"`; reserve
  `role="alert"` for genuinely urgent messages.
- Use shadcn / Radix primitives for dialog, sheet, menu, tabs,
  accordion, tooltip, toast — they own keyboard and ARIA semantics.

## Never

- Don't `role="button"` on a `<div>`. Use `<button>`.
- Don't render a disabled `<button>` without a tooltip explaining why.
- Don't ship icon-only controls without an `aria-label`.
- Don't use a placeholder as the only label for an input.
- Don't set `tabindex` to a positive integer; `0` and `-1` only.
- Don't gate a flow on hover, color, or sound alone — provide a
  redundant cue.

## Verify before merging

- Tab through the new UI: every focusable element is reachable in
  source order, focus is visible, and `Esc` dismisses dialogs/menus.
- The Playwright axe-core spec passes with **0 Serious/Critical**
  findings on every page that hosts the change.
- If the change touches motion, retest with
  `prefers-reduced-motion: reduce`.
