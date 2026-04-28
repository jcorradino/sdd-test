# Research — Dell Apex 15 PDP

Decisions taken while drafting `plan.md`. Each entry names the choice,
the alternatives considered, and the constitutional principle that
justifies the call.

## R-001 — Framework: Next.js 15 (App Router)

- **Decision**: Next.js 15 with the App Router and React Server
  Components.
- **Alternatives considered**:
  - Remix — equivalent capabilities but smaller ecosystem for our
    chosen primitives (shadcn/ui ships first-class Next examples).
  - Vite + React Router — would require hand-rolling SSR, JSON-LD
    emission, and image optimization that Next gives us out of the box.
  - Astro — excellent for content-heavy pages but the cart + live
    configurator push us into hydrated islands either way; no net
    simplification.
- **Justification**: Principle VI (Performance) — `next/image`,
  automatic code-splitting per route, and built-in Lighthouse-friendly
  defaults make the 180 KB gzip budget realistic without bespoke
  tooling.

## R-002 — Data layer: local JSON + Zod, no client

- **Decision**: A single `data/laptops.json` file loaded server-side
  via `lib/data.ts` and validated with Zod. No database, no ORM, no
  HTTP client.
- **Alternatives considered**:
  - SQLite via Drizzle — overkill for a static dataset; introduces
    schema migration overhead.
  - Headless CMS (Contentful, Sanity) — violates Principle II
    (Local-Only Data Sources).
  - In-memory mock with MSW — adds runtime indirection that buys
    nothing for static data.
- **Justification**: Principle II (NON-NEGOTIABLE).

## R-003 — Configuration state: pure reducer in `lib/configurator.ts`

- **Decision**: A hand-written pure reducer
  (`reduce(state, action) → state`) called from a client component via
  `useReducer`. Selectors (`configuredPrice`, `allInStock`,
  `configuredSku`) live alongside.
- **Alternatives considered**:
  - Zustand — overkill for state that lives only on one page and never
    needs to be read from elsewhere.
  - XState — formal but introduces a learning-curve dependency for what
    is essentially a single transition function.
- **Justification**: Principle VII (Component Primitive Reuse) applied
  to state — the simplest primitive that suffices is a reducer; it is
  trivially unit-testable in isolation (Principle III).

## R-004 — Cart state: Zustand + `persist`

- **Decision**: Zustand store keyed `apex.cart.v1` with the official
  `persist` middleware writing to `localStorage`.
- **Alternatives considered**:
  - React Context + manual localStorage sync — error-prone around SSR
    hydration, schema versioning, and Safari private mode.
  - Jotai — overlapping with Zustand; would violate
    `stack-constraints.md` "no overlapping state libs" rule.
- **Justification**: Principle V — `persist` exposes a single
  boundary where Zod validation is applied; schema-version mismatch
  resets the store rather than crashing.

## R-005 — UI primitives: shadcn/ui (Radix)

- **Decision**: Generate the listed primitives via
  `pnpm dlx shadcn@latest add …`. No hand-rolled equivalents.
- **Alternatives considered**:
  - Headless UI — comparable, but Radix has stronger Accordion and
    RadioGroup primitives that the configurator and tech-specs
    sections rely on.
  - MUI / Chakra — heavier, opinionated themes that conflict with the
    Dell-restrained visual style.
- **Justification**: Principle IV (Accessibility) and Principle VII —
  Radix owns keyboard and ARIA semantics; reusing it is the a11y
  strategy.

## R-006 — Validation: Zod as type source

- **Decision**: All boundary types (dataset, cart, URL query) are
  defined as Zod schemas; TypeScript types are derived via
  `z.infer<typeof Schema>`.
- **Alternatives considered**:
  - Hand-written types + a runtime `assert` — splits the source of
    truth in two and is immediately drift-prone.
  - io-ts / valibot — comparable but larger / smaller ecosystems
    respectively; Zod is the canonical pick for the Next ecosystem.
- **Justification**: Principle V (NON-NEGOTIABLE for trust boundaries).

## R-007 — Testing split: Vitest unit + Playwright e2e

- **Decision**: Vitest + RTL for pure-logic and component-behaviour
  tests; Playwright for full-page flows including the axe-core scan.
- **Alternatives considered**:
  - Jest — slower than Vitest, less native ESM support.
  - Cypress — heavier and slower in CI than Playwright.
- **Justification**: Principle III — fast unit feedback (< 5 s) keeps
  the red→green→refactor loop tight; Playwright covers the
  cross-cutting flows that unit tests cannot.

## R-008 — URL configuration encoding

- **Decision**: A single `?c=` query param holding a comma-separated
  list of selected option SKUs in **group order** (CPU, RAM, Storage,
  Display, Color, Warranty). Unknown SKUs are ignored and replaced
  with the group default.
- **Alternatives considered**:
  - One query param per group (`?cpu=…&ram=…`) — verbose; harder to
    keep stable when groups are reordered.
  - Hash fragment (`#c=…`) — not visible to the server; would prevent
    server-side rendering of the correct initial price.
- **Justification**: Server-side rendering of the user's chosen price
  is required for Principle VI (LCP) — query params are visible to
  RSC; hash fragments are not.
