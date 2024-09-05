import {
  MaterialQuantityUnit,
  MaterialQuantityUpdateAction,
  Prisma,
} from "@prisma/client";
import { Character } from "./text";

export function getStockAsText(
  quantity: Prisma.Decimal | null,
  quantityUnit: string | null
) {
  if (!quantity) {
    return Character.EM_DASH;
  }
  return `${quantity.toString()} ${quantityUnit}`;
}

export function getQuantityUnitText(props: {
  quantity: Prisma.Decimal;
  quantityUnit: MaterialQuantityUnit;
  style: "name" | "full" | "abbreviation";
}) {
  const { quantity, quantityUnit, style } = props;
  if (!quantity) {
    return null;
  }

  const q = new Prisma.Decimal(quantity);

  if (style === "name") {
    return quantityUnit.name;
  }

  if (q.equals(1)) {
    if (style === "full") {
      return quantityUnit.singular;
    }
    return quantityUnit.abbrevSingular;
  }

  if (style === "full") {
    return quantityUnit.plural;
  }
  return quantityUnit.abbrevPlural;
}

/**
 * Get the quantity text with abbreviated units (12 fl. oz.).
 * @param quantity The quantity.
 * @param quantityUnit The quantity unit object.
 * @returns The quantity text.
 */
export function getQuantityTextAbbreviated(
  quantity: Prisma.Decimal | null,
  quantityUnit: MaterialQuantityUnit
) {
  if (!quantity) {
    return Character.EM_DASH;
  }

  const quantityUnitText = getQuantityUnitText({
    quantity,
    quantityUnit: quantityUnit,
    style: "abbreviation",
  });

  return `${quantity} ${quantityUnitText}`;
}

/**
 * Calculate the new quantity based on the update action type.
 * @param Object containing the previous quantity, adjusted quantity, and
 * update action type.
 * @returns The new quantity.
 */
export function calculateUpdatedQuantity({
  prevQuantity,
  adjustedQuantity,
  action,
}: {
  prevQuantity: Prisma.Decimal;
  adjustedQuantity: Prisma.Decimal;
  action: MaterialQuantityUpdateAction;
}): Prisma.Decimal | null {
  if (!prevQuantity) {
    return null;
  }

  if (!adjustedQuantity) {
    return new Prisma.Decimal(prevQuantity);
  }

  switch (action) {
    case "DECREASE":
      return prevQuantity.sub(adjustedQuantity);
    case "SET":
      return adjustedQuantity;
    case "INCREASE":
      return prevQuantity.add(adjustedQuantity);
    default:
      return prevQuantity;
  }
}
