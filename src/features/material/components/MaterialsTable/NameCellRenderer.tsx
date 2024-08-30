import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  ScaleFade,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";

import { type CustomCellRendererProps } from "ag-grid-react";

import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { ExternalLink } from "~/components/ExternalLink";
import { TextInput } from "~/components/TextInput";
import {
  updateMaterialFormSchema,
  type UpdateMaterialFormType,
} from "~/types/material";
import { isTRPCClientError } from "~/utils/trpc";
import { api } from "~/utils/api";
import { type MaterialsTableRows } from "./MaterialsTable";

type SelectInput = {
  label: string;
  value: string;
};

export function NameCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableRows>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateMaterialFormType>({
    resolver: zodResolver(updateMaterialFormSchema),
  });

  const { data: categoriesQuery } = api.material.getCategories.useQuery();
  const categoryOptions = categoriesQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const { data: vendorsQuery } = api.material.getVendors.useQuery();
  const vendorOptions = vendorsQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  React.useEffect(() => {
    if (node.data) {
      const { name, cost, quantity, minQuantity, extraData } = node.data;
      if (name === "Autumn Glow") {
        console.log(extraData.cost);
      }
      reset({
        id: extraData.id,
        name,
        url: extraData.url ?? undefined,
        sku: extraData.sku ?? undefined,
        cost: cost ? new Prisma.Decimal(cost).toNumber() : undefined,
        quantity: quantity
          ? new Prisma.Decimal(quantity).toNumber()
          : undefined,
        quantityUnit: extraData.quantityUnit ?? undefined,
        minQuantity: minQuantity
          ? new Prisma.Decimal(minQuantity).toNumber()
          : undefined,
        vendor: extraData.vendor
          ? { label: extraData.vendor.name, value: extraData.vendor.id }
          : undefined,
        categories: extraData.categories
          ? extraData.categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))
          : undefined,
        notes: extraData.notes ?? undefined,
      });
    }
  }, [node.data, reset]);

  const toast = useToast();

  const utils = api.useUtils();
  const mutation = api.material.update.useMutation({
    onSuccess: async ({ name }) => {
      toast({
        title: `Material updated`,
        description: `Successfully updated ${name}`,
        status: "success",
      });

      await utils.material.getAll.invalidate();
      onClose();
    },
  });

  if (!node.data) {
    return null;
  }

  const { name, extraData } = node.data;

  async function onSubmit(data: UpdateMaterialFormType) {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "CONFLICT") {
        setError("sku", {
          type: "manual",
          message: error.message,
        });
        setFocus("sku");
      }
    }
  }

  return (
    <HStack
      py={2}
      justifyContent="space-between"
      alignItems="center"
      wrap="wrap"
    >
      <Stack spacing={2}>
        <HStack spacing={0}>
          <Button
            variant="text"
            justifyContent="flex-start"
            alignItems="center"
            size="sm"
            fontSize="xs"
            fontWeight="semibold"
            w="fit-content"
            px={2}
            h="fit-content"
            py={"0 !important"}
            onClick={onOpen}
          >
            {name}
          </Button>
        </HStack>
        <Drawer {...{ isOpen, onClose }} size="sm">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>{name}</DrawerHeader>
            <DrawerBody>
              <Stack
                as="form"
                id="edit-material-form"
                onSubmit={handleSubmit(onSubmit)}
                spacing={4}
              >
                <TextInput control={control} name="name" label="Name" />

                <TextInput control={control} name="url" label="URL" />

                <TextInput control={control} name="sku" label="SKU" />

                <Box
                  p={4}
                  rounded="2xl"
                  bg="zinc.100"
                  border="1px solid var(--chakra-colors-zinc-200)"
                >
                  <HStack>
                    <Icon
                      as={FaExclamationTriangle}
                      mt={0.5}
                      alignSelf="flex-start"
                    />
                    <Stack fontSize="xs">
                      <Text>
                        Cost will automatically be updated when adding a
                        purchase order.
                      </Text>
                      <Text>Stock must be updated directly in the table.</Text>
                    </Stack>
                  </HStack>

                  <FormControl isInvalid={!!errors.cost}>
                    <FormLabel>Cost</FormLabel>
                    <Controller
                      control={control}
                      name="cost"
                      render={({ field: { value } }) => (
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FaDollarSign />
                          </InputLeftElement>
                          <Input
                            as={NumericFormat}
                            allowNegative={false}
                            decimalScale={2}
                            thousandSeparator=","
                            value={value}
                            isDisabled
                          />
                        </InputGroup>
                      )}
                    />
                    {errors.cost && (
                      <FormErrorMessage>{errors.cost.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <SimpleGrid columns={5} gap={4}>
                    <TextInput
                      control={control}
                      name="quantity"
                      label="Quantity"
                      formControlProps={{
                        gridColumn: "1 / span 3",
                      }}
                      inputProps={{
                        isDisabled: true,
                      }}
                    />

                    <TextInput
                      control={control}
                      name="quantityUnit"
                      label="Quantity unit"
                      formControlProps={{
                        gridColumn: "4 / span 2",
                      }}
                      inputProps={{
                        isDisabled: true,
                      }}
                    />
                  </SimpleGrid>
                </Box>

                <TextInput
                  control={control}
                  name="minQuantity"
                  label="Min. quantity level"
                />

                <ControlledCreatableSelect<
                  UpdateMaterialFormType,
                  SelectInput,
                  true
                >
                  options={vendorOptions}
                  control={control}
                  name="vendor"
                  label="Vendor"
                  useBasicStyles
                />

                <ControlledCreatableSelect<
                  UpdateMaterialFormType,
                  SelectInput,
                  true
                >
                  options={categoryOptions}
                  isMulti
                  control={control}
                  name="categories"
                  label="Categories"
                  useBasicStyles
                />

                <FormControl isInvalid={!!errors.notes}>
                  <FormLabel>Notes</FormLabel>
                  <Input {...register("notes")} />
                  {errors.notes && (
                    <FormErrorMessage>{errors.notes.message}</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
            </DrawerBody>
            <DrawerFooter gap={4}>
              <ScaleFade in={!isSubmitting} initialScale={0.9}>
                <Button onClick={onClose}>Cancel</Button>
              </ScaleFade>
              <Button
                type="submit"
                form="edit-material-form"
                variant="primary"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        {extraData.categories?.length && (
          <HStack wrap="wrap">
            {extraData.categories?.map((category) => (
              <Tag
                key={category.id}
                fontSize="xs"
                fontWeight="normal"
                bg="zinc.100"
                color="zinc.600"
                border="1px solid var(--chakra-colors-zinc-300)"
              >
                {category.name}
              </Tag>
            ))}
          </HStack>
        )}
      </Stack>
      <Stack alignItems="flex-end" alignSelf="center" spacing={0}>
        {extraData.url && (
          <ExternalLink href={extraData.url}>
            View
            {extraData.vendor?.name
              ? ` on ${extraData.vendor.name}`
              : " website"}
          </ExternalLink>
        )}
        {extraData.sku && (
          <Text px={1} color="zinc.600" fontStyle="italic" lineHeight="normal">
            SKU: {extraData.sku}
          </Text>
        )}
      </Stack>
    </HStack>
  );
}
