import { useSession } from "next-auth/react";

import { PageLoader } from "~/components/PageLoader";
import { withAuth } from "~/server/auth";

export default function History() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return <div>History</div>;
}

export const getServerSideProps = withAuth();
