import { useColorModeValue } from "@chakra-ui/react";

export function useTableTheme() {
  const theme = useColorModeValue("ag-theme-quartz", "ag-theme-quartz-dark");

  return theme;
}
