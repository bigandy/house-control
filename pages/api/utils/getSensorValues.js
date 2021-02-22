const sensor = require("node-dht-sensor").promises;

async function getSensorValues() {
  try {
    const { temperature, humidity } = await sensor.read(22, 26);
    // console.log(
    //   `temp: ${temperature.toFixed(1)}°C, ` +
    //     `humidity: ${humidity.toFixed(1)}%`
    // );

    return {
      temperature,
      humidity,
    };
  } catch (err) {
    // console.error("Failed to read sensor data:", err);
    throw new Error(err);
  }
}

module.exports = getSensorValues;
