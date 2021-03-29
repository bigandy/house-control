import { Sonos } from "sonos";
import { deviceDiscovery } from "../utils/sonos";

export default async (req, res) => {
  const { room } = req.query;

  const state = await deviceDiscovery();

  res.status(200).json({
    name: "Sonos status-room",
    state,
  });
};
