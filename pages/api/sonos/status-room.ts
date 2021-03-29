const { Sonos } = require("sonos");
const { statusRoom } = require("../utils/sonos");

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";

  const { state, volume, currentTrack } = await statusRoom(roomToPlay);

  res.status(200).json({
    name: "Sonos status-room",
    state,
    volume,
    roomToPlay,
    currentTrack,
  });
};