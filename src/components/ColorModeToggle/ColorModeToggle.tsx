import {
  Icon,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ColorModeToggle() {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(FaSun, FaMoon);
  const iconColor = useColorModeValue("yellow.500", "indigo.500");

  return (
    <IconButton
      icon={<Icon as={icon} color={iconColor} />}
      aria-label="Toggle color mode"
      onClick={toggleColorMode}
      rounded="full"
    />
  );
}
