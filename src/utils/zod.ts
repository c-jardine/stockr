import { z } from "zod";

const OPTIONAL_POSITIVE_NUMBER = z.union([z.number().min(0), z.nan()]);

const OPTIONAL_URL = z.union([
  z.literal(""),
  z.string().trim().url("Invalid URL format"),
]);

export const CustomZod = {
  OPTIONAL_POSITIVE_NUMBER,
  OPTIONAL_URL,
};
