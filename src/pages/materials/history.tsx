import { Button, Icon, IconButton, Stack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { FaHistory } from "react-icons/fa";
import { FaFileImport, FaPlus } from "react-icons/fa6";

import { PageHeader } from "~/components/PageHeader";
import { PageLoader } from "~/components/PageLoader";
import { MaterialLogsTable } from "~/features/materialLogs/components/MaterialsLogsTable";

export default function MaterialHistory() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return (
    <Stack spacing={4} h="full">
      <PageHeader>
        <PageHeader.Content>
          <PageHeader.Title>Materials History</PageHeader.Title>
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

          {/* <CreateMaterialForm /> */}
        </PageHeader.Content>
      </PageHeader>
      <MaterialLogsTable />
    </Stack>
  );
}
