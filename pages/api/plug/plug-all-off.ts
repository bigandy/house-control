import { turnOff } from "tp-link-tapo-connect";
import { getAllPlugs } from "pages/api/plug/statuses";

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();

    Object.keys(plugs).forEach(async (plug) => {
      const {token} = plugs[plug];
      await turnOff(token);
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
