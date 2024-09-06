import {
  Box,
  Button,
  type ContainerProps,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Manrope } from "next/font/google"; // Override table theme font
import { useMemo, useState } from "react";

import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import {
  type ColDef,
  type GridOptions,
  type SizeColumnsToContentStrategy,
  type SizeColumnsToFitGridStrategy,
  type SizeColumnsToFitProvidedWidthStrategy,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Section } from "~/components/Section";
import { useGridApi } from "../../hooks";

const manrope = Manrope({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

interface TableProps<ColType> extends AgGridReactProps {
  rowData: ColType[];
  columnDefs: ColDef<ColType>[];
  autoSizeStrategy?:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy;
  containerProps?: ContainerProps;
  onDelete?: (data: string[]) => void;
}

export function Table<ColType>({
  rowData,
  columnDefs,
  autoSizeStrategy,
  containerProps,
  onDelete,
  ...props
}: TableProps<ColType>) {
  const { gridRef, gridApi } = useGridApi();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  function onSelectionChanged() {
    // TODO: Terrible typing. Fix it!
    const selected = gridApi?.getSelectedRows() as ({ id: string } & ColType)[];
    const ids = selected.map((row) => row.id);
    if (selected) {
      setSelectedRows(ids);
    }
  }

  function handleClearSelection() {
    gridApi?.deselectAll();
  }

  const { isOpen, onOpen, onClose } = useDisclosure({
    id: "confirmDeleteMaterials",
  });

  function handleDelete() {
    if (onDelete) {
      onDelete(selectedRows);
      onClose();
    }
  }

  const className = useColorModeValue(
    "ag-theme-quartz",
    "ag-theme-quartz-dark"
  );

  const memoizedAutoSizeStrategy = useMemo(
    () => autoSizeStrategy,
    [autoSizeStrategy]
  );

  const gridOptions: GridOptions<ColType> = {
    rowData: useMemo(() => rowData, [rowData]),
    columnDefs: useMemo(() => columnDefs, [columnDefs]),
    suppressCellFocus: true,
    rowSelection: "multiple",
    rowMultiSelectWithClick: false,
    suppressRowClickSelection: true,
    autoSizeStrategy: autoSizeStrategy ? memoizedAutoSizeStrategy : undefined,
    onSelectionChanged,
  };

  return (
    <Section
      className={className}
      p={0}
      flexGrow={1}
      overflow="hidden"
      fontFamily={manrope.style.fontFamily}
      fontSize="xs"
      {...containerProps}
    >
      <ScaleFade
        initialScale={0.9}
        in={selectedRows?.length > 0}
        style={{
          display: selectedRows?.length > 0 ? "block" : "none",
          zIndex: selectedRows?.length > 0 ? 10 : "unset",
          position: "fixed",
          bottom: 4,
          right: 0,
          padding: 4,
        }}
      >
        <Box>
          <Section>
            <HStack justifyContent="flex-end" gap={4}>
              <Text>{selectedRows.length} selected</Text>
              <Button onClick={handleClearSelection}>Clear</Button>
              <>
                <Button colorScheme="red" onClick={onOpen}>
                  Delete
                </Button>
                <Modal {...{ isOpen, onClose }}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Confirm delete</ModalHeader>
                    <ModalBody>
                      Are you sure you want to delete {selectedRows.length}{" "}
                      {selectedRows.length === 1 ? "row" : "rows"}?
                    </ModalBody>
                    <ModalFooter gap={4}>
                      <Button colorScheme="red" onClick={handleDelete}>
                        Delete
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            </HStack>
          </Section>
        </Box>
      </ScaleFade>
      <AgGridReact ref={gridRef} {...gridOptions} {...props} />
    </Section>
  );
}
