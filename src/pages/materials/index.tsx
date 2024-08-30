import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { FaHistory } from "react-icons/fa";
import { FaEllipsis, FaFileImport } from "react-icons/fa6";

import { PageHeader } from "~/components/PageHeader";
import { PageLoader } from "~/components/PageLoader";
import { CreateMaterialForm } from "~/features/material/components/CreateMaterialForm";
import { MaterialsTable } from "~/features/material/components/MaterialsTable/MaterialsTable";
import {
  ManageCategories,
  ManageVendors,
} from "~/features/material/ManageCategories";

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

          <Menu>
            <MenuButton as={IconButton} icon={<Icon as={FaEllipsis} />} />
            <MenuList>
              <MenuItem
                as={NextLink}
                href="/materials/history"
                icon={<Icon as={FaHistory} boxSize={4} />}
                fontSize="sm"
              >
                View history
              </MenuItem>
              <MenuItem
                icon={<Icon as={FaFileImport} boxSize={4} />}
                fontSize="sm"
              >
                Import materials
              </MenuItem>
              <MenuDivider />
              <ManageVendors />
              <ManageCategories />
            </MenuList>
          </Menu>

          <CreateMaterialForm />
        </PageHeader.Content>
      </PageHeader>
      <MaterialsTable />
    </Stack>
  );
}
