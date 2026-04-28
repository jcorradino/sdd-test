---
description: Execute the task list for the active feature
auto_execution_mode: 1
---

The user wants you to implement the active feature by executing its
task list.

User input (optional — may narrow scope to specific tasks):

$ARGUMENTS

## Goal

Work through `<feature_dir>/tasks.md` top-to-bottom, producing
implementation + tests that satisfy `spec.md`. Keep the task list
checked-off as you go.

## Prerequisites

Run:

```bash
.specify/scripts/bash/check-prerequisites.sh --json --require tasks
```

## Procedure

1. **Load context**:
   - `.specify/memory/constitution.md` (non-negotiables).
   - `<feature_dir>/spec.md` (source of truth).
   - `<feature_dir>/plan.md` (structure, stack).
   - `<feature_dir>/data-model.md` and `contracts/` (exact shapes).
   - `<feature_dir>/tasks.md` (what to do, in order).

2. **Narrow scope** if `$ARGUMENTS` specifies particular task IDs,
   phases, or user stories. Otherwise execute all unchecked tasks in
   order.

3. **For each task**:
   1. Announce the task ID being started.
   2. **Write the failing test first** (Test-First principle). Run it
      and confirm it fails.
   3. Implement the minimum change to make the test pass.
   4. Run the affected test file locally: `pnpm vitest run <path>` or
      `pnpm playwright test <path>`.
   5. Run `pnpm lint` and `pnpm typecheck` if the task touched TS/TSX.
   6. Mark the task `[x]` in `tasks.md` and commit with a message of
      the form `feat(<area>): T### <short description>` (or `test:`,
      `refactor:`, etc. as appropriate).

4. **Parallel tasks**: tasks tagged `[P]` may be executed concurrently
   by launching subagents, but only within the same phase. Never cross
   phase boundaries — Foundational must finish before any Phase 3 work
   begins.

5. **Stop conditions**:
   - All tasks checked.
   - A failing quality gate you can't fix without amending the spec —
     stop and report; do not patch around it.
   - User intervention requested.

6. **Final report** at the end of the run:
   - Tasks completed / skipped / failed.
   - Lint, typecheck, unit, and e2e results.
   - Axe-core summary and Lighthouse scores if the Polish phase ran.
   - Outstanding follow-ups.

## Hard rules

- Never introduce a runtime `fetch` against an external service.
  `data/laptops.json` is the only data source (Constitution §II).
- Never skip writing the failing test first (Constitution §III).
- Never silently amend the spec. If the code needs the spec to change,
  stop and tell the user.
