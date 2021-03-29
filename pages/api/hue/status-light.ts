import { v3 } from "node-hue-api";
const LightState = v3.lightStates.LightState;

import { statusLight } from "../utils/hue";

export default async function handler(req, res) {
  try {
    const { state } = await statusLight();

    res.status(200).json({
      name: "Hue status-room",
      state,
    });
  } catch (e) {
    res.status(400).json({
      name: "Hue status-room-error",
      e,
    });
  }
}
