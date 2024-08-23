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
}));

export const inputTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
