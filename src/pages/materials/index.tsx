import { Button, Icon, IconButton, Stack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { FaHistory } from "react-icons/fa";
import { FaFileImport, FaPlus } from "react-icons/fa6";

import { PageHeader } from "~/components/PageHeader";
import { PageLoader } from "~/components/PageLoader";
import { CreateMaterialForm } from "~/features/material/components/CreateMaterialForm";
import { MaterialsTable } from "~/features/material/components/MaterialsTable/MaterialsTable";

export default function Materials() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return (
    <Stack spacing={4} h="full">
      <PageHeader>
        <PageHeader.Content>
          <PageHeader.Title>Materials</PageHeader.Title>
          <IconButton
            as={NextLink}
            icon={<Icon as={FaHistory} />}
            aria-label="View materials history"
            href="/materials/history"
          />
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<Icon as={FaFileImport} />}
            aria-label="Import materials from .csv"
          />
          <Button
            display={{ base: "none", md: "flex" }}
            leftIcon={<Icon as={FaFileImport} />}
            fontSize="sm"
          >
            Import
          </Button>
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<Icon as={FaPlus} />}
            aria-label="Create a new material"
          />

          <CreateMaterialForm />
        </PageHeader.Content>
      </PageHeader>
      <MaterialsTable />
    </Stack>
  );
}
