import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

import { Prisma } from "@prisma/client";
import { api } from "~/utils/api";
import { StatusCellRenderer } from "./StatusCellRenderer";

export type StockStatus = "Available" | "Low stock" | "Out of stock" | null;

// const statusFormatter: ValueFormatterFunc = ({ value }) =>
//   statuses[value as keyof typeof statuses] ?? "";

export type MaterialTableColumnsDef = {
  sku: string | null;
  name: string;
  status: StockStatus;
  stock: string | null;
  notes: string | null;
};

export default function MaterialsTable() {
  const { data: session } = useSession();

  const { data: materials, isLoading } = api.material.getAll.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  );

  const colDefs: ColDef[] = [
    {
      headerName: "SKU",
      field: "sku",
      editable: true,
      filter: true,
      suppressSizeToFit: true,
    },
    {
      headerName: "Name",
      field: "name",
      editable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Status",
      field: "status",
      // valueFormatter: statusFormatter,
      cellRenderer: StatusCellRenderer,
    },
    { headerName: "Stock", field: "stock" },
    { headerName: "Notes", field: "notes", editable: true },
  ];

  const [rowData, setRowData] = React.useState<MaterialTableColumnsDef[]>([]);

  function calculateStatus(
    stock: Prisma.Decimal | null,
    minStock: Prisma.Decimal | null
  ) {
    if (!stock || !minStock) {
      return null;
    }

    if (stock.equals(0)) {
      return "Out of stock";
    }

    const ratio = stock.div(minStock);
    if (ratio.lessThanOrEqualTo(0.5)) {
      return "Low stock";
    }

    return "Available";
  }

  const getStatus = React.useCallback(
    (stock: Prisma.Decimal | null, minStock: Prisma.Decimal | null) => {
      return calculateStatus(
        stock && new Prisma.Decimal(stock),
        minStock && new Prisma.Decimal(minStock)
      );
    },
    []
  );

  function getStock(stock: Prisma.Decimal | null, stockUnit: string | null) {
    if (!stock) {
      return "—";
    }
    return `${stock.toString()} ${stockUnit}`;
  }

  // Update table data when the data is available.
  React.useEffect(() => {
    if (materials) {
      setRowData(
        materials.map((material) => ({
          sku: material.sku,
          name: material.name,
          status: getStatus(material.stockLevel, material.minStockLevel),
          stock: getStock(material.stockLevel, material.stockUnitType),
          notes: material.notes,
        }))
      );
    }
  }, [getStatus, materials]);

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
    <Box className="ag-theme-quartz" flexGrow={1}>
      <AgGridReact
        pagination={true}
        paginationPageSize={20}
        rowData={rowData}
        columnDefs={colDefs}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
      />
    </Box>
  );
}
