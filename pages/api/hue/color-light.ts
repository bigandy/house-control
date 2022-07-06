import { colorLight } from "../utils/hue";

import { runMiddleware, cors } from "pages/api/utils/cors";

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  try {
    const { lightId, color = null } = req.query;

    const result = await colorLight(lightId, color);

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: "bad color" });
  }
}
