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
  },
  header: {
    p: 4,
  },
  body: {
    p: 4,
  },
  footer: {
    p: 4,
  },
}));

export const modalTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
