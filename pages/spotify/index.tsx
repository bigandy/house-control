import { useSession, signIn } from "next-auth/react";

import DefaultLayout from "layouts/default";

import SearchSpotify from "components/SearchSpotify";

export default function SpotifyPage() {
  const [session] = useSession();

  return (
    <DefaultLayout title="Spotify">
      {session ? (
        <SearchSpotify room="bedroom" />
      ) : (
        <p style={{ paddingInline: "0.5rem" }}>
          Please <button onClick={signIn}>Sign In</button>
        </p>
      )}
    </DefaultLayout>
  );
}
