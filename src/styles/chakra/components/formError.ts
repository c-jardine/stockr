import { formErrorAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const helper = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helper.definePartsStyle((_props) => ({
  text: {
    fontSize: "xs",
  },
}));

export const formErrorTheme = helper.defineMultiStyleConfig({
  baseStyle,
});
