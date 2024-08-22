import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  _hover: {
    textDecoration: "none",
  },
});

const menuLink = defineStyle({
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

const navbarLink = defineStyle({
  px: 4,
  py: 2,
  color: "zinc.500",
  fontSize: "sm",
  fontWeight: "semibold",
  transition: "200ms ease-in-out",
  _hover: {
    color: "zinc.800",
  },

  _dark: {
    color: "zinc.400",
    _hover: {
      color: "zinc.100",
    },
  },
});

const navbarLinkActive = defineStyle({
  px: 4,
  py: 2,
  rounded: "lg",
  color: "zinc.950",
  fontSize: "sm",
  fontWeight: "semibold",

  _dark: {
    color: "zinc.50",
  },
});

export const linkTheme = defineStyleConfig({
  baseStyle,
  variants: { menuLink, navbarLink, navbarLinkActive },
});
