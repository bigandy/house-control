const {
  playRoom,
  statusRoom,
  pauseRoom,
  toggleRoom,
  setRoomVolume,
  toggleMute,
} = require("../utils/sonos");

export default async (req, res) => {
  const {
    query: { slug },
  } = req;

  console.log(req.query.volume);

  // get the method and the room
  const [method, room, ...rest] = slug;

  console.log(rest);
  let status = "";
  switch (method) {
    case "pause":
      status = await pauseRoom(room);
      break;
    case "play":
      status = await playRoom(room);
      break;
    case "toggle":
      status = await toggleRoom(room);
      break;
    case "status":
      status = await statusRoom(room).state;
      break;

    case "volume":
      status = await setRoomVolume(room, req.query.volume);
      break;
    case "mute":
      status = await toggleMute(room);
      break;

    default:
      status = "no known method";
      break;
  }

  res
    .status(200)
    .json({ name: "Sonos Catchall (optional?)", method, room, status });
};
