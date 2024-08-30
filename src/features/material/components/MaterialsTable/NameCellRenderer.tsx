import { HStack, Stack, Tag, Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { ExternalLink } from "~/components/ExternalLink";
import { type MaterialsTableRows } from "./MaterialsTable";
import { UpdateMaterialForm } from "./UpdateMaterialForm";

export function NameCellRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { extraData } = node.data;

  return (
    <HStack
      py={2}
      justifyContent="space-between"
      alignItems="center"
      wrap="wrap"
    >
      <Stack spacing={2}>
        <UpdateMaterialForm {...node.data} />
        {extraData.categories?.length && (
          <HStack wrap="wrap">
            {extraData.categories?.map((category) => (
              <Tag key={category.id}>{category.name}</Tag>
            ))}
          </HStack>
        )}
      </Stack>
      <Stack alignItems="flex-end" alignSelf="center" spacing={2}>
        {extraData.url && (
          <ExternalLink href={extraData.url}>
            View
            {extraData.vendor?.name
              ? ` on ${extraData.vendor.name}`
              : " website"}
          </ExternalLink>
        )}
        {extraData.sku && (
          <Text px={1} color="zinc.500" fontStyle="italic" lineHeight="normal">
            SKU: {extraData.sku}
          </Text>
        )}
      </Stack>
    </HStack>
  );
}
