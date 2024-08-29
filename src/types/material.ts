import { MaterialStockUpdateAction } from "@prisma/client";
import { z } from "zod";
import { CustomZod } from "~/utils";

export const createMaterialFormSchema = z.object({
  name: z.string().min(1, "Required"),
  url: CustomZod.OPTIONAL_URL,
  sku: z.string().optional(),
  cost: z.number().min(0).optional(),
  stockLevel: z.string().optional(),
  stockUnitType: z.string().optional(),
  minStockLevel: z.string().optional(),
  notes: z.string().optional(),
  vendor: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .optional(),
  categories: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array(),
});

export type CreateMaterialFormType = z.infer<typeof createMaterialFormSchema>;

export const updateMaterialStockFormSchema = z.object({
  materialId: z.string(),
  type: z.object({
    label: z.string(),
    value: z.object({
      id: z.string(),
      type: z.string(),
      action: z.nativeEnum(MaterialStockUpdateAction),
    }),
  }),
  previousStockLevel: z.string(),
  adjustmentQuantity: z.string(),
  notes: z.string().optional(),
});

export type UpdateMaterialStockFormType = z.infer<
  typeof updateMaterialStockFormSchema
>;

export const newStockAdjustmentActionSchema = z.object({
  name: z.string(),
  color: z.string(),
  adjustmentAction: z.nativeEnum(MaterialStockUpdateAction),
});

export type NewStockAdjustmentActionFormType = z.infer<
  typeof newStockAdjustmentActionSchema
>;
