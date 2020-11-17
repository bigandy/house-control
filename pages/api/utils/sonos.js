const { DeviceDiscovery, Sonos } = require("sonos");

// find one device
// Useful for finding all the IP addresses of devices.
const deviceDiscovery = () => {
	DeviceDiscovery((device) => {
		console.log("found device at " + device.host);

		// get all groups
		const sonos = new Sonos(device.host);
		sonos.getAllGroups().then((groups) => {
			groups.forEach((group) => {
				console.log({ group });
			});
		});
	});
};

const getRoomIpAddress = (room) => {
	let ipAddress = "";
	switch (room) {
		case "kitchen":
			ipAddress = process.env.SONOS_KITCHEN_IP;
			break;
		case "kitchen-eating":
			ipAddress = process.env.SONOS_KITCHEN_EATING_IP;
			break;
		case "bedroom":
			ipAddress = process.env.SONOS_BEDROOM_IP;
			break;
		default:
		case "lounge":
			ipAddress = process.env.SONOS_LOUNGE_IP;
			break;
	}
	return ipAddress;
};

module.exports = {
	getRoomIpAddress,
};
