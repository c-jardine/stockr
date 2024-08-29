import { Icon, IconProps, Link, LinkProps } from "@chakra-ui/react";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  linkProps?: LinkProps;
  iconProps?: IconProps;
}

export function ExternalLink({
  href,
  children,
  linkProps,
  iconProps,
}: ExternalLinkProps) {
  return (
    <Link
      isExternal
      href={href}
      role="group"
      display="flex"
      gap={2}
      alignItems="center"
      lineHeight="normal"
      _hover={{
        color: "blue.500",
      }}
      {...linkProps}
    >
      {children}
      <Icon as={FaExternalLinkAlt} boxSize={3} {...iconProps} />
    </Link>
  );
}
