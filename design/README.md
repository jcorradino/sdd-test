# Design tokens — Dell Design System (DDS)

Canonical color tokens for the Cobalt storefront. This directory is the
single source of truth for Constitution **Principle VIII (Brand &
Design-Token Fidelity)**. Component code consumes *roles*, never raw
palette hex.

- **`dds-tokens.json`** — the tokens: `palette` (raw values) and `roles`
  (semantic light/dark mappings).

## Provenance (read this first)

- **Dell Blue `#0076CE` is confirmed** from public Dell brand references
  (Pantone-derived refs also cite `#007DB8`).
- **Everything else is a principled seed, not the official DDS set.** The
  live DDS color page (<https://www.delldesignsystem.com/foundations/color>)
  returns **HTTP 403** to automated fetch, so the neutral ramp and
  semantic roles were authored to be sensible and AA-safe, then flagged
  for reconciliation. Before treating the secondary values as canonical,
  confirm the exact hex values **and official token names** from the
  signed-in DDS site and update `dds-tokens.json`.

## How roles map to the stack

shadcn/ui themes through CSS custom properties; Tailwind v4 exposes them
via `@theme`. At implement time (feature 001, Phase 1), wire `roles.light`
and `roles.dark` into `app/globals.css`:

```css
:root {
  --background: #FFFFFF;
  --foreground: #131417;
  --primary: #0076CE;
  --primary-foreground: #FFFFFF;
  --ring: #0076CE;
  /* …one line per role in dds-tokens.json → roles.light… */
}
.dark { /* roles.dark */ }
```

Components then use the role, never the literal:

```tsx
// ✅ token-driven
<button className="bg-primary text-primary-foreground">Add to Cart</button>
// ❌ forbidden by §VIII and .windsurf/rules/design-system.md
<button className="bg-[#0076CE] text-white">Add to Cart</button>
```

> shadcn's default `init` emits HSL channel variables. Either convert
> these hex values to the `h s l` channel form shadcn expects, or
> configure the generated `components.json`/theme to read hex. Keep the
> values numerically identical to `dds-tokens.json` whichever form you
> pick — that file stays the source of truth.

## Contrast gotchas (thresholds owned by Principle IV)

These are the DDS-specific traps the accessibility pass will catch. The
**ratios and pass/fail rules live in `.windsurf/rules/accessibility.md`**
— this file only points at where DDS color collides with them.

1. **Dell Blue is borderline on white.** `#0076CE` text on white is
   ~4.6:1 — it *passes* AA for normal text but only just, and fails AAA.
   Use **`--primary-strong` (`#005CB9`, ~6.5:1)** for links and small
   text on light surfaces. White-on-`#0076CE` buttons are at the same
   ~4.6:1 boundary — acceptable, but don't go below ~14px/regular weight.
2. **Light swatch chips need a token border.** A `Platinum Silver`
   finish (`#C0C2C4`) on a white card is ~1.2:1 — effectively invisible
   at the edge. Non-text UI needs ≥ 3:1, so every swatch chip gets a
   `border-border` ring regardless of its fill.
3. **Never signal selection by color alone.** The selected swatch /
   option must carry a ring + check icon, not just a color change
   (redundant cue rule in `accessibility.md`).

## Theme tokens vs. product color data

Two kinds of color live in this repo and must not be confused:

| | Theme tokens (`design/`) | Product color data (`data/laptops.json`) |
|---|---|---|
| What | UI surfaces, text, brand, state | A laptop *finish* `swatch` (content) |
| Form | Semantic role → CSS variable | Literal hex on a `color` config option |
| Rule | §VIII: no raw hex in components | Exempt — it *is* data, validated by Zod |
| Rendered as | `bg-primary`, `text-foreground`, … | The chip fill only; its border/ring/selected state come from theme tokens |
