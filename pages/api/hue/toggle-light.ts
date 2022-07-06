import { toggleLight } from "../utils/hue";

import { runMiddleware, cors } from "pages/api/utils/cors";

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const { lightId } = req.query;

  const result = await toggleLight(lightId);

  res.status(200).json({ result });
}
