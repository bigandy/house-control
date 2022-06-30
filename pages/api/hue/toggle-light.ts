import { toggleLight } from "../utils/hue";

export default async function handler(req, res) {
  const { lightId } = req.query;

  
  const result = await toggleLight(lightId);
  console.log({lightId, result})

  res.status(200).json({ result });
}
