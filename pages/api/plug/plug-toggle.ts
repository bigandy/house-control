import { turnOff, turnOn } from "tp-link-tapo-connect";
import { getAllPlugs } from "pages/api/plug/statuses";

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();

    const { room } = req.query;

    const plug = room || "4";

    if (plugs[plug].status === false) {
      await turnOn(plugs[plug].token);
    } else {
      await turnOff(plugs[plug].token);
    }

    const statusesOut = await getAllPlugs();

    res.status(200).json({
      success: true,
      plug,
      statusOut: statusesOut[plug].status,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: "Error", e });
  }
}
