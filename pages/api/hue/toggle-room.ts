const { toggleRoom } = require("../utils/hue");

export default async function handler(req, res) {
  const roomId = 1; // Office is id 1
  const on = await toggleRoom(roomId);

  res.status(200).json({
    name: "Toggle Room",
    on,
  });
}
