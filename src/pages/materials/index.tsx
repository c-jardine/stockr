import { Button, Icon, IconButton, Stack } from "@chakra-ui/react";
import { FaHistory } from "react-icons/fa";
import { FaFileImport, FaPlus } from "react-icons/fa6";
import MaterialsTable from "~/components/MaterialsTable";
import PageHeader from "~/components/PageHeader";
import CreateMaterialForm from "../../features/createMaterial/components/CreateMaterialForm";

export default function Materials() {
  return (
    <Stack spacing={4} h="full">
      <PageHeader>
        <PageHeader.Content>
          <PageHeader.Title>Materials</PageHeader.Title>
          <IconButton
            icon={<Icon as={FaHistory} />}
            aria-label="View materials history"
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
