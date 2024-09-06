import { useRef } from "react";

import { type AgGridReact } from "ag-grid-react";

export function useGridApi() {
  const gridRef = useRef<AgGridReact>(null);

  const gridApi = gridRef.current?.api;

  return { gridRef, gridApi };
}
