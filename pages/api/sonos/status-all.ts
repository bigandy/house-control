import { handleAll } from "../utils/sonos";

export default async (req, res) => {
  try {
    const statuses = await handleAll("status");

    res.status(200).json({
      name: "Sonos All-Status",
      statuses,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      name: "Sonos All-Status Error",
      error: e,
    });
  }
};
