const { Sonos } = require("sonos");
const { toggleRoom } = require("../utils/sonos");

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";
  const status = await toggleRoom(roomToPlay);

  res.status(200).json({
    name: "Sonos toggle-room",
    status,
    roomToPlay,
  });
};
