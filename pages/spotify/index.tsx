import { useState, useEffect, Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import SearchSpotify from "components/SearchSpotify";

export default function SpotifyPage() {
  return (
    <DefaultLayout title="Spotify">
      <SearchSpotify room="bedroom" />
    </DefaultLayout>
  );
}
