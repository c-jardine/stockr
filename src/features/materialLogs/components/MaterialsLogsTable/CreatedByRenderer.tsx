import { Avatar, Flex, HStack, Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function CreatedByRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const {
    createdBy: { name, image },
  } = node.data;

  return (
    <Flex alignItems="center" h="full">
      <HStack>
        <Avatar name={name ?? "Unknown"} src={image ?? undefined} size="xs" />
        <Text>{name}</Text>
      </HStack>
    </Flex>
  );
}
