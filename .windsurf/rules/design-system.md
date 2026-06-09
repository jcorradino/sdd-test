---
trigger: always_on
---

# Design System Rules

Dell Design System (DDS) — Constitution §VIII (Brand & Design-Token
Fidelity). UI color comes from tokens, never ad-hoc hex.

Canonical token source: `design/dds-tokens.json`. Role-to-CSS-variable
mapping and contrast notes: `design/README.md`. Contrast *thresholds*
are owned by `accessibility.md` (Constitution §IV) — this rule never
restates or relaxes them.

## Always

- Style with semantic role tokens exposed as CSS variables and wired
  into the shadcn/Tailwind theme: `--background`, `--foreground`,
  `--card`, `--primary` (Dell Blue) + `--primary-foreground`,
  `--secondary`, `--muted`, `--accent`, `--border`, `--input`,
  `--ring`, `--destructive`, plus the semantic `--success` /
  `--warning` / `--danger` / `--info` roles.
- Use Tailwind utility classes that resolve to those variables
  (`bg-primary`, `text-foreground`, `border-border`, …). Generate
  shadcn components so their variants read the same variables.
- For text or small UI on a white/light surface, prefer the
  `--primary-strong` (darker) action token over raw Dell Blue —
  `#0076CE` sits right at the AA boundary on white.
- Treat a laptop finish `swatch` (in `data/laptops.json`) as *content*:
  render it as the chip fill, but draw the chip's border, focus ring,
  and selected state from theme tokens — never from the swatch value.

## Never

- Don't write a raw hex/`rgb()`/`hsl()` literal in component, CSS, or
  Tailwind-arbitrary (`bg-[#0076CE]`) code. If a needed color is missing
  from `design/dds-tokens.json`, add it there first.
- Don't introduce a second blue, gray ramp, or semantic palette that
  competes with the DDS tokens.
- Don't convey state (selected swatch, error, in/out of stock) with
  color alone — pair it with an icon, ring, text, or shape (see
  `accessibility.md`).
- Don't ship a light-colored swatch chip (e.g. Platinum `#C0C2C4`)
  without a token-driven border — it needs ≥ 3:1 against the surface
  behind it.

## Verify before merging

- No raw color literals in `app/**`, `components/**`, or CSS — grep for
  `#[0-9a-fA-F]{3,6}` and `bg-\[`/`text-\[` and confirm only
  `design/` and `data/` carry literal colors.
- Every token used resolves to a value in `design/dds-tokens.json`.
- Each token-on-surface pairing meets the Principle IV ratio (verified
  by the accessibility pass, not weakened here).
