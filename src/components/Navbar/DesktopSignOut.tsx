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
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

export default function DesktopSignOut() {
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
          <ModalHeader display="flex" alignItems="center" gap={4}>
            <Icon as={FaTriangleExclamation} boxSize={8} color="red.600" />
            Sign out
          </ModalHeader>
          <ModalBody fontSize="sm">
            Are you sure you want to sign out?
          </ModalBody>
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
