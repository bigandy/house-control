const { CLIMACELL_API_KEY } = process.env;

import { URL } from "url";
import fetch from "node-fetch";

/**
 * Creates a full URL from a base URL and query params.
 * @param url
 * @param query
 * @returns {string}
 */
const createUrl = ({ url, query = {} }) => {
  const urlBuilder = new URL(url);

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((val) => urlBuilder.searchParams.append(key, val));
      return;
    }

    urlBuilder.searchParams.append(key, value);
  });

  return urlBuilder.toString();
};

export default async function handler(req, res) {
  const lat = 51.600121;
  const lon = -1.12481;
  const apikey = CLIMACELL_API_KEY;

  const url = createUrl({
    url: "https://api.climacell.co/v3/weather/realtime",
    query: {
      apikey,
      lat,
      lon,
      unit_system: "si",
      fields: "precipitation,temp,feels_like,weather_code",
    },
  });

  const result = await fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => {
      return res;
    });

  console.log({ result });

  res.status(200).json({ message: "WIP", result });
}
