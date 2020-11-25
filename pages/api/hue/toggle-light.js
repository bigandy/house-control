import { toggleLight } from "../utils/hue";

export default async function handler(req, res) {
  const result = await toggleLight();

  res.status(200).json({ result });
}
