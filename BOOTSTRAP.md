# Bootstrap Prompts

A staged set of prompts for driving an agent through this SDD project.
Feed them **one at a time**, review the output, commit, then move on.
Each prompt is self-contained so the agent can succeed even if its
context was reset.

The target stack (fixed — don't let the agent drift):

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui (Radix primitives)
- Zustand for cart state
- Zod for data validation
- Vitest + React Testing Library for units
- Playwright + `@axe-core/playwright` for e2e + a11y
- All product data loaded from `data/laptops.json` — **no network calls**

---

## Prompt 0 — Ground rules (paste at the top of every session)

```
You are working in a Spec-Driven Development repo. The contract is:

1. `specs/*.md` is the source of truth. Read them before writing code.
2. `data/laptops.json` is the only data source. You MAY NOT add `fetch`
   calls to external services or mock servers.
3. Every spec file corresponds to at least one test. When you implement a
   spec, add or update tests that pin its behavior (see specs/08-testing.md).
4. Stay on the stack listed in BOOTSTRAP.md. Do not introduce Redux,
   Jotai, SWR, React Query, styled-components, or other overlapping
   libraries.
5. Before finishing a step, run `pnpm lint && pnpm typecheck && pnpm
   test:unit`. If anything fails, fix it before handing control back.
6. Keep PRs small: one spec file per commit when possible.

If any instruction below conflicts with a spec, the spec wins — stop and
flag the conflict.
```

---

## Prompt 1 — Scaffold the project

```
Scaffold a Next.js 15 + TypeScript + Tailwind v4 project in the current
repo (which already contains `specs/` and `data/`). Requirements:

- Use pnpm. Commit a `.nvmrc` pinned to Node 20 LTS.
- TypeScript strict mode, `noUncheckedIndexedAccess: true`.
- ESLint with `@typescript-eslint`, `eslint-plugin-react`,
  `eslint-plugin-jsx-a11y`. Prettier via `eslint-config-prettier`.
- Tailwind v4 configured with the default preset; no custom theme yet.
- Install: zod, zustand, lucide-react, class-variance-authority,
  clsx, tailwind-merge.
- Install and init shadcn/ui. Generate only: button, badge, card,
  separator, radio-group, accordion, tabs, sheet (for the cart drawer),
  dialog, tooltip, toast.
- Vitest + @testing-library/react + jsdom set up with a `pnpm test:unit`
  script. One sanity test (`1+1===2`) proves the runner works.
- Playwright set up with `pnpm test:e2e`; one placeholder test that
  visits `/` and asserts a status 200.
- GitHub Actions workflow `.github/workflows/ci.yml` running
  `lint`, `typecheck`, `test:unit`, and `test:e2e` on PRs.
- `README.md` at repo root with a short "How to run" section and a link
  to `specs/00-overview.md`.

Do NOT build any product UI yet. Stop after `pnpm dev` renders the
default Next.js placeholder. Verify the four CI commands all pass
locally.
```

---

## Prompt 2 — Data layer

```
Implement the data layer per `specs/01-data-model.md`:

1. Copy `data/laptops.sample.json` → `data/laptops.json` if the latter
   doesn't exist.
2. Create `lib/schema.ts` with Zod schemas for Dataset, Product,
   ConfigGroup, ConfigOption, Review, Accessory. Enforce invariants:
   - exactly one `default: true` per ConfigGroup
   - symmetric `incompatibleWith`
   - globally unique `sku`
3. Create `lib/data.ts` exporting a memoized
   `getDataset(): Promise<Dataset>`. It reads the JSON via `fs/promises`
   (server-side), validates with Zod, throws a descriptive error with
   the failing path on invalid data.
4. Add unit tests covering:
   - happy path load
   - zero-default group → throws
   - asymmetric incompatibility → throws
   - duplicate sku → throws

Do NOT touch any UI yet. Commit as "feat(data): typed loader with Zod
validation".
```

---

## Prompt 3 — Price + configurator logic (pure)

```
Implement the pure logic per `specs/03-configurator.md` and
`specs/06-pricing-cart.md`:

1. `lib/price.ts` — `formatPrice(cents, currency = "USD")` using
   Intl.NumberFormat. "Included" for 0, U+2212 minus for negatives.
   Unit-test all three branches.
2. `lib/configurator.ts` — pure reducer:
   - `initialState(product): ConfigState`
   - `reduce(state, action): ConfigState` where action is
     `{ type: "select"; groupId; optionSku }` or
     `{ type: "reset"; groupId }`
   - Handles out-of-stock rejection and auto-reset of incompatible
     options (returns which group was auto-reset so the caller can
     show a toast).
3. Derived helpers: `configuredPrice(product, state)`,
   `configuredSku(product, state)`, `allInStock(product, state)`.
4. Unit tests for every rule in spec 03's "Selection rules" section.

No React in this step. Commit as "feat(lib): configurator reducer and
price formatting".
```

---

## Prompt 4 — Product page UI

```
Build the product page per `specs/02-page-layout.md`,
`specs/04-specifications.md`, `specs/05-reviews.md`.

- Route: `app/products/[productId]/page.tsx`, server component.
  `generateStaticParams` enumerates `dataset.products`.
- Compose server components for: Breadcrumb, Hero (server shell),
  InTheBox, TechSpecs, Reviews, Accessories.
- Client components for anything interactive: Gallery, Configurator,
  StickyBuyBar, ReviewsControls (sort/filter), TechSpecsAccordion
  (mobile), CartBadge, CartDrawer.
- Use shadcn primitives (Button, RadioGroup, Accordion, Badge, Card,
  Sheet, Tooltip) — don't hand-roll equivalents.
- Respect `prefers-reduced-motion` on the sticky buy bar transition.
- LCP image is hero; mark `priority` on `next/image`.
- Implement URL sync for configurator selections as specified.

Do NOT wire the cart yet beyond the button — the button should log to
console with the configuredSku for now.

Commit as "feat(pdp): product page layout, configurator, specs, reviews".
```

---

## Prompt 5 — Cart

```
Implement the cart per `specs/06-pricing-cart.md`:

- `lib/cart.ts` — zustand store with `persist` middleware keyed
  `apex.cart.v1`. Wrap `localStorage` access in try/catch for Safari
  private mode.
- Hook: `useCart()` exposing `{ lines, add, remove, setQuantity, count }`.
- Wire "Add to Cart" (hero + sticky bar) to `add`. Show a shadcn toast
  on success with an "Undo" action.
- Cart drawer (shadcn Sheet) lists lines with quantity steppers and
  line-level remove. No checkout button in this milestone.
- Schema-version mismatch → silently reset store.
- Unit tests per spec 08 §Unit §4. Component test for the drawer.

Commit as "feat(cart): persistent zustand cart with drawer".
```

---

## Prompt 6 — NFRs + SEO + E2E

```
Finish per `specs/07-non-functional.md` and `specs/08-testing.md`:

1. JSON-LD Product schema emitted from the page (server-rendered
   <script type="application/ld+json">). Unit test validates shape.
2. `<title>` and meta description per spec 07.
3. Add `@axe-core/playwright`; write `e2e/accessibility.spec.ts`.
4. Write `e2e/configure-and-add-to-cart.spec.ts` and
   `e2e/compatibility-auto-reset.spec.ts`.
5. Add `@next/bundle-analyzer` behind `ANALYZE=true`; add a CI job
   that warns (not fails) if the product route JS > 180 KB gzip.
6. Verify Lighthouse thresholds locally with `pnpm dlx @lhci/cli
   autorun` and paste the summary in the PR description.

Commit as "test: e2e + a11y + SEO coverage".
```

---

## Prompt 7 — Polish pass

```
Run `specs/` end-to-end as a checklist. For each spec:

- Open the spec.
- Manually verify in the running app that every numbered rule holds.
- If a rule lacks a test, add one.
- If a rule is ambiguous, open a GitHub issue rather than guessing.

Produce a short report in `REPORT.md` listing: specs fully covered,
specs with open questions, and any tech-debt items worth revisiting.

Do NOT merge without a green CI run.
```
