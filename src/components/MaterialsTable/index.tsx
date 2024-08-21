import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

import { api } from "~/utils/api";

type ColumnType = {
  sku: string | null;
  name: string;
  stock: string | null;
  notes: string | null;
};

export default function MaterialsTable() {
  const { data: session } = useSession();

  const { data, isLoading } = api.material.getAll.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

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
    { headerName: "Stock", field: "stock" },
    { headerName: "Notes", field: "notes", editable: true },
  ];

  const [rowData, setRowData] = React.useState<ColumnType[]>([]);

  // Update table data when the data is available.
  React.useEffect(() => {
    if (data) {
      setRowData(
        data.map((row) => ({
          sku: row.sku,
          name: row.name,
          stock: row.stockLevel
            ? `${row.stockLevel}${row.stockUnitType && ` ${row.stockUnitType}`}`
            : null,
          notes: row.notes,
        }))
      );
    }
  }, [data]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" flexGrow={1}>
        <PuffLoader color="var(--chakra-colors-blue-500)" />
      </Flex>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Box className="ag-theme-quartz" flexGrow={1}>
      <AgGridReact
        pagination={true}
        paginationPageSize={10}
        rowData={rowData}
        columnDefs={colDefs}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
      />
    </Box>
  );
}
