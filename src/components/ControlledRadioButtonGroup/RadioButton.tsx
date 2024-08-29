import {
  Box,
  useColorModeValue,
  useRadio,
  type BoxProps,
  type UseRadioProps,
} from "@chakra-ui/react";
import React from "react";

interface RadioButtonProps extends UseRadioProps {
  containerProps?: BoxProps;
  innerContainerProps?: BoxProps;
  children: React.ReactNode;
}

export function RadioButton({
  containerProps,
  innerContainerProps,
  children,
  ...props
}: RadioButtonProps) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  const borderColor = useColorModeValue("zinc.200", "zinc.700");
  const hoverBgColor = useColorModeValue("zinc.200", "zinc.700");

  return (
    <Box as="label" {...containerProps}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderColor={borderColor}
        transitionDuration="200ms"
        _checked={{
          bg: "blue.600",
          color: "white",
          borderColor: "blue.600",
          _hover: {
            bg: "blue.500",
            borderColor: "blue.500",
          },
        }}
        _hover={{
          bg: hoverBgColor,
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={4}
        py={2}
        {...innerContainerProps}
      >
        {children}
      </Box>
    </Box>
  );
}
