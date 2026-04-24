# Spec 05 — Reviews

Read-only in this milestone. No posting, no auth.

## Summary block

Top of the section:

- Big average (e.g. `4.6`) with star icons (supports half stars).
- `"Based on {count} reviews"` — count from `product.rating.count`, NOT
  `reviews.length`.
- Star distribution bars (5 → 1). Each bar shows the percentage of reviews
  in the **loaded** sample at that rating. Label each bar with its count.
- "Write a review" button — present but disabled, with a tooltip
  "Available soon".

## Review list

- Default sort: most helpful first (`helpfulCount` desc, then `createdAt`
  desc).
- Sort dropdown: "Most helpful" (default), "Newest", "Highest rated",
  "Lowest rated", "Verified purchases".
- Rating filter: chips for `All`, `5★`, `4★`, `3★`, `2★`, `1★`. Chips
  reflect counts from the loaded sample. Multi-select is NOT supported —
  one active chip at a time.
- Page size: 5. "Show more" button appends the next 5; no infinite scroll.

## Review card

- Author name, verified-purchase badge (small checkmark + "Verified
  purchase" text, not just an icon).
- Rating as stars + numeric.
- Title as `<h4>`.
- Body with `max-height` clamp ≈ 6 lines, "Read more" toggle if truncated.
  Truncation is done with CSS `line-clamp`, not by substring-cutting the
  string (to keep a11y readers happy).
- "Was this helpful?" with up/down count display (no mutation in this
  milestone — the buttons are rendered but the handler is a no-op with a
  `// TODO:` comment referencing this spec).

## Empty state

If `reviews[productId]` is empty or missing, render:

> **No reviews yet.** Be the first to share your experience with the
> {product.name}.

Hide the sort dropdown and filter chips in that case — do not render
empty UI.
