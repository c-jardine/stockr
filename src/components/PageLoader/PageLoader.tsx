import { Stack, StackProps } from "@chakra-ui/react";
import { LoaderSizeProps } from "react-spinners/helpers/props";
import PuffLoader from "react-spinners/PuffLoader";

interface PageLoaderProps extends StackProps {
  loaderProps?: LoaderSizeProps;
}

export function PageLoader({ loaderProps, ...props }: PageLoaderProps) {
  return (
    <Stack h="full" pt={16} alignItems="center" {...props}>
      <PuffLoader color="var(--chakra-colors-blue-500)" {...loaderProps} />
    </Stack>
  );
}
