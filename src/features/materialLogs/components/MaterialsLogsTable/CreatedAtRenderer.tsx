import { Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { getDateFormat } from "~/utils/date";
import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function CreatedAtRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { createdAt } = node.data;

  const { date, time } = getDateFormat(createdAt);

  return (
    <Text>
      {date}, {time}
    </Text>
  );
}
