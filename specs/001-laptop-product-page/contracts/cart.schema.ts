// Persisted-cart contract. Stored in localStorage under "apex.cart.v1".
// On schema-version mismatch the store resets silently rather than throwing.

import { z } from "zod";
import { ConfigGroupId } from "./dataset.schema";

export const CART_STORAGE_KEY = "apex.cart.v1";
export const CART_SCHEMA_VERSION = 1;
export const MAX_QUANTITY_PER_LINE = 5;

export const CartLine = z.object({
  id: z.string().min(1), // === configuredSku
  productId: z.string().min(1),
  name: z.string().min(1),
  configuredSku: z.string().min(1),
  selections: z.record(ConfigGroupId, z.string().min(1)),
  unitPrice: z.number().int().nonnegative(),
  quantity: z
    .number()
    .int()
    .min(1)
    .max(MAX_QUANTITY_PER_LINE),
  addedAt: z.string().datetime(),
});

export const Cart = z.object({
  version: z.literal(CART_SCHEMA_VERSION),
  lines: z.array(CartLine),
});

export type CartLine = z.infer<typeof CartLine>;
export type Cart = z.infer<typeof Cart>;
