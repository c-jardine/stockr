import { withAuth } from "~/server/auth";

export default function Production() {
  return <div>Production</div>;
}

export const getServerSideProps = withAuth();
