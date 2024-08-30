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
import { Montserrat } from "next/font/google"; // Override table theme font

import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import {
  type ColDef,
  type GridOptions,
  type SizeColumnsToContentStrategy,
  type SizeColumnsToFitGridStrategy,
  type SizeColumnsToFitProvidedWidthStrategy,
} from "node_modules/ag-grid-community/dist/types/core/main";

import React from "react";
import { Section } from "~/components/Section";
import { useGridApi } from "../../hooks";

const montserrat = Montserrat({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

interface TableProps<ColType> extends AgGridReactProps {
  rowData: ColType[];
  columnDefs: ColDef<ColType>[];
  autoSizeStrategy:
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

  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

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

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const gridOptions: GridOptions<ColType> = {
    rowData: React.useMemo(() => rowData, [rowData]),
    columnDefs: React.useMemo(() => columnDefs, [columnDefs]),
    suppressCellFocus: true,
    rowSelection: "multiple",
    rowMultiSelectWithClick: false,
    suppressRowClickSelection: true,
    autoSizeStrategy: React.useMemo(() => autoSizeStrategy, [autoSizeStrategy]),
    onSelectionChanged,
  };

  return (
    <Section
      className={className}
      p={0}
      flexGrow={1}
      overflow="hidden"
      fontFamily={montserrat.style.fontFamily}
      fontSize="xs"
      {...containerProps}
    >
      <ScaleFade
        initialScale={0.9}
        in={selectedRows?.length > 0}
        style={{
          zIndex: 10,
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
