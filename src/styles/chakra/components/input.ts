import { inputAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const helper = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helper.definePartsStyle((props) => ({
  field: {
    fontSize: "sm",
  },
  element: {
    color: mode("zinc.400", "zinc.400")(props),
    transition: "200ms ease-in-out",
    _groupHover: {
      color: mode("zinc.800", "zinc.100")(props),
      _groupFocusWithin: {
        color: mode("zinc.800", "zinc.100")(props),
      },
    },
  },
  // dialog: {
  //   bg: mode("white", "zinc.950")(props),
  //   border: "1px",
  //   borderColor: mode("zinc.200", "zinc.800")(props),
  // },
  // header: {
  //   p: 4,
  // },
  // body: {
  //   p: 4,
  // },
  // footer: {
  //   p: 4,
  // },
}));

export const inputTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
