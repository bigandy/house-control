import { useState, Fragment, useMemo } from "react";
import { useSession } from "next-auth/client";

import { SpotifySearch } from "pages/api/spotify/search";

const defaultType = SpotifySearch.PLAYLISTS;

import styles from "./styles.module.scss";

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

  const playResult = async (result: any) => {
    console.log("i want to play this next", result);

    await fetch(
      `/api/sonos/play-favorite?favorite=${JSON.stringify({
        id: `${result.uri}`,
        type: "spotify",
      })}&room=${room}`
    )
      .then((res) => res.json())
      .catch((e) => console.error(e));
  };

  const handleSelect = (e) => {
    setType(e.target.value);
  };

  const resultsGrid = useMemo(() => {
    return (
      <ul className="results-grid">
        {results &&
          results?.map((result) => {
            return (
              <li key={result.id}>
                <img
                  src={
                    result?.images[type === SpotifySearch.PLAYLISTS ? 0 : 1]
                      ?.url
                  }
                  alt=""
                  height={50}
                  width={50}
                />

                <div>{result.name}</div>
                <div>
                  {result.artists?.map((artist) => {
                    return <div>{artist.name}</div>;
                  }) ?? "-"}
                </div>
                <button onClick={() => playResult(result)}>Play Now</button>
              </li>
            );
          })}
      </ul>
    );
  }, [results]);

  return (
    <div className="">
      {!loading && session && (
        <Fragment>
          <h2 style={{ margin: 0, marginLeft: "0.75rem" }}>Search Spotify</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <select onChange={handleSelect} value={type}>
              <option value={SpotifySearch.TRACKS}>Tracks</option>
              <option value={SpotifySearch.ALBUMS}>Albums</option>
              <option value={SpotifySearch.PLAYLISTS}>Playlists</option>
            </select>

            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              className="search-box"
              placeholder={`Search for ${type}`}
            />

            <input
              type="submit"
              value="Submit Search"
              className={styles.submit}
            />
          </form>
          {resultsGrid}
        </Fragment>
      )}
    </div>
  );
};

export default SearchSpotify;
