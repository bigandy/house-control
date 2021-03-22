const {
  DeviceDiscovery,
  Sonos,
  AsyncDeviceDiscovery,
  SpotifyRegion: Regions,
} = require("sonos");

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
  const currentTrack = await device.currentTrack();

  return { volume, state, currentTrack };
};

const getFavorites = async (roomToPlay) => {
  const ipAddress = getRoomIpAddress(roomToPlay);
  const device = new Sonos(ipAddress);

  const sonosFavorites = await device
    .getFavorites()
    .then((favorites) => {
      return favorites;
    })
    .catch((err) => {
      console.log("Error occurred %j", err);
    });

  // // This assumes you have the Spotify music service connected to
  // // your Sonos system.

  // const favorites = {
  //   "6music": {
  //     type: "tunein",
  //     title: "BBC Radio 6 Music",
  //     id: "s44491",
  //   },
  //   fip: {
  //     type: "mp3",
  //     title: "fip",
  //     url: "http://icecast.radiofrance.fr/fip-midfi.mp3",
  //   },
  //   earthtones: {
  //     type: "spotify",
  //     title: "earthtones",
  //     id: "album:2mn50aOZXBLAf66gZVuFAo",
  //   },
  //   "70s-Disco": {
  //     type: "spotify",
  //     title: "70s disco",
  //     id: "playlist:3AtFItPTNrmxqREWOWZV6e",
  //   },
  //   somafm: {
  //     type: "mp3",
  //     title: "somafm",
  //     url:
  //       "x-rincon-mp3radio://http://www.abc.net.au/res/streaming/audio/aac/dig_music.pls",
  //   },
  // };

  // // get random property from an object.
  const favoriteItems = sonosFavorites.items.filter((item) => item.uri);

  const formattedFavorites = {};
  favoriteItems.forEach((item) => {
    const returnObj = {
      title: item.title,
    };

    const type = item.uri.replace(/(^:)|(:$)/g, "");
    const split = type.replace(/(^:)|(:$)/g, "").split(":");

    if (split[0] === "x-sonosapi-stream") {
      returnObj.type = "tunein";
      returnObj.id = split[1].split("?")[0];
    } else if (split[0] === "x-rincon-mp3radio") {
      returnObj.type = "mp3";
      returnObj.url = type;
    } else if (split[0] === "x-rincon-cpcontainer") {
      if (!split[1].includes("spotify")) {
        return;
      }
      const beforeQuestion = split[1]
        .split("?")[0]
        .replace(/%3a/g, ":")
        // .replace("%3a", ":")
        // .replace("%3a", ":")
        .split(":");

      // either spotify-album or spotify-playlist
      returnObj.id = `${beforeQuestion[1]}:${beforeQuestion[2]}`;
      returnObj.type = "spotify";
    }

    formattedFavorites[item.title] = returnObj;
  });

  return { formattedFavorites, sonosFavorites };
};

const playFavorite = async (favorite, roomToPlay = "") => {
  const ipAddress = getRoomIpAddress(roomToPlay);
  const device = new Sonos(ipAddress);

  device.setSpotifyRegion(Regions.EU);

  const statusBefore = await device.getCurrentState(roomToPlay);

  let currentTrack = null;

  if (statusBefore !== "playing") {
    // // const favorite = formattedFavorites[selectedFavorite]; // TEMP

    if (favorite.type === "tunein") {
      currentTrack = await device
        .playTuneinRadio(favorite.id, favorite.title)
        .then((success) => {
          // console.log("Yeay tunein playing", favorite.title);
          return device.currentTrack();
        })
        .catch((err) => {
          console.log("Error occurred", err);
        });
    } else if (favorite.type === "mp3") {
      currentTrack = await device
        .play(favorite.url)
        .then((success) => {
          // console.log("Yeay mp3 playing", favorite.title);
          return device.currentTrack();
        })
        .catch((err) => {
          console.log("Error occurred", err);
        });
    } else if (favorite.type === "spotify") {
      spotifyUri = `spotify:${favorite.id}`;

      currentTrack = await device
        .play(spotifyUri)
        .then((success) => {
          // console.log("Yeay, spotify album playing", favorite.title);
          return device.currentTrack();
        })
        .catch((err) => {
          console.log("Error occurred: ", err);
        });
    } else if (favorite.type === "spotify-playlist") {
      spotifyUri = `spotify:playlist:${favorite.id}`;
      currentTrack = await device
        .play(spotifyUri)
        .then((success) => {
          // console.log("Yeay, spotify Playlist playing", favorite.title);
          return device.currentTrack();
        })
        .catch((err) => {
          console.log("Error occurred: ", err);
        });
    } else {
      console.log("you didn't choose an available option");
    }
  } else {
    console.log("do we want to pause here?");
    await device.pause();
  }

  const status = await device.getCurrentState(roomToPlay);

  return {
    currentTrack,
    favorite,
    status,
    statusBefore,
  };
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
    const { state, volume, currentTrack } = await statusRoom(nextID);
    statuses.push({ state, volume, currentTrack, room: nextID });
    return state;
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
  getFavorites,
  playFavorite,
};
