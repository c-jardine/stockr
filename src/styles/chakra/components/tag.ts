import { tagAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const helper = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helper.definePartsStyle((props) => ({
  container: {
    border: "1px solid",
    borderColor: mode("zinc.300", "zinc.700")(props),
    bg: mode("zinc.100", "zinc.800")(props),
    color: mode("zinc.600", "zinc.400")(props),
    fontSize: "xs",
    fontWeight: "normal",
  },
}));

export const tagTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
