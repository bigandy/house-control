import { useState, useEffect, Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import SearchSpotify from "components/SearchSpotify";
import { useSensorValuesQuery } from "controllers/sensorValues/hooks";

export default function SensorPage() {
  const { data } = useSensorValuesQuery();

  console.log({ data });
  return (
    <DefaultLayout title="Sensor">
      <h2>TODO:</h2>
      <ul>
        <li>
          A graph showing the results of the temp (internal and external) over
          time
        </li>
        <li>
          A graph showing the results of the humidiy (internal and external)
          over time
        </li>
      </ul>

      {data?.sensorValues?.length > 0 &&
        data.sensorValues.map((d) => {
          return (
            <li key={d.id}>
              {d.temperature}&deg;C - {d.humidity}%
            </li>
          );
        })}
    </DefaultLayout>
  );
}
