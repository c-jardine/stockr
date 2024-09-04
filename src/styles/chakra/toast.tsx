import {
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  ToastProviderProps,
  useColorModeValue,
  UseToastOptions,
} from "@chakra-ui/react";
import { FaCheck, FaEllipsis, FaExclamation, FaInfo } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

export const toastOptions: ToastProviderProps = {
  defaultOptions: {
    position: "bottom-right",
    render: CustomToast,
  },
};

function CustomToast({
  title,
  description,
  status,
  onClose,
}: UseToastOptions & { onClose: () => void }) {
  function getStyles() {
    switch (status) {
      case "success":
        return { icon: FaCheck, color: "emerald" };
      case "error":
        return { icon: FaExclamation, color: "red" };
      case "info":
        return { icon: FaInfo, color: "blue" };
      case "loading":
        return { icon: FaEllipsis, color: "zinc" };
      case "warning":
        return { icon: FaExclamation, color: "yellow" };
      default:
        return { icon: FaCheck, color: "zinc" };
    }
  }
  const { icon, color } = getStyles();

  const containerBg = useColorModeValue(`${color}.50`, `${color}.950`);
  const borderColor = useColorModeValue(`${color}.20`, `${color}.900`);
  const descriptionColor = useColorModeValue("zinc.600", "zinc.300");

  return (
    <Box
      position="relative"
      rounded="lg"
      border="1px solid"
      borderColor={borderColor}
      bg={containerBg}
      overflow="hidden"
      maxW="sm"
      w="full"
      onClick={onClose}
    >
      <HStack>
        <Box alignSelf="flex-start" mt="18px" pl={4}>
          <Circle border="1.5px solid" borderColor={`${color}.600`} size={5}>
            <Icon as={icon} boxSize={3} color={`${color}.600`} />
          </Circle>
        </Box>
        <Stack w="full" px={2} py={4}>
          <Flex justifyContent="space-between" alignItems="center" w="full">
            <Text fontSize="sm" fontWeight="semibold">
              {title}
            </Text>
          </Flex>
          <Text mt={-1} fontSize="xs" color={descriptionColor}>
            {description}
          </Text>
        </Stack>
        <Stack
          as="button"
          aria-label="Close toast"
          px={2}
          py={4}
          alignSelf="stretch"
          justifyContent="center"
          alignItems="center"
          borderLeft="1px solid"
          borderColor={borderColor}
          transitionDuration="200ms"
          _hover={{
            bg: `${color}.100`,
          }}
          onClick={onClose}
        >
          <Icon as={IoMdClose} color={`${color}.600`} boxSize={4} />
        </Stack>
      </HStack>
    </Box>
  );
}
