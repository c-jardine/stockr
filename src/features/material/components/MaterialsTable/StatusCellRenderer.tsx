import {
  Tag,
  TagLabel,
  TagLeftIcon,
  useColorModeValue,
  type TagProps,
} from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { Prisma } from "@prisma/client";
import { type QuantityStatus } from "~/types/status";
import { getStockStatus } from "~/utils/stockStatus";
import { Character } from "~/utils/text";
import { type MaterialsTableRows } from "./MaterialsTable";

export function StatusCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableRows>) {
  const greenStyles = {
    border: "1px",
    borderColor: useColorModeValue("green.300", "green.900"),
    bg: useColorModeValue("green.100", "green.950"),
    color: useColorModeValue("green.800", "green.500"),
  };

  const yellowStyles = {
    border: "1px",
    borderColor: useColorModeValue("yellow.300", "yellow.900"),
    bg: useColorModeValue("yellow.100", "yellow.950"),
    color: useColorModeValue("yellow.800", "yellow.500"),
  };

  const redStyles = {
    border: "1px",
    borderColor: useColorModeValue("red.300", "red.900"),
    bg: useColorModeValue("red.100", "red.950"),
    color: useColorModeValue("red.800", "red.500"),
  };

  function getStyles(status: QuantityStatus): TagProps {
    switch (status) {
      case "Available":
        return greenStyles;
      case "Low stock":
        return yellowStyles;
      case "Out of stock":
        return redStyles;
      default:
        return {};
    }
  }

  if (!node.data?.status) {
    return Character.EM_DASH;
  }

  const stockStatus =
    node.data.quantity &&
    getStockStatus(
      new Prisma.Decimal(node.data.quantity),
      node.data.extraData.minQuantity
    );

  return (
    <Tag fontSize="xs" fontWeight="light" {...getStyles(stockStatus)}>
      <TagLeftIcon as={FaCircle} boxSize={1.5} />
      <TagLabel>{stockStatus}</TagLabel>
    </Tag>
  );
}
