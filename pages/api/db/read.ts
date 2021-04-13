import prisma from "utils/database/prisma";
import { SensorValue } from "./../../../housecontrol-graphql";

const readData = async () => {
  try {
    const result = await prisma.sensorValue.findMany();

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("no good came out of this function");
  }
};

export default async (req, res) => {
  const result = await readData();
  result.reverse();
  res.status(200).json({
    name: "DB Results Read",
    result,
  });
};
