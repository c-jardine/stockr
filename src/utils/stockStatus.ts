import { Prisma } from "@prisma/client";
import { type StockStatus } from "~/types/status";

function calculateStockStatus(
  stock: Prisma.Decimal | null,
  minStock: Prisma.Decimal | null
): StockStatus {
  if (!stock || !minStock) {
    return null;
  }

  if (stock.equals(0)) {
    return "Out of stock";
  }

  const ratio = stock.div(minStock);
  if (ratio.lessThanOrEqualTo(0.5)) {
    return "Low stock";
  }

  return "Available";
}

/**
 * Get the stock status.
 * @param stock The current stock.
 * @param minStock The minimum stock.
 * @returns The stock status.
 */
export function getStockStatus(
  stock: Prisma.Decimal | null,
  minStock: Prisma.Decimal | null
) {
  return calculateStockStatus(
    stock && new Prisma.Decimal(stock),
    minStock && new Prisma.Decimal(minStock)
  );
}
