import { type MaterialQuantityUnit, Prisma } from "@prisma/client";
import { Character } from "./text";

interface FormatQuantityWithUnitOptions {
  /** The quantity, used to determine if the unit should be singular or plural. */
  quantity: Prisma.Decimal;
  /** The quantity unit object. */
  quantityUnit: MaterialQuantityUnit;
  /**
   * The style in which the units should be displayed. "name" is generally the
   * full, plural form. "full" is the full unit name (ounce, ounces, etc.).
   * "abbreviation" is the abbreviated form (lbs., fl. oz., etc.).
   */
  style: "name" | "full" | "abbreviation";
}

/**
 * Get a string representation of a quantity and unit (1 lb., 7 lbs., 12 fluid
 * ounces, etc.).
 *
 * @param options - The options for the function.
 * @returns A string representation the quantity and units.
 */
export function formatQuantityWithUnit(options: FormatQuantityWithUnitOptions) {
  const { quantity, quantityUnit, style } = options;
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

interface FormatQuantityWithUnitAbbrevOptions {
  /** The quantity, used to determine if the unit should be singular or plural. */
  quantity: Prisma.Decimal | null;
  /** The quantity unit object. */
  quantityUnit: MaterialQuantityUnit;
}

/**
 * Get the quantity text with abbreviated units (12 fl. oz.).
 *
 * @param options - The options for the function.
 * @returns A string representation of the quantity and units.
 */
export function formatQuantityWithUnitAbbrev(
  options: FormatQuantityWithUnitAbbrevOptions
) {
  if (!options.quantity) {
    return Character.EM_DASH;
  }

  const quantityUnitText = formatQuantityWithUnit({
    quantity: options.quantity,
    quantityUnit: options.quantityUnit,
    style: "abbreviation",
  });

  return `${options.quantity} ${quantityUnitText}`;
}
