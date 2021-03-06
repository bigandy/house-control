import { getAllLights } from "../utils/hue";

export default async function handler(req, res) {
  const lights = await getAllLights();

  res.status(200).json({
    name: "Hue getall-lights",
    lights,
  });
}
