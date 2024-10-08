import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { type CustomCellRendererProps } from "ag-grid-react";

import {
  updateMaterialQuantityFormSchema,
  type UpdateMaterialQuantityFormType,
} from "~/types/material";
import { api } from "~/utils/api";
import { type MaterialsTableRows } from "../MaterialsTable";

export function useUpdateQuantity(
  node: CustomCellRendererProps<MaterialsTableRows>["node"]
) {
  const toast = useToast();
  const utils = api.useUtils();

  const updateTypeQuery = api.material.getQuantityUpdateTypes.useQuery();
  const updateTypeOptions = updateTypeQuery.data?.map(
    ({ id, type, action }) => ({
      label: type,
      value: { id, type, action },
    })
  );

  const mutation = api.material.updateQuantity.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Quantity updated",
        description: `Successfully updated quantity for ${data[0].name}.`,
        status: "success",
      });
      await utils.material.getAll.invalidate();
    },
  });

  const form = useForm<UpdateMaterialQuantityFormType>({
    defaultValues: {
      materialId: node.data?.id ?? undefined,
      originalQuantity: node.data?.quantity?.toString() ?? "0",
    },
    resolver: zodResolver(updateMaterialQuantityFormSchema),
  });

  const { reset } = form;

  // Form submit handler
  async function onSubmit(data: UpdateMaterialQuantityFormType) {
    await mutation.mutateAsync(data);
  }

  // Initialize form callback
  const initializeForm = useCallback(
    (data: MaterialsTableRows) => {
      reset({
        materialId: data.id,
        originalQuantity: data.quantity?.toString() ?? "0",
      });
    },
    [reset]
  );

  useEffect(() => {
    if (node.data) {
      initializeForm(node.data);
    }
  }, [node.data, initializeForm]);

  return { form, onSubmit, updateTypeOptions };
}
