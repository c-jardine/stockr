import { Flex, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function AdjustedQuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  const negativeColor = useColorModeValue("red.600", "red.500");
  const positiveColor = useColorModeValue("green.600", "green.500");

  if (!node.data) {
    return null;
  }

  const { originalQuantity, adjustedQuantity, type } = node.data;

  const prev = new Prisma.Decimal(originalQuantity);
  const adj = new Prisma.Decimal(adjustedQuantity);

  const quantityDifference = adj.sub(prev);

  function getIcon() {
    if (quantityDifference.lessThan(0)) {
      return FaArrowDown;
    }
    if (quantityDifference.greaterThanOrEqualTo(0)) {
      return FaArrowUp;
    }

    return null;
  }

  function getColor() {
    if (quantityDifference.lessThan(0)) {
      return negativeColor;
    }
    if (quantityDifference.greaterThanOrEqualTo(0)) {
      return positiveColor;
    }
  }

  const icon = getIcon();
  const color = getColor();

  function getAdjustedBy() {
    switch (type) {
      case "SET": {
        if (adj < prev) {
          return prev.sub(adj);
        }
        if (adj > prev) {
          return adj.sub(prev);
        }
        return adj;
      }
      default: {
        return adj;
      }
    }
  }

  const adjustedBy = getAdjustedBy();

  return (
    <Flex alignItems="center" h="full">
      <HStack color={color}>
        {icon && <Icon as={icon} />}
        <Text>{adjustedBy?.toNumber()}</Text>
      </HStack>
    </Flex>
  );
}
