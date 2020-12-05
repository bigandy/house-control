import { useState, useEffect, Fragment } from "react";

import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
  Legend,
} from "recharts";
import Head from "next/head";
import styles from "./styles.module.scss";

import DefaultLayout from "layouts/default";
import fetch from "node-fetch";

import { query } from "pages/api/utils/hasura";

export default function TemperatureChart({ sensor_data: data }) {
  return (
    <DefaultLayout>
      <Head>
        <title>Temperature Chart Inside</title>
      </Head>

      <div className={styles.container}>
        <h1>Inside Temperature Chart</h1>

        {data && (
          <LineChart width={500} height={300} data={data}>
            <XAxis dataKey="created_at" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
          </LineChart>
        )}
      </div>
    </DefaultLayout>
  );
}

export async function getStaticProps(context) {
  const { sensor_data } = await query({
    query: `
      query MyQuery($limit: Int) {
        sensor_data(limit: $limit, order_by: {created_at: desc}) {
          humidity
          temperature
          created_at
        }
      }

      `,
    variables: {
      limit: 1000,
    },
  });
  return {
    props: {
      sensor_data,
    }, // will be passed to the page component as props
  };
}
