import {
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { CustomCellRendererProps } from "ag-grid-react";
import { MaterialsTableColumns } from "./MaterialsTable";

export function StockCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableColumns>) {
  return (
    <Flex alignItems="center" h="full">
      <Popover>
        <PopoverTrigger>
          <Button variant="stockUpdate" size="sm">
            {node.data?.stock}
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{node.data?.name}</PopoverHeader>
            <PopoverBody></PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
}
