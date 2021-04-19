import {
  playRoom,
  statusRoom,
  pauseRoom,
  toggleRoom,
  setRoomVolume,
  toggleMute,
} from "../utils/sonos";

export default async (req, res) => {
  const {
    query: { slug },
  } = req;

  // get the method and the room
  const [method, room] = slug;

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
    case "status": {
      const { state } = await statusRoom(room);
      status = state;
      break;
    }
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
