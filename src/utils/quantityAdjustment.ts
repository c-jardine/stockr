import { MaterialQuantityUpdateAction, Prisma } from "@prisma/client";

interface CalculateAdjustedQuantityOptions {
  /** The original quantity. */
  previousQuantity: Prisma.Decimal;
  /** The amount to adjust the original quantity by. */
  adjustmentAmount: Prisma.Decimal;
  /**
   * The action to take when adjusting the quantity. Can be "DECREASE", "SET",
   * or "INCREASE".
   */
  action: MaterialQuantityUpdateAction;
}

/**
 * Calculate the adjusted quantity based on the adjustment action type.
 *
 * @param options The options for the function.
 * @returns The adjusted quantity.
 */
export function calculateAdjustedQuantity({
  previousQuantity,
  adjustmentAmount,
  action,
}: CalculateAdjustedQuantityOptions): Prisma.Decimal | null {
  if (!previousQuantity) {
    return null;
  }

  if (!adjustmentAmount) {
    return new Prisma.Decimal(previousQuantity);
  }

  const prev = new Prisma.Decimal(previousQuantity);
  const adj = new Prisma.Decimal(adjustmentAmount);

  switch (action) {
    case "DECREASE":
      return prev.sub(adj);
    case "SET":
      return adj;
    case "INCREASE":
      return prev.add(adj);
    default:
      return prev;
  }
}
