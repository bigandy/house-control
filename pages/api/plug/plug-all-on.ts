import { turnOn } from "tp-link-tapo-connect";
import { getAllPlugs } from "pages/api/plug/statuses";

export default async function handler(req, res) {
  try {
    const statuses = await getAllPlugs();

    Object.keys(statuses).forEach(async (status) => {
      const token = statuses[status].token;
      await turnOn(token);
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
