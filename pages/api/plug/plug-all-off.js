import { turnOff } from "tp-link-tapo-connect";
import { getAllPlugs } from "pages/api/plug/statuses";

export default async function handler(req, res) {
  try {
    const plugs = await getAllPlugs();

    Object.keys(plugs).forEach(async (plug) => {
      const token = plugs[plug].token;
      await turnOff(token);
    });

    const statusesOut = await getAllPlugs();

    res.status(200).json({
      statusesOut,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error", error });
  }
}
