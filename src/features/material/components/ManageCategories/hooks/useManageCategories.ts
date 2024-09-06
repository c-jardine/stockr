import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useMaterialCategoriesOptions from "~/hooks/material/useMaterialCategoriesOptions";

import {
  updateCategoriesFormSchema,
  type UpdateCategoriesFormType,
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

  const {
    query: { data },
  } = useMaterialCategoriesOptions();

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

  const initializeForm = useCallback(
    (data: UpdateCategoriesFormType) => {
      reset(data);
    },
    [reset]
  );

  useEffect(() => {
    if (data) {
      initializeForm({ categories: data });
    }
  }, [data]);

  async function onSubmit(data: UpdateCategoriesFormType) {
    return await mutation.mutateAsync(data);
  }

  return { form, fieldArray, onSubmit, disclosure };
}
