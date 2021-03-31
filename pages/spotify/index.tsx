import { useState, useEffect, Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

import fetch from "node-fetch";
import { useRouter } from "next/router";

const pageTitle = "Music";

export default function SpotifyPage() {
  const [session, loading] = useSession();

  const [value, setValue] = useState("");
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const type = "albums";

    if (value !== "") {
      const searchResults = await fetch(
        `/api/spotify/search?searchText=${value}&type=${type}`
      ).then((res) => res.json());

      setResults(searchResults);
    }
  };

  console.log({ results });

  return (
    <DefaultLayout title="Spotify">
      <div className={styles.container}>
        {!session && (
          <Fragment>
            Not signed in <br />
            <button onClick={() => signIn("spotify")}>Sign in</button>
          </Fragment>
        )}
        {session && (
          <Fragment>
            Signed in as {session.user.name} <br />
            <button onClick={() => signOut()}>Sign out</button>
            <div>{session?.user?.accessToken}</div>
            <form onSubmit={handleSubmit}>
              <input type="text" value={value} onChange={handleInputChange} />

              <input type="submit" value="Submit Search" />
            </form>
          </Fragment>
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
