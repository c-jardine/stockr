import { Button, Icon, IconButton, Stack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa6";

import { PageHeader } from "~/components/PageHeader";
import { PageLoader } from "~/components/PageLoader";
import { MaterialLogsTable } from "~/features/materialLogs/components/MaterialsLogsTable";
import { withAuth } from "~/server/auth";

export default function MaterialHistory() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <PageLoader />;
  }

  async function handleGoBack() {
    await router.push("/materials");
  }

  return (
    <Stack spacing={4} h="full">
      <PageHeader>
        <PageHeader.Content>
          <PageHeader.Title>Materials History</PageHeader.Title>
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<Icon as={FaArrowLeft} />}
            aria-label="Back to materials"
            onClick={handleGoBack}
          />
          <Button
            display={{ base: "none", md: "flex" }}
            leftIcon={<Icon as={FaArrowLeft} />}
            onClick={handleGoBack}
          >
            Back to materials
          </Button>
        </PageHeader.Content>
      </PageHeader>
      <MaterialLogsTable />
    </Stack>
  );
}

export const getServerSideProps = withAuth();
