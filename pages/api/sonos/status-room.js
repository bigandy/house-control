const { Sonos } = require("sonos");
const { statusRoom } = require("../utils/sonos");

export default async (req, res) => {
	const { room } = req.query;

	const roomToPlay = room || "lounge";

	const state = await statusRoom(roomToPlay);

	res.statusCode = 200;
	res.json({
		name: "Sonos status-room",
		status,
		roomToPlay,
	});
};
