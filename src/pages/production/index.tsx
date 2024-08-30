import { useSession } from "next-auth/react";

import { PageLoader } from "~/components/PageLoader";

export default function Production() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return <div>Production</div>;
}
