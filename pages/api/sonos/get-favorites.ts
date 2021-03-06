import { Sonos } from "sonos";
import { getFavorites } from "../utils/sonos";

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "lounge";

  const { formattedFavorites, sonosFavorites } = await getFavorites("bedroom");

  res.status(200).json({
    name: "Sonos get-favorites",
    formattedFavorites,
    sonosFavorites,
  });
};
