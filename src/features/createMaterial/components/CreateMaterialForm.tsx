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
import {
  type CreateMaterialForm,
  createMaterialFormSchema,
} from "~/types/material";
import { api } from "~/utils/api";

type CategoriesInput = {
  label: string;
  value: string;
};

export default function CreateMaterialForm() {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMaterialForm>({
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
      <Drawer size="md" {...{ isOpen, onClose }}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>New material</DrawerHeader>
          <DrawerBody>
            <Stack
              as="form"
              id="create-material-form"
              onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
              spacing={4}
            >
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input {...register("name")} />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.url}>
                <FormLabel>URL</FormLabel>
                <Input {...register("url")} />
                {errors.url && (
                  <FormErrorMessage>{errors.url.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.sku}>
                <FormLabel>SKU</FormLabel>
                <Input {...register("sku")} />
                {errors.sku && (
                  <FormErrorMessage>{errors.sku.message}</FormErrorMessage>
                )}
              </FormControl>
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
              <SimpleGrid columns={4} gap={4}>
                <FormControl
                  isInvalid={!!errors.stockLevel}
                  gridColumn="1 / span 3"
                >
                  <FormLabel>Stock Level</FormLabel>
                  <Input {...register("stockLevel")} />
                  {errors.stockLevel && (
                    <FormErrorMessage>
                      {errors.stockLevel.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.stockUnitType}>
                  <FormLabel>Unit Type</FormLabel>
                  <Input {...register("stockUnitType")} />
                  {errors.stockUnitType && (
                    <FormErrorMessage>
                      {errors.stockUnitType.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </SimpleGrid>
              <FormControl isInvalid={!!errors.minStockLevel}>
                <FormLabel>Min. Stock Level</FormLabel>
                <Input {...register("minStockLevel")} />
                {errors.minStockLevel && (
                  <FormErrorMessage>
                    {errors.minStockLevel.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.vendor}>
                <FormLabel>Vendor</FormLabel>
                <Input {...register("vendor")} />
                {errors.vendor && (
                  <FormErrorMessage>{errors.vendor.message}</FormErrorMessage>
                )}
              </FormControl>

              <ControlledSelect<CreateMaterialForm, CategoriesInput, true>
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
