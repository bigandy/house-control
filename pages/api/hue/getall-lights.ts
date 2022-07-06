import { getAllLights } from "../utils/hue";

import { runMiddleware, cors } from "pages/api/utils/cors";

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const lights = await getAllLights();

  res.status(200).json({
    name: "Hue getall-lights",
    lights,
  });
}
