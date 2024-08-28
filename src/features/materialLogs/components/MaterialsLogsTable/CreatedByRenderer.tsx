import { Avatar, Flex, HStack, Text } from "@chakra-ui/react";
import { type CustomCellRendererProps } from "ag-grid-react";

import { type MaterialLogsTableColumns } from "./MaterialLogsTable";

export function CreatedByRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableColumns>) {
  if (!node.data) {
    return null;
  }

  return (
    <Flex alignItems="center" h="full">
      <HStack>
        <Avatar
          name={node.data.createdBy.name}
          src={node.data.createdBy.img}
          size="xs"
        />
        <Text>{node.data.createdBy.name}</Text>
      </HStack>
    </Flex>
  );
}
