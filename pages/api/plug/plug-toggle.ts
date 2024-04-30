import { getAllPlugs } from "pages/api/plug/statuses";

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();

    const { room } = req.query;

    const plug = room || "4";

    const device = plugs[plug].device;

    if (plugs[plug].status === false) {
      await device.turnOn();
    } else {
      await device.turnOff();
    }

    const statusesOut = await getAllPlugs();

    res.status(200).json({
      plug,
      statusOut: statusesOut[plug].status,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error", e });
  }
}
