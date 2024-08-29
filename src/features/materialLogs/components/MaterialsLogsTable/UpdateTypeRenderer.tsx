import { HStack, Text, useColorModeValue } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function UpdateTypeRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  const color = useColorModeValue(
    node.data ? `${node.data.extraData.type.color}.600` : "unset",
    node.data ? `${node.data.extraData.type.color}.500` : "unset"
  );

  if (!node.data) {
    return null;
  }

  const {
    extraData: { type },
  } = node.data;

  return (
    <HStack h="full" alignItems="center" color={color}>
      <Text>{type.type}</Text>
    </HStack>
  );
}
