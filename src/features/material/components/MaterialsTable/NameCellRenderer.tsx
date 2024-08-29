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
  SimpleGrid,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { type CustomCellRendererProps } from "ag-grid-react";

import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { TextInput } from "~/components/TextInput";
import {
  updateMaterialFormSchema,
  type UpdateMaterialFormType,
} from "~/types/material";
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
    reset,
    formState: { errors },
  } = useForm<UpdateMaterialFormType>({
    resolver: zodResolver(updateMaterialFormSchema),
  });

  const { data: categoriesQuery } = api.material.getCategories.useQuery();
  const categoryOptions = categoriesQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const { data: vendorsQuery } = api.material.getVendors.useQuery();
  const vendorOptions = vendorsQuery?.map(({ name }) => ({
    label: name,
    value: name,
  }));

  React.useEffect(() => {
    if (node.data) {
      const { name, sku, quantity, vendor, categories, extraData } = node.data;
      if (name === "Autumn Glow") {
        console.log(extraData.cost);
      }
      reset({
        name: name,
        url: extraData.url ?? undefined,
        sku: sku,
        cost: extraData.cost ?? undefined,
        quantity: quantity.toString() ?? undefined,
        quantityUnit: extraData.quantityUnit ?? undefined,
        minQuantity: extraData.minQuantity ?? undefined,
        vendor: vendor ?? undefined,
        categories: categories ?? undefined,
        notes: extraData.notes ?? undefined,
      });
    }
  }, [node.data, reset]);

  if (!node.data) {
    return null;
  }

  const { name, sku, quantity, vendor, categories, extraData } = node.data;

  async function onSubmit(data: UpdateMaterialFormType) {
    console.log(data);
  }

  return (
    <Stack spacing={0}>
      <Button
        variant="text"
        justifyContent="flex-start"
        size="sm"
        fontSize="xs"
        w="fit-content"
        p={0}
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
                      Cost will automatically be updated when adding a purchase
                      order.
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
            <Button>Cancel</Button>
            <Button variant="primary">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {node.data.categories?.length && (
        <HStack mt={-2} mb={2}>
          {node.data.categories?.map((c) => (
            <Tag key={c} fontSize="xs" fontWeight="medium">
              {c}
            </Tag>
          ))}
        </HStack>
      )}
    </Stack>
  );
}
