import { Avatar, Circle, Heading, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { type User } from "@prisma/client";
import React from "react";

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
      <Tag fontSize="2xs" size="sm">{timestamp}</Tag>
      <Avatar src={createdBy.image ?? undefined} size="xs" />
      <Stack spacing={0}>
        <Heading as="h3" fontSize="sm">
          {title}
          <Text as="span" fontWeight="normal">
            {" "}
            completed by{" "}
          </Text>
          {createdBy.name ?? "Unknown"}
        </Heading>
        {description && <Text fontSize="xs">{description}</Text>}
      </Stack>
    </HStack>
  );
}
