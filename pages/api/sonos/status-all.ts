const { Sonos } = require("sonos");
const { handleAll } = require("../utils/sonos");

export default async (req, res) => {
  try {
    const statuses = await handleAll("status");

    res.status(200).json({
      name: "Hue All-Status",
      statuses,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      name: "Hue All-Status Error",
      error: e,
    });
  }
};
