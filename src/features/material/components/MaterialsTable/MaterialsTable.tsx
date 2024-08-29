import { Flex, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/features/table/components/Table";
import { api, type RouterOutputs } from "~/utils/api";
import { NameCellRenderer } from "./NameCellRenderer";
import { QuantityCellRenderer } from "./QuantityCellRenderer";
import { StatusCellRenderer } from "./StatusCellRenderer";

// Table column type definition
export type MaterialsTableRows = {
  name: string;
  status: string;
  quantity: number;
  vendor: string;
  sku: string;
  categories: string[];
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
          name: material.name,
          status: "Format status",
          quantity: material.quantity as unknown as number,
          vendor: material.vendor?.name ?? "",
          sku: material.sku ?? "",
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
    },
    {
      headerName: "Quantity",
      field: "quantity",
      cellRenderer: QuantityCellRenderer,
    },
    {
      headerName: "Vendor",
      field: "vendor",
      filter: true,
    },
    {
      headerName: "SKU",
      field: "sku",
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
    <Table<MaterialsTableRows>
      rowData={rowData}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: ["status", "quantity", "vendor", "sku", "categories"],
      }}
      onDelete={onDelete}
    />
  );
}
