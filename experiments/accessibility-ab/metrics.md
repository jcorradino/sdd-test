# Measurement harness

Fixed, ruleset-independent instruments. Run the **same** set against both
arms, in **report mode** (record numbers; never fail the build — see the
validity rules in `README.md`). All of these reuse tooling the stack
already mandates, so there's nothing new to install.

## Quantitative

| # | Instrument | How to run | What to record |
|---|---|---|---|
| M1 | **axe-core** (`@axe-core/playwright`) | Scan every page hosting the feature. Reuse the pattern from `tests/e2e/accessibility.spec.ts`, but **collect** violations instead of asserting zero. | Count by impact: critical / serious / moderate / minor, plus the list of rule IDs hit. |
| M2 | **Lighthouse Accessibility** (`@lhci/cli`) | Run against a production build of the same routes. | The 0–100 Accessibility score (and the failed audit IDs). |
| M3 | **WCAG 2.2 AA checklist** | Manual pass against the AA success criteria relevant to the feature. | Count of criteria **failed**, listed by number (e.g. 1.4.3, 2.1.1, 2.4.7, 4.1.2). |
| M4 | **Keyboard pass** | Tab through the feature; try `Enter`/`Space`/`Esc`/arrows. | Count of: unreachable controls, invisible-focus elements, keyboard traps, missing `Esc` dismissal. |
| M5 | **Screen-reader smoke** | VoiceOver or NVDA over the primary flow. | Count of blocking issues (unlabeled control, wrong role, silent state change) + short notes. |
| M6 | **Contrast** | Check token-on-surface pairings the feature introduces, especially Dell Blue usages (`design/README.md`). | Count of pairings below the AA ratio. |

## Qualitative — generated-code patterns

A simple "did the agent reach for the accessible pattern unprompted"
tally. For each, mark ✅ / ❌ per arm; the count of ✅ is the score.

| Pattern | Looking for |
|---|---|
| Semantic element | `<button>` / `<a>` vs. `<div role="button">` or click-handlers on non-interactive nodes |
| Option groups | `<fieldset>` + `<legend>` (or Radix `RadioGroup`) around the configurator/picker groups |
| Names | `alt` on every image; `aria-label` on icon-only controls |
| Live regions | `aria-live="polite"` for price/cart/undo status updates |
| Focus management | Focus moved into dialogs/sheets and restored on close |
| Reduced motion | `prefers-reduced-motion` honored for enter/exit transitions |
| State not color-only | Selected/error/out-of-stock carries a non-color cue (icon, ring, text) |
| Headings | No skipped heading levels |

## Procedure

1. Build the feature in each arm (see `README.md`).
2. Run M1–M6 against each build; tally the qualitative patterns from the
   diff.
3. Enter raw numbers into a copy of `results-template.md`
   (`results-<feature>-<date>.md`).
4. Report the delta. Lower M1/M3/M4/M5/M6 and higher M2 / more ✅ = the
   ruleset helped.
