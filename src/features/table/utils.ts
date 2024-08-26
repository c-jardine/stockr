import { type SizeColumnsToContentStrategy } from "node_modules/ag-grid-community/dist/types/core/main";

export function getTableAutoSizeStrategy(
  columns?: SizeColumnsToContentStrategy["colIds"]
): SizeColumnsToContentStrategy {
  return {
    type: "fitCellContents",
    colIds: columns ?? undefined,
  };
}
