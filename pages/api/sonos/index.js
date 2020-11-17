const { Sonos, DeviceDiscovery } = require("sonos");

const device = new Sonos(process.env.SONOS_LOUNGE_IP);

export default async (req, res) => {
	const loungeVolume = await device.getVolume();
	await device.togglePlayback();

	res.statusCode = 200;
	res.json({ name: "Sonos index", loungeVolume, getCurrentState });
};
