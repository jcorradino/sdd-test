# Spec 00 — Product Overview

## Context

We are building a **product detail page (PDP)** for a configurable Dell-style
laptop. This is a representative test of the kind of page Dell.com ships:
rich media, a configurator that drives live pricing, a dense technical-spec
table, ratings/reviews, and an add-to-cart affordance.

The goal of this spec set is to demonstrate **Spec-Driven Development**:
specs are the source of truth, implementation is generated/validated against
them. Each spec file is self-contained and references shared data contracts
in `02-data-model.md`.

## Product being modeled

- **Name**: Dell Apex 15 (fictional SKU family used to avoid trademarked
  configurations).
- **Category**: Premium developer / creator laptop, 15".
- **SKU shape**: one base model with multiple configurable components. Each
  component has an ordered list of options, each option has a delta price
  and stock state.

## In scope

1. Product hero (gallery, name, short pitch, starting price, CTA).
2. Configurator (CPU, RAM, storage, display, color, warranty).
3. Live price + availability recalculation as options change.
4. Full technical specifications table.
5. Customer ratings and reviews (read-only in this milestone).
6. Related accessories (static list).
7. Add-to-cart action that persists to `localStorage` (no backend).

## Out of scope (explicitly)

- Real checkout / payment.
- Auth, accounts, wishlists.
- Server-side cart, inventory reservation.
- Admin tooling, CMS, i18n.
- Real network calls. **All data is loaded from a local JSON file**
  (`data/laptops.json`). This is a hard constraint — do not introduce fetch
  calls to external services.

## Success criteria

- A user can land on `/products/apex-15`, configure a machine, see the price
  update, and add it to the cart.
- Lighthouse Performance ≥ 90, Accessibility ≥ 95 on desktop.
- All specs in this folder have at least one corresponding automated test
  (unit or e2e) that pins the behavior.

## Directory map

```
specs/
  00-overview.md          ← you are here
  01-data-model.md        ← canonical JSON schema
  02-page-layout.md       ← sections, responsive behavior
  03-configurator.md      ← component, state, pricing rules
  04-specifications.md    ← tech-spec table behavior
  05-reviews.md           ← ratings + review list
  06-pricing-cart.md      ← price formatting, cart persistence
  07-non-functional.md    ← a11y, perf, SEO
  08-testing.md           ← test strategy & required coverage
data/
  laptops.sample.json     ← one fully-populated example
BOOTSTRAP.md              ← prompts to scaffold & implement
```
