import { HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { type CustomCellRendererProps } from "ag-grid-react";
import { FaClipboardList } from "react-icons/fa6";
import { type MaterialLogsTableColumns } from "./MaterialLogsTable";

export function UpdateTypeRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableColumns>) {
  const color = useColorModeValue(
    node.data ? `${node.data.type.color}.600` : "unset",
    node.data ? `${node.data.type.color}.500` : "unset"
  );

  if (!node.data) {
    return null;
  }

  function getUpdateTypeIcon() {
    if (node.data?.type.name === "Audit") {
      return FaClipboardList;
    }

    return null;
  }

  const icon = getUpdateTypeIcon();

  if (!icon) {
    return null;
  }

  return (
    <HStack h="full" alignItems="center" color={color}>
      <Icon as={icon} boxSize={4} />
      <Text>{node.data.type.name}</Text>
    </HStack>
  );
}
