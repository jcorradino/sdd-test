# Apex Laptops Storefront Constitution

## Core Principles

### I. Spec-First Development (NON-NEGOTIABLE)
Every feature begins as a specification under `specs/<NNN>-<slug>/spec.md`
before any implementation code is written. Specs describe **what** and
**why** only — no stack, schemas, or file paths. Implementation artifacts
(plan, research, data-model, contracts, tasks) are generated from the spec,
not authored in parallel. If code contradicts the spec, the spec wins;
either the code is wrong or the spec must be amended through
`/speckit.constitution` or `/speckit.specify` before proceeding.

*Rationale:* The project exists to test Spec-Driven Development. Without
spec primacy, we are just writing code with extra Markdown.

### II. Local-Only Data Sources (NON-NEGOTIABLE)
All product, review, and accessory data is loaded from files committed
under `data/` (authoritative file: `data/laptops.json`). No runtime
`fetch`, no third-party APIs, no mock servers, no environment-gated
switches to "real" endpoints. Data is validated with Zod at load time;
invalid data is a fatal boot error.

*Rationale:* The harness must run deterministically in any environment
(CI, offline demo, review worktree) without secrets or network access.

### III. Test-First Development
Contract tests, unit tests, and at least one end-to-end happy-path test
are written **before** the implementation that satisfies them. Red →
green → refactor is the required cadence. Pull requests whose first
commit contains implementation without a preceding failing test are
rejected.

*Rationale:* Tests encode the spec in executable form. Writing them first
is the only reliable way to prove the spec and the implementation agree.

### IV. Accessibility Is a Feature (WCAG 2.2 AA)
Accessibility requirements are not a final-polish checklist; they are
listed as functional requirements in every spec that adds UI. Keyboard
reachability, focus visibility, semantic landmarks, `alt` on every image,
`fieldset`/`legend` on every option group, and `prefers-reduced-motion`
handling are acceptance criteria, not nice-to-haves. Zero `axe-core`
Serious or Critical violations is a merge blocker.

*Rationale:* A Dell-grade storefront that fails a screen reader is not
shippable. Treating a11y as a feature is cheaper than retrofitting it.

### V. Type Safety at Trust Boundaries
All data crossing a trust boundary — JSON file → app, URL query →
reducer, `localStorage` → store — is parsed through a Zod schema. Schemas
live in `lib/schema.ts` and are the single source of truth for derived
TypeScript types (`z.infer`). Hand-written duplicate types are forbidden.
TypeScript is configured with `strict: true` and
`noUncheckedIndexedAccess: true`.

*Rationale:* Invariants caught at the boundary can't silently corrupt
downstream state. Sharing schema → type removes a class of drift bugs.

### VI. Performance Budget Enforcement
The product detail route ships ≤ 180 KB gzipped client JS and must hit
Lighthouse Performance ≥ 90 / Accessibility ≥ 95 / Best Practices ≥ 95 /
SEO ≥ 95 on throttled desktop. CI measures bundle size on every PR; a
regression is a failing check, not a warning. LCP element is explicitly
tagged `priority` on `next/image`.

*Rationale:* A product page that feels slow loses buyers. Budgets only
work when they block merges.

### VII. Component Primitive Reuse
UI primitives (Button, RadioGroup, Accordion, Sheet, Tooltip, Toast,
Dialog, Tabs, Badge, Card, Separator) come from shadcn/ui, which is a
thin wrapper over Radix primitives. Hand-rolled equivalents are not
permitted when a primitive exists. New primitives require a Complexity
Tracking entry in the feature's `plan.md`.

*Rationale:* Radix owns the keyboard and ARIA semantics we would
otherwise have to re-derive per component. Reuse is the a11y strategy.

## Technology Stack (Fixed)

The following stack is ratified and may only be changed by amending this
constitution:

- **Runtime:** Node.js 20 LTS, pnpm 9.
- **Framework:** Next.js 15 (App Router), React 19, TypeScript strict.
- **Styling:** Tailwind CSS v4, shadcn/ui primitives.
- **State:** Zustand with `persist` middleware for cart; pure reducers
  (`lib/configurator.ts`) for configuration state.
- **Validation:** Zod.
- **Testing:** Vitest + React Testing Library (units), Playwright +
  `@axe-core/playwright` (e2e + a11y).
- **Tooling:** ESLint (`@typescript-eslint`, `eslint-plugin-jsx-a11y`),
  Prettier, `@next/bundle-analyzer`.

Stack substitutions (e.g. Jotai → Zustand, Vite → Next) require a
constitution amendment and an updated `research.md` justifying the swap.

## Development Workflow

All feature work follows the spec-kit flow, in order:

1. `/speckit.constitution` — establish or amend principles (this file).
2. `/speckit.specify` — create `specs/<NNN>-<slug>/spec.md`.
3. `/speckit.clarify` — resolve ambiguities; update `spec.md` in place.
4. `/speckit.plan` — produce `plan.md`, `research.md`, `data-model.md`,
   `contracts/`, `quickstart.md`.
5. `/speckit.tasks` — produce `tasks.md` (ordered, parallelizable).
6. `/speckit.analyze` — consistency check across spec/plan/tasks.
7. `/speckit.implement` — execute `tasks.md` top-to-bottom.

Skipping `/speckit.clarify` is permitted only if the spec has zero
`[NEEDS CLARIFICATION]` markers. Skipping `/speckit.analyze` is permitted
only for trivial features (single user story, < 10 tasks).

Every feature works on a branch named `###-feature-slug` (the same slug
used for its `specs/` directory).

## Quality Gates

A pull request is mergeable only if all of the following pass:

- `pnpm lint` — zero errors.
- `pnpm typecheck` — zero errors.
- `pnpm test:unit` — all tests pass; coverage ≥ 80% lines for `lib/**`.
- `pnpm test:e2e` — all Playwright specs pass.
- Axe-core scan — zero Serious/Critical violations.
- Bundle size check — product route ≤ 180 KB gzipped.
- Every requirement in the feature's `spec.md` maps to at least one
  task in `tasks.md` and at least one test.

## Governance

This constitution supersedes all other practices in the repo. Any PR that
violates a NON-NEGOTIABLE principle must be closed, not amended-to-fit.

Amendments require:
1. A PR editing this file with a new version number.
2. A migration note explaining which specs, plans, or code the amendment
   affects.
3. Updates to all dependent templates (`.specify/templates/*.md`) and
   Windsurf rules (`.windsurf/rules/*.md`) in the same PR.

Versioning uses SemVer applied to governance impact:
- **MAJOR** — a NON-NEGOTIABLE principle is removed or redefined.
- **MINOR** — a new principle is added or an existing one materially
  expanded.
- **PATCH** — clarifications, typos, non-semantic wording.

**Version**: 1.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-04-24
