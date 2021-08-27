import { useState, useEffect } from "react";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

import fetch from "node-fetch";

export default function MusicPage() {
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    const getAllStatuses = async () => {
      await fetch(`/api/sonos/status-all`)
        .then((res) => res.json())
        .then(({ statuses }) => {
          const roomsObj: any = {};
          statuses.forEach(
            ({ room, state }) =>
              (roomsObj[room] = state !== "paused" && state !== "stopped")
          );
          setMusicPlaying(roomsObj);
        })
        .catch((e) => console.error(e));
    };
    getAllStatuses();
  }, []);

  const toggleMusic = async (room) => {
    await fetch(`/api/sonos/toggle-room/?room=${room}`)
      .then((res) => res.json())
      .then((json) => {
        setMusicPlaying((prevState) => {
          return {
            ...(prevState as any),
            [room]: json.state === "transitioning",
          };
        });
      })
      .catch((e) => console.error(e));
  };

  const turnOffAllSonos = async () => {
    await fetch(`/api/sonos/pause-all`)
      .then((res) => res.json())
      .then(({ statuses }) => {
        const roomsObj: any = {};
        statuses.forEach(
          ({ room, state }) =>
            (roomsObj[room] = state !== "paused" && state !== "stopped")
        );
        setMusicPlaying(roomsObj);
      })
      .catch((e) => console.error(e));
  };

  return (
    <DefaultLayout title="Music">
      <div className={styles.container}>
        <button onClick={() => turnOffAllSonos()}>Off All</button>

        {["bedroom", "lounge", "kitchen", "kitchen-eating"].map((room) => {
          return (
            <button
              key={room}
              onClick={() => toggleMusic(room)}
              className={classnames("button-music", {
                active: musicPlaying[room],
              })}
            >
              Turn {room} {musicPlaying[room] ? "off" : "on"}
            </button>
          );
        })}
      </div>
    </DefaultLayout>
  );
}
