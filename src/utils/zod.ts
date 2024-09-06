import { z } from "zod";
import { removeCommas } from "./text";

const OPTIONAL_POSITIVE_NUMBER = z.union([z.number().min(0), z.nan()]);

const OPTIONAL_URL = z.union([
  z.literal("").optional(),
  z.string().trim().url("Invalid URL format"),
]);

const PRISMA_DECIMAL = z
  .string()
  .transform((val) => removeCommas(val))
  .refine((val) => !isNaN(Number(val)), "Invalid number");

const PRISMA_POSITIVE_DECIMAL = z
  .string()
  .transform((val) => removeCommas(val))
  .refine((val) => !isNaN(Number(val)), "Invalid number")
  .refine((val) => Number(val) >= 0, "Number must be 0 or more");

export const CustomZod = {
  OPTIONAL_POSITIVE_NUMBER,
  OPTIONAL_URL,
  PRISMA_DECIMAL,
  PRISMA_POSITIVE_DECIMAL,
};
