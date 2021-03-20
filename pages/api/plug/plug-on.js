import { turnOn } from "tp-link-tapo-connect";
import { getAllPlugs } from "pages/api/plug/statuses";

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();

    const { room } = req.query;

    const plug = room || "4";

    await turnOn(plugs[plug].token);

    const statusesOut = await getAllPlugs();

    res.status(200).json({
      statusOut: statusesOut[plug].status,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error", error });
  }
}
