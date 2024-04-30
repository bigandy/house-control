import { getAllPlugs } from "pages/api/plug/statuses";

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();

    Object.keys(plugs).forEach(async (plug) => {
      const device = plugs[plug].device;
      await device.turnOff();
    });

    const statusesOut = await getAllPlugs();

    res.status(200).json({
      statusesOut,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error", e });
  }
}
