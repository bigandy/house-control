import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";
import fetch from "node-fetch";

const pageTitle = "Music";

const { getFavorites } = require("pages/api/utils/sonos");

export default function MusicRoomPage({ favorites }) {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState("bedroom");

  const [currentFavorite, setCurrentFavorite] = useState(null);

  useEffect(async () => {
    try {
      const statuses = await fetch(`/api/sonos/status-all`)
        .then((res) => res.json())
        .then(({ statuses }) => console.log({ statuses }));
    } catch (error) {
      console.error("error in useEffect", error);
    }
  }, [selectedRoom]);

  const playFavorite = async () => {
    // update state fast.
    setPlaying((prevState) => !prevState);
    await fetch(
      `/api/sonos/play-favorite?favorite=${JSON.stringify(
        currentFavorite
      )}&room=${selectedRoom}`
    )
      .then((res) => res.json())
      .then(({ status }) => {
        // if the status is different, need to update the state then.
        setPlaying(status === "transitioning");
      })
      .catch((e) => console.error(e));
  };

  // AHTODO:
  //   1. How to persist state to localStorage so that when I refresh the page, the room is pre-selected
  //   2. How to list the favorites from Sonos? Could be Spotify Playlists or something too

  const icon = useMemo(() => {
    const playIcon = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
    const pauseIcon =
      "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";

    if (playing) {
      return playIcon;
    }
    return pauseIcon;
  }, [playing]);

  return (
    <DefaultLayout title="Music">
      <h2>Selected Room is : {selectedRoom}</h2>
      <div className={styles.container}>
        {["bedroom", "lounge", "kitchen", "kitchen-eating"].map((room) => {
          return (
            <label htmlFor={room} key={room}>
              <input
                id={room}
                type="radio"
                checked={room === selectedRoom}
                onChange={() => setSelectedRoom(room)}
                className={classnames("button-music", {
                  active: room === selectedRoom,
                })}
              />
              {room}
            </label>
          );
        })}

        {favorites &&
          Object.keys(favorites).map((favorite) => {
            return (
              <button
                onClick={() => setCurrentFavorite(favorites[favorite])}
                key={favorite}
                className={classnames("button-music", {
                  active: currentFavorite?.title === favorites[favorite].title,
                })}
              >
                {favorites[favorite].title}
              </button>
            );
          })}
      </div>

      <div className="play-wrapper">
        <h2>
          Is there a favorite?:{" "}
          {currentFavorite && (
            <button onClick={() => playFavorite()}>
              <svg width="100px" height="100px" viewBox="0 0 36 36">
                <path d={icon} />
              </svg>
            </button>
          )}
        </h2>
      </div>
    </DefaultLayout>
  );
}

export async function getStaticProps(context) {
  const { formattedFavorites: favorites } = await getFavorites("bedroom");
  return {
    props: { favorites }, // will be passed to the page component as props
  };
}
