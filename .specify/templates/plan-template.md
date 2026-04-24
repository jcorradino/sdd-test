# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Summary

[2–4 sentences: what is being built and the approach at a glance.]

## Technical Context

- **Language/Version**: TypeScript 5.x (strict)
- **Runtime**: Node.js 20 LTS
- **Primary Dependencies**: Next.js 15, React 19, Tailwind v4, shadcn/ui,
  Zustand, Zod
- **Storage**: local JSON file at `data/laptops.json` (no database)
- **Testing**: Vitest + RTL (units), Playwright + axe-core (e2e)
- **Target Platform**: modern desktop and mobile browsers (last 2 versions)
- **Project Type**: single Next.js App Router project
- **Performance Goals**: LCP < 2.5s, JS ≤ 180 KB gzip, Lighthouse ≥ 90/95/95/95
- **Constraints**: no external network calls at runtime; WCAG 2.2 AA
- **Scale/Scope**: single product family, ≤ 20 SKUs, sample review set

## Constitution Check

For each principle in `.specify/memory/constitution.md`, state compliance:

| Principle | Status | Notes |
|---|---|---|
| I. Spec-First Development | ✅ | [why] |
| II. Local-Only Data Sources | ✅ | [why] |
| III. Test-First Development | ✅ | [why] |
| IV. Accessibility Is a Feature | ✅ | [why] |
| V. Type Safety at Trust Boundaries | ✅ | [why] |
| VI. Performance Budget Enforcement | ✅ | [why] |
| VII. Component Primitive Reuse | ✅ | [why] |

Any ❌ must appear in Complexity Tracking with a justification.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature-name]/
├── spec.md
├── plan.md            ← this file
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── *.ts | *.json
├── tasks.md           ← produced by /speckit.tasks
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```
app/
├── layout.tsx
├── page.tsx
└── products/
    └── [productId]/
        └── page.tsx
components/
├── ui/                ← shadcn primitives
├── product/
│   ├── gallery.tsx
│   ├── configurator.tsx
│   ├── tech-specs.tsx
│   ├── reviews.tsx
│   └── sticky-buy-bar.tsx
└── cart/
    ├── cart-badge.tsx
    └── cart-drawer.tsx
lib/
├── data.ts            ← memoized loader
├── schema.ts          ← Zod schemas (source of truth)
├── price.ts
├── configurator.ts    ← pure reducer
└── cart.ts            ← Zustand store
data/
└── laptops.json
tests/
├── unit/              ← Vitest
└── e2e/               ← Playwright
```

**Structure Decision**: Single Next.js project; no monorepo. Rationale in
`research.md`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| [e.g. adding a new component primitive outside shadcn] | [reason] | [why the simpler path does not work] |
