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
  fontSize: "sm",
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

const stockUpdate = defineStyle((props) => ({
  fontSize: "sm",
  outline: "1px solid transparent",
  _hover: {
    bg: props.colorMode === "light" ? "blue.200" : "blue.950",
    outlineColor: props.colorMode === "light" ? "white" : "blue.800",
  },
  _active: {
    bg: props.colorMode === "light" ? "blue.300" : "blue.800",
  },
}));

export const buttonTheme = defineStyleConfig({
  baseStyle,
  variants: {
    solid,
    primary,
    menuButton,
    stockUpdate,
  },
});
