import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { CustomCellRendererProps } from "ag-grid-react";
import {
  type ColDef,
  type ValueFormatterParams,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/features/table/components/Table";
import { api } from "~/utils/api";

export type TableRows = {
  name: string;
  url: string;
  sku: string;
  cost: string;
  quantity: string;
  quantityUnit: string;
  minQuantity: string;
  vendor: { name: string };
  categories: { name: string }[];
  notes: string;
};

export function ImportMaterialsOverview({ data }: { data: TableRows[] }) {
  const { isOpen, onClose } = useDisclosure({
    id: "confirmImport",
    defaultIsOpen: true,
  });

  // TODO
  const isSubmitting = false;

  const toast = useToast();
  const utils = api.useUtils();
  const mutation = api.material.importMaterials.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Successful import",
        description: `You successfully imported ${data.length} materials.`,
        status: "success",
      });

      await utils.material.getAll.invalidate();
      onClose();
    },
  });

  async function handleImport() {
    await mutation.mutateAsync(data);
  }

  const colDefs: ColDef<TableRows>[] = [
    {
      headerName: "Name",
      field: "name",
      flex: 1,
    },
    {
      headerName: "URL",
      field: "url",
      width: 200,
      suppressAutoSize: true,
    },
    {
      headerName: "SKU",
      field: "sku",
    },
    {
      field: "quantity",
    },
    {
      headerName: "Min. quantity",
      field: "minQuantity",
    },
    {
      field: "vendor",
      valueFormatter: (
        params: ValueFormatterParams<TableRows, TableRows["vendor"]>
      ) => params.value?.name ?? "",
    },
    {
      field: "categories",
      cellRenderer: ({ node }: CustomCellRendererProps<TableRows>) => (
        <HStack>
          {node.data?.categories.map(({ name }) => (
            <Tag key={name}>{name}</Tag>
          ))}
        </HStack>
      ),
    },
    {
      field: "notes",
    },
  ];

  if (!data) {
    return null;
  }

  return (
    <Modal {...{ isOpen, onClose }} size="full">
      <ModalOverlay />
      <ModalContent h="full" rounded="none">
        <ModalHeader>
          Import overview
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody h="full">
          <Box visibility="hidden" as="form"></Box>
          <Stack maxH={128} h="full">
            <Table<TableRows>
              rowData={data}
              columnDefs={colDefs}
              autoSizeStrategy={{
                type: "fitCellContents",
                colIds: [
                  "sku",
                  "cost",
                  "quantity",
                  "quantityUnit",
                  "minQuantity",
                  "vendor",
                  "categories",
                  "notes",
                ],
              }}
            />
          </Stack>
        </ModalBody>
        <ModalFooter justifyContent="flex-end" gap={4}>
          <Button
            type="button"
            variant="primary"
            size="sm"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            onClick={handleImport}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
