---
trigger: always_on
---

# Stack Constraints

The stack for this project is ratified in `.specify/memory/constitution.md`
§"Technology Stack (Fixed)". Summary:

| Layer | Choice |
|---|---|
| Runtime | Node.js 20 LTS, pnpm 9 |
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS v4 |
| UI primitives | shadcn/ui (Radix) |
| Persistent state | Zustand + `persist` middleware |
| Pure state | Hand-rolled reducer in `lib/configurator.ts` |
| Validation | Zod (source of truth for types) |
| Unit tests | Vitest + React Testing Library |
| E2E + a11y | Playwright + `@axe-core/playwright` |

## Do

- Use shadcn primitives for Button, RadioGroup, Accordion, Sheet,
  Tooltip, Toast, Dialog, Tabs, Badge, Card, Separator. Generate via
  `pnpm dlx shadcn@latest add <name>`.
- Derive TypeScript types from Zod schemas (`type T = z.infer<typeof T>`).
- Use `next/image` with `priority` on the LCP image.
- Format currency via `Intl.NumberFormat`.

## Don't

- Don't add Redux, Jotai, SWR, React Query, Apollo, or styled-components
  — they overlap with existing choices.
- Don't hand-roll a component when shadcn provides an equivalent.
- Don't introduce a data layer (Prisma, Drizzle, Supabase client, etc.).
  Data is a local JSON file — see `data-constraints.md`.
- Don't disable strict TypeScript settings or ESLint rules without a
  line comment linking to the constitution clause that justifies it.

Stack changes require a constitution amendment via `/speckit.constitution`.
