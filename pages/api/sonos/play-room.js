const { Sonos } = require("sonos");
const { playRoom } = require("../utils/sonos");

export default async (req, res) => {
	const { room } = req.query;

	const roomToPlay = room || "lounge";

	const status = await playRoom(roomToPlay);

	res.statusCode = 200;
	res.json({
		name: "Sonos play-room",
		status,
		roomToPlay,
	});
};
