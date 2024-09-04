import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { MaterialsTableRows } from "../MaterialsTable/MaterialsTable";

import { CustomCellRendererProps } from "ag-grid-react";
import { UpdateMaterialForm } from "../UpdateMaterialForm/UpdateMaterialForm";

export function MaterialViewer(
  props: CustomCellRendererProps<MaterialsTableRows>["data"]
) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!props) {
    return null;
  }

  const { name } = props;
  return (
    <>
      <Button
        variant="text"
        justifyContent="flex-start"
        alignItems="center"
        size="sm"
        fontSize="sm"
        fontWeight="semibold"
        w="fit-content"
        px={2}
        h="fit-content"
        py={"0 !important"}
        onClick={onOpen}
      >
        {name}
      </Button>
      <Drawer {...{ isOpen, onClose }} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>{name}</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <UpdateMaterialForm {...props} />
            </Stack>
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button onClick={onClose}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
