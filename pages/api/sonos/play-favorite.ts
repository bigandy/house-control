import { getFavorites, playFavoriteWithStatuses } from "../utils/sonos";

export default async (req, res) => {
  const { room } = req.query;

  const roomToPlay = room || "bedroom";

  const favorite = JSON.parse(req.query.favorite);

  if (!favorite) {
    return res.status(400).json({ error: "no favorite selected" });
  }

  const { currentTrack, status, statusBefore } = await playFavoriteWithStatuses(
    favorite,
    roomToPlay
  );

  res.status(200).json({
    name: "Sonos play-favorite",
    roomToPlay,

    favorite,
    currentTrack,

    status,
    statusBefore,
  });
};
