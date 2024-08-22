import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  rounded: "lg",
  fontWeight: "400",
});

const solid = defineStyle({
  fontSize: "sm",
});

const primary = defineStyle((props) => ({
  bg: "blue.600",
  color: "blue.50",
  _hover: {
    bg: "blue.500",
  },
  _active: {
    bg: "blue.700",
  },
}));

const menuButton = defineStyle({
  px: 4,
  py: 2,
  w: "full",
  justifyContent: "flex-start",
  rounded: "none",
  color: "zinc.600",
  textDecoration: "none !important",
  fontWeight: "normal",
  transition: "200ms ease-in-out",
  _hover: {
    bg: "blue.100",
  },

  _dark: {
    color: "zinc.300",
    _hover: {
      bg: "blue.950",
    },
  },
});

export const buttonTheme = defineStyleConfig({
  baseStyle,
  variants: {
    solid,
    primary,
    menuButton,
  },
});
