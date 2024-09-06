import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  updateCategoriesFormSchema,
  UpdateCategoriesFormType,
} from "~/types/material";
import { api } from "~/utils/api";

export default function useManageCategories() {
  const toast = useToast();
  const disclosure = useDisclosure();
  const utils = api.useUtils();

  const form = useForm<UpdateCategoriesFormType>({
    defaultValues: {
      categories: [{ id: "", name: "" }],
    },
    resolver: zodResolver(updateCategoriesFormSchema),
  });
  const fieldArray = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const { data, isLoading } = api.material.getCategories.useQuery();
  const mutation = api.material.updateCategories.useMutation({
    onSuccess: async () => {
      toast({
        title: "Updated categories",
        description: "Successfully updated categories.",
        status: "success",
      });

      await utils.material.getAll.invalidate();
      await utils.material.getCategories.invalidate();
      disclosure.onClose();
    },
  });

  const { reset } = form;

  React.useEffect(() => {
    if (data) {
      reset({ categories: data });
    }
  }, [data, reset]);

  async function onSubmit(data: UpdateCategoriesFormType) {
    return await mutation.mutateAsync(data);
  }

  return { form, fieldArray, onSubmit, disclosure };
}
