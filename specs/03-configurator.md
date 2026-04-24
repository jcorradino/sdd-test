# Spec 03 — Configurator

The configurator lets a user pick one option per `ConfigGroup` and shows a
live price + availability. Implemented as a client component driven by a
single reducer.

## State

```ts
type ConfigState = {
  // group.id → selected option sku
  selections: Record<ConfigGroupId, string>;
};
```

Initial state is built from `product.configurable` by taking the `default`
option of each group. This initial state must be **deterministic** and
computed on the server so there is no hydration flash.

## Selection rules

1. Clicking an option sets `selections[group.id] = option.sku`.
2. Selecting an option with `inStock: false` is disabled (option is
   rendered but not clickable, visually struck-through, `aria-disabled`).
3. If the new selection creates an `incompatibleWith` conflict:
   - The conflicting option in the **other** group is auto-reset to that
     group's `default`.
     - A non-blocking toast explains: "Changed {old label} to {new label}
       for compatibility with your {current group} choice."
4. The user cannot end up in a state with no selection for a group — every
   group always has one selected option.

## Derived values

```ts
configuredPrice   = basePrice + Σ selected.priceDelta
configuredSku     = [product.id, ...Object.values(selections)].join(":")
allInStock        = every selected option has inStock === true
estimatedShipDate = today + (allInStock ? 3 : 10) business days
```

`estimatedShipDate` is formatted as "Ships by {weekday, Mon D}" using the
user's locale.

## Rendering per group

- **CPU / RAM / Storage / Display / Warranty**: vertical list of option
  cards. Each card shows `label`, `sublabel`, and the delta price
  (`"+$120"` or `"Included"` if delta is 0, or `"−$50"` if negative).
  Selected card has a 2px brand-blue border and a check icon.
- **Color**: horizontal row of round swatches with the color name below
  the row. Selected swatch has a ring.
- Group labels are `<h3>`; the group is wrapped in a `<fieldset>` with a
  `<legend>` for screen readers.

## Price display

- Render `configuredPrice` in the hero and in the sticky buy bar.
- Show strike-through `basePrice` only when `configuredPrice < basePrice`
  (i.e. a cheaper-than-default option was selected).
- Format: `$1,899.00` via `Intl.NumberFormat('en-US', {style:'currency',
  currency:'USD'})`. Never hard-code "$".

## URL sync

Selections are reflected in the URL as a compact query string:
`?c=CPU_SKU,RAM_SKU,...` in group order. On mount, if the query string is
present and valid, it overrides defaults. Invalid SKUs are ignored (fall
back to default for that group) rather than throwing.

## Edge cases

- All options in a group out of stock → group header shows a "Temporarily
  unavailable" chip, the user-facing CTA becomes "Notify me" (disabled in
  this milestone, but rendered).
- Reducer is pure; selection → next state must be a single function
  (`reduce(state, action)`) with no side effects. Toasts are dispatched
  from the component layer based on a diff.
