import { getSession } from "adapters/sessions";

import SpotifyWebApi from "spotify-web-api-node";

import { playFavorite } from "../utils/sonos";

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    console.error("no session");

    res.status(400).json({
      name: "Spotify Search Error - Not valid session",
    });
  }
  const { searchText, type } = req.query;

  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(session.user.accessToken);

  //   const tracks = await spotifyApi
  //     // .getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE")
  //     .searchTracks(searchText)
  //     .then(
  //       function (data) {
  //         // console.log("Artist albums", data.body);

  //         return data.body.tracks.items;
  //       },
  //       function (err) {
  //         console.error(err);
  //       }
  //     );

  const searchType = type === "albums" ? "albums" : "tracks";

  const searchResults =
    searchType === "albums"
      ? await spotifyApi.searchAlbums(searchText).then((data) => {
          return data.body;
        })
      : await spotifyApi.searchTracks(searchText).then((data) => {
          return data.body;
        });

  const results =
    searchResults[searchType]?.items?.map(({ name, type, id }) => {
      return {
        name,
        type,
        id,
      };
    }) || [];

  // AHTODO want to do this on the search results page.

  // if (play === "true") {
  //   await playFavorite(
  //     {
  //       id: `${resultsRefined[0].type}:${resultsRefined[0].id}`,
  //       type: "spotify",
  //     },
  //     "bedroom"
  //   );
  // }

  res.status(200).json({
    name: "Spotify Search",
    searchText,
    results,
    type,
  });
};
