import { type Prisma } from "@prisma/client";

export function getStockAsText(
  stock: Prisma.Decimal | null,
  stockUnit: string | null
) {
  if (!stock) {
    return "—";
  }
  return `${stock.toString()} ${stockUnit}`;
}
