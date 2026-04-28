---
description: Generate an ordered, parallelizable task list from the plan
auto_execution_mode: 1
---

The user wants a task list for the active feature.

User input (optional):

$ARGUMENTS

## Goal

Produce `<feature_dir>/tasks.md` — an ordered list of atomic tasks that,
executed top-to-bottom, satisfies `spec.md` per `plan.md`.

## Prerequisites

Run:

```bash
.specify/scripts/bash/check-prerequisites.sh --json --require plan
```

Capture `feature_dir`.

## Procedure

1. **Read**:
   - `<feature_dir>/spec.md`
   - `<feature_dir>/plan.md`
   - `<feature_dir>/data-model.md`
   - every file under `<feature_dir>/contracts/`
   - `.specify/templates/tasks-template.md`

2. **Build tasks** using the template's phase structure:
   - **Phase 1 — Setup**: scaffolding, tooling, deps.
   - **Phase 2 — Foundational**: schemas, data loader, core libs. These
     MUST land before any user-story phase.
   - **Phase 3+ — User Stories**: one phase per User Story in spec, in
     priority order (P1 = MVP first). Each phase starts with failing
     tests (Test-First principle).
   - **Final phase — Polish & Compliance**: a11y, perf, bundle check.

3. **Rules for every task**:
   - Atomic — one responsibility, one place in the codebase.
   - Testable — a reviewer can tell from the task alone whether it's done.
   - Ordered — earlier tasks don't depend on later ones.
   - `[P]` only when truly parallel-safe (no shared files, no ordering
     dependency). When in doubt, omit `[P]`.
   - Tag tasks tied to a user story with `[US1]`, `[US2]`, etc.
   - Include a file path or directory in the description so the reader
     knows where the work lands.

4. **Coverage check** before finishing:
   - [ ] Every FR-### from the spec appears in at least one task.
   - [ ] Every entity in `data-model.md` has a schema task and a test
         task.
   - [ ] Every contract in `contracts/` has a corresponding
         contract-test task.
   - [ ] A Polish task exists for each NFR.

5. **Report** the task count per phase and recommend `/speckit.analyze`
   (or `/speckit.implement` if you skipped analyze for a trivial
   feature).
