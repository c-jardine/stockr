import { Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

import { type CustomCellRendererProps } from "ag-grid-react";

import { getQuantityUnitText } from "~/utils";
import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function PreviousQuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { originalQuantity, extraData } = node.data;

  const prev = new Prisma.Decimal(originalQuantity);

  return (
    <Text>
      {prev?.toNumber()}{" "}
      {getQuantityUnitText({
        quantity: prev,
        quantityUnit: extraData.material.quantityUnit,
        style: "abbreviation",
      })}
    </Text>
  );
}
