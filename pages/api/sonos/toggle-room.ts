import { toggleRoom } from "../utils/sonos";

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";

  const state = await toggleRoom(roomToPlay);

  res.status(200).json({
    name: "Sonos toggle-room",
    state,
    roomToPlay,
  });
};
