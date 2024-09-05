import { useSession } from "next-auth/react";

import { PageLoader } from "~/components/PageLoader";
import { withAuth } from "~/server/auth";

export default function Settings() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return <div>Settings</div>;
}

export const getServerSideProps = withAuth();
