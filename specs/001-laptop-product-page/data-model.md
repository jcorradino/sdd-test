# Data Model — Dell XPS 15 PDP

The canonical schemas live in `lib/schema.ts` (Zod). This document is
the human-readable mirror; if the two ever disagree, the Zod source
wins and this file must be amended.

## Top-level dataset

```ts
type Dataset = {
  products: Product[];
  reviews: Record<string /* productId */, Review[]>;
  accessories: Accessory[];
};
```

### Invariants

- `products` is non-empty.
- For every key in `reviews`, the key matches some `Product.id`.
- For every `Accessory.compatibleWith[i]`, the value matches some
  `Product.id`.

## Product

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (slug) | Unique. Used in URL and as React key. |
| `name` | `string` | "Dell XPS 15". |
| `tagline` | `string` | One-line marketing pitch. |
| `description` | `string` | 2–3 paragraphs. Sanitized markdown. |
| `brand` | `"Dell"` | Single-value enum for now. |
| `category` | `"laptop"` | Single-value enum for now. |
| `images` | `Image[]` | ≥ 3 entries; first is hero/LCP. |
| `basePrice` | `number` (USD cents) | Integer ≥ 0. |
| `currency` | `"USD"` | Single-value enum for now. |
| `rating` | `{ average: number; count: number }` | `average ∈ [0, 5]`, 1 decimal. |
| `badges` | `Badge[]` | Subset of the closed enum. |
| `configurable` | `ConfigGroup[]` | Ordered. See below. |
| `specs` | `SpecSection[]` | Ordered. See below. |
| `inTheBox` | `string[]` | Bullet list. |
| `warranty` | `{ defaultSku: string; options: WarrantyOption[] }` | Mirror of the `warranty` config group. |
| `releaseDate` | `string` (ISO date) | |

### Image

| Field | Type | Notes |
|---|---|---|
| `src` | `string` | Path under `/public`. |
| `alt` | `string` | Non-empty unless explicitly decorative. |
| `width` | `number` | Required for `next/image`. |
| `height` | `number` | |

### Badge

Closed enum: `"New" | "Best Seller" | "Energy Star" | "EPEAT Gold"`.

## ConfigGroup

| Field | Type | Notes |
|---|---|---|
| `id` | `"cpu" \| "ram" \| "storage" \| "display" \| "color" \| "warranty"` | Closed enum. |
| `label` | `string` | "Processor". |
| `helpText` | `string?` | Shown under the label. |
| `required` | `true` | Always true in this milestone. |
| `options` | `ConfigOption[]` | Ordered cheapest→priciest, except `color`. |

### Invariants

- Exactly one `option` per group has `default: true`.
- Group `id` values are unique within a product.

## ConfigOption

| Field | Type | Notes |
|---|---|---|
| `sku` | `string` | Globally unique across the dataset. |
| `label` | `string` | "Intel Core Ultra 7 155H". |
| `sublabel` | `string?` | "16 cores, up to 4.8 GHz". |
| `priceDelta` | `number` (USD cents) | May be 0 or negative. |
| `default` | `boolean` | Exactly one per group. |
| `inStock` | `boolean` | |
| `swatch` | `string?` (hex) | Only for `color` group. |
| `image` | `Image?` | Optional thumbnail. |
| `incompatibleWith` | `string[]?` | Other option SKUs. **Symmetric**. |

### Invariants

- `sku` is globally unique across the entire dataset.
- `incompatibleWith` is symmetric: if A lists B, B must list A.
- `swatch` is set if and only if the parent group's `id === "color"`.

## SpecSection

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (slug) | Used as anchor target. |
| `label` | `string` | Section heading. |
| `rows` | `SpecRow[]` | |

### SpecRow

| Field | Type | Notes |
|---|---|---|
| `label` | `string` | "Refresh rate". |
| `value` | `string` | "120 Hz". |
| `highlight` | `boolean?` | If true, render in semibold. |

## Review

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | |
| `author` | `string` | Display name (already redacted). |
| `rating` | `1 \| 2 \| 3 \| 4 \| 5` | |
| `title` | `string` | |
| `body` | `string` | Plain text (no HTML). |
| `verifiedPurchase` | `boolean` | |
| `createdAt` | `string` (ISO date) | |
| `helpfulCount` | `number` (≥ 0) | |

### Behaviour

- `product.rating.average` is the source of truth for the summary;
  it is **not** recomputed from this list (the list may be a sample).

## Accessory

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | |
| `name` | `string` | |
| `price` | `number` (USD cents) | |
| `image` | `Image` | |
| `compatibleWith` | `string[]` | At least one product id. |

## Cart (client-only)

Persisted in `localStorage` under key `xps.cart.v1`.

```ts
type Cart = {
  version: 1;
  lines: CartLine[];
};

type CartLine = {
  id: string;            // configuredSku
  productId: string;
  name: string;
  configuredSku: string; // === id
  selections: Record<ConfigGroupId, string>;
  unitPrice: number;     // USD cents
  quantity: number;      // 1..5
  addedAt: string;       // ISO timestamp
};
```

### Invariants

- `quantity ∈ [1, 5]` per line.
- `lines[i].id === lines[i].configuredSku`.
- `selections` covers every `ConfigGroup.id` for the parent product.
- On schema-version mismatch (e.g. future `xps.cart.v2` reading
  `xps.cart.v1`), the store resets silently.

## Derived values

```ts
configuredPrice(product, selections)
  = product.basePrice + Σ option.priceDelta for selected options

configuredSku(product, selections)
  = [product.id, ...orderedSelections].join(":")

allInStock(product, selections)
  = every selected option has inStock === true
```
