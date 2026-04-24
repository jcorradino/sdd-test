---
description: Create or amend the project constitution
auto_execution_mode: 1
---

The user has asked you to update the project constitution.

User input:

$ARGUMENTS

## Goal

Produce or amend `.specify/memory/constitution.md` — the ratified set of
principles that every feature spec, plan, and PR must comply with.

## Inputs

- Existing constitution: `.specify/memory/constitution.md` (may already exist).
- Template: `.specify/templates/constitution-template.md`.
- Downstream files that may need updating:
  - `.specify/templates/spec-template.md`
  - `.specify/templates/plan-template.md`
  - `.specify/templates/tasks-template.md`
  - `.windsurf/rules/*.md`
  - Any `specs/*/plan.md` with a Constitution Check table.

## Procedure

1. **Read** the existing constitution (if present) and the
   constitution-template. Read the user input above.
2. **Draft** the amended constitution:
   - Each principle has a short memorable name, a one-paragraph body,
     and a *Rationale* sentence.
   - Mark load-bearing principles `(NON-NEGOTIABLE)`.
   - Fill in **all** bracketed placeholders. No `[…]` or `TODO` may
     remain.
   - Update the `**Version**` footer using SemVer:
     - **MAJOR** if a NON-NEGOTIABLE principle is removed or redefined.
     - **MINOR** if a principle is added or materially expanded.
     - **PATCH** for clarifications/typos only.
   - Update `Last Amended` to today's date.
3. **Ripple-check** every downstream file above. For each, either confirm
   no change is needed or list a concrete edit in a short impact report.
4. **Present** the diff and the impact report to the user for approval
   before writing.
5. On approval, write the file and commit with a message of the form
   `docs(constitution): bump to vX.Y.Z — <summary>`.

## Output

- Updated `.specify/memory/constitution.md`.
- A brief impact report describing which templates, rules, or plans
  require follow-up edits and whether you made them in the same change.
