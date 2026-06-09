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
    ├── data-constraints.md
    ├── accessibility.md
    └── design-system.md         ← DDS color tokens (Principle VIII)

specs/
├── 001-laptop-product-page/     ← worked example, fully planned
│   ├── spec.md
│   ├── plan.md
│   ├── research.md
│   ├── data-model.md
│   ├── quickstart.md
│   ├── tasks.md
│   ├── contracts/{dataset,cart}.schema.ts, url-config.md
│   └── checklists/requirements.md
├── 002-laptop-catalog/          ← spec only; drive /speckit.clarify next
│   └── spec.md
└── 003-recently-viewed/         ← spec only; drive /speckit.clarify next
    └── spec.md

data/
└── laptops.sample.json          ← canonical sample dataset
```

## Getting started in Windsurf

See **[SETUP.md](./SETUP.md)** for a step-by-step runbook with three
suggested paths (implement the worked feature, drive the full SDD
flow, or specify something new) and copy-paste prompts for each step.

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
- **Design Tokens** — all UI color from Dell Design System role tokens
  (`design/dds-tokens.json`); no raw hex in components.

See [`.specify/memory/constitution.md`](./.specify/memory/constitution.md)
for the ratified text and amendment process.

## Features

- [`001-laptop-product-page`](./specs/001-laptop-product-page/) — fully
  planned: spec, plan, research, data-model, contracts, tasks, and
  requirements checklist. Ready for `/speckit.analyze` →
  `/speckit.implement`.
- [`002-laptop-catalog`](./specs/002-laptop-catalog/) — `/laptops`
  listing with filters, sort, and search. Spec only, with open
  `[NEEDS CLARIFICATION]` markers — exercise `/speckit.clarify` →
  `/speckit.plan` → `/speckit.tasks`.
- [`003-recently-viewed`](./specs/003-recently-viewed/) — persistent
  recently-viewed strip. Spec only, with open clarifications — small
  scope makes it a good first run through the full workflow.

`.specify/feature.json` points at the currently-active feature; update
it when you start working on a different one (or use the
`create-new-feature.sh` script to bootstrap a new one).
