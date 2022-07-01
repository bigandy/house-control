import { toggleLight } from "../utils/hue";

export default async function handler(req, res) {
  const { lightId } = req.query;

  const result = await toggleLight(lightId);

  res.status(200).json({ result });
}
