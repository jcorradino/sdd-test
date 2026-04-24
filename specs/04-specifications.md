# Spec 04 — Technical Specifications

## Data

Each product has `specs: SpecSection[]`:

```ts
type SpecSection = {
  id: string;                   // "processor", "display", ...
  label: string;                // "Processor"
  rows: SpecRow[];
};

type SpecRow = {
  label: string;                // "Processor family"
  value: string;                // "Intel Core Ultra 7"
  highlight?: boolean;          // renders in semibold
};
```

Recommended sections, in order:
`Processor`, `Memory`, `Storage`, `Display`, `Graphics`, `Ports & Slots`,
`Wireless`, `Battery & Power`, `Dimensions & Weight`, `Operating System`,
`Sustainability`, `Regulatory`.

## Rendering

- Desktop (`≥ md`): two-column table per section, `<dl>` with `<dt>`/`<dd>`.
  Sticky section nav on the left (anchor links). Clicking a nav item
  scrolls to the section with `scroll-margin-top: 5rem`.
- Mobile (`< md`): accordion. First section open by default, others
  collapsed. State is not persisted across reloads.
- No tabs — Dell-style long-scroll with anchor nav.

## "Reflects your configuration" banner

At the top of the spec section, show a small callout:
> Showing specs for: **{selected CPU label}**, **{selected RAM label}**,
> **{selected storage label}**, **{selected display label}**

This banner updates reactively as the user re-configures. Spec **rows
themselves are static** — we do not try to rewrite individual rows based
on selections in this milestone. The banner is the bridge between the
configurator and the spec table.

## Accessibility

- Each section is an `<section aria-labelledby={sectionId}>` with the
  label as an `<h3 id={sectionId}>`.
- Accordion uses `@radix-ui/react-accordion` (via shadcn) — do not
  hand-roll disclosure widgets.
