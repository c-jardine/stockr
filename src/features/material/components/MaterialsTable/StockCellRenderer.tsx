import {
  Button,
  Flex,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  ScaleFade,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CustomCellRendererProps } from "ag-grid-react";
import React from "react";
import { useForm } from "react-hook-form";
import { FaChevronRight } from "react-icons/fa6";

import {
  CreatableSelect,
  type MultiSelectInput,
} from "~/components/CreatableSelect";
import { TextInput } from "~/components/TextInput";
import {
  updateMaterialStockFormSchema,
  type UpdateMaterialStockFormType,
} from "~/types/material";
import { api } from "~/utils/api";
import { type MaterialsTableColumns } from "./MaterialsTable";

export function StockCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableColumns>) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<UpdateMaterialStockFormType>({
    defaultValues: {
      materialId: node.data?.id ?? undefined,
      previousStockLevel: node.data?.stock ?? undefined,
    },
    resolver: zodResolver(updateMaterialStockFormSchema),
  });

  const { data: updateTypeQuery } = api.material.getStockUpdateTypes.useQuery();
  const updateTypeOptions = updateTypeQuery?.map(({ id, type }) => ({
    label: type,
    value: id,
  }));

  React.useEffect(() => {
    if (node.data) {
      reset({
        materialId: node.data.id,
        previousStockLevel: node.data.stock ?? undefined,
      });
    }
  }, [node.data, reset]);

  const toast = useToast();

  const utils = api.useUtils();
  const mutation = api.material.updateStock.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Stock updated",
        description: `Successfully updated stock for ${data[0].name}.`,
        status: "success",
      });
      await utils.material.getAll.invalidate();
    },
  });

  async function onSubmit(data: UpdateMaterialStockFormType) {
    if (node.data) {
      await mutation.mutateAsync(data);
    }
  }

  return (
    <Flex alignItems="center" h="full">
      <Popover>
        <PopoverTrigger>
          <Button variant="stockUpdate" size="sm">
            {node.data?.stock}
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{node.data?.name}</PopoverHeader>
            <PopoverBody>
              <Stack
                as="form"
                id="update-material-stock-form"
                onSubmit={handleSubmit(onSubmit)}
                spacing={4}
              >
                <CreatableSelect<
                  UpdateMaterialStockFormType,
                  MultiSelectInput,
                  true
                >
                  options={updateTypeOptions}
                  control={control}
                  name="type"
                  label="Stock update type"
                  useBasicStyles
                />
                <TextInput
                  control={control}
                  name="adjustmentQuantity"
                  label="Stock level"
                />
                <HStack>
                  <Text fontSize="xs">{node.data?.stock}</Text>{" "}
                  <Icon as={FaChevronRight} boxSize={3} />{" "}
                  <Text fontSize="xs" fontWeight="semibold">
                    {watch("adjustmentQuantity") ?? node.data?.stock}
                  </Text>
                </HStack>
                <TextInput control={control} name="notes" label="Notes" />
              </Stack>
            </PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end" gap={4}>
              <ScaleFade in={!isSubmitting} initialScale={0.9}>
                <Button size="sm">Cancel</Button>
              </ScaleFade>
              <Button
                type="submit"
                form="update-material-stock-form"
                variant="primary"
                size="sm"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Save
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
}
