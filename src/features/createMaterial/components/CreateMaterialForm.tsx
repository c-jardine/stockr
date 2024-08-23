import {
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FaDollarSign, FaPlus } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import ControlledSelect from "~/components/ControlledSelect";
import TextInput from "~/components/TextInput";
import {
  type CreateMaterialForm,
  createMaterialFormSchema,
} from "~/types/material";
import { api } from "~/utils/api";

type MultiSelectInput = {
  label: string;
  value: string;
};

export default function CreateMaterialForm() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMaterialForm>({
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
    },
  });

  const { data: categoriesQuery } = api.material.getCategories.useQuery();
  const categoryOptions = categoriesQuery?.map(({ category: { name } }) => ({
    label: name,
    value: name,
  }));

  const { data: vendorsQuery } = api.material.getVendors.useQuery();
  const vendorOptions = vendorsQuery?.map(({ name }) => ({
    label: name,
    value: name,
  }));

  function onSubmit(data: CreateMaterialForm) {
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
      <Drawer size="sm" {...{ isOpen, onClose }}>
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
                        as={NumericFormat}
                        allowNegative={false}
                        decimalScale={2}
                        thousandSeparator=","
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </InputGroup>
                  )}
                />
                {errors.cost && (
                  <FormErrorMessage>{errors.cost.message}</FormErrorMessage>
                )}
              </FormControl>

              <SimpleGrid columns={2} gap={4}>
                <TextInput
                  control={control}
                  name="stockLevel"
                  label="Stock level"
                />

                <TextInput
                  control={control}
                  name="stockUnitType"
                  label="Stock unit"
                />
              </SimpleGrid>

              <TextInput
                control={control}
                name="minStockLevel"
                label="Min. stock level"
              />

              <ControlledSelect<CreateMaterialForm, MultiSelectInput, true>
                options={vendorOptions}
                isMulti
                control={control}
                name="vendor"
                label="Vendor"
                useBasicStyles
              />

              <ControlledSelect<CreateMaterialForm, MultiSelectInput, true>
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
