import { HStack, Text } from "@chakra-ui/react";
import { type CustomCellRendererProps } from "ag-grid-react";
import { format } from "date-fns/format";
import { type MaterialLogsTableColumns } from "./MaterialLogsTable";

export function CreatedAtRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableColumns>) {
  if (!node.data) {
    return null;
  }

  return (
    <HStack>
      <Text fontWeight="semibold">
        {format(node.data.createdAt, "MMM. dd, yyyy")}
      </Text>
      <Text>{format(node.data.createdAt, "h:mm aa")}</Text>
    </HStack>
  );
}
