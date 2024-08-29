import {
  Flex,
  Tag,
  TagLabel,
  TagLeftIcon,
  useColorModeValue,
  type TagProps,
} from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { type QuantityStatus } from "~/types/status";
import { type MaterialsTableRows } from "./MaterialsTable";

export function StatusCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableRows>) {
  function getStyles(status: QuantityStatus): TagProps {
    switch (status) {
      case "Available": {
        // TODO: Fix this
        return {
          border: "1px",
          borderColor: useColorModeValue("green.300", "green.900"),
          bg: useColorModeValue("green.100", "green.950"),
          color: useColorModeValue("green.800", "green.500"),
        };
      }
      case "Low stock": {
        return {
          border: "1px",
          borderColor: useColorModeValue("yellow.300", "yellow.900"),
          bg: useColorModeValue("yellow.100", "yellow.950"),
          color: useColorModeValue("yellow.800", "yellow.500"),
        };
      }
      case "Out of stock": {
        return {
          border: "1px",
          borderColor: useColorModeValue("red.300", "red.900"),
          bg: useColorModeValue("red.100", "red.950"),
          color: useColorModeValue("red.800", "red.500"),
        };
      }
      default: {
        return {};
      }
    }
  }

  if (!node.data?.status) {
    return null;
  }

  return (
    <Flex alignItems="center" h="full">
      <Tag
        fontSize="xs"
        fontWeight="light"
        {...getStyles(node.data?.status)}
        ico
      >
        <TagLeftIcon as={FaCircle} boxSize={1.5} />
        <TagLabel>{node.data?.status}</TagLabel>
      </Tag>
    </Flex>
  );
}
