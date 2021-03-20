import { useState, useEffect } from "react";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import styles from "styles/Home.module.scss";

import fetch from "node-fetch";

const pageTitle = "Music";

const { getAllLights } = require("pages/api/utils/hue");

export default function LightsPage({ initialLightsState }) {
  const [lights, setLights] = useState(initialLightsState);

  // useEffect(async () => {
  //   await fetch(`/api/hue/getall-lights`)
  //     .then((res) => res.json())
  //     .then(({ lights }) => {
  //       setLights(lights);
  //     })
  //     .catch((e) => console.error(e));
  // }, []);

  const toggleLight = async (light) => {
    await fetch(`/api/hue/toggle-light/?lightId=${light.id}`)
      .then((res) => res.json())
      .then(({ result }) => {
        setLights((prevState) => {
          let newState = [...prevState];
          const updatedLightIndex = prevState.findIndex(
            ({ id }) => id === light.id
          );

          newState[updatedLightIndex].state.on = result;

          return newState;
        });
      })
      .catch((e) => console.error(e));
  };

  const turnOffAllHue = async () => {
    await fetch(`/api/hue/off-all`)
      .then((res) => res.json())
      .catch((e) => console.error(e));
  };

  return (
    <DefaultLayout title="Lights">
      <div className={styles.container}>
        <button onClick={turnOffAllHue}>Off All</button>

        {lights?.map((light) => {
          return (
            <button
              key={light.id}
              onClick={() => toggleLight(light)}
              className={classnames("button-light", {
                active: light.state.on,
              })}
            >
              {light.name}
            </button>
          );
        })}
      </div>
    </DefaultLayout>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const initialLightsState = await getAllLights();
  // .then((res) => res.json())
  // .then(({ lights }) => {
  //   return lights;
  // });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      initialLightsState,
    },
  };
}
