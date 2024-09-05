import { withAuth } from "~/server/auth";

export default function History() {
  return <div>History</div>;
}

export const getServerSideProps = withAuth();
