import { withAuth } from "~/server/auth";

export default function Products() {
  return <div>Products</div>;
}

export const getServerSideProps = withAuth();
