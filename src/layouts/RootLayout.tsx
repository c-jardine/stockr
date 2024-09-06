import { Box, Container } from "@chakra-ui/react";
import { type ReactNode } from "react";

import { Navbar } from "~/components/Navbar";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <Box h="calc(100vh - 4rem)">
      <Navbar />
      <Container mt={16} p={4} maxW="1440px" h="full">
        {children}
      </Container>
    </Box>
  );
}
