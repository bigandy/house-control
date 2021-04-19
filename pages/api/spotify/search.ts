import { getSession } from "adapters/sessions";

import SpotifyWebApi from "spotify-web-api-node";

import prisma from "utils/database/prisma";

export enum SpotifySearch {
  ALBUMS = "albums",
  TRACKS = "tracks",
  PLAYLISTS = "playlists",
}

const resolver = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    console.error("no session");

    res.status(400).json({
      name: "Spotify Search Error - Not valid session",
    });
  }
  const { searchText, type } = req.query;

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const getSearchResults = async (type, searchText) => {
    const searchResults = async (type: SpotifySearch, searchText: string) => {
      switch (type) {
        case SpotifySearch.ALBUMS:
          return await spotifyApi.searchAlbums(searchText).then((data) => {
            return data.body;
          });
        case SpotifySearch.TRACKS:
          return await spotifyApi.searchTracks(searchText).then((data) => {
            return data.body;
          });
        case SpotifySearch.PLAYLISTS:
          return await spotifyApi.searchPlaylists(searchText).then((data) => {
            return data.body;
          });
        default:
          console.log("no type selected");
          return;
      }
    };

    const search = await searchResults(type, searchText);

    console.log(search[type]);

    const results =
      search[type]?.items?.map(
        ({ name, type, id, album, images, uri, artists }) => {
          return {
            name,
            type,
            id,
            images: album?.images || images,
            uri,
            artists,
          };
        }
      ) || [];

    return results;
  };

  try {
    console.log("using stored accessToken");
    spotifyApi.setAccessToken(session.user.accessToken);
    const results = await getSearchResults(type, searchText);

    res.status(200).json({
      name: "Spotify Search",
      results,
    });
  } catch (error) {
    console.error("error in using stored token");
    await spotifyApi.clientCredentialsGrant().then(
      async function (data) {
        console.log("The access token expires in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);
        const accessToken = data.body["access_token"];
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(accessToken);

        // AHTODO SAVE TO DB SO DON't HAVE TO DO THIS EVERY TIME!

        await prisma.account.update({
          where: {
            id: 1, // AHTODO GET THIS PROPERLY!
          },
          data: { accessToken: accessToken },
        });
      },
      function (err) {
        console.log(
          "Something went wrong when retrieving an access token",
          err.message
        );
      }
    );
    const results = await getSearchResults(type, searchText);

    res.status(200).json({
      name: "Spotify Search",
      results,
    });
  }
};

export default resolver;
