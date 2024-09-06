import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  createMaterialFormSchema,
  type CreateMaterialFormType,
} from "~/types/material";
import { api } from "~/utils/api";

export default function useCreateMaterial() {
  const disclosure = useDisclosure();
  const toast = useToast();
  const utils = api.useUtils();

  // Form
  const form = useForm<CreateMaterialFormType>({
    defaultValues: {
      categories: [],
    },
    resolver: zodResolver(createMaterialFormSchema),
  });

  const mutation = api.material.create.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Material created",
        description: `${data.name} has been created!`,
        status: "success",
      });
      disclosure.onClose();
      form.reset();
      await utils.material.getAll.invalidate();
      await utils.material.getCategories.invalidate();
      await utils.material.getVendors.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error creating material",
        description: error.message,
        status: "error",
      });
    },
  });

  function onSubmit(data: CreateMaterialFormType) {
    mutation.mutate(data);
  }

  return {
    form,
    onSubmit,
    disclosure,
  };
}
