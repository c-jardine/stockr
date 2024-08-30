import { Stack } from "@chakra-ui/react";
import PuffLoader from "react-spinners/PuffLoader";

export function PageLoader() {
  return (
    <Stack h="full" pt={16} alignItems="center">
      <PuffLoader color="var(--chakra-colors-blue-500)" />
    </Stack>
  );
}
