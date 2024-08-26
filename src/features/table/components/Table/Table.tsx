import {
  Box,
  Button,
  type ContainerProps,
  HStack,
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

import { Section } from "~/components/Section";

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
}

export function Table<ColType>({
  rowData,
  columnDefs,
  autoSizeStrategy,
  containerProps,
  ...props
}: TableProps<ColType>) {
  const className = useColorModeValue(
    "ag-theme-quartz",
    "ag-theme-quartz-dark"
  );

  const gridOptions: GridOptions<ColType> = {
    rowData,
    columnDefs,
    rowSelection: "multiple",
    rowMultiSelectWithClick: true,
    autoSizeStrategy,
  };

  return (
    <Section
      className={className}
      fontFamily={poppins.style.fontFamily}
      fontSize="xs"
      flexGrow={1}
      p={0}
      overflow="hidden"
      {...containerProps}
    >
      <Box position="fixed" top={4} left={0} p={4} w={64}>
        <Section>
          <HStack justifyContent="flex-end" gap={4}>
            <Text>selected</Text>
            <Button>Delete</Button>
          </HStack>
        </Section>
      </Box>
      <AgGridReact {...gridOptions} {...props} />
    </Section>
  );
}
