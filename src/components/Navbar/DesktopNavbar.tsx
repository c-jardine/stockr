import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaEdit, FaSignInAlt } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

import { ColorModeToggle } from "../ColorModeToggle";
import { DesktopSignOut } from "./DesktopSignOut";

export function DesktopNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <SimpleGrid gridTemplateColumns="1fr auto 1fr">
      <Box></Box>
      <HStack justifySelf="center">
        <Link
          as={NextLink}
          href="/"
          variant={router.asPath === "/" ? "navbarLinkActive" : "navbarLink"}
        >
          Dashboard
        </Link>
        <Link
          as={NextLink}
          href="/materials"
          variant={
            router.asPath === "/materials" ? "navbarLinkActive" : "navbarLink"
          }
        >
          Materials
        </Link>
        <Link
          as={NextLink}
          href="/products"
          variant={
            router.asPath === "/products" ? "navbarLinkActive" : "navbarLink"
          }
        >
          Products
        </Link>
        <Link
          as={NextLink}
          href="/blueprints"
          variant={
            router.asPath === "/blueprints" ? "navbarLinkActive" : "navbarLink"
          }
        >
          Blueprints
        </Link>
        <Link
          as={NextLink}
          href="/production"
          variant={
            router.asPath === "/production" ? "navbarLinkActive" : "navbarLink"
          }
        >
          Production
        </Link>
        <Link
          as={NextLink}
          href="/history"
          variant={
            router.asPath === "/history" ? "navbarLinkActive" : "navbarLink"
          }
        >
          History
        </Link>
      </HStack>
      <HStack justifySelf="flex-end">
        {!session && (
          <Button
            leftIcon={<Icon as={FaSignInAlt} />}
            variant="primary"
            onClick={() => signIn()}
          >
            Sign in
          </Button>
        )}
        {session && (
          <Button
            variant="unstyled"
            display="flex"
            alignItems="center"
            gap={2}
            onClick={onOpen}
          >
            <Avatar
              size="sm"
              name={session?.user.name ?? "Current user"}
              src={session?.user.image ?? undefined}
            />
            <Icon as={FaChevronDown} boxSize={3} />
          </Button>
        )}
        <Drawer variant="userMenu" isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <Text fontSize="sm">Signed in as</Text>
              <HStack>
                <Avatar
                  size="sm"
                  name={session?.user.name ?? "Current user"}
                  src={session?.user.image ?? undefined}
                />
                <Text flexGrow={1} fontSize="sm" fontWeight="semibold">
                  {session?.user.name}
                </Text>
                <IconButton icon={<Icon as={FaEdit} />} aria-label="Sign out" />
              </HStack>
            </DrawerHeader>
            <DrawerBody>
              <Stack h="full" justifyContent="space-between" gap={0}>
                <Stack gap={0}>
                  <Link as={NextLink} href="/settings" variant="menuLink">
                    Settings
                  </Link>
                  <Link as={NextLink} href="/edit-profile" variant="menuLink">
                    Edit profile
                  </Link>
                  <Link as={NextLink} href="/help" variant="menuLink">
                    Help
                  </Link>
                </Stack>
                <DesktopSignOut />
              </Stack>
            </DrawerBody>
            <DrawerFooter>
              <ColorModeToggle />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </HStack>
    </SimpleGrid>
  );
}
