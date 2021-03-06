import getSensorValues from "../utils/getSensorValues";

export default async function handler(req, res) {
  try {
    const { temperature, humidity } = await getSensorValues();

    console.log({ temperature, humidity });

    res
      .status(200)
      .json({ message: "Get Pi Sensor Values", temperature, humidity });
  } catch (e) {
    console.error("error in get-pi-sensor", e); 
    throw new Error('error in get-pi-sensor')
  }
}
