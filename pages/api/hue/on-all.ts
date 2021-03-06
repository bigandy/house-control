import { Sonos } from "sonos";
import { handleAll } from "../utils/hue";

export default async (req, res) => {
  try {
    const statuses = await handleAll("play");

    res.status(200).json({
      name: "Hue All-Lights-On",
      statuses,
    });
  } catch (e) {
    res.status(400).json({
      name: "Hue All-Lights-On Error",
      error: e,
    });
  }
};
