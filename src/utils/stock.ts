import { MaterialQuantityUnit, Prisma } from "@prisma/client";

export function getStockAsText(
  quantity: Prisma.Decimal | null,
  quantityUnit: string | null
) {
  if (!quantity) {
    return "—";
  }
  return `${quantity.toString()} ${quantityUnit}`;
}

export function getQuantityUnitText(props: {
  quantity: number | Prisma.Decimal | null;
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
