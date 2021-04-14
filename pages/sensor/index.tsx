import { useState, useEffect, Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import classnames from "classnames";

import DefaultLayout from "layouts/default";

import SearchSpotify from "components/SearchSpotify";
import { useSensorValuesQuery } from "controllers/sensorValues/hooks";

import { compareAsc, format } from "date-fns";

import classes from "./styles.module.scss";

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

      {data?.sensorValues?.length > 0 && (
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Created</th>
              <th>Temp (&deg;C)</th>
              <th>Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.sensorValues
              .map((d) => {
                const date = new Date(d.createdAt);

                console.log(date);

                return (
                  <tr key={d.id}>
                    <td>
                      {format(date, "hh:mm")} - {format(date, "do-MMM-yyyy")}
                    </td>
                    <td>{d.temperature}</td>
                    <td>{d.humidity}</td>
                  </tr>
                );
              })
              .reverse()}
          </tbody>
        </table>
      )}
    </DefaultLayout>
  );
}
