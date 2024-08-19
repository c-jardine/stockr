import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import DesktopNavbar from "./DesktopNavbar";

export default function Navbar() {
  const bgColor = useColorModeValue("white", "zinc.900");
  const borderColor = useColorModeValue("zinc.200", "zinc.700");

  return (
    <Box bg={bgColor} borderBottom="1px solid" borderBottomColor={borderColor}>
      <Container p={4} maxW="1440px">
        <DesktopNavbar />
      </Container>
    </Box>
  );
}
