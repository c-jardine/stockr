import { HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { type CustomCellRendererProps } from "ag-grid-react";
import { FaClipboardList } from "react-icons/fa6";
import { type MaterialLogsTableColumns } from "./MaterialLogsTable";

export function UpdateTypeRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableColumns>) {
  const auditColor = useColorModeValue("indigo.600", "indigo.800");

  if (!node.data) {
    return null;
  }

  function getUpdateTypeIcon() {
    if (node.data?.type === "Audit") {
      return FaClipboardList;
    }

    return null;
  }

  function getColor() {
    if (node.data?.type === "Audit") {
      return auditColor;
    }

    return "unset";
  }

  const icon = getUpdateTypeIcon();
  const color = getColor();

  if (!icon) {
    return null;
  }

  return (
    <HStack h="full" alignItems="center" color={color}>
      <Icon as={icon} boxSize={4} />
      <Text>{node.data.type}</Text>
    </HStack>
  );
}
