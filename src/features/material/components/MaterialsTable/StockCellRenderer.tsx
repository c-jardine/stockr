import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Textarea,
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
            <PopoverBody>
              <FormControl>
                <FormLabel>Update type</FormLabel>
                <Input />
              </FormControl>
              <FormControl>
                <FormLabel>Stock level</FormLabel>
                <Input />
              </FormControl>
              <FormControl>
                <FormLabel>Stock unit</FormLabel>
                <Input />
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea />
              </FormControl>
            </PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end" gap={4}>
              <Button size="sm">Cancel</Button>
              <Button variant="primary" size="sm">
                Save
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
}
