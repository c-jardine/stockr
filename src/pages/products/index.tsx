import { useSession } from "next-auth/react";

import { PageLoader } from "~/components/PageLoader";
import { withAuth } from "~/server/auth";

export default function Products() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return <div>Products</div>;
}

export const getServerSideProps = withAuth();
