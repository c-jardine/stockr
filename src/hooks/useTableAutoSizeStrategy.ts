import { type SizeColumnsToContentStrategy } from "node_modules/ag-grid-community/dist/types/core/main";
import React from "react";

/**
 * Helper to generate the auto size strategy for AG Grid. This hook uses the
 * fitCellContents strategy type.
 * @param columns An optional list of column IDs to be auto-sized. Leaving this
 * blank will result in all columns being auto-sized.
 * @returns The auto size strategy.
 */
export default function useTableSizing(
  columns?: SizeColumnsToContentStrategy["colIds"]
) {
  const autoSizeStrategy = React.useMemo<SizeColumnsToContentStrategy>(() => {
    return {
      type: "fitCellContents",
      colIds: columns ?? undefined,
    };
  }, [columns]);

  return autoSizeStrategy;
}
