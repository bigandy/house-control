const { Sonos } = require("sonos");
const { handleAll } = require("../utils/hue");

export default async (req, res) => {
  try {
    const statuses = await handleAll("toggle");

    res.status(200).json({
      name: "Hue All-Lights-Toggle",
      statuses: statuses.map((item) => {
        status: item.status.on;
      }),
    });
  } catch (e) {
    res.status(400).json({
      name: "Hue All-Lights-Toggle Error",
      error: e,
    });
  }
};
