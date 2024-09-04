import {
  Button,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FaEdit } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { TextInput } from "~/components/TextInput";
import { getQuantityUnitText } from "~/utils";
import { type MaterialsTableRows } from "./MaterialsTable";
import { NewQuantityUpdateTypeForm } from "./NewQuantityUpdateTypeForm";
import { useUpdateQuantity } from "./hooks/useUpdateQuantity";

export function QuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableRows>) {
  const {
    form: {
      control,
      handleSubmit,
      watch,
      formState: { isSubmitting },
    },
    onSubmit,
    updateTypeOptions,
  } = useUpdateQuantity(node);

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!node.data) {
    return null;
  }

  const { name, quantity, extraData } = node.data;

  // Get the adjusted quantity as Prisma.Decimal
  const adjustedQuantity = watch("adjustedQuantity")
    ? new Prisma.Decimal(watch("adjustedQuantity"))
    : quantity ?? new Prisma.Decimal(0);

  // Utility function for getting the full quantity text (12 fl. oz., etc...)
  function getFullQuantityText(quantity: Prisma.Decimal) {
    const quantityUnit = getQuantityUnitText({
      quantity,
      quantityUnit: extraData.quantityUnit,
      style: "abbreviation",
    });

    return `${quantity} ${quantityUnit}`;
  }

  return (
    <>
      <Button
        rightIcon={<Icon as={FaEdit} />}
        variant="stockUpdate"
        size="sm"
        justifyContent="space-between"
        w="full"
        onClick={onOpen}
      >
        {quantity ? getFullQuantityText(quantity) : "—"}
      </Button>

      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name}</ModalHeader>

          <ModalBody>
            <Stack
              as="form"
              id="update-material-quantity-form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={4}
            >
              <ControlledCreatableSelect
                options={updateTypeOptions}
                control={control}
                name="type"
                label={
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text>Quantity update type</Text>
                    <NewQuantityUpdateTypeForm />
                  </Flex>
                }
                useBasicStyles
              />
              <TextInput
                control={control}
                name="adjustedQuantity"
                label="Adjusted quantity"
              />
              <HStack>
                <Text fontSize="xs">
                  {quantity && getFullQuantityText(quantity)}
                </Text>{" "}
                <Icon as={FaChevronRight} boxSize={3} />
                <Text fontSize="xs" fontWeight="semibold">
                  {getFullQuantityText(adjustedQuantity ?? quantity)}
                </Text>
              </HStack>
              <TextInput control={control} name="notes" label="Notes" />
            </Stack>
          </ModalBody>

          <ModalFooter gap={4}>
            <ScaleFade in={!isSubmitting} initialScale={0.9}>
              <Button size="sm">Cancel</Button>
            </ScaleFade>
            <Button
              type="submit"
              form="update-material-quantity-form"
              variant="primary"
              size="sm"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
