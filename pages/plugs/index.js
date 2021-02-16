import { useState, useEffect } from "react";
import Head from "next/head";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

import { sonosRooms } from "utils/sonos";
import fetch from "node-fetch";

const RoomSelector = ({ selected, handleChange }) => {
  return (
    <select onChange={handleChange} value={selected}>
      {["2", "3", "4", "office"].map((room, index) => {
        return (
          <option value={room} key={`select-${index}`}>
            {room}
          </option>
        );
      })}
    </select>
  );
};

export default function Home() {
  const [room, setRoom] = useState("4");
  const [status, setStatus] = useState(false);

  useEffect(async () => {
    const plugs = await await fetch(`/api/plug/statuses`)
      .then((res) => res.json())
      .then((json) => {
        setStatus(json.plugs.find((plug) => plug.name === room).status);
      })
      .catch((e) => console.error(e));
  }, [room]);

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  const togglePlug = async () => {
    console.log(room);

    await fetch(`/api/plug/plug-toggle/?room=${room}`)
      .then((res) => res.json())
      .then((json) => setStatus(json.statusOut))
      .catch((e) => console.error(e));
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Plug</title>
      </Head>
      <div className={styles.container}>
        <RoomSelector handleChange={handleRoomChange} selected={room} />

        <button onClick={togglePlug}>
          {room} - {status ? "Off" : "On"}
        </button>
      </div>
    </DefaultLayout>
  );
}
