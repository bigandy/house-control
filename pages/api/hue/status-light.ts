import { statusLight } from "../utils/hue";

export default async function handler(_, res) {
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
