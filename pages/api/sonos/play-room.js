const { Sonos } = require("sonos");
const { getRoomIpAddress } = require("../utils/sonos");

export default async (req, res) => {
	const { room } = req.query;

	const roomToPlay = room || "lounge";
	const ipAddress = getRoomIpAddress(roomToPlay);
	const device = new Sonos(ipAddress);

	await device.play();
	const getCurrentState = await device.getCurrentState();

	res.statusCode = 200;
	res.json({
		name: "Sonos play-room",
		status: getCurrentState,
		roomToPlay,
	});
};
