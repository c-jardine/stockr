import { withAuth } from "~/server/auth";

export default function Blueprints() {
  return <div>Blueprints</div>;
}

export const getServerSideProps = withAuth();
