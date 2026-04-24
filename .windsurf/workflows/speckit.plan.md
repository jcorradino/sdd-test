---
description: Produce the implementation plan and supporting design docs
auto_execution_mode: 1
---

The user wants an implementation plan for the active feature.

User input (optional):

$ARGUMENTS

## Goal

Translate `spec.md` into an implementation plan plus supporting design
documents (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`).

## Prerequisites

Run:

```bash
.specify/scripts/bash/check-prerequisites.sh --json --require spec
.specify/scripts/bash/setup-plan.sh --json
```

This seeds `plan.md`, `research.md`, `data-model.md`, and `quickstart.md`
from templates if they don't yet exist. Capture `feature_dir`.

## Procedure

1. **Read in order**:
   - `.specify/memory/constitution.md`
   - `<feature_dir>/spec.md`
   - `.specify/templates/plan-template.md`
   - The `specify-rules` file at `.windsurf/rules/specify-rules.md` plus
     any stack rules in `.windsurf/rules/`.

2. **Fill `plan.md`**:
   - `Summary` — 2–4 sentences.
   - `Technical Context` — concrete values, no `NEEDS DECIDING`.
   - `Constitution Check` — one row per principle with ✅ or ❌ plus a
     short note. Every ❌ must appear in Complexity Tracking below.
   - `Project Structure` — list actual source directories the feature
     will touch.
   - `Complexity Tracking` — only populated if there is a violation.

3. **Produce `research.md`**: document stack decisions and the
   alternatives rejected, one section per decision. Each decision
   explicitly references the constitutional principle that justifies it.

4. **Produce `data-model.md`**: every entity from the spec's
   `Key Entities` section, with fields, types, invariants, and
   relationships. This file is the reference the implementation must
   mirror in `lib/schema.ts`.

5. **Produce `contracts/`**: for each user-facing contract (page props,
   URL query, persisted store shape), create a `.ts` or `.json` file
   capturing the exact shape. These contracts are the first thing
   implementation tests should pin.

6. **Produce `quickstart.md`**: a runnable recipe — `pnpm i`, `pnpm dev`,
   the URL to open, and the minimum interaction that exercises the
   MVP user story.

7. **Self-check**:
   - [ ] Every `FR-###` in the spec maps to at least one entity, contract,
         or section of the plan.
   - [ ] Every principle in the constitution has a ✅/❌ row.
   - [ ] No `[…]` placeholders remain in any produced file.

8. **Report** the produced files and recommend `/speckit.tasks` next.
