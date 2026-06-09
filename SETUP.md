# SETUP — Running this project in Windsurf

A runbook for driving the spec-kit workflows in Windsurf, in the order
Cascade expects them. Three paths are described below — pick the one
that matches what you want to test.

---

## 0. Prerequisites

- **Windsurf** installed and signed in.
- **Node.js 20 LTS** and **pnpm 9**:
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```
- Repo cloned locally, e.g.:
  ```bash
  git clone <repo-url> sdd-test
  cd sdd-test
  ```

> Don't run `pnpm install` yet. The Next.js project is scaffolded by
> `/speckit.implement` on its first run (Phase 1 of `tasks.md`).

---

## 1. Open the project in Windsurf

`File → Open Folder…` → select the repo root.

Windsurf scans `.windsurf/workflows/` and `.windsurf/rules/`
automatically when the workspace opens.

### Sanity-check the slash commands

Open Cascade and type `/`. The picker should list:

- `/speckit.constitution`
- `/speckit.specify`
- `/speckit.clarify`
- `/speckit.plan`
- `/speckit.tasks`
- `/speckit.analyze`
- `/speckit.implement`

If they aren't there, restart Windsurf — the workflows folder is read
at workspace open. If they're still missing, check the YAML
frontmatter at the top of each `.windsurf/workflows/speckit.*.md` for
typos.

### Sanity-check the rules

In the Cascade rules panel, confirm these five always-on rules load
without errors:

- `accessibility`
- `data-constraints`
- `design-system`
- `sdd-workflow`
- `specify-rules`
- `stack-constraints`

---

## 2. Pick a path

| Path | Goal | Time |
|---|---|---|
| **A** | Implement the already-planned feature `001` end-to-end | ~30–60 min |
| **B** | Drive feature `003` through the full SDD flow (clarify → implement) | ~60–90 min |
| **C** | Specify and implement a brand-new feature | open-ended |

Most users should run **Path A first** to see the agent produce real
code, then **Path B** to exercise the full workflow.

---

## Path A — Implement the worked feature (001-laptop-product-page)

This feature already has `spec.md`, `plan.md`, `research.md`,
`data-model.md`, `contracts/`, `tasks.md`, and a requirements
checklist. Cascade just needs to analyze and implement.

### A.1. Point the active-feature pointer

Open `.specify/feature.json` and confirm:

```json
{ "feature_directory": "specs/001-laptop-product-page" }
```

(It already ships pointing at 001; only edit if you switched paths
earlier.)

### A.2. Cross-check the package

In Cascade, paste:

```
/speckit.analyze
```

**Expect:** a Markdown table of findings. With the repo as shipped,
all rows should be `info`-severity or the table should be empty.
A `blocker` row means upstream artifacts (spec/plan/tasks) disagree —
fix the named file before continuing.

### A.3. Implement, top-to-bottom

```
/speckit.implement
```

**Expect:** Cascade walks `tasks.md` in order:

- **Phase 1** scaffolds Next.js, Tailwind, ESLint, Vitest, Playwright,
  CI workflow.
- **Phase 2** writes Zod schemas and the validating loader **with
  failing tests committed first**, then the implementation.
- **Phases 3–5** build the configurator, cart, tech-specs, reviews,
  accessories, sticky bar, and URL sync — each phase test-first.
- **Phase 6** adds JSON-LD, axe-core, Lighthouse, and bundle-size
  checks.

Each task lands as its own commit (`feat(area): T### …`).

### A.4. Narrow the scope (optional)

If you don't want a 60-minute run, scope the implementation:

```
/speckit.implement Only Phase 1 and Phase 2. Stop before Phase 3.
```

or

```
/speckit.implement Run T001 through T012, then hand back control.
```

The text after the slash command becomes `$ARGUMENTS` inside the
workflow.

### A.5. Verify

```bash
pnpm install      # if not already done by Phase 1
pnpm dev
# open http://localhost:3000/products/apex-15
```

Run every quality gate:

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
```

All four should be clean. If any fail, follow the failing-test trace
back to the responsible task and either fix the implementation or
flag the spec for amendment via `/speckit.specify` (don't silently
edit `spec.md`).

---

## Path B — Full SDD flow on 003-recently-viewed

The smaller feature with three open `[NEEDS CLARIFICATION]` markers.
Best path for exercising the whole workflow chain.

### B.1. Switch to the feature

```bash
git checkout -b 003-recently-viewed
```

Then update `.specify/feature.json`:

```json
{ "feature_directory": "specs/003-recently-viewed" }
```

### B.2. Resolve open questions

```
/speckit.clarify
```

**Expect:** Cascade asks one question at a time, drawn from the
`[NEEDS CLARIFICATION]` markers in `spec.md`. After each answer it
rewrites the spec in place and appends a line to `## Clarifications`.

Stop when zero markers remain.

### B.3. Produce the plan + supporting docs

```
/speckit.plan
```

**Expect:** Cascade creates `plan.md`, `research.md`, `data-model.md`,
`contracts/`, and `quickstart.md` inside
`specs/003-recently-viewed/`. Every constitution principle gets a
✅/❌ row in `plan.md`'s Constitution Check table.

### B.4. Generate the task list

```
/speckit.tasks
```

**Expect:** an ordered, phased `tasks.md` with `[P]` markers on
parallel-safe tasks and `[USn]` tags tying each task to a user story.

### B.5. Audit consistency

```
/speckit.analyze
```

**Expect:** a findings table. Resolve any `blocker` rows by re-running
the upstream command (`/speckit.specify`, `/speckit.plan`, or
`/speckit.tasks`) — never patch over a blocker by editing the
artifact directly.

### B.6. Implement

```
/speckit.implement
```

Same cadence as Path A.5. Tests first, commit per task, gates green.

---

## Path C — Brand-new feature

```
/speckit.specify <one-line feature description>
```

Example:

```
/speckit.specify Side-by-side compare drawer that lets a shopper compare up to three configured laptops, persisted to localStorage and shareable via URL.
```

**Expect:** the `create-new-feature.sh` script:

1. Picks the next free `NNN-` prefix.
2. Creates branch `NNN-slug` and `specs/NNN-slug/`.
3. Seeds `spec.md` from the template with `$ARGUMENTS` filled in.
4. Updates `.specify/feature.json`.

Cascade then writes user stories, FRs, NFRs, success criteria, and
clarifications-needed markers.

Continue with `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks`
→ `/speckit.analyze` → `/speckit.implement` exactly as in Path B.

---

## Useful one-liners (paste-able)

These are copy-paste-ready prompts for common situations.

**Implement only the MVP user story (Phase 1 + Phase 2 + Phase 3):**
```
/speckit.implement Stop after Phase 3. Do not start Phases 4–6.
```

**Re-run analyze after fixing one blocker:**
```
/speckit.analyze The previous blocker was <id>; verify it is now resolved and rerun the full audit.
```

**Have Cascade summarize current state:**
```
Read .specify/feature.json, then summarize the contents of the active feature directory in 3 bullets: spec status, planning status, implementation progress.
```

**Amend the constitution:**
```
/speckit.constitution Add an eighth principle covering observability: every user-facing error path emits a structured log entry, and every cart mutation is debuggable from devtools.
```

---

## Troubleshooting

**The agent wants to add a `fetch` to an external API.**
That's a Constitution §II violation. Push back — point the agent at
`.windsurf/rules/data-constraints.md`. If the feature genuinely needs
an external source, run `/speckit.constitution` first.

**Cascade is editing `spec.md` mid-implementation.**
That's a workflow violation. Stop the run and either revert the spec
edit or loop back to `/speckit.specify` / `/speckit.clarify`. Never
let implementation silently rewrite the source of truth.

**The Phase 1 scaffolding broke half-way through.**
Phase 1 tasks are all idempotent. Re-run with:
```
/speckit.implement Resume from the first unchecked task in Phase 1.
```

**Tests pass but Lighthouse is below the threshold.**
That's a real failure — NFR-003 is a merge gate. Either fix
performance (likely an unoptimized image or an unused client bundle)
or open a constitution amendment if the threshold is wrong.

**A `[P]` task conflicts with another `[P]` task.**
The `tasks.md` parallelization is wrong. Re-run `/speckit.tasks` and
explain the conflict in `$ARGUMENTS` so it is fixed at the source.
