import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import { Table } from "~/features/table/components/Table";
import { type StockStatus } from "~/types/status";
import { api } from "~/utils/api";
import { getStockAsText } from "~/utils/stock";
import { getStockStatus } from "~/utils/stockStatus";
import { StatusCellRenderer } from "./StatusCellRenderer";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

export type ColType = {
  id: string;
  sku: string | null;
  name: string;
  status: StockStatus;
  stock: string | null;
  vendor: string | null;
  categories: string[] | null;
  notes: string | null;
};

// const colDefs: ColDef<ColType>[] =

export function MaterialsTable() {
  const { data: session } = useSession();

  // Fetch materials query
  const { data: materials, isLoading } = api.material.getAll.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  );

  // Materials data as state
  const [rowData, setRowData] = React.useState<ColType[]>([]);

  // Update table data when the data is available
  React.useEffect(() => {
    if (materials) {
      setRowData(
        materials.map((material) => ({
          id: material.id,
          sku: material.sku,
          name: material.name,
          status: getStockStatus(material.stockLevel, material.minStockLevel),
          stock: getStockAsText(material.stockLevel, material.stockUnitType),
          vendor: material.vendor?.name ?? null,
          categories: material.categories?.map((category) => category.name),
          notes: material.notes,
        }))
      );
    }
  }, [materials]);

  const colDefs: ColDef<ColType>[] = [
    {
      headerName: "SKU",
      field: "sku",
      editable: true,
      filter: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
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
    {
      headerName: "Stock",
      field: "stock",
    },
    {
      headerName: "Vendor",
      field: "vendor",
      filter: true,
    },
    {
      headerName: "Categories",
      field: "categories",
    },
  ];

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
    <Table<ColType>
      rowData={rowData}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: ["sku", "status", "stock", "vendor", "categories"],
      }}
    />
  );
}
