import { menuAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const helper = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helper.definePartsStyle((props) => ({
  list: {
    bg: mode("white", "zinc.950")(props),
    border: "1px",
    borderColor: mode("zinc.200", "zinc.800")(props),
  },
  item: {
    bg: mode("white", "zinc.950")(props),
    _hover: {
      bg: mode("zinc.100", "zinc.800")(props),
    },
    divider: {
      borderColor: mode("zinc.200", "zinc.800")(props),
    },
  },
}));

export const menuTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
