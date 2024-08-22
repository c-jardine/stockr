import { z } from "zod";
import { CustomZod } from "~/utils";

export const createMaterialFormSchema = z.object({
  name: z.string().min(1, "Required"),
  url: CustomZod.OPTIONAL_URL,
  sku: z.string(),
  cost: z.string().optional(),
  stockLevel: z.string(),
  stockUnitType: z.string(),
  minStockLevel: z.string(),
  notes: z.string(),
  vendor: z.string(),
  categories: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array(),
});

export type CreateMaterialForm = z.infer<typeof createMaterialFormSchema>;
