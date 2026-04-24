# Spec 08 — Testing Strategy

Every spec in this folder must have at least one test that pins its
behavior. Tests live alongside source (`*.test.ts` / `*.test.tsx`) for
units and in `e2e/` for Playwright flows.

## Unit (Vitest + React Testing Library)

Required coverage:

1. **Data loader** (`lib/data.ts`)
   - Loads and Zod-validates `data/laptops.json`.
   - Throws a descriptive error when a ConfigGroup has zero or ≥2
     `default: true` options.
   - Throws when `incompatibleWith` is asymmetric.

2. **Price formatter** (`lib/price.ts`)
   - `$1,899.00`, `Included` for 0, `−$50.00` for negatives.
   - Renders USD by default, accepts override.

3. **Configurator reducer** (`lib/configurator.ts`)
   - Default state derived deterministically from a product.
   - Selecting a new option updates only that group.
   - Auto-resets a conflicting option to its group default.
   - Out-of-stock selections are rejected (state unchanged).

4. **Cart store** (`lib/cart.ts`)
   - Add → new line. Add same SKU → quantity increments.
   - Quantity capped at 5.
   - Schema-version mismatch resets store without throwing.

5. **JSON-LD builder** — emits a valid `Product` document; snapshot tested
   for the sample product.

## Component (RTL)

- `<Configurator>` renders one radio group per `ConfigGroup`, announces
  price changes via an `aria-live="polite"` region.
- `<Reviews>` empty state renders the "first to review" message and hides
  sort/filter controls.
- `<TechSpecs>` renders an accordion on mobile viewport and a `<dl>` table
  on desktop viewport (use `window.matchMedia` mock).

## E2E (Playwright)

One spec file per user journey:

1. **configure-and-add-to-cart.spec.ts**
   - Navigate to `/products/apex-15`.
   - Change CPU and RAM, assert hero price updates.
   - Click Add to Cart, assert toast + cart badge shows `1`.
   - Reload, assert cart badge still shows `1` (persistence).

2. **compatibility-auto-reset.spec.ts**
   - Pick an option whose `incompatibleWith` forces a reset in another
     group; assert the toast text and the new selection.

3. **accessibility.spec.ts**
   - Run `@axe-core/playwright` against the page; assert zero Serious /
     Critical violations.

## CI

- GitHub Actions: `lint`, `typecheck`, `test:unit`, `test:e2e` jobs run
  in parallel on PRs. E2E uses the Playwright Docker image.
- Coverage threshold: 80% lines for `lib/**`. UI components are
  behavior-tested, not coverage-gated.
