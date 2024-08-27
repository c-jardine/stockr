import { popoverAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const helper = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helper.definePartsStyle((props) => ({
  dialog: {
    bg: mode("white", "zinc.950")(props),
    border: "1px",
    borderColor: mode("zinc.200", "zinc.800")(props),
  },
  header: {
    p: 4,
    fontSize: "sm",
    fontWeight: "semibold",
    borderBottom: "none",
  },
  body: {
    px: 4,
    py: 0,
  },
  footer: {
    p: 4,
    borderTop: "none",
  },
}));

export const popoverTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
