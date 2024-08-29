import { Flex } from "@chakra-ui/react";
import { MaterialStockUpdateAction } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/features/table/components/Table";
import { api, RouterOutputs } from "~/utils/api";
import { AdjustedQuantityCellRenderer } from "./AdjustedQuantityCellRenderer";
import { CreatedAtRenderer } from "./CreatedAtRenderer";
import { CreatedByRenderer } from "./CreatedByRenderer";
import { UpdateTypeRenderer } from "./UpdateTypeRenderer";

// Table row type definition
export type MaterialLogsTableRows = {
  name: string;
  type: MaterialStockUpdateAction;
  newStock: number;
  previousStockLevel: number;
  adjustedQuantity: number;
  createdBy: string;
  createdAt: Date;
  extraData: RouterOutputs["material"]["getStockUpdates"][0];
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
  const [rowData, setRowData] = React.useState<MaterialLogsTableRows[]>([]);

  // Update table data when the data is available
  React.useEffect(() => {
    if (updates) {
      setRowData(
        updates.map((update) => ({
          name: update.material.name,
          type: update.type.action,
          newStock: update.adjustmentQuantity as unknown as number,
          previousStockLevel: update.previousStockLevel as unknown as number,
          adjustedQuantity: update.adjustmentQuantity as unknown as number,
          createdBy: update.createdBy.name ?? "Unknown",
          createdAt: update.createdAt,
          extraData: update, // Pass all data so cell renderers can use it
        }))
      );
    }
  }, [updates]);

  const colDefs: ColDef<MaterialLogsTableRows>[] = [
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
      headerName: "New stock",
      field: "newStock",
      // cellRenderer: StockCellRenderer,
    },
    {
      headerName: "Previous",
      field: "previousStockLevel",
    },
    {
      headerName: "Adjusted",
      field: "adjustedQuantity",
      cellRenderer: AdjustedQuantityCellRenderer,
    },
    {
      headerName: "User",
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
    <Table<MaterialLogsTableRows>
      rowData={rowData}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: [
          "type",
          "stockChange",
          "previousStockLevel",
          "adjustedQuantity",
          "createdBy",
          "createdAt",
        ],
      }}
    />
  );
}
