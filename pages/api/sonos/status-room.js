const { Sonos } = require("sonos");
const { statusRoom } = require("../utils/sonos");

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";

  const state = await statusRoom(roomToPlay);

  res.status(200).json({
    name: "Sonos status-room",
    status,
    roomToPlay,
  });
};
