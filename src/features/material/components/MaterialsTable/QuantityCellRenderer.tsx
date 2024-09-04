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
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { FaChevronRight } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { Prisma } from "@prisma/client";
import { FaEdit } from "react-icons/fa";
import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { TextInput } from "~/components/TextInput";
import {
  updateMaterialQuantityFormSchema,
  type UpdateMaterialQuantityFormType,
} from "~/types/material";
import { getQuantityUnitText } from "~/utils";
import { api } from "~/utils/api";
import { type MaterialsTableRows } from "./MaterialsTable";
import { NewQuantityUpdateTypeForm } from "./NewQuantityUpdateTypeForm";

export function QuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableRows>) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<UpdateMaterialQuantityFormType>({
    defaultValues: {
      materialId: node.data?.extraData.id ?? undefined,
      originalQuantity: node.data?.quantity?.toString() ?? "0",
    },
    resolver: zodResolver(updateMaterialQuantityFormSchema),
  });

  const { data: updateTypeQuery } =
    api.material.getQuantityUpdateTypes.useQuery();
  const updateTypeOptions = updateTypeQuery?.map(({ id, type, action }) => ({
    label: type,
    value: { id, type, action },
  }));

  React.useEffect(() => {
    if (node.data) {
      reset({
        materialId: extraData.id,
        originalQuantity: quantity?.toString() ?? "0",
      });
    }
  }, [node.data, reset]);

  const toast = useToast();

  const utils = api.useUtils();
  const mutation = api.material.updateQuantity.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Quantity updated",
        description: `Successfully updated quantity for ${data[0].name}.`,
        status: "success",
      });
      await utils.material.getAll.invalidate();
    },
  });

  async function onSubmit(data: UpdateMaterialQuantityFormType) {
    await mutation.mutateAsync(data);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!node.data) {
    return null;
  }

  const { quantity, extraData } = node.data;

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
        {node.data?.quantity
          ? `${new Prisma.Decimal(quantity!).toString()} ${getQuantityUnitText({
              quantity,
              quantityUnit: extraData.quantityUnit,
              style: "abbreviation",
            })}`
          : "—"}
      </Button>
      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{node.data?.name}</ModalHeader>
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
                label="Quantity"
              />
              <HStack>
                <Text fontSize="xs">
                  {node.data?.quantity
                    ? new Prisma.Decimal(node.data?.quantity).toString()
                    : "0"}
                </Text>{" "}
                <Icon as={FaChevronRight} boxSize={3} />{" "}
                <Text fontSize="xs" fontWeight="semibold">
                  {watch("adjustedQuantity") ?? node.data?.quantity}
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
