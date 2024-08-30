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
    px: 8,
    pt: 8,
    pb: 4,
  },
  body: {
    px: 8,
    pt: 4,
    pb: 4,
  },
  footer: {
    px: 8,
    pt: 4,
    pb: 8,
  },
}));

export const modalTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
