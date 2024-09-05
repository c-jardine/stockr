import { withAuth } from "~/server/auth";

export default function Settings() {
  return <div>Settings</div>;
}

export const getServerSideProps = withAuth();
