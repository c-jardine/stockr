import { Flex, useToast } from "@chakra-ui/react";
import { type Prisma, type Vendor } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  type ColDef,
  type ValueFormatterParams,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/features/table/components/Table";
import { api, type RouterOutputs } from "~/utils/api";
import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { Character } from "~/utils/text";
import { NameCellRenderer } from "./NameCellRenderer";
import { QuantityCellRenderer } from "./QuantityCellRenderer";
import { StatusCellRenderer } from "./StatusCellRenderer";

// Table column type definition
export type MaterialsTableRows = RouterOutputs["material"]["getAll"][0] & {
  status: string;
};

export function MaterialsTable() {
  const { data: session } = useSession();

  // Fetch materials query
  const { data: materials, isLoading } = api.material.getAll.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
    }
  );

  const toast = useToast();

  const utils = api.useUtils();
  const deleteMutation = api.material.deleteAll.useMutation({
    onSuccess: async ({ count }) => {
      toast({
        title: "Deleted materials",
        description: `Deleted ${count} materials`,
        status: "success",
      });
      await utils.material.getAll.invalidate();
    },
  });

  function onDelete(data: string[]) {
    deleteMutation.mutate(data);
  }

  // Materials data as state
  const [rowData, setRowData] = useState<MaterialsTableRows[]>([]);

  // Update table data when the data is available
  useEffect(() => {
    if (materials) {
      setRowData(
        materials.map((material) => ({
          ...material,
          status: "Format status",
        }))
      );
    }
  }, [materials]);

  const colDefs: ColDef<MaterialsTableRows>[] = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      autoHeight: true,
      flex: 1,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: NameCellRenderer,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Quantity",
      field: "quantity",
      cellRenderer: QuantityCellRenderer,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Min. quantity",
      field: "minQuantity",
      filter: true,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
      valueFormatter: (
        params: ValueFormatterParams<MaterialsTableRows, Prisma.Decimal>
      ) => {
        if (!params.value || !params.data) {
          return Character.EM_DASH;
        }
        return formatQuantityWithUnitAbbrev({
          quantity: params.value,
          quantityUnit: params.data.quantityUnit,
        });
      },
    },
    {
      headerName: "Cost",
      field: "cost",
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
      valueFormatter: (
        params: ValueFormatterParams<MaterialsTableRows, Prisma.Decimal>
      ) => {
        if (!params.value || !params.data) {
          return Character.EM_DASH;
        }
        return `$${params.value} /${params.data.quantityUnit.abbrevSingular}`;
      },
    },
    {
      headerName: "Vendor",
      field: "vendor",
      filter: true,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
      valueFormatter: (
        params: ValueFormatterParams<MaterialsTableRows, Vendor>
      ) => {
        if (!params.value) {
          return Character.EM_DASH;
        }

        return params.value.name;
      },
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
    <Table<MaterialsTableRows>
      rowData={rowData}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: ["status", "quantity", "minQuantity", "cost", "vendor"],
      }}
      onDelete={onDelete}
    />
  );
}
