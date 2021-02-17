import { useState, useEffect } from "react";
import Head from "next/head";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

import { sonosRooms } from "utils/sonos";
import fetch from "node-fetch";

const plugs = ["2", "3", "4", "office"];

export default function Home() {
  const [room, setRoom] = useState("4");
  //   const [status, setStatus] = useState(plugs.map(() => false));

  // AHTODO Keep track of on/off status using the API.

  useEffect(async () => {
    const plugs = await await fetch(`/api/plug/statuses`)
      .then((res) => res.json())
      .then((json) => {
        console.log(status);
        // setStatus(json.plugs.findIndex((plug) => plug.name === room).status);
      })
      .catch((e) => console.error(e));
  }, [room]);

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  const togglePlug = async (plug) => {
    await fetch(`/api/plug/plug-toggle/?room=${plug}`)
      .then((res) => res.json())
      .then((json) => setStatus(json.statusOut))
      .catch((e) => console.error(e));
  };

  const offAllPlugs = async (plug) => {
    await fetch(`/api/plug/plug-all-off`).catch((e) => console.error(e));
  };

  const onAllPlugs = async (plug) => {
    await fetch(`/api/plug/plug-all-on`).catch((e) => console.error(e));
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Plug</title>
      </Head>

      <div className={styles.container}>
        <button onClick={() => offAllPlugs()}>Off All</button>
        <button onClick={() => onAllPlugs()}>On All</button>

        {plugs.map((plug) => {
          return <button onClick={() => togglePlug(plug)}>{plug}</button>;
        })}
      </div>
    </DefaultLayout>
  );
}
