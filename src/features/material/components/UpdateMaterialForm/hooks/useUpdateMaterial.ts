import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { type CustomCellRendererProps } from "ag-grid-react";

import {
  updateMaterialFormSchema,
  type UpdateMaterialFormType,
} from "~/types/material";
import { api } from "~/utils/api";
import { formatQuantityWithUnit } from "~/utils/formatQuantity";
import { mapToSelectInput } from "~/utils/selectInput";
import { isTRPCClientError } from "~/utils/trpc";
import { type MaterialsTableRows } from "../../MaterialsTable/MaterialsTable";

export function useUpdateMaterial(
  props: CustomCellRendererProps<MaterialsTableRows>["data"]
) {
  const toast = useToast();

  const disclosure = useDisclosure();
  const { onClose } = disclosure;

  // Initialize the form
  const form = useForm<UpdateMaterialFormType>({
    resolver: zodResolver(updateMaterialFormSchema),
  });

  const { reset, setFocus, setError } = form;

  // Get vendors
  const { data: vendorsQuery } = api.material.getVendors.useQuery();
  const vendorOptions = vendorsQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  // Get categories
  const { data: categoriesQuery } = api.material.getCategories.useQuery();
  const categoryOptions = categoriesQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  // Callback to initialize the form when node.data is ready
  const initializeForm = useCallback(
    (data: MaterialsTableRows) => {
      const {
        id,
        name,
        url,
        sku,
        cost,
        quantity,
        quantityUnit,
        minQuantity,
        vendor,
        categories,
        notes,
      } = data;
      reset({
        id: id,
        name,
        url: url ?? undefined,
        sku: sku ?? undefined,
        cost: cost?.toString(),
        quantity: quantity.toString(),
        quantityUnit:
          formatQuantityWithUnit({
            quantity: quantity,
            quantityUnit: quantityUnit,
            style: "abbreviation",
          }) ?? "",
        minQuantity: minQuantity?.toString(),
        vendor: vendor ? mapToSelectInput(vendor) : undefined,
        categories: categories?.map(mapToSelectInput),
        notes: notes ?? undefined,
      });
    },
    [reset]
  );

  // Initialize the form defaults
  useEffect(() => {
    if (props) {
      initializeForm(props);
    }
  }, [initializeForm, props]);

  // Update material mutation
  const utils = api.useUtils();
  const mutation = api.material.update.useMutation({
    onSuccess: async ({ name }) => {
      toast({
        title: `Material updated`,
        description: `Successfully updated ${name}`,
        status: "success",
      });

      await utils.material.getAll.invalidate();
      onClose();
    },
  });

  // Form submit handler
  async function onSubmit(data: UpdateMaterialFormType) {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "CONFLICT") {
        setError("sku", {
          type: "manual",
          message: error.message,
        });
        setFocus("sku");
      }
    }
  }

  return { form, onSubmit, vendorOptions, categoryOptions, disclosure };
}
