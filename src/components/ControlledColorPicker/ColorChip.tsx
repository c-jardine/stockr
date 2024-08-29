import {
  Box,
  type BoxProps,
  Flex,
  Icon,
  useColorModeValue,
  useRadio,
  type UseRadioProps,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa6";

interface RadioButtonProps extends UseRadioProps {
  color: string;
  containerProps?: BoxProps;
  innerContainerProps?: BoxProps;
  children?: React.ReactNode;
}

export function ColorChip({
  color,
  containerProps,
  innerContainerProps,
  children,
  ...props
}: RadioButtonProps) {
  const chipColor = useColorModeValue(`${color}.600`, `${color}.500`);
  const borderColor = useColorModeValue("zinc.200", "zinc.700");

  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" {...containerProps}>
      <input {...input} />
      <Box
        {...checkbox}
        overflow="hidden"
        cursor="pointer"
        role="group"
        p={1}
        rounded="lg"
        border="1px solid transparent"
        transitionDuration="200ms"
        _hover={{
          borderColor: borderColor,
        }}
        _checked={{
          borderColor: borderColor,
        }}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          boxSize={6}
          rounded="full"
          bg={chipColor}
        >
          <Icon
            display="none"
            _groupChecked={{
              display: "block",
            }}
            as={FaCheck}
            color="white"
            boxSize={4}
          />
        </Flex>
      </Box>
    </Box>
  );
}
