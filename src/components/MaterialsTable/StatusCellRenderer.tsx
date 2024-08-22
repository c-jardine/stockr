import {
  Flex,
  Tag,
  TagLabel,
  TagLeftIcon,
  type TagProps,
} from "@chakra-ui/react";
import { type CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import { FaCircle } from "react-icons/fa6";
import { type MaterialTableColumnsDef, type StockStatus } from ".";

export const StatusCellRenderer: FunctionComponent<
  CustomCellRendererProps<MaterialTableColumnsDef>
> = ({ node }) => {
  function getStyles(status: StockStatus): TagProps {
    switch (status) {
      case "Available": {
        return {
          border: "1px",
          borderColor: "green.300",
          bg: "green.100",
          color: "green.800",
        };
      }
      case "Low stock": {
        return {
          border: "1px",
          borderColor: "yellow.300",
          bg: "yellow.100",
          color: "yellow.800",
        };
      }
      case "Out of stock": {
        return {
          border: "1px",
          borderColor: "red.300",
          bg: "red.100",
          color: "red.800",
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
      <Tag fontSize='xs' fontWeight="light" {...getStyles(node.data?.status)} ico>
        <TagLeftIcon as={FaCircle} boxSize={1.5} />
        <TagLabel>{node.data?.status}</TagLabel>
      </Tag>
    </Flex>
  );
};
