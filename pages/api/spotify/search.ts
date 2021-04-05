import { getSession } from "adapters/sessions";
import { Resolver } from "node:dns";

import SpotifyWebApi from "spotify-web-api-node";

import { playFavorite } from "../utils/sonos";

// import prisma from "utils/database/prisma";

export enum SpotifySearch {
  ALBUMS = "albums",
  TRACKS = "tracks",
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

  var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  // Retrieve an access token

  // //   const tracks = await spotifyApi
  // //     // .getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE")
  // //     .searchTracks(searchText)
  // //     .then(
  // //       function (data) {
  // //         // console.log("Artist albums", data.body);

  // //         return data.body.tracks.items;
  // //       },
  // //       function (err) {
  // //         console.error(err);
  // //       }
  // //     );

  const getSearchResults = async (type, searchText) => {
    const searchType: SpotifySearch =
      type === SpotifySearch.ALBUMS
        ? SpotifySearch.ALBUMS
        : SpotifySearch.TRACKS;

    const searchResults =
      searchType === SpotifySearch.ALBUMS
        ? await spotifyApi.searchAlbums(searchText).then((data) => {
            return data.body;
          })
        : await spotifyApi.searchTracks(searchText).then((data) => {
            return data.body;
          });

    const results =
      searchResults[searchType]?.items?.map(
        ({ name, type, id, album, images }) => {
          return {
            name,
            type,
            id,
            images: album?.images || images,
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
      // searchText,
      results,
      // type,
    });
  } catch (error) {
    await spotifyApi.clientCredentialsGrant().then(
      async function (data) {
        console.log("The access token expires in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);
        const accessToken = data.body["access_token"];
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(accessToken);

        // AHTODO SAVE TO DB SO DON't HAVE TO DO THIS EVERY TIME!

        // await prisma.account.update({
        //   where: {
        //     id: session.user.userId,
        //   },
        //   data: { accessToken: accessToken },
        // });
      },
      function (err) {
        console.log(
          "Something went wrong when retrieving an access token",
          err.message
        );
      }
    );
    const results = await getSearchResults(type, searchText);
  }
};

export default resolver;
