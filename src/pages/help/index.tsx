import {
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Input,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Section } from "~/components/Section";

interface LinkCardProps {
  title: string;
  description: string;
  href: string;
}

function LinkCard({ title, description, href }: LinkCardProps) {
  const bgColor = useColorModeValue("white", "zinc.900");
  const borderColor = useColorModeValue("zinc.200", "zinc.800");

  const hoverBgColor = useColorModeValue("blue.100", "blue.950");
  const hoverBorderColor = useColorModeValue("blue.200", "blue.900");

  return (
    <LinkBox
      as="article"
      p={4}
      rounded="2xl"
      maxW="full"
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      transitionDuration="200ms"
      _hover={{
        bg: hoverBgColor,
        borderColor: hoverBorderColor,
      }}
    >
      <Heading as="h2" fontSize="md">
        <LinkOverlay href={href}>{title}</LinkOverlay>
      </Heading>
      <Text mt={1} fontSize="sm">
        {description}
      </Text>
    </LinkBox>
  );
}

export default function Help() {
  const sections: LinkCardProps[] = [
    {
      title: "Quick start",
      description: "A quick rundown of how to get started with Craftmate.",
      href: "/help/quick-start",
    },
    {
      title: "Accounts and teams",
      description:
        "Learn how to manage your account and how to create a teams.",
      href: "/help/accounts-and-teams",
    },
    {
      title: "What's new",
      description: "View recent changes and coming features to Craftmate.",
      href: "/help/whats-new",
    },
    {
      title: "Materials",
      description:
        "Learn how to create and manage the materials needed to make your products.",
      href: "/help/materials",
    },
    {
      title: "Products",
      description: "Learn how to create and manage your products.",
      href: "/help/products",
    },
    {
      title: "Blueprints",
      description:
        "Materials can be used in blueprints for the products you create.",
      href: "/help/blueprints",
    },
  ];
  return (
    <>
      <Head>
        <title>Craftmate Help Center</title>
        <meta
          name="description"
          content="Learn how to use Craftmate with our guides, tips, and tutorials."
        />
      </Head>
      <main>
        <Section display="flex" justifyContent="center" mt={6} mb={8} py={16}>
          <Stack spacing={8} maxW="container.sm" w="full">
            <Heading as="h1" textAlign="center">
              Craftmate Help Center
            </Heading>
            <HStack>
              <Input />
              <Button
                variant="primary"
                leftIcon={<Icon as={FaMagnifyingGlass} />}
              >
                Search
              </Button>
            </HStack>
          </Stack>
        </Section>

        <SimpleGrid as={Container} columns={3} gap={4} maxW="container.lg">
          {sections.map((section) => (
            <LinkCard key={section.title} {...section} />
          ))}
        </SimpleGrid>
      </main>
    </>
  );
}
