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
import { NumericFormat } from "react-number-format";

import { type CustomCellRendererProps } from "ag-grid-react";

import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { TextInput } from "~/components/TextInput";
import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { calculateAdjustedQuantity } from "~/utils/quantityAdjustment";
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

  const { name, quantity, quantityUnit } = node.data;

  const prevQuantityText = formatQuantityWithUnitAbbrev({
    quantity,
    quantityUnit,
  });

  const newQuantity =
    quantity &&
    watch("adjustedQuantity") &&
    calculateAdjustedQuantity({
      previousQuantity: new Prisma.Decimal(quantity),
      adjustmentAmount: new Prisma.Decimal(
        watch("adjustedQuantity").replaceAll(",", "")
      ),
      action: watch("type.value.action"),
    });
  const newQuantityText = newQuantity
    ? formatQuantityWithUnitAbbrev({ quantity: newQuantity, quantityUnit })
    : prevQuantityText;

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
        {prevQuantityText}
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
                inputProps={{
                  as: NumericFormat,
                  allowNegative: false,
                  decimalScale: 2,
                  thousandSeparator: ",",
                }}
              />
              <HStack>
                <Text fontSize="xs">{prevQuantityText}</Text>{" "}
                <Icon as={FaChevronRight} boxSize={3} />
                <Text fontSize="xs" fontWeight="semibold">
                  {newQuantityText}
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
