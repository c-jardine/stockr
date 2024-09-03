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
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FaDollarSign, FaPlus } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";

import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { ControlledSelect } from "~/components/ControlledSelect";
import { TextInput } from "~/components/TextInput";
import {
  type CreateMaterialFormType,
  createMaterialFormSchema,
} from "~/types/material";
import { api } from "~/utils/api";

type SelectInput = {
  label: string;
  value: string;
};

export function CreateMaterialForm() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMaterialFormType>({
    defaultValues: {
      categories: [],
    },
    resolver: zodResolver(createMaterialFormSchema),
  });

  const utils = api.useUtils();
  const mutation = api.material.create.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Material created",
        description: `${data.name} has been created!`,
        status: "success",
      });
      onClose();
      reset();
      await utils.material.getAll.invalidate();
      await utils.material.getCategories.invalidate();
      await utils.material.getVendors.invalidate();
    },
  });

  interface SelectInput {
    label: string;
    value: string;
  }

  interface FormattedGroup {
    label: string;
    options: SelectInput[];
  }

  const { data: quantityUnits } = api.material.getQuantityUnits.useQuery();
  const quantityUnitOptions =
    quantityUnits?.reduce((groups, unit) => {
      // Find the existing group or create a new one
      const group = groups.find((g) => g.label === unit.group);

      const option: SelectInput = {
        label: unit.name,
        value: unit.name,
      };

      if (group) {
        group.options.push(option);
      } else {
        groups.push({
          label: unit.group,
          options: [option],
        });
      }

      return groups;
    }, [] as FormattedGroup[]) || [];

  const groupOrder = [
    "Count",
    "Weight",
    "Length",
    "Area",
    "Volume",
    "Miscellaneous",
  ];

  quantityUnitOptions.sort(
    (a, b) => groupOrder.indexOf(a.label) - groupOrder.indexOf(b.label)
  );

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

  function onSubmit(data: CreateMaterialFormType) {
    mutation.mutate(data);
  }

  return (
    <>
      <Button
        display={{ base: "none", md: "flex" }}
        variant="primary"
        leftIcon={<Icon as={FaPlus} />}
        fontSize="sm"
        onClick={onOpen}
      >
        New material
      </Button>
      <Drawer size="md" {...{ isOpen, onClose }}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>New material</DrawerHeader>
          <DrawerBody>
            <Stack
              as="form"
              id="create-material-form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={4}
            >
              <TextInput
                control={control}
                name="name"
                label="Name"
                isRequired
              />

              <TextInput control={control} name="url" label="URL" />

              <TextInput control={control} name="sku" label="SKU" />

              <FormControl isInvalid={!!errors.cost}>
                <FormLabel>Cost</FormLabel>
                <Controller
                  control={control}
                  name="cost"
                  render={({ field: { value, onChange, onBlur } }) => (
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
                        onValueChange={({ floatValue }) => onChange(floatValue)}
                        onBlur={onBlur}
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
                  formControlProps={{ gridColumn: "1 / span 3" }}
                />

                <Box gridColumn="4 / span 2">
                  <ControlledSelect
                    control={control}
                    name="quantityUnitName"
                    label="Unit"
                    options={quantityUnitOptions}
                    noOptionsMessage={(props) => <Text>No units found.</Text>}
                  />
                </Box>
              </SimpleGrid>

              <TextInput
                control={control}
                name="minQuantity"
                label="Min. quantity level"
              />

              <ControlledCreatableSelect<
                CreateMaterialFormType,
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
                CreateMaterialFormType,
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
            <Button onClick={onClose} isDisabled={!!isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-material-form"
              variant="primary"
              isDisabled={!!isSubmitting}
            >
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
