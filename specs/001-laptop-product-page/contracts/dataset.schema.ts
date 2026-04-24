// Canonical Zod contracts for the Apex 15 PDP dataset.
//
// This file is the SOURCE OF TRUTH for all dataset shapes. The
// implementation in `lib/schema.ts` MUST match this file exactly (it
// may be a literal copy). Tests in `tests/unit/data.test.ts` validate
// `data/laptops.json` against these schemas.
//
// Edit this file via /speckit.plan, never ad hoc.

import { z } from "zod";

export const ConfigGroupId = z.enum([
  "cpu",
  "ram",
  "storage",
  "display",
  "color",
  "warranty",
]);
export type ConfigGroupId = z.infer<typeof ConfigGroupId>;

export const Badge = z.enum(["New", "Best Seller", "Energy Star", "EPEAT Gold"]);

export const Image = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const ConfigOption = z.object({
  sku: z.string().min(1),
  label: z.string().min(1),
  sublabel: z.string().optional(),
  priceDelta: z.number().int(),
  default: z.boolean(),
  inStock: z.boolean(),
  swatch: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  image: Image.optional(),
  incompatibleWith: z.array(z.string().min(1)).optional(),
});

export const ConfigGroup = z
  .object({
    id: ConfigGroupId,
    label: z.string().min(1),
    helpText: z.string().optional(),
    required: z.literal(true),
    options: z.array(ConfigOption).min(1),
  })
  .superRefine((group, ctx) => {
    const defaults = group.options.filter((o) => o.default).length;
    if (defaults !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `group "${group.id}" must have exactly one default option (found ${defaults})`,
      });
    }
    if (group.id === "color") {
      for (const o of group.options) {
        if (!o.swatch) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `color option "${o.sku}" is missing required "swatch"`,
          });
        }
      }
    } else {
      for (const o of group.options) {
        if (o.swatch) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `non-color option "${o.sku}" must not carry "swatch"`,
          });
        }
      }
    }
  });

export const SpecRow = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  highlight: z.boolean().optional(),
});

export const SpecSection = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  rows: z.array(SpecRow).min(1),
});

export const WarrantyOption = z.object({
  sku: z.string().min(1),
  label: z.string().min(1),
});

export const Product = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  brand: z.literal("Dell"),
  category: z.literal("laptop"),
  images: z.array(Image).min(3),
  basePrice: z.number().int().nonnegative(),
  currency: z.literal("USD"),
  rating: z.object({
    average: z.number().min(0).max(5),
    count: z.number().int().nonnegative(),
  }),
  badges: z.array(Badge),
  configurable: z.array(ConfigGroup).min(1),
  specs: z.array(SpecSection).min(1),
  inTheBox: z.array(z.string().min(1)).min(1),
  warranty: z.object({
    defaultSku: z.string().min(1),
    options: z.array(WarrantyOption).min(1),
  }),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const Review = z.object({
  id: z.string().min(1),
  author: z.string().min(1),
  rating: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  title: z.string().min(1),
  body: z.string().min(1),
  verifiedPurchase: z.boolean(),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  helpfulCount: z.number().int().nonnegative(),
});

export const Accessory = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  image: Image,
  compatibleWith: z.array(z.string().min(1)).min(1),
});

export const Dataset = z
  .object({
    products: z.array(Product).min(1),
    reviews: z.record(z.string(), z.array(Review)),
    accessories: z.array(Accessory),
  })
  .superRefine((data, ctx) => {
    const productIds = new Set(data.products.map((p) => p.id));

    // reviews keys must match products
    for (const key of Object.keys(data.reviews)) {
      if (!productIds.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `reviews key "${key}" does not match any product id`,
        });
      }
    }

    // accessories.compatibleWith must match products
    for (const acc of data.accessories) {
      for (const pid of acc.compatibleWith) {
        if (!productIds.has(pid)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `accessory "${acc.id}" lists unknown productId "${pid}"`,
          });
        }
      }
    }

    // global SKU uniqueness across configurable options
    const seen = new Map<string, string>();
    for (const p of data.products) {
      for (const g of p.configurable) {
        for (const o of g.options) {
          const where = `${p.id}/${g.id}/${o.sku}`;
          if (seen.has(o.sku)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `duplicate sku "${o.sku}" at ${where} (also at ${seen.get(o.sku)})`,
            });
          }
          seen.set(o.sku, where);
        }
      }
    }

    // symmetric incompatibleWith
    const skuLookup = new Map<string, { sku: string; incompat: string[] }>();
    for (const p of data.products) {
      for (const g of p.configurable) {
        for (const o of g.options) {
          skuLookup.set(o.sku, {
            sku: o.sku,
            incompat: o.incompatibleWith ?? [],
          });
        }
      }
    }
    for (const { sku, incompat } of skuLookup.values()) {
      for (const other of incompat) {
        const peer = skuLookup.get(other);
        if (!peer) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `option "${sku}" lists unknown incompatibleWith "${other}"`,
          });
        } else if (!peer.incompat.includes(sku)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `incompatibleWith asymmetric: "${sku}" lists "${other}" but not vice versa`,
          });
        }
      }
    }
  });

export type Image = z.infer<typeof Image>;
export type ConfigOption = z.infer<typeof ConfigOption>;
export type ConfigGroup = z.infer<typeof ConfigGroup>;
export type SpecRow = z.infer<typeof SpecRow>;
export type SpecSection = z.infer<typeof SpecSection>;
export type Product = z.infer<typeof Product>;
export type Review = z.infer<typeof Review>;
export type Accessory = z.infer<typeof Accessory>;
export type Dataset = z.infer<typeof Dataset>;
