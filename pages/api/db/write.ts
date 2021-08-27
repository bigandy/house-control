import prisma from "utils/database/prisma";

enum SensorType {
  INSIDE = "INSIDE",
  OUTSIDE = "OUTSIDE",
}

const saveData = async (
  temperature: number,
  humidity: number,
  type: SensorType
) => {
  try {
    const result = await prisma.sensorValue.create({
      data: {
        humidity: Number(humidity),
        temperature: Number(temperature),
        type,
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("no good came out of this function");
  }
};

export default async (req, res) => {
  const { temperature, humidity, type } = req.query;

  if (!temperature || !humidity || !type) {
    res.status(400).json({
      name: "DB Sensor Save",
      error: "need humidity, type, and temperature",
    });
  } else if (!Object.values(SensorType).includes(type.toUpperCase())) {
    res.status(400).json({
      name: "DB Sensor Save",
      error: "please provide a valid type",
    });
  } else {
    try {
      const result = await saveData(temperature, humidity, type);
      res.status(200).json({
        name: "DB Sensor Save",
        result,
      });
    } catch (e) {
      console.error("error in saving data", e);
      res.status(400).json({
        name: "DB Sensor Save",
        error: e,
      });
    }
  }
};
