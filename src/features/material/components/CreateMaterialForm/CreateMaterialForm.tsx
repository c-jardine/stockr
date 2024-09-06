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
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { FaDollarSign, FaPlus } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";

import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { ControlledSelect } from "~/components/ControlledSelect";
import { TextInput } from "~/components/TextInput";
import useMaterialCategoriesOptions from "~/hooks/material/useMaterialCategoriesOptions";
import useMaterialQuantityUnitOptions from "~/hooks/material/useMaterialQuantityUnitOptions";
import useMaterialVendorsOptions from "~/hooks/material/useMaterialVendorsOptions";
import { type CreateMaterialFormType } from "~/types/material";
import { type SelectInput } from "~/utils/selectInput";
import useCreateMaterial from "./hooks/useCreateMaterial";

export function CreateMaterialForm() {
  const {
    form: {
      control,
      register,
      watch,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit,
    disclosure: { isOpen, onOpen, onClose },
  } = useCreateMaterial();

  const { quantityUnitOptions } = useMaterialQuantityUnitOptions();
  const { vendorOptions } = useMaterialVendorsOptions();
  const { categoryOptions } = useMaterialCategoriesOptions();

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
                <FormLabel>Cost {typeof watch("cost")}</FormLabel>
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

              <SimpleGrid columns={5} gap={4}>
                <TextInput
                  control={control}
                  name="quantity"
                  label="Quantity"
                  formControlProps={{ gridColumn: "1 / span 3" }}
                  inputProps={{
                    as: NumericFormat,
                    allowNegative: false,
                    decimalScale: 2,
                    thousandSeparator: ",",
                  }}
                />

                <Box gridColumn="4 / span 2">
                  <ControlledSelect
                    control={control}
                    name="quantityUnitName"
                    label="Unit"
                    options={quantityUnitOptions}
                    noOptionsMessage={() => <Text>No units found.</Text>}
                  />
                </Box>
              </SimpleGrid>

              <TextInput
                control={control}
                name="minQuantity"
                label="Min. quantity level"
                inputProps={{
                  as: NumericFormat,
                  allowNegative: false,
                  decimalScale: 2,
                  thousandSeparator: ",",
                }}
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
