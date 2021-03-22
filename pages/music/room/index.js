import { useState, useEffect } from "react";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

import fetch from "node-fetch";

const pageTitle = "Music";

export default function MusicPage() {
  const [musicPlaying, setMusicPlaying] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState("bedroom");

  //   useEffect(async () => {
  //     await fetch(`/api/sonos/status-all`)
  //       .then((res) => res.json())
  //       .then((json) => {
  //         const roomsObj = {};
  //         json.statuses.forEach(
  //           (room) =>
  //             (roomsObj[room.room] =
  //               room.status !== "paused" && room.status !== "stopped")
  //         );
  //         setMusicPlaying(roomsObj);
  //       })
  //       .catch((e) => console.error(e));
  //   }, []);

  //   const toggleMusic = async (room) => {
  //     await fetch(`/api/sonos/toggle-room/?room=${room}`)
  //       .then((res) => res.json())
  //       .then((json) => {
  //         setMusicPlaying((prevState) => {
  //           return {
  //             ...prevState,
  //             [room]: json.status === "transitioning",
  //           };
  //         });
  //       })
  //       .catch((e) => console.error(e));
  //   };

  //   const turnOffAllSonos = async () => {
  //     await fetch(`/api/sonos/pause-all`)
  //       .then((res) => res.json())
  //       .then((json) => {
  //         const roomsObj = {};
  //         json.statuses.forEach(
  //           (room) =>
  //             (roomsObj[room.room] =
  //               room.status !== "paused" && room.status !== "stopped")
  //         );
  //         setMusicPlaying(roomsObj);
  //       })
  //       .catch((e) => console.error(e));
  //   };

  // AHTODO:
  //   1. How to persist state to localStorage so that when I refresh the page, the room is pre-selected
  //   2. How to list the favorites from Sonos? Could be Spotify Playlists or something too

  return (
    <DefaultLayout title="Music">
      <h2>Selected Room is : {selectedRoom}</h2>
      <div className={styles.container}>
        {["bedroom", "lounge", "kitchen", "kitchen-eating"].map((room) => {
          return (
            <label htmlFor={room} key={room}>
              <input
                id={room}
                type="checkbox"
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
      </div>
    </DefaultLayout>
  );
}
