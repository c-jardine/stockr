import { extendTheme, type ThemeOverride } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Poppins } from "next/font/google";
import { colors } from "./colors";
import { buttonTheme } from "./components/button";
import { drawerTheme } from "./components/drawer";
import { formErrorTheme } from "./components/formError";
import { inputTheme } from "./components/input";
import { linkTheme } from "./components/link";
import { menuTheme } from "./components/menu";
import { modalTheme } from "./components/modal";
import { popoverTheme } from "./components/popover";
import { tagTheme } from "./components/tag";

const poppins = Poppins({
  weight: ["400", "500", "600", "800"],
  subsets: ["latin"],
  display: "swap", // Fixes issue with not loading in Chrome
});

const config: ThemeOverride["config"] = {
  initialColorMode: "light",
};

const styles: ThemeOverride["styles"] = {
  global: (props) => ({
    "html, body": {
      bg: mode("zinc.50", "zinc.950")(props),
      fontFamily: poppins.style.fontFamily,
    },
    "h1, h2, h3, h4, h5, h6": {
      fontFamily: `${poppins.style.fontFamily} !important`,
    },
    h1: {
      fontSize: "2xl !important",
      fontWeight: "bold !important",
    },
    label: {
      color: mode("zinc.600", "zinc.300")(props),
      fontSize: "xs !important",
      letterSpacing: "wide",
    },
  }),
};

const themeOverride: ThemeOverride = {
  config,
  styles,
  colors,
  components: {
    Button: buttonTheme,
    Drawer: drawerTheme,
    FormError: formErrorTheme,
    Input: inputTheme,
    Link: linkTheme,
    Menu: menuTheme,
    Modal: modalTheme,
    Popover: popoverTheme,
    Tag: tagTheme,
  },
};

export const theme = extendTheme(themeOverride);
