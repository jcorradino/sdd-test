# Spec 01 — Data Model

All product data lives in **`data/laptops.json`** at repo root. The page reads
this file at build/request time via a typed loader — **no network calls**.

## Top-level shape

```ts
type Dataset = {
  products: Product[];
  reviews: Record<string /* productId */, Review[]>;
  accessories: Accessory[];
};
```

## Product

```ts
type Product = {
  id: string;                    // slug, e.g. "apex-15"
  name: string;                  // "Dell Apex 15"
  tagline: string;               // one-line marketing pitch
  description: string;           // 2–3 paragraphs, markdown allowed
  brand: "Dell";
  category: "laptop";
  images: Image[];               // ≥ 3, first is hero
  basePrice: number;             // USD cents, integer
  currency: "USD";
  rating: { average: number; count: number }; // avg ∈ [0,5], 1 decimal
  badges: Badge[];               // e.g. "New", "Energy Star"
  configurable: ConfigGroup[];   // ordered, drives configurator
  specs: SpecSection[];          // full tech-spec table
  inTheBox: string[];            // bullet list
  warranty: { defaultSku: string; options: WarrantyOption[] };
  releaseDate: string;           // ISO date
};

type Image = {
  src: string;                   // "/images/apex-15/hero.jpg"
  alt: string;                   // required, non-empty
  width: number;
  height: number;
};

type Badge = "New" | "Best Seller" | "Energy Star" | "EPEAT Gold";
```

## Configurable components

```ts
type ConfigGroup = {
  id: "cpu" | "ram" | "storage" | "display" | "color" | "warranty";
  label: string;                 // "Processor"
  helpText?: string;             // shown under label
  required: true;
  options: ConfigOption[];       // ordered cheapest → priciest (except color)
};

type ConfigOption = {
  sku: string;                   // unique across the dataset
  label: string;                 // "Intel Core Ultra 7 155H"
  sublabel?: string;             // "16 cores, up to 4.8 GHz"
  priceDelta: number;            // USD cents, relative to basePrice
  default: boolean;              // exactly one per group is true
  inStock: boolean;
  swatch?: string;               // hex color, only for "color" group
  image?: Image;                 // optional thumbnail
  incompatibleWith?: string[];   // other option SKUs that conflict
};
```

### Invariants

- Every `ConfigGroup` has **exactly one** option with `default: true`.
- The sum of `basePrice + Σ priceDelta(defaults)` must equal the advertised
  "starting at" price shown in the hero.
- `incompatibleWith` is symmetric — if A lists B, B must list A. The loader
  validates this and throws at boot time.
- `sku` is globally unique; used as the React key and cart line id.

## Reviews

```ts
type Review = {
  id: string;
  author: string;                // display name, already redacted
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;             // ISO date
  helpfulCount: number;
};
```

- `reviews[productId]` MAY be empty → UI shows an empty state, not an error.
- `product.rating.average` is the source of truth for the summary; it is
  NOT recomputed from the review list (reviews are a sampled page).

## Accessories

```ts
type Accessory = {
  id: string;
  name: string;
  price: number;                 // USD cents
  image: Image;
  compatibleWith: string[];      // product ids
};
```

## Loader contract

- Exposed as `getDataset(): Promise<Dataset>` from `lib/data.ts`.
- Validates the JSON with Zod at load time; throws with the path of the first
  failure. Validation errors are **fatal** — do not ship partial data.
- Loader is memoized per process (server) / per page load (client).
- No other module may `import laptops.json` directly.
