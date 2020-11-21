const { DeviceDiscovery, Sonos, AsyncDeviceDiscovery } = require("sonos");

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

				return groups[0].CoordinatorDevice().setPlayMode("paused");
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

const playRoom = async (roomToPlay) => {
	const ipAddress = getRoomIpAddress(roomToPlay);
	const device = new Sonos(ipAddress);

	await device.play();
	const state = await device.getCurrentState();
	return state;
};

const pauseRoom = async (roomToPlay) => {
	const ipAddress = getRoomIpAddress(roomToPlay);
	const device = new Sonos(ipAddress);

	await device.pause();
	const state = await device.getCurrentState();
	return state;
};

const toggleRoom = async (roomToPlay) => {
	const ipAddress = getRoomIpAddress(roomToPlay);
	const device = new Sonos(ipAddress);

	await device.togglePlayback();
	const state = await device.getCurrentState();
	return state;
};

const statusRoom = async (roomToPlay) => {
	const ipAddress = getRoomIpAddress(roomToPlay);
	const device = new Sonos(ipAddress);

	const volume = await device.getVolume();
	const state = await device.getCurrentState();

	return state;
};

const handleAll = async (method = "pause") => {
	console.log("method", method);

	const rooms = ["lounge", "bedroom", "kitchen", "kitchen-eating"];

	await rooms.reduce(async (previousPromise, nextID) => {
		await previousPromise;

		if (method === "pause") {
			return pauseRoom(nextID);
		} else {
			return playRoom(nextID);
		}
	}, Promise.resolve());
	const statuses = [];
	await rooms.reduce(async (previousPromise, nextID) => {
		await previousPromise;
		const status = await statusRoom(nextID);
		statuses.push(status);
		return status;
	}, Promise.resolve());

	return statuses;
};

module.exports = {
	playRoom,
	statusRoom,
	pauseRoom,
	toggleRoom,
	handleAll,
};
