import { useState, useEffect, Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import classnames from "classnames";

import { SpotifySearch } from "pages/api/spotify/search";
import playFavorite from "pages/api/sonos/play-favorite";

const defaultType = SpotifySearch.ALBUMS;

import styles from "styles/Home.module.scss";

const SearchSpotify = ({ room }) => {
  const [session, loading] = useSession();

  const [value, setValue] = useState("");
  const [results, setResults] = useState(null);
  const [type, setType] = useState(defaultType);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (value !== "") {
      const searchResultsJson = await fetch(
        `/api/spotify/search?searchText=${value}&type=${type}`
      ).then((res) => res.json());
      const searchResults = searchResultsJson.results;

      setResults(searchResults);
    }
  };

  const playResult = async (result) => {
    console.log("i want to play this next", result);

    await fetch(
      `/api/sonos/play-favorite?favorite=${JSON.stringify({
        id: `${type.replace("s", "")}:${result.id}`,
        type: "spotify",
      })}&room=${room}`
    )
      .then((res) => res.json())
      .catch((e) => console.error(e));
  };

  const handleSelect = (e) => {
    console.log(e.target.value);

    setType(e.target.value);
  };
  return (
    <div className={styles.container}>
      {!session && (
        <Fragment>
          Not signed in <br />
          <button onClick={() => signIn("spotify")}>Sign in</button>
        </Fragment>
      )}
      {!loading && session && (
        <Fragment>
          Signed in as {session.user.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
          <form onSubmit={handleSubmit}>
            <select onChange={handleSelect} value={type}>
              <option value={SpotifySearch.TRACKS}>Tracks</option>
              <option value={SpotifySearch.ALBUMS}>Albums</option>
            </select>

            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              className="search-box"
              placeholder={`Search for ${type}`}
            />

            <input type="submit" value="Submit Search" />
          </form>
          <ul className="results-grid">
            {results &&
              results?.map((result) => (
                <li key={result.id} onClick={() => playResult(result)}>
                  <div>{result.name}</div>
                  <div>{result.type}</div>
                  <div>{result.id}</div>
                  <img
                    src={result.images[1].url}
                    alt=""
                    height={result.images[1].height}
                    width={result.images[1].width}
                  />
                </li>
              ))}
          </ul>
        </Fragment>
      )}
    </div>
  );
};

export default SearchSpotify;
