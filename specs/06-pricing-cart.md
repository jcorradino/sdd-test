# Spec 06 — Pricing and Cart

## Price formatting

- Single utility `formatPrice(cents: number, currency = "USD"): string`.
- Uses `Intl.NumberFormat`. Never concatenate `"$"` by hand.
- Negative deltas render with a leading minus: `−$50.00` (the U+2212
  minus sign, not hyphen).
- Zero deltas render as the literal string `"Included"` (not `"$0.00"`).

## Cart model

Persisted to `localStorage` under key `apex.cart.v1`:

```ts
type CartLine = {
  id: string;              // configuredSku
  productId: string;
  name: string;            // product.name
  configuredSku: string;   // same as id
  selections: Record<ConfigGroupId, string>;
  unitPrice: number;       // cents
  quantity: number;
  addedAt: string;         // ISO
};

type Cart = {
  version: 1;
  lines: CartLine[];
};
```

### Rules

1. "Add to Cart" appends a new line; if a line with the same
   `configuredSku` already exists, increment quantity instead.
2. Max quantity per line: 5. Beyond that, the button shows "Max reached"
   for 2s.
3. Cart state is exposed via a single `useCart()` hook backed by
   `zustand` with `persist` middleware. Do **not** read `localStorage`
   from components directly.
4. On schema-version mismatch (e.g. future `apex.cart.v2`), the v1 store
   is discarded silently rather than crashing.

## Add-to-cart UX

- Button shows the current configured price: `Add to Cart — $1,999.00`.
- Disabled while any selected option has `inStock: false`.
- On click: optimistic update → toast "Added to cart" with an "Undo"
  action that removes the just-added quantity.
- Sticky buy bar shows the same button; the two must stay in sync (they
  both read from `useCart`).

## Cart badge

Top-right of the page, a small cart icon with the total item count (sum
of quantities). Clicking it opens a drawer showing the lines — this
drawer is in scope so that "Add to Cart" has a visible effect, but
checkout itself is not.
