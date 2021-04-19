import { pauseRoom } from "../utils/sonos";

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";
  const status = await pauseRoom(roomToPlay);

  res.status(200).json({
    name: "Sonos pause-room",
    status,
    roomToPlay,
  });
};
