import { type Prisma } from "@prisma/client";

export function getStockAsText(
  quantity: Prisma.Decimal | null,
  quantityUnit: string | null
) {
  if (!quantity) {
    return "—";
  }
  return `${quantity.toString()} ${quantityUnit}`;
}
