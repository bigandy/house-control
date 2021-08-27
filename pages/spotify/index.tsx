import DefaultLayout from "layouts/default";

import SearchSpotify from "components/SearchSpotify";

export default function SpotifyPage() {
  return (
    <DefaultLayout title="Spotify">
      <SearchSpotify room="bedroom" />
    </DefaultLayout>
  );
}
