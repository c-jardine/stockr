import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const helper = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helper.definePartsStyle((props) => ({
  dialog: {
    bg: mode("white", "zinc.900")(props),
    border: "1px",
    borderColor: mode("zinc.200", "zinc.800")(props),
    rounded: '2xl',
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

const userMenu = helper.definePartsStyle((props) => ({
  header: {
    fontSize: "medium",
    fontWeight: "normal",
    borderBottom: "1px",
    borderColor: mode("zinc.200", "zinc.800")(props),
  },
  body: {
    p: 0,
  },
  footer: {
    bg: mode("zinc.50", "zinc.900")(props),
    borderTop: "1px",
    borderColor: mode("zinc.200", "zinc.800")(props),
  },
}));

const editMenu = helper.definePartsStyle({});

export const modalTheme = helper.defineMultiStyleConfig({
  baseStyle,
  variants: {
    userMenu,
    editMenu,
  },
});
