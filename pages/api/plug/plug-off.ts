import { turnOff } from "tp-link-tapo-connect";
import { getAllPlugs } from "pages/api/plug/statuses";

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();

    const { room } = req.query;

    const plug = room || "4";

    await turnOff(plugs[plug].token);

    const statusesOut = await getAllPlugs();

    res.status(200).json({
      statusOut: statusesOut[plug].status,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error", e });
  }
}
