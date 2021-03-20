const { DeviceDiscovery, Sonos, AsyncDeviceDiscovery } = require("sonos");

// find one device
// Useful for finding all the IP addresses of devices.
const deviceDiscovery = async () => {
  const DeviceDiscovery = new AsyncDeviceDiscovery();

  const devices = await DeviceDiscovery.discover();

  const sonos = new Sonos(devices.host);
  const groups = await sonos.getAllGroups();

  // Might have to run a few times to get all, because
  // there is Sonos1 and Sonos2 and thus different host.
  // Grrrrr!

  return groups.map((group) => ({ host: group.host, name: group.Name }));
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
  try {
    const ipAddress = getRoomIpAddress(roomToPlay);
    const device = new Sonos(ipAddress);

    await device.togglePlayback();
    const state = await device.getCurrentState();
    return state;
  } catch (error) {
    console.error("error in toggleRoom", error);
  }
};

const statusRoom = async (roomToPlay) => {
  const ipAddress = getRoomIpAddress(roomToPlay);
  const device = new Sonos(ipAddress);

  const volume = await device.getVolume();
  const state = await device.getCurrentState();

  return state;
};

const handleAll = async (method = "pause") => {
  const rooms = ["lounge", "bedroom", "kitchen", "kitchen-eating"];

  if (method === "pause" || method === "play") {
    await rooms.reduce(async (previousPromise, nextID) => {
      await previousPromise;

      if (method === "pause") {
        return pauseRoom(nextID);
      } else {
        return playRoom(nextID);
      }
    }, Promise.resolve());
  }

  const statuses = [];
  await rooms.reduce(async (previousPromise, nextID) => {
    await previousPromise;
    const status = await statusRoom(nextID);
    statuses.push({ status, room: nextID });
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
  deviceDiscovery,
};
