import {
    Avatar,
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
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { FaEdit } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

import { ColorModeToggle } from "../ColorModeToggle";
import { DesktopSignOut } from "./DesktopSignOut";

export function UserAvatarMenu() {
  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
    </>
  );
}
