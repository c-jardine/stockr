import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  createMaterialFormSchema,
  CreateMaterialFormType,
} from "~/types/material";
import { api } from "~/utils/api";
import { SelectInput } from "~/utils/selectInput";

interface FormattedGroup {
  label: string;
  options: SelectInput[];
}

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
  });

  const { data: quantityUnits } = api.material.getQuantityUnits.useQuery();
  const quantityUnitOptions =
    quantityUnits?.reduce((groups, unit) => {
      // Find the existing group or create a new one
      const group = groups.find((g) => g.label === unit.group);

      const option: SelectInput = {
        label: unit.name,
        value: unit.name,
      };

      if (group) {
        group.options.push(option);
      } else {
        groups.push({
          label: unit.group,
          options: [option],
        });
      }

      return groups;
    }, [] as FormattedGroup[]) || [];

  const groupOrder = [
    "Count",
    "Weight",
    "Length",
    "Area",
    "Volume",
    "Miscellaneous",
  ];

  quantityUnitOptions.sort(
    (a, b) => groupOrder.indexOf(a.label) - groupOrder.indexOf(b.label)
  );

  const { data: categoriesQuery } = api.material.getCategories.useQuery();
  const categoryOptions = categoriesQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const { data: vendorsQuery } = api.material.getVendors.useQuery();
  const vendorOptions = vendorsQuery?.map(({ name }) => ({
    label: name,
    value: name,
  }));

  function onSubmit(data: CreateMaterialFormType) {
    mutation.mutate(data);
  }

  return {
    form,
    onSubmit,
    disclosure,
    quantityUnitOptions,
    categoryOptions,
    vendorOptions,
  };
}
