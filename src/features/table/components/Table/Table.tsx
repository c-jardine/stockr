import {
  Box,
  Button,
  type ContainerProps,
  HStack,
  ScaleFade,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Poppins } from "next/font/google"; // Override table theme font

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

const poppins = Poppins({
  weight: ["400"],
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
  onDelete: (data: string[]) => void;
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

  function handleDelete() {
    onDelete(selectedRows);
  }

  const className = useColorModeValue(
    "ag-theme-quartz",
    "ag-theme-quartz-dark"
  );

  const gridOptions: GridOptions<ColType> = {
    rowData: React.useMemo(() => rowData, [rowData]),
    columnDefs: React.useMemo(() => columnDefs, [columnDefs]),
    rowSelection: "multiple",
    rowMultiSelectWithClick: true,
    autoSizeStrategy: React.useMemo(() => autoSizeStrategy, [autoSizeStrategy]),
    onSelectionChanged,
  };

  return (
    <Section
      className={className}
      p={0}
      flexGrow={1}
      overflow="hidden"
      fontFamily={poppins.style.fontFamily}
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
              <Button colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </HStack>
          </Section>
        </Box>
      </ScaleFade>
      <AgGridReact ref={gridRef} {...gridOptions} {...props} />
    </Section>
  );
}
