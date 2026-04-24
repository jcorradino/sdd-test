# Spec 07 — Non-Functional Requirements

## Accessibility (WCAG 2.2 AA)

- All interactive elements reachable by keyboard in a logical order.
- Focus rings are never removed; use Tailwind's `focus-visible` ring.
- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for large text and UI components.
- Every image has a non-empty, descriptive `alt`. Decorative images use
  `alt=""` explicitly — never omit the attribute.
- Configurator groups use `<fieldset>` + `<legend>`; options use
  `role="radio"` inside `role="radiogroup"`.
- Respect `prefers-reduced-motion`: disable the sticky buy bar transition
  and any auto-playing gallery behavior.
- Target: 0 `axe-core` violations of Serious or Critical severity.

## Performance

- Lighthouse (desktop, throttled): Perf ≥ 90, A11y ≥ 95, Best Practices ≥
  95, SEO ≥ 95.
- LCP element is the hero image — marked `priority` on `next/image`.
- No blocking third-party scripts. No analytics in this milestone.
- JS payload budget: ≤ 180 KB gzip for the product route (measured via
  `@next/bundle-analyzer` in CI, soft-fail on exceed).
- Images under `public/images/` are committed as optimized
  WebP + fallback JPG.

## SEO

- `<title>`: `{product.name} | {product.tagline} | Apex Laptops`.
- `<meta name="description">`: first 155 chars of `product.description`,
  trimmed on word boundary.
- Open Graph + Twitter card tags populated from the product.
- JSON-LD `Product` schema with `offers`, `aggregateRating`, and `brand`.
  Generated server-side; validated by a unit test against the
  `schema.org/Product` shape.

## Security

- No dangerouslySetInnerHTML unless passing through a markdown sanitizer
  (`rehype-sanitize`) for `product.description`.
- No third-party scripts, no inline event handlers.
- `localStorage` access wrapped in try/catch — Safari private mode throws.

## Browser support

- Last 2 versions of Chrome, Firefox, Safari, Edge.
- No IE11.
