const { Sonos } = require("sonos");
const { handleAll } = require("../utils/sonos");

export default async (req, res) => {
  const statuses = await handleAll("pause");

  res.status(200).json({
    name: "Sonos pause-all-rooms",
    statuses,
  });
};
