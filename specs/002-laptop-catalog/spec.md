# Feature Specification: Laptop Catalog & Filtering

**Feature Branch**: `002-laptop-catalog`
**Created**: 2026-04-24
**Status**: Draft
**Input**: User description: "A `/laptops` listing page showing every laptop in the catalog with filters (price, screen size, color, badges) and sort, linking into the PDP. Local data only."

## Clarifications

- [NEEDS CLARIFICATION: Should the user-case taxonomy (e.g. "Developer", "Creator", "Gaming", "Everyday") be a filter facet, and if so, where does the tag come from — a new `useCases: string[]` field on `Product`, or derived from CPU/RAM thresholds?]
- [NEEDS CLARIFICATION: Pagination strategy — server-side numbered pages, "Load more" button, or infinite scroll? Each has a11y and SEO trade-offs.]
- [NEEDS CLARIFICATION: When a filter combination yields zero results, do we show an empty state with "Reset filters" only, or do we also surface the closest-matching subset of products?]

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse all laptops (Priority: P1)

A shopper who hasn't yet decided on a model lands on `/laptops` and
sees every available laptop with its starting price, hero image,
rating, and the most relevant badge. They can click any card to open
the PDP for that model.

**Why this priority:** Without a browseable index, the storefront is
just a single PDP. This story is the entry point that makes the rest
of the catalog reachable; if it doesn't work, nothing downstream
matters.

**Independent Test:** A user can navigate to `/laptops` from the home
page, see a card for every product in the dataset in a stable default
order, and click any card to land on its PDP — with no filters,
sort, or search implemented.

**Acceptance Scenarios:**

1. **Given** the catalog has N products, **When** the user opens
   `/laptops`, **Then** N cards are rendered, each showing name,
   tagline, hero image with non-empty alt text, starting price,
   star rating, and review count.
2. **Given** the user is on `/laptops`, **When** they activate any
   card, **Then** the browser navigates to that product's PDP at
   `/products/<id>`.
3. **Given** the catalog dataset is empty, **When** the user opens
   `/laptops`, **Then** an empty state explains that no laptops are
   currently available and links back to the homepage.

### User Story 2 - Narrow choices with filters and sort (Priority: P2)

A shopper with a budget cap and a screen-size preference applies
filters to reduce the catalog to laptops that match, then sorts the
remaining results by price.

**Why this priority:** Filters are the standard mechanism for moving
from "I want a laptop" to "I want this laptop" on a multi-SKU
storefront. Without them, browsers with > ~6 products become
overwhelming.

**Independent Test:** A user can apply a price-range filter and a
screen-size filter, see the card count update, change the sort to
"Price: low to high", and confirm the cards are reordered accordingly
— with the underlying card rendering from US1.

**Acceptance Scenarios:**

1. **Given** the catalog has products spanning multiple price tiers,
   **When** the user sets a maximum price filter, **Then** only
   products whose **starting** price is at or below the cap are
   shown, and the result count visible to the user updates.
2. **Given** the user has applied at least one filter, **When** they
   reload the page, **Then** the filters are restored from the URL
   query string and the same set of products is displayed.
3. **Given** filters yielding zero results,
   **When** the result list updates, **Then** an empty state offers a
   one-click "Reset all filters" action [NEEDS CLARIFICATION: see
   open question above].
4. **Given** the user changes the sort to "Price: low to high",
   **When** the list re-renders, **Then** results are ordered by
   ascending starting price; equal prices break ties by name A→Z.

### User Story 3 - Find a specific model by keyword (Priority: P3)

A returning shopper who already knows the rough model name types it
into a search field and sees only matching laptops.

**Why this priority:** Search is a faster path for repeat or informed
visitors, but a small catalog (≤ 20 SKUs) is navigable without it.
Lower priority than browse + filter.

**Independent Test:** With US1 and US2 implemented, a user can type
into the search field, see results narrow as they type (debounced),
and clear the field to restore the full list.

**Acceptance Scenarios:**

1. **Given** the user types a query that matches part of a product
   name, **When** the input settles, **Then** only products whose
   name contains the query (case-insensitive) are shown.
2. **Given** the user clears the search field, **When** the input
   settles, **Then** the previously filtered (US2) result set is
   restored — search is composable with filters, not a replacement.
3. **Given** a query with no matches, **When** the input settles,
   **Then** an empty state shows the query and a "Clear search" action.

### Edge Cases

- A product is missing one or more filterable attributes (no badges,
  unknown screen size): it is excluded from filters that *positively*
  require that attribute and included otherwise.
- The user navigates with Back/Forward after filter changes: the URL
  query string drives the displayed state, so navigation reproduces
  what the user saw.
- All products have the same starting price: a price-range filter is
  rendered as a single tick, not a broken slider.
- The data file is missing or invalid: same fatal-error behavior as
  the PDP loader.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render a catalog index at `/laptops`
  listing every product in `data/laptops.json`.
- **FR-002**: Each catalog card MUST show product name, tagline,
  hero image with non-empty alt text, starting price, aggregate
  rating, review count, and at most one prominent badge.
- **FR-003**: The catalog page MUST expose filter controls for
  price range, screen size, color, and badge.
- **FR-004**: The catalog page MUST expose a sort control with the
  options: "Featured" (default), "Price: low to high", "Price: high
  to low", "Highest rated", "Newest".
- **FR-005**: The catalog page MUST expose a free-text search input
  matching against product name (case-insensitive substring).
- **FR-006**: Filter, sort, and search state MUST be reflected in the
  URL query string and MUST be restored on reload or via direct link.
- **FR-007**: Empty result sets MUST render an empty state with a
  one-click "Reset all filters" action that clears every filter,
  sort override, and the search query.
- **FR-008**: A counter MUST display the number of products currently
  visible relative to the total (e.g. "Showing 3 of 7 laptops").
- **FR-009**: Each card MUST be a navigable link to the corresponding
  PDP at `/products/<productId>`.
- **FR-010**: Pagination MUST be applied when the visible result count
  exceeds [NEEDS CLARIFICATION: page size threshold; suggest 12 once
  the dataset grows].

### Non-Functional Requirements

- **NFR-001**: Every interactive control (filter, sort, search,
  pagination, card) MUST be reachable and operable via keyboard.
- **NFR-002**: Zero axe-core Serious or Critical violations on a full
  page scan of `/laptops`.
- **NFR-003**: Desktop Lighthouse Performance ≥ 90, Accessibility ≥
  95, Best Practices ≥ 95, SEO ≥ 95.
- **NFR-004**: Filtering and sorting MUST execute in the browser
  against the in-memory dataset; no additional network requests.
- **NFR-005**: First filter response MUST render within 100 ms of the
  filter input event for a dataset of up to 50 products.

### Key Entities *(include if feature involves data)*

- **Catalog Card**: a denormalized projection of `Product` containing
  only the fields needed for the listing (name, tagline, hero image,
  starting price, rating, badges, screen size, color list,
  releaseDate). The full `Product` is loaded only on PDP navigation.
- **Filter State**: the user's current selections — price range
  (min, max), screen sizes (set), colors (set), badges (set), sort
  key, search query. Serializable to and from the URL query string.
- **Catalog View Result**: the ordered list of Catalog Cards for the
  current Filter State, plus the visible/total counts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can land on `/laptops`, narrow to ≤ 3 results
  using filters, and click into a PDP in ≤ 5 user-observable
  interactions.
- **SC-002**: Sharing the URL of a filtered/sorted catalog view
  reproduces the same view in a fresh browser session.
- **SC-003**: Desktop Lighthouse Performance ≥ 90, Accessibility ≥
  95, Best Practices ≥ 95, SEO ≥ 95 on `/laptops`.
- **SC-004**: Zero axe-core Serious or Critical findings on
  `/laptops`.
- **SC-005**: 100% of FRs map to at least one automated test.

## Assumptions

- The dataset will be expanded during implementation to contain at
  least 4 distinct laptop models with varied price tiers, screen
  sizes, and colors so filters are meaningful.
- "Featured" sort order is the dataset's natural array order; the
  sample data is curated so this matches editorial intent.
- Search is local-only and does not need fuzzy matching, stemming,
  or synonyms in this milestone.

## Out of Scope

- Faceted result counts ("Color: Graphite (3)") — too noisy for the
  current dataset size; revisit if catalog grows past 20 SKUs.
- Saved searches, alerts, or back-in-stock notifications.
- Personalized ordering, recommendations, or A/B-tested ranking.
- Localization of filter labels or currency.
