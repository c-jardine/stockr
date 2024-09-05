import { Button, Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import { FaSignInAlt } from "react-icons/fa";
import { FaApple, FaDiscord } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Section } from "~/components/Section";
import { authOptions } from "~/server/auth";

const getIcon = (providerName: string) => {
  switch (providerName) {
    case "Apple":
      return FaApple;
    case "Google":
      return FcGoogle;
    case "Discord":
      return FaDiscord;
    default:
      return null;
  }
};

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Stack as={Section} mt={8} gap={6} p={8} maxW="lg">
      <Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          rounded="2xl"
          boxSize={12}
          border="1px solid"
          borderColor="blue.100"
          bg="blue.50"
        >
          <Icon as={FaSignInAlt} boxSize={5} color="blue.400" />
        </Stack>
        <Heading fontSize="2xl">Sign in</Heading>
        <Text fontSize="sm">
          Start managing your materials, products, and production with{" "}
          <Text as="span" fontWeight="bold">
            Craftmate
          </Text>
          .
        </Text>
      </Stack>
      <Stack maxW="xs" w="full" alignSelf="center">
        {Object.values(providers).map((provider) => {
          const icon = getIcon(provider.name);

          return (
            <HStack
              key={provider.name}
              as={Button}
              variant="outline"
              fontSize="sm"
              alignItems="center"
              onClick={() => signIn(provider.id)}
            >
              {icon && (
                <Icon
                  as={icon}
                  boxSize={5}
                  color={provider.name === "Discord" ? "#7289da" : "unset"}
                />
              )}
              <Text>Sign in with {provider.name}</Text>
            </HStack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
