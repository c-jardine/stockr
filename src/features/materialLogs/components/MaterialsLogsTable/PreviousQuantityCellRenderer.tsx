import { Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { getQuantityTextAbbreviated } from "~/utils";
import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function PreviousQuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { originalQuantity, material } = node.data;

  return (
    <Text>
      {getQuantityTextAbbreviated(originalQuantity, material.quantityUnit)}
    </Text>
  );
}
