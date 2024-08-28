import { Flex, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { type CustomCellRendererProps } from "ag-grid-react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

import { type MaterialLogsTableColumns } from "./MaterialLogsTable";

export function StockCellRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableColumns>) {
  const negativeColor = useColorModeValue("red.600", "red.800");
  const positiveColor = useColorModeValue("green.600", "green.800");

  if (!node.data) {
    return null;
  }

  const stockDifference =
    node.data.newStockLevel - node.data.previousStockLevel;

  function getIcon() {
    if (stockDifference < 0) {
      return FaArrowDown;
    }
    if (stockDifference >= 0) {
      return FaArrowUp;
    }

    return null;
  }

  function getColor() {
    if (stockDifference < 0) {
      return negativeColor;
    }
    if (stockDifference >= 0) {
      return positiveColor;
    }
  }

  const icon = getIcon();
  const color = getColor();

  return (
    <Flex alignItems="center" h="full">
      {stockDifference === 0 && <Text>—</Text>}
      {stockDifference !== 0 && (
        <HStack color={color}>
          {icon && <Icon as={icon} />}
          <Text>{Math.abs(stockDifference)}</Text>
        </HStack>
      )}
    </Flex>
  );
}
