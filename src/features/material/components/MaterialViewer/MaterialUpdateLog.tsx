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
import { ReactNode } from "react";

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
  const bgColor = useColorModeValue("zinc.50", "zinc.900");
  const borderColor = useColorModeValue("zinc.200", "zinc.800");

  return (
    <Stack
      position="relative"
      pl={4}
      py={4}
      borderLeft="3px solid"
      borderColor="zinc.200"
    >
      <Circle
        position="absolute"
        bg="zinc.400"
        size={2}
        top="22.5px"
        left="-5px"
        outline="2px solid"
        outlineColor="white"
      />
      <Tag fontSize="2xs" size="sm" w="fit-content">
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
          borderColor={borderColor}
          bg={bgColor}
          fontSize="xs"
          textAlign="left"
        >
          {description}
        </Text>
      )}
    </Stack>
  );
}
