import { Prisma } from "@prisma/client";
import { type QuantityStatus } from "~/types/status";

function calculateStockStatus(
  quantity: Prisma.Decimal | null,
  minQuantity: Prisma.Decimal | null
): QuantityStatus {
  if (!quantity || !minQuantity) {
    return null;
  }

  if (quantity.equals(0)) {
    return "Out of stock";
  }

  const ratio = quantity.div(minQuantity);
  if (ratio.lessThanOrEqualTo(0.5)) {
    return "Low stock";
  }

  return "Available";
}

/**
 * Get the stock status.
 * @param quantity The current stock.
 * @param minQuantity The minimum stock.
 * @returns The stock status.
 */
export function getStockStatus(
  quantity: Prisma.Decimal | null,
  minQuantity: Prisma.Decimal | null
) {
  return calculateStockStatus(
    quantity && new Prisma.Decimal(quantity),
    minQuantity && new Prisma.Decimal(minQuantity)
  );
}
