---
trigger: always_on
---

# Spec-Driven Development Workflow

This repository uses **Spec-Driven Development** via spec-kit. All
non-trivial work follows this workflow in order:

1. `/speckit.constitution` — amend `.specify/memory/constitution.md`
   (rare; only when principles change).
2. `/speckit.specify "<feature description>"` — create a new feature
   branch `NNN-slug` and `specs/NNN-slug/spec.md`.
3. `/speckit.clarify` — resolve every `[NEEDS CLARIFICATION]` marker.
4. `/speckit.plan` — produce `plan.md`, `research.md`, `data-model.md`,
   `contracts/`, `quickstart.md`.
5. `/speckit.tasks` — produce `tasks.md`.
6. `/speckit.analyze` — cross-check consistency.
7. `/speckit.implement` — execute `tasks.md` top-to-bottom.

## Hard rules

- **Do not** write implementation code before the corresponding task
  exists in `tasks.md` and its failing test has been committed.
- **Do not** edit `spec.md` during `/speckit.plan` or later — if the
  spec is wrong, loop back to `/speckit.specify` or `/speckit.clarify`.
- **Do not** introduce stack changes (new libraries, frameworks) without
  recording the decision in the feature's `research.md` and confirming
  it does not violate the constitution.
- Commits happen **per task**, with messages like `feat(area): T### …`.
  Never bundle unrelated tasks in one commit.
- Branch names mirror the feature directory: branch `001-laptop-product-page`
  → `specs/001-laptop-product-page/`.

## When something looks off

If code and spec disagree, stop and ask the user — never silently drift.
If a constitution principle seems to block legitimate work, raise it as
a potential amendment via `/speckit.constitution` rather than ignoring
it.
