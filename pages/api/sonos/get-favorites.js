const { Sonos } = require("sonos");
const { getFavorites } = require("../utils/sonos");

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";

  const favorites = await getFavorites("bedroom");

  res.status(200).json({
    name: "Sonos get-favorites",
    favorites,
    roomToPlay,
  });
};
