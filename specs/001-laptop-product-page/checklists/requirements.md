# Requirements Checklist — 001-laptop-product-page

**Feature**: `specs/001-laptop-product-page/`
**Generated**: 2026-04-24

Use this checklist during `/speckit.analyze` and again at PR review.
Each item references a Functional or Non-Functional Requirement from
`spec.md` and the Task ID(s) that satisfy it.

## Functional coverage

- [ ] **CHK001** FR-001 — `/products/<id>` route renders for every
      product; unknown id returns 404. *(T026)*
- [ ] **CHK002** FR-002 — Hero shows name, tagline, ≥ 3 images with
      non-empty alt, rating, count, starting price. *(T026, T031)*
- [ ] **CHK003** FR-003 — Configurator renders one group per
      configurable component with all options + price deltas.
      *(T022, T023, T027)*
- [ ] **CHK004** FR-004 — Price recomputes on every selection change
      using `Intl.NumberFormat`. *(T020, T021, T023, T031)*
- [ ] **CHK005** FR-005 — OOS options non-selectable; "Add to Cart"
      disabled when any selection is OOS. *(T022, T027, T030)*
- [ ] **CHK006** FR-006 — Conflict auto-resets the other group to
      default and surfaces a toast. *(T023, T027, T032)*
- [ ] **CHK007** FR-007 — Spec sections rendered in canonical order;
      desktop table / mobile accordion. *(T040, T041)*
- [ ] **CHK008** FR-008 — "Reflects your configuration" banner
      updates reactively. *(T040, T041)*
- [ ] **CHK009** FR-009 — Reviews summary, distribution, list,
      sort, single-select rating filter. *(T042, T043, T045)*
- [ ] **CHK010** FR-010 — Reviews empty-state hides sort/filter.
      *(T042, T043)*
- [ ] **CHK011** FR-011 — Accessories strip rendered iff at least one
      accessory lists this product. *(T044)*
- [ ] **CHK012** FR-012 — Add-to-cart appends or increments,
      capped at 5. *(T024, T025, T030)*
- [ ] **CHK013** FR-013 — Cart persists across reloads. *(T025, T031)*
- [ ] **CHK014** FR-014 — Sticky buy bar appears post-hero. *(T028)*
- [ ] **CHK015** FR-015 — Cart badge + drawer with line controls. *(T029)*
- [ ] **CHK016** FR-016 — URL `?c=` round-trips configuration; bad
      tokens fall back. *(T050, T051, T052, T053)*
- [ ] **CHK017** FR-017 — Unknown productId returns 404. *(T026)*

## Non-functional coverage

- [ ] **CHK020** NFR-001 — Keyboard reachable, focus visible.
      *(T093, manual review)*
- [ ] **CHK021** NFR-002 — Zero axe Serious/Critical. *(T093)*
- [ ] **CHK022** NFR-003 — Lighthouse ≥ 90/95/95/95. *(T094)*
- [ ] **CHK023** NFR-004 — Product-route JS ≤ 180 KB gzip. *(T092)*
- [ ] **CHK024** NFR-005 — No external runtime fetch. *(T011, T012)*
- [ ] **CHK025** NFR-006 — `prefers-reduced-motion` honored. *(T028, T093)*
- [ ] **CHK026** NFR-007 — Valid JSON-LD Product. *(T090)*

## Success Criteria measurement

- [ ] **CHK027** SC-001 — ≤ 4 interactions from load to cart toast,
      enforced by an e2e click counter. *(T031, T096)*
- [ ] **CHK028** SC-002 — Price redraw p95 ≤ 100 ms across 50
      iterations. *(T097)*
- [ ] **CHK029** SC-003 — Lighthouse ≥ 90/95/95/95 enforced by
      `.lighthouserc.json` assertions. *(T094)*
- [ ] **CHK030** SC-004 — Zero axe Serious/Critical, enforced by
      Playwright spec. *(T093)*
- [ ] **CHK031** SC-005 — Bundle ≤ 180 KB gzip, enforced by CI parse
      of `@next/bundle-analyzer` JSON. *(T092)*
- [ ] **CHK032** SC-006 — Every FR-### has ≥ 1 test reference,
      enforced by `coverage.test.ts`. *(T095)*

## Constitution compliance

- [ ] **CHK033** Spec written before any implementation code landed.
- [ ] **CHK034** No `fetch` to external services in any source file.
- [ ] **CHK035** Each implementation task has a preceding failing-test
      task in `tasks.md`.
- [ ] **CHK036** All boundary types derived from Zod via `z.infer`.
- [ ] **CHK037** Every UI primitive used exists in shadcn/ui;
      no hand-rolled equivalents.

## Quality gates (PR-level)

- [ ] **CHK040** `pnpm lint` clean.
- [ ] **CHK041** `pnpm typecheck` clean.
- [ ] **CHK042** `pnpm test:unit` clean; `lib/**` coverage ≥ 80%.
- [ ] **CHK043** `pnpm test:e2e` clean.
- [ ] **CHK044** Bundle size measured and within budget.
- [ ] **CHK045** Lighthouse scores captured in PR description.
