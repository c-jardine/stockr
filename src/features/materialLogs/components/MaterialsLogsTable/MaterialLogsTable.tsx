import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import { Table } from "~/features/table/components/Table";
import { api } from "~/utils/api";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";
import { CreatedAtRenderer } from "./CreatedAtRenderer";
import { CreatedByRenderer } from "./CreatedByRenderer";
import { StockCellRenderer } from "./StockCellRenderer";
import { UpdateTypeRenderer } from "./UpdateTypeRenderer";

// Table column type definition
export type MaterialLogsTableColumns = {
  id: string;
  name: string;
  type: { name: string; color: string };
  previousStockLevel: number;
  newStockLevel: number;
  stock?: number;
  notes: string | null;
  createdBy: { name: string; img: string };
  createdAt: Date;
};

export function MaterialLogsTable() {
  const { data: session } = useSession();

  // Fetch materials updates query
  const { data: updates, isLoading } = api.material.getStockUpdates.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  );

  // Materials data as state
  const [rowData, setRowData] = React.useState<MaterialLogsTableColumns[]>([]);

  // Update table data when the data is available
  React.useEffect(() => {
    if (updates) {
      setRowData(
        updates.map((update) => ({
          id: update.id,
          name: update.material.name,
          type: { name: update.type.type, color: update.type.color },
          previousStockLevel: update.previousStockLevel as unknown as number,
          newStockLevel: update.newStockLevel as unknown as number,
          createdBy: {
            name: update.createdBy?.name ?? "Unknown user",
            img: update.createdBy?.image ?? "",
          },
          createdAt: update.createdAt,
          notes: update.notes,
        }))
      );
    }
  }, [updates]);

  const colDefs: ColDef<MaterialLogsTableColumns>[] = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      autoHeight: true,
      flex: 1,
    },
    {
      headerName: "Type",
      field: "type",
      cellRenderer: UpdateTypeRenderer,
    },
    {
      headerName: "Stock change",
      field: "stock",
      cellRenderer: StockCellRenderer,
    },
    {
      headerName: "Previous",
      field: "previousStockLevel",
    },
    {
      headerName: "New",
      field: "newStockLevel",
    },
    {
      headerName: "Created by",
      field: "createdBy",
      cellRenderer: CreatedByRenderer,
    },
    {
      headerName: "Timestamp",
      field: "createdAt",
      cellRenderer: CreatedAtRenderer,
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

  if (!updates) {
    return null;
  }

  return (
    <Table<MaterialLogsTableColumns>
      rowData={rowData}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: [
          "createdAt",
          // "type",
          "stock",
          "previousStockLevel",
          "newStockLevel",
          "createdBy",
          "notes",
        ],
      }}
    />
  );
}
