import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const helper = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helper.definePartsStyle((props) => ({
  dialog: {
    bg: mode("white", "zinc.900")(props),
    border: "1px",
    borderColor: mode("zinc.200", "zinc.800")(props),
    rounded: "2xl",
    p: 8,
  },
  header: {
    mb: 8,
    p: 0,
  },
  body: {
    p: 0,
  },
  footer: {
    mt: 8,
    p: 0,
  },
}));

export const modalTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
