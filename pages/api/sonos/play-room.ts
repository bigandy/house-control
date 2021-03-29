import { Sonos } from "sonos";
import { playRoom } from "../utils/sonos";

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";

  const state = await playRoom(roomToPlay);

  res.status(200).json({
    name: "Sonos play-room",
    status,
    roomToPlay,
  });
};
