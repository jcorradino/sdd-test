# Quickstart — Vela 15 PDP

## Prerequisites

- Node.js 20 LTS (see `.nvmrc`).
- pnpm 9 (`corepack enable && corepack prepare pnpm@latest --activate`).

## First-time setup

```bash
pnpm install
cp data/laptops.sample.json data/laptops.json   # if not already present
pnpm dev
```

Open <http://localhost:3000/products/vela-15>.

## Verify the MVP user story (US1)

1. Confirm the hero shows the product name "Cobalt Vela 15", the
   starting price, and the first hero image.
2. In the configurator, switch the processor to **Intel Core Ultra 7
   155H**. The hero price should increase by exactly $200.00.
3. Switch memory to **32 GB**. Price increases by an additional
   $150.00.
4. Click **Add to Cart**. A toast confirms; the cart badge top-right
   shows `1`.
5. Reload the page. The cart badge still shows `1` (cart persists in
   `localStorage`).

## Run the test suites

```bash
pnpm lint
pnpm typecheck
pnpm test:unit          # Vitest
pnpm test:e2e           # Playwright
pnpm test:e2e -- --grep "accessibility"   # axe-core scan only
```

## Bundle-size check

```bash
ANALYZE=true pnpm build
```

Open the generated report; the route group `app/products/[productId]`
must remain ≤ 180 KB gzipped.

## Lighthouse

```bash
pnpm dlx @lhci/cli autorun --collect.url=http://localhost:3000/products/vela-15
```

Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95,
SEO ≥ 95.

## Troubleshooting

- **`Error: dataset validation failed at …`** — `data/laptops.json`
  drifted from the schema in `lib/schema.ts`. Diff against
  `data/laptops.sample.json` to find the offending record.
- **Cart not persisting** — check that the browser is not in private
  mode and that no extension is clearing `localStorage`.
- **Hydration mismatch** — likely a missing `?c=` parse; ensure the
  server's `parseConfigQuery` and the client's reducer agree on how
  to resolve unknown SKUs (fall back to defaults).
