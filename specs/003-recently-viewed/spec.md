# Feature Specification: Recently Viewed Laptops

**Feature Branch**: `003-recently-viewed`
**Created**: 2026-04-24
**Status**: Draft
**Input**: User description: "Track and surface a user's recently viewed laptops anonymously, persisted in the browser, on the homepage and at the bottom of every PDP."

## Clarifications

- [NEEDS CLARIFICATION: How long should an entry persist before it expires? Suggest 30 days; should the user be told this in any UI?]
- [NEEDS CLARIFICATION: Should we record only PDP views, or also catalog-card hovers / catalog clicks? Recommendation: PDP views only, to avoid noise.]
- [NEEDS CLARIFICATION: When the user adds a configured laptop to cart, do we still record it as recently viewed, or only as cart? Could double-render the same product if both are shown.]

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See what I just looked at (Priority: P1)

A returning shopper opens the homepage and sees a "Recently viewed"
strip showing the last few laptops they visited, with the most recent
first. Clicking any card returns them to that PDP.

**Why this priority:** This is the core value of the feature — making
it cheap to resume an interrupted shopping session. Without this
story the feature has no purpose.

**Independent Test:** A user can visit two distinct PDPs, return to
the homepage, and see both products in the "Recently viewed" strip
with the most recently visited first; clicking either card opens its
PDP.

**Acceptance Scenarios:**

1. **Given** the user has not yet viewed any laptop, **When** they
   open the homepage, **Then** the "Recently viewed" strip is hidden
   entirely (no empty placeholder).
2. **Given** the user has viewed at least one laptop, **When** they
   open the homepage, **Then** the strip is rendered with up to 5
   product cards in most-recent-first order.
3. **Given** the user views the same laptop twice with another laptop
   in between, **When** the strip is rendered, **Then** that laptop
   appears exactly once and at its most-recent position.
4. **Given** the user views a sixth distinct laptop, **When** the
   strip is rendered, **Then** the oldest of the six is dropped and
   only the most-recent five remain.

### User Story 2 - Remove an item from recently viewed (Priority: P2)

A user who shared their device with someone else (or simply looked at
a laptop they don't want to be reminded of) removes a specific entry
from the "Recently viewed" strip without affecting the others.

**Why this priority:** Privacy / control over the surface is expected
from any persisted UX. Not strictly required for the feature to
function.

**Independent Test:** With ≥ 2 entries in the strip, a user can
activate a remove control on one card and confirm that card disappears
while the others remain in their original order.

**Acceptance Scenarios:**

1. **Given** a strip with at least two entries, **When** the user
   activates the remove control on a card, **Then** that card is
   removed immediately and a brief "Undo" action is offered for ≥ 5s.
2. **Given** the user activates "Undo" before the action expires,
   **When** the strip re-renders, **Then** the removed card is
   restored to its previous position.
3. **Given** a strip with exactly one entry, **When** the user
   removes it, **Then** the strip is hidden (consistent with US1
   scenario 1).

### User Story 3 - Clear all recently viewed (Priority: P3)

A user wants to reset their entire recently-viewed history in one
action.

**Why this priority:** Convenience action; users can also remove
items one by one (US2). Not on the critical path.

**Independent Test:** With at least one entry present, a user can
activate a "Clear all" affordance, confirm in a small dialog, and see
the strip disappear from the page and from any other surface that
displays it.

**Acceptance Scenarios:**

1. **Given** a strip with one or more entries, **When** the user
   activates "Clear all" and confirms in the dialog, **Then** the
   strip is hidden across all surfaces and `localStorage` no longer
   contains any recently-viewed entries.
2. **Given** the user opens the confirmation dialog and dismisses it
   without confirming, **When** the dialog closes, **Then** the strip
   is unchanged.

### Edge Cases

- A recently-viewed product is removed from the dataset between
  visits: the system MUST silently skip the missing id rather than
  rendering a broken card or throwing.
- The user has `prefers-reduced-motion` set: any card-enter or
  card-exit transitions are suppressed; the strip otherwise functions
  identically.
- The user is in Safari private mode (or another environment where
  `localStorage` writes throw): the strip MUST silently no-op rather
  than crashing the page.
- The persisted store schema version is not the current version: the
  store resets silently (consistent with the cart store's behavior).
- The same laptop is added to cart and recently viewed: rendering
  rules per [NEEDS CLARIFICATION above].

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST record a recently-viewed entry whenever
  the user visits a `/products/<productId>` route for a product that
  exists in the dataset.
- **FR-002**: The system MUST persist recently-viewed entries across
  page reloads within the same browser, scoped to the device only
  (no server, no auth, no cross-device sync).
- **FR-003**: The system MUST cap the number of stored entries at 5.
  Adding a 6th entry MUST drop the oldest by recency.
- **FR-004**: A "Recently viewed" strip MUST appear on the homepage
  and at the bottom of every PDP whenever at least one entry exists,
  showing each entry as a card with name, hero image (with non-empty
  alt), starting price, and aggregate rating.
- **FR-005**: The strip MUST hide entirely when there are zero entries.
- **FR-006**: Each card in the strip MUST be a navigable link to the
  corresponding PDP.
- **FR-007**: On a PDP, the currently displayed product MUST NOT
  appear in its own recently-viewed strip.
- **FR-008**: Each card MUST expose a remove control that deletes
  only that entry; an Undo affordance MUST be available for at least
  5 seconds after removal.
- **FR-009**: A "Clear all" affordance MUST be available on the strip
  and MUST require explicit confirmation before removing all entries.
- **FR-010**: Entries whose `productId` is no longer present in the
  dataset MUST be silently skipped at render time and pruned from the
  store on the next mutation.

### Non-Functional Requirements

- **NFR-001**: Storage failures (private mode, full quota) MUST NOT
  crash the page; the feature degrades to no-op silently.
- **NFR-002**: Every interactive element in the strip MUST be reachable
  and operable via keyboard with a visible focus indicator.
- **NFR-003**: Zero axe-core Serious or Critical violations on any
  page that hosts the strip.
- **NFR-004**: Card-enter and card-exit transitions MUST be suppressed
  when `prefers-reduced-motion: reduce` is set.
- **NFR-005**: The recently-viewed store MUST add ≤ 3 KB gzip to the
  client JS payload.

### Key Entities *(include if feature involves data)*

- **Recently Viewed Entry**: a single record in the persisted store;
  carries a productId, a viewedAt ISO timestamp, and the schema
  version at write time.
- **Recently Viewed Store**: the list of entries (capped at 5)
  persisted in `localStorage` under a versioned key, surfaced via a
  hook that hides the storage details.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After viewing two distinct laptops in succession, the
  homepage strip displays both within ≤ 1 user-observable interaction
  (clicking the home link).
- **SC-002**: Removing a single entry, followed by Undo, results in a
  strip identical to the pre-removal state.
- **SC-003**: Zero axe-core Serious or Critical findings on any page
  rendering the strip.
- **SC-004**: Strip render does not change Lighthouse Performance by
  more than 1 point relative to a baseline without the strip.
- **SC-005**: 100% of FRs map to at least one automated test.

## Assumptions

- 5 entries is sufficient capacity; smaller "last 3" or larger
  "last 10" do not change the architecture.
- Users do not expect cross-device sync at this milestone — recently
  viewed is explicitly device-local.
- The strip component is shared between the homepage and PDP and is
  not duplicated.

## Out of Scope

- Cross-device synchronization, accounts, or any server-side storage.
- Recently-viewed analytics or personalized ranking beyond recency.
- "Recommended for you" or other algorithmic suggestion strips that
  reuse view history.
- Importing/exporting the recently-viewed list.
