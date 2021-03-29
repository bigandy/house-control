import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

import fetch from "node-fetch";
import { useRouter } from "next/router";

const pageTitle = "Music";

export default function SpotifyPage() {
  const [session, loading, ...rest] = useSession();

  console.log({ session });

  return (
    <DefaultLayout title="Spotify">
      <div className={styles.container}>
        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
        {session && (
          <>
            Signed in as {session.user.name} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
      </div>
    </DefaultLayout>
  );
}

// export const getServerSideProps = withSession(async function ({ req, res }) {
//   // Get the user's session based on the request
//   const user = req.session.get("user");

//   if (!user) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { user },
//   };
// });