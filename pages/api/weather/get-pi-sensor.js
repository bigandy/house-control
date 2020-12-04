import getSensorValues from "../utils/getSensorValues";

export default async function handler(req, res) {
  try {
    const { temperature, humidity } = await getSensorValues();

    res
      .status(200)
      .json({ message: "Get Pi Sensor Values", temperature, humidity });
  } catch (e) {
    console.error(e);
    throw new Error("error");
    res.status(400).json({
      message: "error in getting sensor values",
    });
  }
}
