---
trigger: always_on
---

# Data Constraints

**All product, review, and accessory data lives in `data/laptops.json`.**
This is a NON-NEGOTIABLE constitutional rule (Principle II).

## Hard rules

- No runtime `fetch`, `axios`, `ky`, or equivalent call to an external
  service. If you see one being added, remove it and replace with a
  read from the local JSON.
- No mock servers (MSW, json-server, nock) — the local file *is* the
  mock.
- No environment-gated switches like `if (process.env.USE_REAL_API) …`.
- No database clients (Prisma, Drizzle, Supabase, Firebase, etc.).
- `localStorage` is permitted for cart persistence only, wrapped in
  try/catch (Safari private mode throws).
- The data file is read **once per request** (server) or **once per
  mount** (client) via the memoized loader in `lib/data.ts`. No other
  module may import the JSON directly.

## Loading pattern

```ts
import { getDataset } from "@/lib/data";
const dataset = await getDataset(); // validated via Zod, memoized
```

## Validation

- Every boundary crossing is validated with Zod. If validation fails
  at boot, throw with the offending path — do not ship partial data.
- Zod schemas in `lib/schema.ts` are the single source of truth;
  TypeScript types are derived via `z.infer`.

## Why

The project demonstrates SDD in a deterministic, offline-friendly
environment. External APIs would make the harness flaky and gate it
behind secrets. If a future feature genuinely requires live data, it
must first be raised as a constitution amendment.
