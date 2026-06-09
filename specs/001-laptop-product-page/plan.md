# Implementation Plan: Cobalt Vela 15 Product Detail Page

**Branch**: `001-laptop-product-page` | **Date**: 2026-04-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-laptop-product-page/spec.md`

## Summary

A server-rendered Next.js App Router page at `/products/[productId]`
that loads a Zod-validated dataset from `data/laptops.json`, drives a
client configurator backed by a pure reducer, and persists a cart in
`localStorage` via Zustand. UI primitives come from shadcn/ui; tests
are split between Vitest unit specs and Playwright e2e flows including
an axe-core accessibility scan.

## Technical Context

- **Language/Version**: TypeScript 5.5+, strict mode,
  `noUncheckedIndexedAccess: true`.
- **Runtime**: Node.js 20 LTS, pnpm 9.
- **Primary Dependencies**: Next.js 15, React 19, Tailwind CSS v4,
  shadcn/ui (Radix), Zustand 4, Zod 3, lucide-react.
- **Storage**: local file at `data/laptops.json` for catalog data;
  `localStorage` (key `vela.cart.v1`) for the user's cart.
- **Testing**: Vitest + React Testing Library + jsdom (units);
  Playwright + `@axe-core/playwright` (e2e + a11y).
- **Target Platform**: last 2 versions of Chrome, Firefox, Safari, Edge.
- **Project Type**: single Next.js App Router project (no monorepo).
- **Performance Goals**: LCP < 2.5 s; product-route JS ≤ 180 KB gzip;
  Lighthouse ≥ 90/95/95/95 (Perf/A11y/BP/SEO).
- **Constraints**: no runtime fetch to external services; WCAG 2.2 AA;
  zero axe-core Serious/Critical findings.
- **Scale/Scope**: 1 product family in this milestone, sample review
  set of ≤ 50 entries; designed to scale to ~50 products without
  architectural change.

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Spec-First Development | ✅ | All requirements trace to `spec.md`; no implementation choice predates it. |
| II. Local-Only Data Sources | ✅ | Data loaded from `data/laptops.json` via memoized `getDataset()`; no `fetch` to external services. |
| III. Test-First Development | ✅ | `tasks.md` interleaves a failing-test task before each implementation task. |
| IV. Accessibility Is a Feature | ✅ | NFR-001/002 listed in spec; axe scan blocks merge; primitives sourced from Radix-backed shadcn. |
| V. Type Safety at Trust Boundaries | ✅ | Zod schemas in `lib/schema.ts`; types via `z.infer`; URL/storage/JSON all parsed at the boundary. |
| VI. Performance Budget Enforcement | ✅ | NFR-003/004; CI runs `@next/bundle-analyzer` and Lighthouse. |
| VII. Component Primitive Reuse | ✅ | All listed primitives map to existing shadcn components; no hand-rolled equivalents planned. |
| VIII. Brand & Design-Token Fidelity | ✅ | UI color comes from DDS role tokens in `design/dds-tokens.json` wired into the shadcn theme; product `swatch` values stay data-only. No raw hex in components. |

No principle violations — Complexity Tracking is empty.

## Success Criteria Measurement

Every Success Criterion in `spec.md` is paired here with the concrete
measurement that verifies it. If a row's methodology cannot be
implemented as listed, this table — and the corresponding tasks in
`tasks.md` — must be amended before `/speckit.implement` runs.

| SC | Threshold | Methodology | Verified in | Task |
|---|---|---|---|---|
| SC-001 | ≤ 4 user-observable interactions from page load to cart-added toast | Playwright e2e instruments `page.on('console')` + click counters; the test asserts the toast becomes visible within 4 user inputs (click or `Enter`) starting at `page.goto` | `tests/e2e/configure-and-add-to-cart.spec.ts` | T031, T096 |
| SC-002 | Price redraw ≤ 100 ms (p95) after a selection input event | Vitest perf test renders `<Configurator>` via RTL, fires `userEvent.click` on a non-default option, measures `performance.now()` between the event and the next paint via `findByText(price)`; runs 50 iterations, asserts p95 ≤ 100 ms on the CI runner | `tests/unit/configurator-perf.test.ts` | T097 |
| SC-003 | Lighthouse desktop ≥ 90/95/95/95 (Perf/A11y/BP/SEO) | `@lhci/cli autorun` against a production build of `/products/vela-15`; thresholds declared in `.lighthouserc.json`; CI fails on regression | `.github/workflows/ci.yml` (`lighthouse` job) | T094 |
| SC-004 | Zero axe-core Serious/Critical findings on `/products/vela-15` | `@axe-core/playwright` scan on the production build; assertion fails if any violation has `impact === "serious"` or `"critical"` | `tests/e2e/accessibility.spec.ts` | T093 |
| SC-005 | Product-route client JS ≤ 180 KB gzipped | `@next/bundle-analyzer` JSON output parsed by `scripts/check-bundle-size.mjs`; CI step compares the `app/products/[productId]` route-group entry to the threshold and fails on overage | `.github/workflows/ci.yml` (`bundle-size` job) | T092 |
| SC-006 | 100 % of FRs map to ≥ 1 automated test | Vitest test (`coverage.test.ts`) extracts every `FR-###` ID from `spec.md`, then `grep`s the `tests/` tree; the assertion fails listing any FR without a matching reference. Runs as part of `pnpm test:unit`, not as a CI-only step | `tests/unit/coverage.test.ts` | T095 |

Operational notes:

- The Lighthouse and bundle-size jobs run against a production build
  (`pnpm build && pnpm start`), not `pnpm dev` — dev-mode bundles and
  unminified assets distort both metrics.
- The configurator perf test runs in CI on the standard runner; if
  CI noise produces flakes, raise the iteration count first and the
  threshold last (the threshold is a Constitution-adjacent commitment).
- SC-006's grep-based coverage check is intentionally cheap: it
  enforces *traceability*, not depth. Test depth is enforced by the
  per-task quality gates already listed above.

## Project Structure

### Documentation (this feature)

```
specs/001-laptop-product-page/
├── spec.md
├── plan.md                  ← this file
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── dataset.schema.ts    ← Zod schemas (canonical)
│   ├── cart.schema.ts       ← persisted cart shape v1
│   └── url-config.md        ← URL ?c= encoding contract
├── tasks.md                 ← produced by /speckit.tasks
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```
app/
├── layout.tsx
├── page.tsx                       ← redirects to /products/vela-15
└── products/
    └── [productId]/
        ├── page.tsx               ← server component, generateStaticParams
        ├── opengraph-image.tsx
        └── _components/
            ├── hero.tsx           ← server shell
            ├── gallery.tsx        ← client
            ├── configurator.tsx   ← client, uses lib/configurator
            ├── tech-specs.tsx
            ├── reviews.tsx
            ├── accessories.tsx
            └── sticky-buy-bar.tsx
components/
├── ui/                            ← shadcn primitives
└── cart/
    ├── cart-badge.tsx
    └── cart-drawer.tsx
lib/
├── data.ts                        ← memoized dataset loader
├── schema.ts                      ← Zod schemas (source of truth)
├── price.ts                       ← Intl currency formatter
├── configurator.ts                ← pure reducer + selectors
├── cart.ts                        ← Zustand store + persist
└── seo.ts                         ← JSON-LD Product builder
data/
├── laptops.json                   ← canonical dataset
└── laptops.sample.json            ← committed reference
public/images/vela-15/
tests/
├── unit/
│   ├── data.test.ts
│   ├── price.test.ts
│   ├── configurator.test.ts
│   ├── cart.test.ts
│   └── seo.test.ts
└── e2e/
    ├── configure-and-add-to-cart.spec.ts
    ├── compatibility-auto-reset.spec.ts
    ├── reviews-and-specs.spec.ts
    ├── share-config-url.spec.ts
    └── accessibility.spec.ts
.github/workflows/
└── ci.yml
```

**Structure Decision**: Single Next.js project. A monorepo or split
package boundary is not justified for one product page; revisit if a
second surface (e.g. compare, search) is added.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *(none)* | — | — |
