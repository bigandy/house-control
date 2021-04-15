const { TOMORROW_API_KEY } = process.env;

import fetch from "node-fetch";

import { createUrl } from "../utils/urls";

export default async function handler(req, res) {
  try {
    const lat = 51.600121;
    const lon = -1.12481;
    const apikey = TOMORROW_API_KEY;

    const url = createUrl({
      url: "https://api.tomorrow.io/v4/timelines",
      query: {
        apikey,
        location: `${lat},${lon}`,
        units: "metric",
        fields: "temperature,humidity",
        timesteps: "current",
      },
    });

    const result = await fetch(url)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ data }) => {
        return data.timelines[0].intervals[0].values;
      })
      .catch((e) => console.error(e));

    res.status(200).json({ message: "Get Weather", result });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Get Weather Error", error: e });
  }
}
