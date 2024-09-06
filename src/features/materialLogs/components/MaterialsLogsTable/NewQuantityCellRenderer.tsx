import { Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { calculateAdjustedQuantity } from "~/utils/quantityAdjustment";
import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function NewQuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { originalQuantity, adjustedQuantity, type, material } = node.data;

  const adjustedBy = calculateAdjustedQuantity({
    previousQuantity: originalQuantity,
    adjustmentAmount: adjustedQuantity,
    action: type.action,
  });

  return (
    <Text>
      {formatQuantityWithUnitAbbrev({
        quantity: adjustedBy,
        quantityUnit: material.quantityUnit,
      })}
    </Text>
  );
}
