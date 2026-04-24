---
description: Create a new feature specification from a user description
auto_execution_mode: 1
---

The user has asked you to specify a new feature.

User input:

$ARGUMENTS

## Goal

Produce `specs/<NNN>-<slug>/spec.md` describing **what** and **why**, not
**how**. The spec is the source of truth for all subsequent workflows.

## Prerequisites

- Constitution exists at `.specify/memory/constitution.md`.
- Working tree is clean enough to create a new branch.

## Procedure

1. **Create the feature scaffold** by running:

   ```bash
   .specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS"
   ```

   This creates branch `NNN-slug`, the `specs/NNN-slug/` directory, and
   a `spec.md` seeded from the template. Capture the returned
   `feature_dir` and `spec_file` paths.

2. **Read** `.specify/memory/constitution.md`. Every requirement you
   write must be consistent with its principles.

3. **Read** `.specify/templates/spec-template.md` to confirm the exact
   section layout you must produce.

4. **Fill out** the seeded `spec.md`:
   - Replace **all** bracketed placeholders. No `[…]` may remain.
   - Write at least one User Story at P1. Add P2/P3 stories only if the
     request warrants them.
   - Every functional requirement is observable (`MUST …`, `MUST NOT …`)
     and testable. Avoid implementation detail (no file paths, no stack
     names, no library references).
   - Where the user input is ambiguous or silent, add
     `[NEEDS CLARIFICATION: question]` markers rather than guessing.
   - Fill `Success Criteria` with measurable thresholds.
   - Fill `Out of Scope` explicitly — scope creep is the #1 failure
     mode.

5. **Self-check** against this gate before handing back control:
   - [ ] Every User Story has an Independent Test statement.
   - [ ] Every Functional Requirement is testable.
   - [ ] No implementation detail leaked into the spec.
   - [ ] Constitution principles are honored (or a `[NEEDS
         CLARIFICATION]` flags the conflict).

6. **Report** back to the user with:
   - The created branch and spec path.
   - Any `[NEEDS CLARIFICATION]` markers — recommend running
     `/speckit.clarify` next.
   - If zero clarifications needed, recommend `/speckit.plan`.
