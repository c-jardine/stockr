import { Flex, useToast } from "@chakra-ui/react";
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
import { StockCellRenderer } from "./StockCellRenderer";

// Table column type definition
export type MaterialsTableColumns = {
  sku: string | null;
  name: string;
  status: StockStatus;
  stock: string | null;
  vendor: string | null;
  categories: string[] | null;
  notes: string | null;
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
  const [rowData, setRowData] = React.useState<MaterialsTableColumns[]>([]);

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

  const colDefs: ColDef<MaterialsTableColumns>[] = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      autoHeight: true,
      flex: 1,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: "Stock",
      field: "stock",
      cellRenderer: StockCellRenderer,
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
    <Table<MaterialsTableColumns>
      rowData={rowData}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: ["sku", "status", "stock", "vendor", "categories"],
      }}
      onDelete={onDelete}
    />
  );
}
