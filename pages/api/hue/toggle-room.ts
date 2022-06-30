import { toggleRoom } from "../utils/hue";

export default async function handler(req, res) {

  const { roomId } = req.query;

  
  if (!roomId) {
    res.status(400).json({
      message: 'no roomId'
    })
  }
  const on = await toggleRoom(roomId);

  res.status(200).json({
    name: "Toggle Room",
    on,
  });
}
