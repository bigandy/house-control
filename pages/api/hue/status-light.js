const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const { statusLight } = require("../utils/hue");

export default async function handler(req, res) {
  try {
    const { state } = await statusLight();

    res.statusCode = 200;
    res.json({
      name: "Hue status-room",
      state,
    });
  } catch (error) {
    res.statusCode = 400;
    res.json({
      name: "Hue status-room-error",
      error,
    });
  }
}
