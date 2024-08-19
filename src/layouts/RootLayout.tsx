import { Container } from "@chakra-ui/react";
import React from "react";
import Navbar from "~/components/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <Navbar />
      <Container p={4} maxW="full">
        {children}
      </Container>
    </>
  );
}
