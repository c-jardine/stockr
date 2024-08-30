import { useSession } from "next-auth/react";

import { PageLoader } from "~/components/PageLoader";

export default function Blueprints() {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return <div>Blueprints</div>;
}
