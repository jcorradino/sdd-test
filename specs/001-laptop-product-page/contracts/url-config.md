# URL Configuration Contract

The configurator state is reflected in the URL via a single query
parameter so that links can be shared and the initial render on the
server reflects the user's chosen price (no hydration flash).

## Shape

```
/products/<productId>?c=<sku1>,<sku2>,<sku3>,<sku4>,<sku5>,<sku6>
```

- The value of `c` is a comma-separated list of `ConfigOption.sku`
  values.
- Order matches the canonical group order:
  `cpu, ram, storage, display, color, warranty`.
- A trailing or missing position falls back to that group's default.

## Parsing rules

1. Split on `,`. Trim whitespace from each token.
2. For each position `i` in canonical group order:
   - If token `i` exists and matches an option SKU **for that group**,
     use it.
   - Otherwise (missing, empty, or unknown SKU), use that group's
     `default: true` option.
3. If applying selections introduces a compatibility conflict, run
   the same auto-reset logic the runtime configurator uses; record a
   one-time toast on first interaction (not on initial render).
4. Never throw on a malformed `c` value — always degrade to defaults.

## Emission rules

- Update the URL **on idle**, not on every keystroke. Debounce 150 ms.
- Use `router.replace`, not `router.push` — selection changes do not
  warrant new history entries.
- When every selected option equals its group's default, omit the
  `c` parameter entirely (clean URL for the canonical landing page).

## Examples

| Selection | URL |
|---|---|
| All defaults | `/products/vela-15` |
| 32 GB RAM, OLED | `/products/vela-15?c=cpu-u5-125h,ram-32,ssd-512,disp-oled,color-platinum,war-1y` |
| Invalid token in slot 3 | falls back: `ssd-512` becomes default |
