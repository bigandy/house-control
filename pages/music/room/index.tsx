import { Fragment, useState, useEffect, useMemo } from "react";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";
import fetch from "node-fetch";

import { useDebouncedCallback } from "use-debounce";

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

  const playFavorite = async () => {
    // update state fast.
    // setPlaying((prevState) => !prevState);
    await fetch(
      `/api/sonos/play-favorite?favorite=${JSON.stringify(
        currentFavorite
      )}&room=${selectedRoom}`
    )
      .then((res) => res.json())
      .then(({ status }) => {
        // if the status is different, need to update the state then.
        // setPlaying(status === "transitioning");
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

  // AHTODO:
  //   1. How to persist state to localStorage so that when I refresh the page, the room is pre-selected
  //   2. How to list the favorites from Sonos? Could be Spotify Playlists or something too

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

  const handleVolumeChange = (e) => {
    const volume = e.target.value;
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
    <DefaultLayout title="Music Room">
      <div className="play-wrapper">
        <button
          onClick={() => toggleRoom()}
          className={classnames({
            active: musicPlaying[selectedRoom],
          })}
        >
          <svg width="100px" height="100px" viewBox="0 0 36 36">
            <path d={icon} />
          </svg>
        </button>

        {currentFavorite && (
          <button onClick={playFavoriteNext} className="playnext-button">
            Play {currentFavorite?.title}
          </button>
        )}

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
              onChange={(e) => handleVolumeChange(e)}
              className="input-range"
            />
            {roomVolumes[selectedRoom]}
          </Fragment>
        )}
      </div>

      <h2>Selected Room is : {selectedRoom}</h2>
      <div className={styles.container}>
        {rooms.map((room) => {
          return (
            <label
              htmlFor={room}
              key={room}
              className={classnames({
                active: room === selectedRoom,
              })}
            >
              <input
                id={room}
                type="radio"
                checked={room === selectedRoom}
                onChange={() => handleRoomChange(room)}
              />
              {room}
            </label>
          );
        })}

        {favorites && (
          <select
            onChange={(e) => {
              setCurrentFavorite(favorites[e.target.value]);
            }}
            value={currentFavorite?.title}
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
      </div>
      <SearchSpotify room={selectedRoom} />
    </DefaultLayout>
  );
}

export async function getStaticProps(context) {
  const { formattedFavorites: favorites } = await getFavorites("bedroom");
  return {
    props: { favorites }, // will be passed to the page component as props
  };
}
