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

  return state;
};

const getFavorites = async (roomToPlay) => {
  const ipAddress = getRoomIpAddress(roomToPlay);
  const device = new Sonos(ipAddress);

  const favorites = await device
    .getFavorites()
    .then((favorites) => {
      console.log("Got current favorites %j", favorites);
      const tripleJ =
        "x-rincon-mp3radio://http://www.abc.net.au/res/streaming/audio/mp3/triplej.pls";

      return favorites;
    })
    .catch((err) => {
      console.log("Error occurred %j", err);
    });

  device.setSpotifyRegion(Regions.EU);
  // This example demonstrates playing various spotify uri types.
  // The Spotify uris can be obtained by using the Spotify
  // REST apis:
  //     https://developer.spotify.com/web-api/console/
  //
  // Or by using a scoped internet search and scraping the results:
  //    e.g. "A night at the opera site:spotify.com"
  //
  // And right from spotify, click the three dots => share => Copy spotify uri
  //
  // Spotify uri examples:
  //     Bohemian Rhapsody track - spotify:track:1AhDOtG9vPSOmsWgNW0BEY
  //     A night at the opera album - spotify:album:1TSZDcvlPtAnekTaItI3qO
  //     Top tracks by Queen - spotify:artistTopTracks:1dfeR4HaWDbWqFHLkxsg1d
  //     Top Tracks by Guus Meeuwis spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv
  //     Queen playlist (public user) - spotify:user:lorrainehelen:playlist:2ytnaITywUiPoS9JDYig5I
  //     Summer rewind by Spotify - spotify:user:spotify:playlist:37i9dQZF1DWSBi5svWQ9Nk
  //
  // This assumes you have the Spotify music service connected to
  // your Sonos system.

  // var spotifyUri = 'spotify:artistTopTracks:72qVrKXRp9GeFQOesj0Pmv'
  // var spotifyUri = "spotify:track:6sYJuVcEu4gFHmeTLdHzRz";

  // // spotifyUri = "spotify:playlist:3AtFItPTNrmxqREWOWZV6e";
  // spotifyUri = "spotify:album:2mn50aOZXBLAf66gZVuFAo";

  // await device
  //   .play(spotifyUri)
  //   .then((success) => {
  //     console.log("Yeay");
  //     return sonos.currentTrack();
  //   })
  //   .then((track) => {
  //     console.log(JSON.stringify(track, null, 2));
  //   })
  //   .catch((err) => {
  //     console.log("Error occurred %j", err);
  //   });

  await device
    .play("http://icecast.radiofrance.fr/fip-midfi.mp3")
    .then((success) => {
      console.log("Yeay");
    })
    .catch((err) => {
      console.log("Error occurred %j", err);
    });

  return favorites;
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
  getFavorites,
};
