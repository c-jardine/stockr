import { Flex, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { type CustomCellRendererProps } from "ag-grid-react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { getQuantityUnitText } from "~/utils";
import { Character } from "~/utils/text";
import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function AdjustedQuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  const negativeColor = useColorModeValue("red.600", "red.500");
  const positiveColor = useColorModeValue("green.600", "green.500");

  if (!node.data) return null;

  const { originalQuantity, adjustedQuantity, type, material } = node.data;

  const prev = new Prisma.Decimal(originalQuantity);
  const adj = new Prisma.Decimal(adjustedQuantity);
  const quantityDifference = adj.sub(prev);

  const { icon, color } = quantityDifference.isNegative()
    ? { icon: FaArrowDown, color: negativeColor }
    : { icon: FaArrowUp, color: positiveColor };

  const adjustedBy = type.type === "SET" ? adj.sub(prev).abs() : adj;

  return (
    <Flex alignItems="center" h="full">
      {adjustedBy.isZero() ? (
        <Text>{Character.EM_DASH}</Text>
      ) : (
        <HStack color={color}>
          <Icon as={icon} />
          <Text>
            {adjustedBy.toNumber()}{" "}
            {getQuantityUnitText({
              quantity: adjustedBy,
              quantityUnit: material.quantityUnit,
              style: "abbreviation",
            })}
          </Text>
        </HStack>
      )}
    </Flex>
  );
}
