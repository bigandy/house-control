const { Sonos } = require("sonos");
const { handleAll } = require("../utils/hue");

export default async (req, res) => {
  try {
    const statuses = await handleAll("off");

    res.status(200).json({
      name: "Hue All-Lights-Off",
      statuses,
    });
  } catch (e) {
    res.status(400).json({
      name: "Hue All-Lights-Off Error",
      error: e,
    });
  }
};
