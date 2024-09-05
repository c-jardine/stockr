import { useSession } from "next-auth/react";

import { PageLoader } from "~/components/PageLoader";
import { withAuth } from "~/server/auth";

export default function Blueprints() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return <div>Blueprints</div>;
}

export const getServerSideProps = withAuth();
