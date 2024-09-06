import {
  Avatar,
  Circle,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { type User } from "@prisma/client";
import { type ReactNode } from "react";

interface MaterialUpdateLogProps {
  title: ReactNode;
  description: ReactNode;
  timestamp: ReactNode;
  createdBy: User;
}

export default function MaterialUpdateLog({
  title,
  description,
  timestamp,
  createdBy,
}: MaterialUpdateLogProps) {
  const indicatorBorderColor = useColorModeValue("zinc.200", "zinc.800");
  const indicatorCircleBgColor = useColorModeValue("blue.400", "blue.400");
  const indicatorCircleBorderColor = useColorModeValue("white", "zinc.950");

  const timestampColor = useColorModeValue("blue.700", "blue.500");
  const timestampBgColor = useColorModeValue("blue.100", "blue.950");
  const timestampBorderColor = useColorModeValue("blue.200", "blue.900");

  const descriptionBgColor = useColorModeValue("zinc.50", "zinc.900");
  const descriptionBorderColor = useColorModeValue("zinc.200", "zinc.800");

  return (
    <Stack
      position="relative"
      pl={4}
      py={4}
      borderLeft="3px solid"
      borderColor={indicatorBorderColor}
    >
      <Circle
        position="absolute"
        bg={indicatorCircleBgColor}
        size={2}
        top="22.5px"
        left="-5px"
        outline="2px solid"
        outlineColor={indicatorCircleBorderColor}
      />
      <Tag
        fontSize="2xs"
        size="sm"
        w="fit-content"
        border="1px solid"
        borderColor={timestampBorderColor}
        bg={timestampBgColor}
        color={timestampColor}
      >
        {timestamp}
      </Tag>
      <HStack>
        <Avatar src={createdBy.image ?? undefined} size="xs" />
        <Heading as="h3" fontSize="sm">
          {title}
          <Text as="span" fontWeight="normal">
            {" "}
            completed by{" "}
          </Text>
          {createdBy.name ?? "Unknown"}
        </Heading>
      </HStack>
      {description && (
        <Text
          p={2}
          rounded="lg"
          border="1px solid"
          borderColor={descriptionBorderColor}
          bg={descriptionBgColor}
          fontSize="xs"
          textAlign="left"
        >
          {description}
        </Text>
      )}
    </Stack>
  );
}
