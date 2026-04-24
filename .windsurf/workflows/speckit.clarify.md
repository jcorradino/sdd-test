---
description: Resolve ambiguities in the current feature spec
auto_execution_mode: 1
---

The user wants to resolve open questions in the active feature spec.

User input (optional):

$ARGUMENTS

## Goal

Drive the active `specs/<NNN>-<slug>/spec.md` to zero
`[NEEDS CLARIFICATION]` markers by asking the user targeted questions
and recording the answers **in the spec itself**.

## Prerequisites

Run:

```bash
.specify/scripts/bash/check-prerequisites.sh --json --require spec
```

Capture the returned `feature_dir`.

## Procedure

1. **Scan** `spec.md` for `[NEEDS CLARIFICATION: …]` markers. Group
   related ones.

2. **Ask one question at a time.** For each group:
   - State the ambiguity in plain language.
   - Offer 2–4 concrete options when a closed-set answer is viable.
   - Mark which option you'd recommend and why, briefly.
   - Wait for the user's answer before moving on.

3. **Rewrite in place.** After each answer:
   - Delete the `[NEEDS CLARIFICATION]` marker.
   - Update or add the affected Functional Requirement /
     Success Criterion / Assumption.
   - Append a bullet to a `## Clarifications` section at the top of the
     spec with the form:
     `- [YYYY-MM-DD] <question> → <resolution>`

4. **Honor the constitution.** If a user answer would violate a
   NON-NEGOTIABLE principle, push back and propose a compliant
   alternative before accepting.

5. **Stop conditions** (any of):
   - All markers resolved.
   - User says "stop" / "that's enough" / equivalent.
   - Three questions in a row the user defers; record them as open
     assumptions and continue to `/speckit.plan`.

6. **Report** at the end:
   - Count of resolved vs. remaining clarifications.
   - Recommendation for the next workflow (`/speckit.plan` if clean,
     otherwise another round of `/speckit.clarify`).
