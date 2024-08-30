import {
  Icon,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { MdCategory } from "react-icons/md";
import { PageLoader } from "~/components/PageLoader";
import { api } from "~/utils/api";

export function ManageCategories() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading } = api.material.getCategories.useQuery();

  return (
    <>
      <MenuItem
        icon={<Icon as={MdCategory} boxSize={4} />}
        fontSize="sm"
        onClick={onOpen}
      >
        Manage categories
      </MenuItem>
      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage categories</ModalHeader>
          <ModalBody>{!isLoading && <PageLoader />}</ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
