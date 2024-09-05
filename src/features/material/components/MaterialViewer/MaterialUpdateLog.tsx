import {
  Avatar,
  Circle,
  Heading,
  HStack,
  Icon,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { type User } from "@prisma/client";
import React from "react";
import { FaFile } from "react-icons/fa6";

interface MaterialUpdateLogProps {
  title: React.ReactNode;
  description: React.ReactNode;
  timestamp: React.ReactNode;
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
    <HStack
      position="relative"
      pl={4}
      py={4}
      borderLeft="3px solid"
      borderColor="zinc.200"
    >
      <Circle
        bg="zinc.400"
        size={2}
        ml="-21.5px"
        outline="2px solid"
        outlineColor="white"
      />
      <Tag fontSize="2xs" size="sm">
        {timestamp}
      </Tag>
      <Avatar src={createdBy.image ?? undefined} size="xs" />
      <Stack spacing={2}>
        <Heading as="h3" fontSize="sm">
          {title}
          <Text as="span" fontWeight="normal">
            {" "}
            completed by{" "}
          </Text>
          {createdBy.name ?? "Unknown"}
        </Heading>
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
    </HStack>
  );
}
