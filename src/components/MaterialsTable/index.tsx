import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

import useTableAutoSizeStrategy from "~/hooks/useTableAutoSizeStrategy";
import useTableTheme from "~/hooks/useTableTheme";
import { type StockStatus } from "~/types/status";
import { api } from "~/utils/api";
import { getStockAsText } from "~/utils/stock";
import { getStockStatus } from "~/utils/stockStatus";
import { StatusCellRenderer } from "./StatusCellRenderer";

import { Poppins } from "next/font/google"; // Override table theme font
import Section from "../Section";
const poppins = Poppins({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

type MaterialTableColumnsDef = {
  sku: string | null;
  name: string;
  status: StockStatus;
  stock: string | null;
  vendor: string | null;
  categories: string[] | null;
  notes: string | null;
};

const colDefs: ColDef[] = [
  {
    headerName: "SKU",
    field: "sku",
    editable: true,
    filter: true,
  },
  {
    headerName: "Name",
    field: "name",
    editable: true,
    filter: true,
    autoHeight: true,
    flex: 1,
  },
  {
    headerName: "Status",
    field: "status",
    cellRenderer: StatusCellRenderer,
  },
  { headerName: "Stock", field: "stock" },
  { headerName: "Vendor", field: "vendor", filter: true },
  { headerName: "Categories", field: "categories" },
];

export default function MaterialsTable() {
  const { data: session } = useSession();

  // Fetch materials query
  const { data: materials, isLoading } = api.material.getAll.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  );

  // Table config
  const theme = useTableTheme();
  const autoSizeStrategy = useTableAutoSizeStrategy([
    "sku",
    "status",
    "stock",
    "vendor",
    "categories",
  ]);

  // Materials data as state
  const [rowData, setRowData] = React.useState<MaterialTableColumnsDef[]>([]);

  // Update table data when the data is available.
  React.useEffect(() => {
    if (materials) {
      setRowData(
        materials.map((material) => ({
          sku: material.sku,
          name: material.name,
          status: getStockStatus(material.stockLevel, material.minStockLevel),
          stock: getStockAsText(material.stockLevel, material.stockUnitType),
          vendor: material.vendor,
          categories: material.categories?.map(({ category }) => category.name),
          notes: material.notes,
        }))
      );
    }
  }, [materials]);

  // Show spinner if query is loading
  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" flexGrow={1}>
        <PuffLoader color="var(--chakra-colors-blue-500)" />
      </Flex>
    );
  }

  if (!materials) {
    return null;
  }

  return (
    <Section
      className={theme}
      fontFamily={poppins.style.fontFamily}
      fontSize="xs"
      flexGrow={1}
      p={0}
      overflow='hidden'
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        rowSelection="multiple"
        autoSizeStrategy={autoSizeStrategy}
      />
    </Section>
  );
}
