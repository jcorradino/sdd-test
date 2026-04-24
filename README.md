# Apex Laptops Storefront — Windsurf SDD Sandbox

A Spec-Driven Development project laid out for [Windsurf](https://windsurf.com)
using the [spec-kit](https://github.com/github/spec-kit) conventions.
The product under spec is a **Dell-style configurable laptop product
detail page** (the fictional "Dell Apex 15"), built entirely from a
local JSON dataset — no external network calls.

## Repository layout

```
.specify/
├── memory/
│   └── constitution.md          ← ratified principles (v1.0.0)
├── templates/
│   ├── constitution-template.md
│   ├── spec-template.md
│   ├── plan-template.md
│   ├── tasks-template.md
│   └── checklist-template.md
├── scripts/bash/
│   ├── common.sh
│   ├── create-new-feature.sh
│   ├── setup-plan.sh
│   └── check-prerequisites.sh
└── feature.json                 ← pointer to the active feature

.windsurf/
├── workflows/                   ← Windsurf slash commands
│   ├── speckit.constitution.md
│   ├── speckit.specify.md
│   ├── speckit.clarify.md
│   ├── speckit.plan.md
│   ├── speckit.tasks.md
│   ├── speckit.analyze.md
│   └── speckit.implement.md
└── rules/
    ├── specify-rules.md         ← managed pointer to active plan
    ├── sdd-workflow.md
    ├── stack-constraints.md
    └── data-constraints.md

specs/
└── 001-laptop-product-page/
    ├── spec.md
    ├── plan.md
    ├── research.md
    ├── data-model.md
    ├── quickstart.md
    ├── tasks.md
    ├── contracts/
    │   ├── dataset.schema.ts
    │   ├── cart.schema.ts
    │   └── url-config.md
    └── checklists/
        └── requirements.md

data/
└── laptops.sample.json          ← canonical sample dataset
```

## Workflow (per feature)

In Windsurf, run these slash commands in order:

1. `/speckit.constitution` — only when amending principles.
2. `/speckit.specify "<one-line feature description>"` — creates a
   `NNN-slug` branch and `specs/NNN-slug/spec.md`.
3. `/speckit.clarify` — drives the spec to zero `[NEEDS CLARIFICATION]`.
4. `/speckit.plan` — produces `plan.md`, `research.md`, `data-model.md`,
   `contracts/`, `quickstart.md`.
5. `/speckit.tasks` — produces `tasks.md`.
6. `/speckit.analyze` — consistency cross-check.
7. `/speckit.implement` — executes `tasks.md` top-to-bottom, test-first.

## Hard constraints (Constitution)

- **Spec-First** — no implementation before its task + failing test exist.
- **Local-Only Data** — `data/laptops.json` is the only data source.
- **Test-First** — red → green → refactor; failing test commits
  precede implementation commits.
- **Accessibility** — WCAG 2.2 AA; zero axe-core Serious/Critical
  findings.
- **Type Safety** — Zod is the source of truth at every trust boundary.
- **Performance Budget** — product route ≤ 180 KB gzip;
  Lighthouse ≥ 90/95/95/95.
- **Component Reuse** — shadcn/ui (Radix) primitives; no hand-rolled
  equivalents.

See [`.specify/memory/constitution.md`](./.specify/memory/constitution.md)
for the ratified text and amendment process.

## Active feature

[`specs/001-laptop-product-page/`](./specs/001-laptop-product-page/) —
spec is drafted, plan + tasks are ready. Run `/speckit.analyze` followed
by `/speckit.implement` to build it.
