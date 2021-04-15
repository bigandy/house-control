import { Fragment, useState, useEffect, useMemo } from "react";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "./styles.module.scss";
import fetch from "node-fetch";

import { useDebouncedCallback } from "use-debounce";

import useInterval from "hooks/useInterval";

const pageTitle = "Music Room";

import { getFavorites } from "pages/api/utils/sonos";

// AHTODO: move into a consts file for sharing
const rooms = ["bedroom", "lounge", "kitchen", "kitchen-eating"];

import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import SearchSpotify from "components/SearchSpotify";

export default function MusicRoomPage({ favorites }) {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [roomVolumes, setRoomVolumes] = useState(null);
  const [roomsMuted, setRoomsMuted] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState("bedroom");

  const [currentFavorite, setCurrentFavorite] = useState(null);
  const [currentTrackPlaying, setCurrentTrackPlaying] = useState(null);

  const getCurrentTrack = async () => {
    try {
      const statuses = await fetch(
        `/api/sonos/status-room?room=${selectedRoom}`
      )
        .then((res) => res.json())
        .then(({ currentTrack }) => {
          setCurrentTrackPlaying(currentTrack);
        })
        .catch((e) => console.error(e));
    } catch (e) {
      console.error("error in useEffect", e);
    }
  };

  useEffect(() => {
    const room = localStorage.getItem("room");
    if (room) {
      setSelectedRoom(room);
    }
  }, []);

  useEffect(() => {
    const getAllStatuses = async () => {
      await fetch(`/api/sonos/status-all`)
        .then((res) => res.json())
        .then((json) => {
          const roomsObj: any = {};
          const soundObj = {};
          const mutedObj = {};

          json.statuses.forEach(({ room, state, volume, muted }) => {
            roomsObj[room] = state !== "paused" && state !== "stopped";
            soundObj[room] = volume;
            mutedObj[room] = muted;
          });

          setRoomsMuted(mutedObj);
          setRoomVolumes(soundObj);
          setMusicPlaying(roomsObj);
        })
        .catch((e) => console.error(e));
    };
    getAllStatuses();
  }, []);

  useEffect(() => {
    const getAllStatuses = async () => {
      try {
        const statuses = await fetch(`/api/sonos/status-all`)
          .then((res) => res.json())
          .then((json) => {
            const roomsObj: any = {};
            const soundObj = {};
            json.statuses.forEach(({ room, state, volume }) => {
              roomsObj[room] = state !== "paused" && state !== "stopped";
              soundObj[room] = volume;
            });
            setRoomVolumes(soundObj);
            setMusicPlaying(roomsObj);
          })
          .catch((e) => console.error(e));
      } catch (e) {
        console.error("error in useEffect", e);
      }
    };
    getAllStatuses();
  }, [selectedRoom]);

  useEffect(() => {
    if (musicPlaying[selectedRoom]) {
      // 1. Get currently playing track
      getCurrentTrack();
    }
  }, [selectedRoom, musicPlaying]);

  useInterval(async () => {
    if (musicPlaying[selectedRoom]) {
      // 2. Use an interval to check this regularly when playing.
      getCurrentTrack();

      // 3. Is it possible to do this only when the component is in the viewport?
    }
  }, 1000);

  const playFavorite = async () => {
    // update state fast.
    // setPlaying((prevState) => !prevState);
    console.log({ currentFavorite });
    await fetch(
      `/api/sonos/play-favorite?favorite=${JSON.stringify(
        currentFavorite
      )}&room=${selectedRoom}`
    )
      .then((res) => res.json())
      .then(({ status }) => {
        // if the status is different, need to update the state then.
        setMusicPlaying((prevState) => {
          return {
            ...(prevState as any),
            [selectedRoom]: status === "transitioning",
          };
        });
      })
      .catch((e) => console.error(e));
  };

  const toggleRoom = async () => {
    await toggleMusic();
  };

  const playFavoriteNext = async () => {
    setCurrentFavorite(null);
    setMusicPlaying((prevState) => {
      return {
        ...(prevState as any),
        [selectedRoom]: false,
      };
    });
    await playFavorite();

    setMusicPlaying((prevState) => {
      return {
        ...(prevState as any),
        [selectedRoom]: true,
      };
    });
  };

  const toggleMusic = async () => {
    await fetch(`/api/sonos/toggle-room/?room=${selectedRoom}`)
      .then((res) => res.json())
      .then(({ state }) => {
        setMusicPlaying((prevState) => {
          return {
            ...(prevState as any),
            [selectedRoom]: state === "transitioning",
          };
        });
      })
      .catch((e) => console.error(e));
  };

  const icon = useMemo(() => {
    const playIcon = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
    const pauseIcon =
      "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";

    if (musicPlaying[selectedRoom]) {
      return playIcon;
    }
    return pauseIcon;
  }, [musicPlaying, selectedRoom]);

  const handleRoomChange = (room) => {
    setSelectedRoom(room);
    localStorage.setItem("room", room);
  };

  const handleVolumeChange = (volume) => {
    setRoomVolumes((prevState) => {
      return {
        ...(prevState as any),
        [selectedRoom]: volume,
      };
    });
    updateVolume(volume, selectedRoom);
  };

  const updateVolume = useDebouncedCallback(async (volume, room) => {
    await fetch(`/api/sonos/volume/${selectedRoom}?volume=${volume}`)
      .then((res) => res.json())
      .catch((e) => console.error(e));
  }, 100);

  const handleRoomMute = async () => {
    setRoomsMuted((prevState) => {
      return {
        ...(prevState as any),
        [selectedRoom]: !prevState[selectedRoom],
      };
    });

    await fetch(`/api/sonos/mute/${selectedRoom}`)
      .then((res) => res.json())
      .catch((e) => console.error(e));
  };

  return (
    <DefaultLayout title="">
      <h1 style={{ marginLeft: "0.75rem", marginBottom: 0, lineHeight: 1 }}>
        Music
        <select
          value={selectedRoom}
          onChange={(e) => handleRoomChange(e.target.value)}
          className="inline-select"
        >
          {rooms.map((room) => {
            return (
              <option
                id={room}
                key={room}
                className={classnames({
                  active: room === selectedRoom,
                })}
              >
                {room}
              </option>
            );
          })}
        </select>
      </h1>
      <div className="play-wrapper">
        <button
          onClick={() => toggleRoom()}
          className={classnames({
            active: musicPlaying[selectedRoom],
          })}
        >
          <svg width="24px" height="24px" viewBox="0 0 36 36">
            <path d={icon} />
          </svg>
        </button>

        {roomsMuted && (
          <button onClick={handleRoomMute} className="mute-button">
            {roomsMuted[selectedRoom] ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </button>
        )}

        {roomVolumes && (
          <Fragment>
            <input
              type="range"
              min="0"
              max="40"
              value={roomVolumes[selectedRoom]}
              onChange={(e) => handleVolumeChange(e.target.value)}
              className={styles["input-range"]}
            />
            {roomVolumes[selectedRoom]}
            <button
              className={styles.volButton}
              onClick={() => handleVolumeChange(roomVolumes[selectedRoom] + 5)}
            >
              Up
            </button>
            <button
              className={styles.volButton}
              onClick={() => handleVolumeChange(roomVolumes[selectedRoom] - 5)}
            >
              Down
            </button>
          </Fragment>
        )}

        {favorites && (
          <select
            onChange={(e) => {
              setCurrentFavorite(favorites[e.target.value]);
            }}
            value={currentFavorite?.title}
            className="inline-select"
          >
            {Object.keys(favorites).map((favorite) => {
              return (
                <option
                  id={favorite}
                  key={favorite}
                  className={classnames("button-music", {
                    active:
                      currentFavorite?.title === favorites[favorite].title,
                  })}
                >
                  {favorites[favorite].title}
                </option>
              );
            })}
          </select>
        )}

        {currentFavorite && (
          <button onClick={playFavoriteNext} className="playnext-button">
            Play {currentFavorite?.title}
          </button>
        )}
      </div>

      <SearchSpotify room={selectedRoom} />

      {currentTrackPlaying && (
        <div style={{ marginLeft: "1rem" }}>
          <h2>Current Track Info</h2>
          <div>Title: {currentTrackPlaying.title}</div>
          <div>Album: {currentTrackPlaying.album}</div>
          <div>Artist: {currentTrackPlaying.artist}</div>
          <div>Uri: {currentTrackPlaying.uri}</div>
          <div>Position: {currentTrackPlaying.position}</div>
          {/* <div>
            <img
              src={currentTrackPlaying.albumArtURL}
              loading="lazy"
              alt=""
              height="100"
              width="100"
            />
          </div> */}
        </div>
      )}
    </DefaultLayout>
  );
}

export async function getStaticProps(context) {
  const { formattedFavorites: favorites } = await getFavorites("bedroom");
  return {
    props: { favorites }, // will be passed to the page component as props
  };
}
