---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- `[ID]` — `T001`, `T002`, …
- `[P?]` — append `[P]` when the task is safe to run in parallel with
  other `[P]` tasks (no shared files, no ordering dependency).
- `[Story]` — `US1`, `US2`, `US3` for tasks tied to a user story from
  the spec; omit for setup/foundation/polish tasks.

## Path Conventions

Paths are repo-relative. All implementation lives under the single
Next.js app described in `plan.md`.

## Phase 1: Setup (Shared Infrastructure)

- [ ] **T001** Scaffold Next.js + Tailwind + TypeScript project per `plan.md`.
- [ ] **T002** Add ESLint, Prettier, and CI workflow.
- [ ] **T003** Install shadcn primitives listed in `plan.md`.
- [ ] **T004** Configure Vitest and Playwright runners.

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] **T010** Write Zod schemas in `lib/schema.ts` matching `data-model.md`.
- [ ] **T011** Write failing loader tests in `tests/unit/data.test.ts`.
- [ ] **T012** Implement `lib/data.ts` until tests pass.
- [ ] **T013** Copy `data/laptops.sample.json` → `data/laptops.json`.

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

- [ ] **T020** [US1] Write failing tests for [behavior].
- [ ] **T021** [US1] Implement [component/module].
- [ ] **T022** [P] [US1] Add Playwright spec `e2e/[name].spec.ts`.

## Phase 4: User Story 2 - [Title] (Priority: P2)

- [ ] **T030** [US2] …

## Phase 5: User Story 3 - [Title] (Priority: P3)

- [ ] **T040** [US3] …

## Phase 6: Polish & Compliance

- [ ] **T090** Axe-core pass; 0 Serious/Critical.
- [ ] **T091** Lighthouse run; capture scores in PR.
- [ ] **T092** Bundle-size check ≤ 180 KB gzip.
