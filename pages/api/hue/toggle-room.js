const { toggleRoom } = require("../utils/hue");

export default async function handler(req, res) {
  const roomId = 0; // Office is id 0
  const on = await toggleRoom(roomId);

  res.status(200).json({
    name: "Toggle Room",
    on,
  });
}
