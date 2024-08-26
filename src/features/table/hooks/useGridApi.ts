import { type AgGridReact } from "ag-grid-react";
import React from "react";

export function useGridApi() {
  const gridRef = React.useRef<AgGridReact>(null);

  const gridApi = gridRef.current?.api;

  return { gridRef, gridApi };
}
