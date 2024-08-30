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
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaDollarSign, FaLock } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";

import { type CustomCellRendererProps } from "ag-grid-react";

import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { TextInput } from "~/components/TextInput";
import {
  updateMaterialFormSchema,
  type UpdateMaterialFormType,
} from "~/types/material";
import { isTRPCClientError } from "~/utils";
import { api } from "~/utils/api";
import { toNumber } from "~/utils/prisma";
import { mapToSelectInput, type SelectInput } from "~/utils/selectInput";
import { type MaterialsTableRows } from "./MaterialsTable";

export function UpdateMaterialForm(
  props: CustomCellRendererProps<MaterialsTableRows>["data"]
) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue("zinc.200", "zinc.900");
  const borderColor = useColorModeValue("zinc.300", "zinc.800");

  // Initialize the form
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

  // Get vendors
  const { data: vendorsQuery } = api.material.getVendors.useQuery();
  const vendorOptions = vendorsQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  // Get categories
  const { data: categoriesQuery } = api.material.getCategories.useQuery();
  const categoryOptions = categoriesQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  // Callback to initialize the form when node.data is ready
  const initializeForm = React.useCallback(
    (data: MaterialsTableRows) => {
      const { name, cost, quantity, minQuantity, extraData } = data;
      reset({
        id: extraData.id,
        name,
        url: extraData.url ?? undefined,
        sku: extraData.sku ?? undefined,
        cost: toNumber(cost),
        quantity: toNumber(quantity),
        quantityUnit: extraData.quantityUnit ?? undefined,
        minQuantity: toNumber(minQuantity),
        vendor: extraData.vendor
          ? mapToSelectInput(extraData.vendor)
          : undefined,
        categories: extraData.categories?.map(mapToSelectInput),
        notes: extraData.notes ?? undefined,
      });
    },
    [reset]
  );

  // Initialize the form defaults
  React.useEffect(() => {
    if (props) {
      initializeForm(props);
    }
  }, [initializeForm, props]);

  // Update material mutation
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
                bg={bgColor}
                border="1px solid"
                borderColor={borderColor}
              >
                <Stack spacing={4}>
                  <HStack>
                    <Icon
                      as={FaLock}
                      mt={0.5}
                      alignSelf="flex-start"
                      color="zinc.400"
                    />
                    <Text fontSize="xs" color="zinc.500">
                      Edit stock to update these fields.
                    </Text>
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
                            variant="input"
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
                </Stack>
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
    </>
  );
}
