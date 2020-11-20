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

const handleAll = async (method = "stop") => {
  console.log("method", method);

  const discovery = new AsyncDeviceDiscovery();

  await discovery
    .discover()
    .then((device, model) => {
      console.log("Found one sonos device %s getting all groups", device.host);
      return device.getAllGroups().then((groups) => {
        // console.log("Groups %s", JSON.stringify(groups, null, 2));
        // console.log(groups);
        groups.forEach((group) => {
          console.log(group);
          group.CoordinatorDevice().pause();
        });
        // return groups[0].CoordinatorDevice().play();
      });
    })
    .catch((e) => {
      console.warn(" Error in discovery %j", e);
    });

  //   DeviceDiscovery(async (device) => {
  //     console.log("found device at " + device.host);

  //     // device.setMuted(true).then((d) => console.log(`now muted`, { d }));

  //     // get all groups
  //     const sonos = new Sonos(device.host);
  //     await sonos.getAllGroups().then((groups) => {
  //       groups.forEach((group) => {
  //         // group.CoordinatorDevice().pausePlayback();
  //         console.log({ group });
  //       });
  //     });
  //   });

  return true;
};

module.exports = {
  playRoom,
  statusRoom,
  pauseRoom,
  toggleRoom,
  handleAll,
};
