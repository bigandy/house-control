import prisma from "utils/database/prisma";
import { SensorValue } from "./../../../housecontrol-graphql";

const saveData = async (temperature: number, humidity: number) => {
  try {
    const result = await prisma.sensorValue.create({
      data: {
        humidity: Number(humidity),
        temperature: Number(temperature),
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("no good came out of this function");
  }
};

export default async (req, res) => {
  const { temperature, humidity } = req.query;

  if (!temperature || !humidity) {
    res.status(400).json({
      name: "DB Sensor Save",
      error: "need humidity and temperature",
    });
  } else {
    try {
      const result = await saveData(temperature, humidity);
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
