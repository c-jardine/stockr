import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

export default function DesktopSignOut() {
  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <>
      <Button
        leftIcon={<Icon as={FaSignOutAlt} />}
        variant="menuButton"
        onClick={onOpen}
      >
        Sign out
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign out</ModalHeader>
          <ModalBody>Are you sure you want to sign out?</ModalBody>
          <ModalFooter gap={4}>
            <Button colorScheme="red" onClick={handleSignOut}>
              Sign out
            </Button>
            <Button>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
