---
description: Cross-check consistency across spec, plan, and tasks
auto_execution_mode: 1
---

The user wants a consistency audit of the active feature before
implementation begins.

User input (optional):

$ARGUMENTS

## Goal

Produce a short report that either unblocks `/speckit.implement` or
lists concrete fix-ups.

## Prerequisites

Run:

```bash
.specify/scripts/bash/check-prerequisites.sh --json --require tasks
```

## Procedure

1. **Read** in order:
   - `.specify/memory/constitution.md`
   - `<feature_dir>/spec.md`
   - `<feature_dir>/plan.md`
   - `<feature_dir>/data-model.md`
   - every file under `<feature_dir>/contracts/`
   - `<feature_dir>/tasks.md`

2. **Check** (do not modify anything yet):

   **A. Spec ↔ Plan coverage**
   - Every FR-### in `spec.md` is addressed by at least one element
     of `plan.md` (Technical Context, component list, or Complexity
     Tracking row).
   - Every Success Criterion has a concrete measurement plan.

   **B. Plan ↔ Tasks coverage**
   - Every entity in `data-model.md` has a schema + test task.
   - Every contract has a corresponding contract-test task.
   - Every NFR from the spec has a Polish task.

   **C. Constitution compliance**
   - Every principle has a row in `plan.md`'s Constitution Check.
   - No NON-NEGOTIABLE principle is marked ❌ without a
     Complexity Tracking entry (and those entries are never "we'll
     revisit later" — they must justify the violation today).

   **D. Ordering**
   - No user-story task depends on a later user-story task.
   - All Phase 2 Foundational tasks precede Phase 3.
   - `[P]` tags are valid (no shared-file conflicts).

   **E. Residual ambiguity**
   - No `[NEEDS CLARIFICATION]` markers remain anywhere.

3. **Report** a Markdown table of findings:

   | Severity | Area | Issue | Recommendation |
   |---|---|---|---|
   | blocker | … | … | … |
   | warning | … | … | … |
   | info | … | … | … |

   Severity definitions:
   - **blocker** — do not run `/speckit.implement` until resolved.
   - **warning** — safe to proceed but flag in PR description.
   - **info** — nice-to-fix.

4. **Do not edit** spec/plan/tasks in this workflow — recommend the
   user re-run the appropriate upstream command (`/speckit.specify`,
   `/speckit.plan`, `/speckit.tasks`) for each blocker.

5. If zero blockers, recommend `/speckit.implement`.
