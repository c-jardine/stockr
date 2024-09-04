import { Link } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>CraftMate</title>
        <meta
          name="description"
          content="A material and product tracker for artisans."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AuthShowcase />
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: session } = useSession();

  const { data: secretMessage } = api.material.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: session?.user !== undefined }
  );

  return (
    <>
      <div>
        <p>
          {session && <span>Logged in as {session.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>

        <Link href="https://www.google.com" isExternal>
          Click here
        </Link>
        <button onClick={session ? () => void signOut() : () => void signIn()}>
          {session ? "Sign out" : "Sign in"}
        </button>
      </div>
    </>
  );
}
