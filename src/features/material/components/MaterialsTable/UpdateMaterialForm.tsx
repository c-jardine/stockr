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
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { FaDollarSign, FaLock } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";

import { type CustomCellRendererProps } from "ag-grid-react";

import { ControlledCreatableSelect } from "~/components/ControlledCreatableSelect";
import { TextInput } from "~/components/TextInput";
import { type UpdateMaterialFormType } from "~/types/material";
import { type SelectInput } from "~/utils/selectInput";
import { type MaterialsTableRows } from "./MaterialsTable";
import { useUpdateMaterial } from "./hooks/useUpdateMaterial";

export function UpdateMaterialForm(
  props: CustomCellRendererProps<MaterialsTableRows>["data"]
) {
  const {
    form: {
      control,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit,
    vendorOptions,
    categoryOptions,
    disclosure,
  } = useUpdateMaterial(props);

  const { isOpen, onOpen, onClose } = disclosure;

  const bgColor = useColorModeValue("zinc.200", "zinc.900");
  const borderColor = useColorModeValue("zinc.300", "zinc.800");

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
        fontSize="sm"
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
