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

const input = helper.definePartsStyle((props) => ({
  field: {
    border: "1px solid",
    borderColor: mode("zinc.200", "zinc.800")(props),
    bg: mode("white", "zinc.950")(props),
    _selection: {
      bg: mode("blue.500", "blue.800")(props),
    },
    _focusWithin: {
      outline: "2px solid",
      outlineColor: mode("blue.500", "blue.800")(props),
      caretColor: mode("blue.500", "blue.800")(props),
    },
  },
}));

export const inputTheme = helper.defineMultiStyleConfig({
  baseStyle,
  variants: {
    input,
  },
});
