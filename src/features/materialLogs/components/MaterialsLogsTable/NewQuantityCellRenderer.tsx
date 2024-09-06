import { Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { calculateUpdatedQuantity, getQuantityTextAbbreviated } from "~/utils";
import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function NewQuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { originalQuantity, adjustedQuantity, type, material } = node.data;

  const adjustedBy = calculateUpdatedQuantity({
    prevQuantity: originalQuantity,
    adjustedQuantity: adjustedQuantity,
    action: type.action,
  });

  return (
    <Text>{getQuantityTextAbbreviated(adjustedBy, material.quantityUnit)}</Text>
  );
}
