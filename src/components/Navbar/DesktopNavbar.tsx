import { Box, Button, HStack, Icon, Link, SimpleGrid } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaSignInAlt } from "react-icons/fa";

import { isActiveLink } from "~/utils/router";
import { UserAvatarMenu } from "./UserAvatarMenu";

export function DesktopNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/materials", label: "Materials" },
    { href: "/products", label: "Products" },
    { href: "/blueprints", label: "Blueprints" },
    { href: "/production", label: "Production" },
    { href: "/history", label: "History" },
  ];

  return (
    <SimpleGrid gridTemplateColumns="1fr auto 1fr" alignItems="center">
      {/* Brand */}
      <Box>
        <Link as={NextLink} href="/" fontWeight="bold">
          Stockr
        </Link>
      </Box>

      {/* Session nav links */}
      {session && (
        <HStack justifySelf="center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              variant={
                isActiveLink(router, href) ? "navbarLinkActive" : "navbarLink"
              }
            >
              {label}
            </Link>
          ))}
        </HStack>
      )}

      {/* Authentication section */}
      <HStack gridColumn={3} justifySelf="flex-end">
        {!session && !isActiveLink(router, "/auth/signin") && (
          <Button
            leftIcon={<Icon as={FaSignInAlt} />}
            variant="primary"
            onClick={() => signIn()}
          >
            Sign in
          </Button>
        )}

        <UserAvatarMenu />
      </HStack>
    </SimpleGrid>
  );
}
