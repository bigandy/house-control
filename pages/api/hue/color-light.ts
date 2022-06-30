import { colorLight } from "../utils/hue";

export default async function handler(req, res) {
  try {
    const { lightId, color = null } = req.query;

    const result = await colorLight(lightId, color);

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: "bad color" });
  }
}
