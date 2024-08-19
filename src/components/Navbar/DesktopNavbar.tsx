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
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { FaEdit } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import ColorModeToggle from "../ColorModeToggle/ColorModeToggle";
import DesktopSignOut from "./DesktopSignOut";

export default function DesktopNavbar() {
  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <SimpleGrid gridTemplateColumns="1fr auto 1fr">
      <Box></Box>
      <HStack justifySelf="center" gap={4}>
        <Link as={NextLink} href="/">
          Dashboard
        </Link>
        <Link as={NextLink} href="/materials">
          Materials
        </Link>
        <Link as={NextLink} href="/products">
          Products
        </Link>
        <Link as={NextLink} href="/blueprints">
          Blueprints
        </Link>
        <Link as={NextLink} href="/production">
          Production
        </Link>
        <Link as={NextLink} href="/history">
          History
        </Link>
      </HStack>
      <HStack justifySelf="flex-end">
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
