import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { CustomCellRendererProps } from "ag-grid-react";
import { MaterialsTableColumns } from "./MaterialsTable";

export function StockCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableColumns>) {
  return (
    <Popover>
      <PopoverTrigger>
        <Text>{node.data?.stock}</Text>
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
  );
}
