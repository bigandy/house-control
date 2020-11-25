const { Sonos } = require("sonos");
const { playRoom } = require("../utils/sonos");

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";

  const status = await playRoom(roomToPlay);

  res.status(200).json({
    name: "Sonos play-room",
    status,
    roomToPlay,
  });
};
