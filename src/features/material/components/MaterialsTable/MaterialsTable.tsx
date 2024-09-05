import { Flex, useToast } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  type ColDef,
  type ValueFormatterParams,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/features/table/components/Table";
import { getQuantityTextAbbreviated, getQuantityUnitText } from "~/utils";
import { api, type RouterOutputs } from "~/utils/api";
import { Character } from "~/utils/text";
import { NameCellRenderer } from "./NameCellRenderer";
import { QuantityCellRenderer } from "./QuantityCellRenderer";
import { StatusCellRenderer } from "./StatusCellRenderer";

// Table column type definition
export type MaterialsTableRows = {
  id: string;
  name: string;
  status: string;
  quantity: Prisma.Decimal;
  minQuantity: Prisma.Decimal | null;
  cost: Prisma.Decimal | null;
  vendor: string;
  extraData: RouterOutputs["material"]["getAll"][0];
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
  const [rowData, setRowData] = React.useState<MaterialsTableRows[]>([]);

  // Update table data when the data is available
  React.useEffect(() => {
    if (materials) {
      setRowData(
        materials.map((material) => ({
          id: material.id,
          name: material.name,
          status: "Format status",
          quantity: material.quantity,
          minQuantity: material.minQuantity,
          cost: material.cost,
          vendor: material.vendor?.name ?? "",
          categories: material.categories.map((category) => category.name),
          extraData: material,
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
      valueFormatter: (
        params: ValueFormatterParams<MaterialsTableRows, Prisma.Decimal>
      ) => {
        if (!params.value || !params.data) {
          return Character.EM_DASH;
        }
        return getQuantityTextAbbreviated(
          params.value,
          params.data.extraData.quantityUnit
        );
      },
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Cost",
      field: "cost",
      valueFormatter: (
        params: ValueFormatterParams<MaterialsTableRows, Prisma.Decimal>
      ) => {
        if (params.value && params.data) {
          return `$${new Prisma.Decimal(
            params.value
          ).toString()} /${getQuantityUnitText({
            quantity: params.value,
            quantityUnit: params.data.extraData.quantityUnit,
            style: "abbreviation",
          })}`;
        }
        return Character.EM_DASH;
      },
      cellStyle: {
        display: "flex",
        alignItems: "center",
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
