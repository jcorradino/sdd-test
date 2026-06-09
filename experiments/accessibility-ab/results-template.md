# Results — <feature> — <date>

Copy this file to `results-<feature>-<date>.md` and fill it in. One row
per instrument; record raw numbers, then the delta.

## Run metadata

| Field | Value |
|---|---|
| Feature built | e.g. `003-recently-viewed` |
| Base commit (common to both arms) | `<sha>` |
| Model / settings | |
| Arm A ruleset | `.windsurf/rules/accessibility.md` (baseline, unchanged) |
| Arm B ruleset | `<your alternate ruleset — name/source>` |
| axe-core version | |
| Lighthouse version | |
| Implement rounds per arm | |
| Measurement mode | report-only (gates disabled) |

## Quantitative

| Metric | Arm A (baseline) | Arm B (alternate) | Delta (A − B) |
|---|---|---|---|
| M1 axe — critical | | | |
| M1 axe — serious | | | |
| M1 axe — moderate | | | |
| M1 axe — minor | | | |
| M2 Lighthouse a11y (0–100) | | | |
| M3 WCAG 2.2 AA criteria failed | | | |
| M4 keyboard issues | | | |
| M5 screen-reader blocking issues | | | |
| M6 contrast pairs below AA | | | |

axe rule IDs hit — Arm A:

axe rule IDs hit — Arm B:

## Qualitative — generated-code patterns (✅/❌)

| Pattern | Arm A | Arm B |
|---|---|---|
| Semantic element (`<button>`/`<a>`) | | |
| `<fieldset>`+`<legend>` / RadioGroup | | |
| `alt` / `aria-label` names | | |
| `aria-live` status regions | | |
| Focus management (dialog/sheet) | | |
| `prefers-reduced-motion` honored | | |
| State not color-only | | |
| Heading levels not skipped | | |
| **✅ count** | | |

## Conclusion

- Headline delta:
- Where the ruleset helped most:
- Where both arms were equal (likely Radix/jsx-a11y baseline):
- Surprises / confounds noticed:
- Verdict on whether the ruleset earns its keep given the stack:
