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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomCellRendererProps } from "ag-grid-react";
import React from "react";
import { useForm } from "react-hook-form";
import { FaChevronRight } from "react-icons/fa6";
import { TextInput } from "~/components/TextInput";
import {
  updateMaterialStockFormSchema,
  UpdateMaterialStockFormType,
} from "~/types/material";
import { api } from "~/utils/api";
import { MaterialsTableColumns } from "./MaterialsTable";

export function StockCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableColumns>) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateMaterialStockFormType>({
    defaultValues: {
      materialId: node.data?.id ?? undefined,
      previousStockLevel: node.data?.stock ?? undefined,
    },
    resolver: zodResolver(updateMaterialStockFormSchema),
  });

  React.useEffect(() => {
    if (node.data) {
      reset({
        materialId: node.data.id,
        previousStockLevel: node.data.stock ?? undefined,
      });
    }
  }, []);

  const toast = useToast();

  const utils = api.useUtils();
  const mutation = api.material.updateStock.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Stock updated",
        description: "Successfully updated stock.",
        status: "success",
      });
      await utils.material.getAll.invalidate();
    },
  });

  function onSubmit(data: UpdateMaterialStockFormType) {
    if (node.data) {
      mutation.mutate({
        ...data,
      });
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
                onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
                spacing={4}
              >
                <TextInput
                  control={control}
                  name="type"
                  label="Stock update type"
                  isRequired
                />
                <TextInput
                  control={control}
                  name="newStockLevel"
                  label="Stock level"
                  isRequired
                />
                <HStack>
                  <Text fontSize="xs">{node.data?.stock}</Text>{" "}
                  <Icon as={FaChevronRight} boxSize={3} />{" "}
                  <Text fontSize="xs" fontWeight="semibold">
                    {watch("newStockLevel") ?? node.data?.stock}
                  </Text>
                </HStack>
                <TextInput control={control} name="notes" label="Notes" />
              </Stack>
            </PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end" gap={4}>
              <Button size="sm">Cancel</Button>
              <Button
                type="submit"
                form="update-material-stock-form"
                variant="primary"
                size="sm"
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
