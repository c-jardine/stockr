import { useSession } from "next-auth/react";

import { PageLoader } from "~/components/PageLoader";

export default function History() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return <div>History</div>;
}
