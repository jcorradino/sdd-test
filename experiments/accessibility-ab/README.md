# Experiment: Accessibility ruleset A/B

Measure how much an accessibility ruleset improves the code an agent
produces, by building the **same feature twice** and changing **only**
which ruleset is active.

## Hypothesis

With an accessibility ruleset active during `/speckit.implement`, the
generated feature has materially fewer accessibility defects (axe
findings, WCAG 2.2 AA failures, keyboard/SR issues) than the same
feature generated without it.

## The one variable

The **only** thing that differs between arms is the active accessibility
ruleset:

| Arm | Active accessibility ruleset |
|---|---|
| **A — baseline** | The repo's `.windsurf/rules/accessibility.md`, unchanged. |
| **B — alternate** | *Your* ruleset, used **instead** of the baseline. |

> The repo's `accessibility.md` is intentionally left as-is. Swapping in
> the Arm B ruleset is the experimenter's action on the Arm B branch
> (replace the file's contents, or disable it and add yours) — this
> scaffold never edits or deletes it.

This is an A/B of **two rulesets**, not "rule on vs. off." If you instead
want "on vs. nothing," make Arm B carry no accessibility ruleset at all —
the harness and template work the same either way.

## Held constant (controls)

Everything below must be identical across both arms, or the result is
confounded:

- Same `spec.md` / `plan.md` / `tasks.md` and the same `/speckit.implement`
  invocation (same `$ARGUMENTS`, same stopping point).
- Same dataset (`data/laptops.json`), same DDS tokens (`design/`).
- Same stack — and note this is the big confound: **shadcn/Radix
  (Principle VII) and `eslint-plugin-jsx-a11y` deliver a baseline of
  accessibility in *both* arms.** So the measured delta is the
  *marginal* value of the ruleset *on top of an already-decent stack* —
  which is the honest, interesting question. Only strip Radix/jsx-a11y
  if you deliberately want to measure the whole a11y program instead.
- Same model, same temperature/settings, same number of implement
  iterations.
- Same measurement harness (`metrics.md`), same tool versions, same
  reviewer.

## Candidate feature

Build a UI-rich but small feature so it's cheap to build twice and dense
with a11y decision points. Recommended:

- **`003-recently-viewed`** (already specified) — remove buttons, an
  Undo affordance, a "Clear all" confirmation dialog, focus management,
  reduced-motion, and keyboard nav. Lots of surface, small footprint.
- *Alternative:* a new DDS-driven **color/finish picker** that exercises
  the swatch contrast traps in `design/README.md` (light-chip border,
  no-color-only selection) — ties the DDS and a11y threads together.

Pick one and build the **same** one in both arms.

## Procedure

1. Branch both arms from a common base that already includes the DDS
   foundation and the expanded dataset (this scaffold's base):
   - `exp/a11y-ab--armA-baseline`
   - `exp/a11y-ab--armB-alternate`
2. On Arm B only, substitute your alternate ruleset (your action).
3. In each arm, run the *identical* `/speckit.implement` for the chosen
   feature. Don't hand-fix accessibility afterward — you're measuring
   what the agent produced.
4. Run the measurement harness in `metrics.md` against each build, in
   **report mode** (see validity rule below), and record raw numbers in
   a copy of `results-template.md`.
5. Compare. The delta (Arm A − Arm B) is your result.

## Validity rules

- **Measure in report mode, not as a gate.** The repo normally treats
  axe Serious/Critical as a *merge blocker* (Constitution §IV). If the
  gate stays on, Arm B literally cannot land its failures and you'll
  never see them. For the experiment, run axe/Lighthouse as reporting
  that records counts and does **not** fail the build.
- The measurement harness is fixed and ruleset-independent — never let
  the thing you're toggling also be the thing doing the measuring.
- Pin tool versions (axe-core, Lighthouse) and note them in the results.
- Same effort in both arms: same number of `/speckit.implement` rounds,
  no extra nudging in one arm.
- Run each arm at least twice if the agent is non-deterministic; report
  median.
