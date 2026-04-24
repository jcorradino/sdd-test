# Spec 02 — Page Layout

## Route

`/products/[productId]` — server-rendered. `generateStaticParams` emits one
route per product in the dataset.

## Sections (top to bottom)

1. **Breadcrumb** — `Home / Laptops / {product.name}`.
2. **Hero** — two-column on desktop, stacked on mobile.
   - **Left**: image gallery (see below).
   - **Right**: name, tagline, star rating + count (links to reviews
     section), badges, current configured price, stock state, primary CTA
     ("Add to Cart"), secondary link ("Compare").
3. **Configurator** — see spec 03.
4. **Tech specs** — see spec 04.
5. **What's in the box** — bullet list from `product.inTheBox`.
6. **Reviews** — see spec 05.
7. **Accessories** — horizontally scrollable card strip of compatible
   accessories.
8. **Sticky buy bar** — appears after user scrolls past the hero, shows
   product name, current price, and "Add to Cart". On mobile this is
   bottom-fixed; on desktop it is top-fixed.

## Image gallery

- Thumbnails below the main image on desktop, dot indicators on mobile.
- Keyboard: Left/Right arrows cycle when gallery is focused.
- Main image uses `next/image` with `priority` on the first (LCP) image.

## Responsive breakpoints

Tailwind defaults: `sm 640 / md 768 / lg 1024 / xl 1280`.
- `< md`: all sections stack, gallery above copy.
- `md – lg`: 2-col hero, configurator full-width.
- `≥ lg`: 2-col hero with configurator rendered in the right column
  (configurator detaches into the hero sidebar and becomes sticky).

## Empty / error states

- Unknown productId → Next.js `notFound()`.
- No reviews → reviews section renders "Be the first to review".
- No accessories → section is omitted entirely (do not render an empty
  heading).

## Visual style

- Neutral surface, Dell-like restrained palette (blues + grays). No custom
  typography; use system font stack via Tailwind.
- Use shadcn/ui primitives (`Button`, `Badge`, `Tabs`, `RadioGroup`,
  `Separator`, `Card`). Do not hand-roll components that shadcn provides.
- Radius: `rounded-xl` for cards, `rounded-md` for buttons.
