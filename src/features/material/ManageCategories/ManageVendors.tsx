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
import { FaBuildingUser, FaPlus, FaTrash } from "react-icons/fa6";

import { PageLoader } from "~/components/PageLoader";
import { TextInput } from "~/components/TextInput";
import {
  updateVendorsFormSchema,
  UpdateVendorsFormType,
} from "~/types/material";
import { api } from "~/utils/api";

export function ManageVendors() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const methods = useForm<UpdateVendorsFormType>({
    defaultValues: {
      vendors: [{ id: "", name: "" }],
    },
    resolver: zodResolver(updateVendorsFormSchema),
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: methods.control,
      name: "vendors",
    }
  );

  const toast = useToast();

  const { data, isLoading } = api.material.getVendors.useQuery();
  const utils = api.useUtils();
  const mutation = api.material.updateVendors.useMutation({
    onSuccess: async () => {
      toast({
        title: "Updated vendors",
        description: "Successfully updated vendors.",
        status: "success",
      });

      await utils.material.getAll.invalidate();
      await utils.material.getVendors.invalidate();
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
      reset({ vendors: data });
    }
  }, [data, reset]);

  async function onSubmit(data: UpdateVendorsFormType) {
    return await mutation.mutateAsync(data);
  }

  return (
    <>
      <MenuItem
        icon={<Icon as={FaBuildingUser} boxSize={4} />}
        fontSize="sm"
        onClick={onOpen}
      >
        Manage vendors
      </MenuItem>
      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage vendors</ModalHeader>
          <ModalBody maxH={96} overflowY="scroll">
            {isLoading && <PageLoader pt={0} />}
            {!isLoading && (
              <Stack
                as="form"
                id="update-vendors-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                {fields.map((field, index) => (
                  <HStack key={field.id} justifyContent="space-between">
                    <TextInput
                      control={control}
                      name={`vendors.${index}.name`}
                    />
                    <IconButton
                      icon={<Icon as={FaTrash} color="red.600" boxSize={3} />}
                      aria-label={`Edit ${name} vendor`}
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
                  const length = watch("vendors").length;
                  const lastVendor = watch("vendors")[length - 1];

                  if (!lastVendor?.name) {
                    return true;
                  }

                  return false;
                })()}
              >
                Create new vendor
              </Button>

              <HStack mt={8} spacing={4} justifyContent="flex-end">
                <ScaleFade in={!isSubmitting} initialScale={0.9}>
                  <Button size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                </ScaleFade>
                <Button
                  type="submit"
                  form="update-vendors-form"
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
