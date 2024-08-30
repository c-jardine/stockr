import {
  Button,
  HStack,
  Icon,
  IconButton,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";

import { PageLoader } from "~/components/PageLoader";
import { TextInput } from "~/components/TextInput";
import {
  updateCategoriesFormSchema,
  UpdateCategoriesFormType,
} from "~/types/material";
import { api } from "~/utils/api";

export function ManageCategories() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const methods = useForm<UpdateCategoriesFormType>({
    defaultValues: {
      categories: [{ id: "", name: "" }],
    },
    resolver: zodResolver(updateCategoriesFormSchema),
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: methods.control,
      name: "categories",
    }
  );

  const toast = useToast();

  const { data, isLoading } = api.material.getCategories.useQuery();
  const utils = api.useUtils();
  const mutation = api.material.updateCategories.useMutation({
    onSuccess: async () => {
      toast({
        title: "Updated categories",
        description: "Successfully updated categories.",
        status: "success",
      });

      await utils.material.getCategories.invalidate();
      onClose();
    },
  });

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  React.useEffect(() => {
    if (data) {
      reset({ categories: data });
    }
  }, [data, reset]);

  async function onSubmit(data: UpdateCategoriesFormType) {
    return await mutation.mutateAsync(data);
  }

  return (
    <>
      <MenuItem
        icon={<Icon as={MdCategory} boxSize={4} />}
        fontSize="sm"
        onClick={onOpen}
      >
        Manage categories
      </MenuItem>
      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage categories</ModalHeader>
          <ModalBody maxH={96} overflowY="scroll">
            {isLoading && <PageLoader pt={0} />}
            {!isLoading && (
              <Stack
                as="form"
                id="update-categories-form"
                onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
              >
                {fields.map((field, index) => (
                  <HStack key={field.id} justifyContent="space-between">
                    <TextInput
                      control={control}
                      name={`categories.${index}.name`}
                    />
                    <IconButton
                      icon={<Icon as={FaTrash} color="red.600" boxSize={3} />}
                      aria-label={`Edit ${name} category`}
                      variant="outline"
                      size="xs"
                      rounded="md"
                      onClick={() => remove(index)}
                    />
                  </HStack>
                ))}
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Stack w="full">
              <Button
                leftIcon={<Icon as={FaPlus} />}
                variant="primary"
                w="full"
                onClick={() => append({ id: "", name: "" })}
                isDisabled={(() => {
                  const length = watch("categories").length;
                  const lastCategory = watch("categories")[length - 1];

                  if (!lastCategory?.name) {
                    return true;
                  }

                  return false;
                })()}
              >
                Create new category
              </Button>

              <HStack mt={8} spacing={4} justifyContent="flex-end">
                <ScaleFade in={!isSubmitting} initialScale={0.9}>
                  <Button size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                </ScaleFade>
                <Button
                  type="submit"
                  form="update-categories-form"
                  variant="primary"
                  size="sm"
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Save
                </Button>
              </HStack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
