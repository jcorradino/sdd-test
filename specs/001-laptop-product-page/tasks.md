---
description: "Task list for 001-laptop-product-page"
---

# Tasks: Cobalt Vela 15 Product Detail Page

**Input**: Design documents from `/specs/001-laptop-product-page/`
**Prerequisites**: spec.md, plan.md, data-model.md, contracts/, research.md

## Format: `[ID] [P?] [Story] Description`

- `[P]` — safe to run in parallel with other `[P]` tasks in the same phase.
- `[USn]` — tied to User Story n in `spec.md`.

## Path Conventions

Repo-relative. Single Next.js project. Source tree per `plan.md`.

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] **T001** Initialize Next.js 15 + TypeScript + Tailwind v4 in
      repo root using pnpm. Commit `.nvmrc` pinned to Node 20 LTS.
- [ ] **T002** Configure TypeScript strict mode + `noUncheckedIndexedAccess`
      in `tsconfig.json`.
- [ ] **T003** [P] Install ESLint with `@typescript-eslint`,
      `eslint-plugin-react`, `eslint-plugin-jsx-a11y`; Prettier via
      `eslint-config-prettier`. Add `pnpm lint` script.
- [ ] **T004** [P] Install runtime deps: `zod`, `zustand`,
      `lucide-react`, `class-variance-authority`, `clsx`,
      `tailwind-merge`.
- [ ] **T005** [P] Install and `init` shadcn/ui. Generate primitives:
      `button`, `badge`, `card`, `separator`, `radio-group`,
      `accordion`, `tabs`, `sheet`, `dialog`, `tooltip`, `toast`.
- [ ] **T006** [P] Install Vitest + `@testing-library/react` + jsdom;
      add `pnpm test:unit` script and a sanity test that asserts
      `1 + 1 === 2`.
- [ ] **T007** [P] Install Playwright + `@axe-core/playwright`; add
      `pnpm test:e2e` script and a placeholder spec that asserts
      `/` returns 200.
- [ ] **T008** Add `.github/workflows/ci.yml` running `lint`,
      `typecheck`, `test:unit`, `test:e2e` jobs in parallel on PR.

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] **T010** Copy `specs/001-laptop-product-page/contracts/dataset.schema.ts`
      to `lib/schema.ts` (verbatim). Re-export types via `z.infer`.
- [ ] **T011** Write failing tests in `tests/unit/data.test.ts`
      covering: happy-path load, zero-default group throws,
      asymmetric `incompatibleWith` throws, duplicate SKU throws,
      reviews key matching unknown product throws.
- [ ] **T012** Implement `lib/data.ts` exporting memoized
      `getDataset(): Promise<Dataset>` that reads
      `data/laptops.json` with `fs/promises` and validates with the
      Zod `Dataset` schema until T011 passes.
- [ ] **T013** Copy `specs/001-laptop-product-page/contracts/cart.schema.ts`
      to `lib/cart-schema.ts` (verbatim).
- [ ] **T014** Promote `data/laptops.sample.json` → `data/laptops.json`
      (commit both; `sample` remains as the canonical reference).

## Phase 3: User Story 1 - Configure & Add to Cart (Priority: P1) 🎯 MVP

- [ ] **T020** [US1] Write failing tests in
      `tests/unit/price.test.ts` for `formatPrice`: `$1,899.00`,
      `Included` for 0, U+2212 minus for negatives, USD default.
- [ ] **T021** [US1] Implement `lib/price.ts`.
- [ ] **T022** [US1] Write failing tests in
      `tests/unit/configurator.test.ts` covering every rule in
      spec FR-003..FR-006: deterministic initial state, single-group
      updates, out-of-stock rejection, auto-reset on conflict
      (and the returned reset-event shape).
- [ ] **T023** [US1] Implement `lib/configurator.ts` (pure reducer +
      `initialState`, `configuredPrice`, `configuredSku`, `allInStock`).
- [ ] **T024** [US1] Write failing tests in `tests/unit/cart.test.ts`:
      add → new line; same SKU → quantity++; quantity capped at 5;
      schema-version mismatch silently resets.
- [ ] **T025** [US1] Implement `lib/cart.ts` (Zustand + `persist`),
      wrap `localStorage` access in try/catch.
- [ ] **T026** [US1] Build `app/products/[productId]/page.tsx`
      (server component) with `generateStaticParams` over
      `dataset.products`. Render hero shell + child components.
- [ ] **T027** [US1] Build `app/products/[productId]/_components/configurator.tsx`
      (client) wired to `lib/configurator.ts` via `useReducer`.
- [ ] **T028** [US1] Build `app/products/[productId]/_components/sticky-buy-bar.tsx`
      reading from the same configurator state via context.
- [ ] **T029** [US1] Build `components/cart/cart-badge.tsx` and
      `components/cart/cart-drawer.tsx` (shadcn `Sheet`).
- [ ] **T030** [US1] Wire "Add to Cart" in hero + sticky bar to
      `useCart().add`; show toast with Undo action.
- [ ] **T031** [P] [US1] Write Playwright spec
      `tests/e2e/configure-and-add-to-cart.spec.ts` covering
      acceptance scenarios 1–3 of US1 (price update, add → toast,
      reload → persistence).
- [ ] **T032** [P] [US1] Write Playwright spec
      `tests/e2e/compatibility-auto-reset.spec.ts` covering
      acceptance scenario 4 (auto-reset toast).

## Phase 4: User Story 2 - Evaluate Specs & Reviews (Priority: P2)

- [ ] **T040** [US2] Write failing tests for
      `app/products/[productId]/_components/tech-specs.tsx`:
      sticky nav on desktop, accordion on mobile (matchMedia mock),
      "Reflects your configuration" banner updates.
- [ ] **T041** [US2] Implement `tech-specs.tsx`.
- [ ] **T042** [US2] Write failing tests for
      `app/products/[productId]/_components/reviews.tsx`:
      summary, distribution, sort dropdown, rating-filter chips,
      "Show more" pagination, empty-state hides controls.
- [ ] **T043** [US2] Implement `reviews.tsx`.
- [ ] **T044** [US2] Implement
      `app/products/[productId]/_components/accessories.tsx`
      (horizontal card strip, hidden when no compatible accessories).
- [ ] **T045** [P] [US2] Write Playwright spec
      `tests/e2e/reviews-and-specs.spec.ts` exercising US2 scenarios.

## Phase 5: User Story 3 - Share Configured URL (Priority: P3)

- [ ] **T050** [US3] Write failing tests for
      `lib/url-config.ts` (`encode(state)` and `parse(query, product)`),
      including malformed-input fallback per the URL-config contract.
- [ ] **T051** [US3] Implement `lib/url-config.ts`.
- [ ] **T052** [US3] Wire encode/parse into the configurator: parse
      on server render, encode (debounced 150 ms, `router.replace`)
      on selection change.
- [ ] **T053** [P] [US3] Write Playwright spec
      `tests/e2e/share-config-url.spec.ts` covering US3 scenarios.

## Phase 6: Polish & Compliance

- [ ] **T090** Implement `lib/seo.ts` JSON-LD `Product` builder;
      embed via `<script type="application/ld+json">` in the page.
      Snapshot test the output for `vela-15`.
- [ ] **T091** Set `<title>` and `<meta name="description">` per
      NFR-007 / spec FR / SEO targets.
- [ ] **T092** Add `@next/bundle-analyzer` behind `ANALYZE=true`.
      CI job warns when product-route JS exceeds 180 KB gzip
      (warning-only until baseline is captured).
- [ ] **T093** Write `tests/e2e/accessibility.spec.ts` running
      `@axe-core/playwright` on `/products/vela-15`; assert zero
      Serious / Critical findings.
- [ ] **T094** Run Lighthouse via `@lhci/cli`; capture scores in PR
      description. Fix until ≥ 90/95/95/95.
- [ ] **T095** Implement `tests/unit/coverage.test.ts`: parse
      `spec.md` for every `FR-###` ID, grep the `tests/` tree, assert
      each ID is referenced in at least one test file. Failures must
      list the missing IDs. Runs as part of `pnpm test:unit`.
- [ ] **T096** [US1] Extend `tests/e2e/configure-and-add-to-cart.spec.ts`
      with an SC-001 assertion: count user-observable interactions
      (clicks, `Enter` keypresses) between `page.goto` and the visible
      "Added to cart" toast; fail if > 4.
- [ ] **T097** [US1] Implement `tests/unit/configurator-perf.test.ts`:
      mount `<Configurator>` via RTL, fire `userEvent.click` on a
      non-default option, measure elapsed time until the new price
      is queryable via `findByText`; run 50 iterations and assert
      p95 ≤ 100 ms (SC-002).

---

## Coverage map (FR → tasks)

| Requirement | Tasks |
|---|---|
| FR-001 | T026 |
| FR-002 | T026, T031 |
| FR-003 | T022, T023, T027 |
| FR-004 | T020, T021, T023, T031 |
| FR-005 | T022, T027, T030 |
| FR-006 | T022, T023, T027, T032 |
| FR-007 | T040, T041 |
| FR-008 | T040, T041 |
| FR-009 | T042, T043, T045 |
| FR-010 | T042, T043 |
| FR-011 | T044 |
| FR-012 | T024, T025, T030 |
| FR-013 | T025, T031 |
| FR-014 | T028 |
| FR-015 | T029 |
| FR-016 | T050, T051, T052, T053 |
| FR-017 | T026 |
| NFR-001..002 | T093 |
| NFR-003 | T094 |
| NFR-004 | T092 |
| NFR-005 | T011, T012 |
| NFR-006 | T028 (sticky bar), T093 |
| NFR-007 | T090 |
| SC-001 | T031, T096 |
| SC-002 | T097 |
| SC-003 | T094 |
| SC-004 | T093 |
| SC-005 | T092 |
| SC-006 | T095 |
