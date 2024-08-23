import { z } from "zod";
import { CustomZod } from "~/utils";

export const createMaterialFormSchema = z.object({
  name: z.string().min(1, "Required"),
  url: CustomZod.OPTIONAL_URL,
  sku: z.string().optional(),
  cost: z.string().optional(),
  stockLevel: z.string().optional(),
  stockUnitType: z.string().optional(),
  minStockLevel: z.string().optional(),
  notes: z.string().optional(),
  vendor: z
    .object({
      name: z.string(),
    })
    .optional(),
  categories: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array(),
});

export type CreateMaterialForm = z.infer<typeof createMaterialFormSchema>;
