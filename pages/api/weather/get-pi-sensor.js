import fetch from "node-fetch";

import getSensorValues from "../utils/getSensorValues";

export default async function handler(req, res) {
  try {
    const result = await getSensorValues();
    // console.log({ result });

    res.status(200).json({ message: "Get Pi Sensor Values", result });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: "error in getting sensor values",
    });
  }
}
