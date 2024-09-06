import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

import { Prisma } from "@prisma/client";
import { Table } from "~/features/table/components/Table";
import { api, type RouterOutputs } from "~/utils/api";
import { AdjustedQuantityCellRenderer } from "./AdjustedQuantityCellRenderer";
import { CreatedAtRenderer } from "./CreatedAtRenderer";
import { CreatedByRenderer } from "./CreatedByRenderer";
import { NewQuantityCellRenderer } from "./NewQuantityCellRenderer";
import { PreviousQuantityCellRenderer } from "./PreviousQuantityCellRenderer";
import { UpdateTypeRenderer } from "./UpdateTypeRenderer";

// Table row type definition
export type MaterialLogsTableRows =
  RouterOutputs["material"]["getQuantityUpdates"][0] & {
    name: string;
    newQuantity: Prisma.Decimal;
  };

export function MaterialLogsTable() {
  const { data: session } = useSession();

  // Fetch materials updates query
  const { data: updates, isLoading } = api.material.getQuantityUpdates.useQuery(
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
      console.log("DATA", updates)
      setRowData(
        updates.map((update) => ({
          ...update,
          name: update.material.name,
          newQuantity: update.adjustedQuantity,
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
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "New quantity",
      field: "newQuantity",
      cellRenderer: NewQuantityCellRenderer,
    },
    {
      headerName: "Previous",
      field: "originalQuantity",
      cellRenderer: PreviousQuantityCellRenderer,
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
          "newQuantity",
          "originalQuantity",
          "adjustedQuantity",
          "createdBy",
          "createdAt",
        ],
      }}
    />
  );
}
