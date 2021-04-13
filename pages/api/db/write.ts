import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Turn on verbose mode of sqlite3
sqlite3.verbose();

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

enum SensorType {
  "humidity",
  "temperature",
}

const saveData = async (value: number, type: SensorType) => {
  try {
    const db = await open({
      filename: "./sensor.db",
      driver: sqlite3.Database,
    });

    await db.exec(
      `CREATE TABLE IF NOT EXISTS sensor (
        id integer primary key autoincrement,
        timestamp DATE DEFAULT (datetime('now','localtime')),
        value INTEGER,
        type TEXT
      )`
    );

    await db.run(`INSERT INTO sensor VALUES (?, :timestamp, :value, :type)`, {
      ":timestamp": new Date(),
      ":value": value,
      ":type": type,
    });

    const result = await db.all("SELECT * FROM sensor");

    await db.close();

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("no good came out of this function");
  }
};

export default async (req, res) => {
  const { value, type } = req.query;

  if (!value || !type) {
    res.status(400).json({
      name: "DB Sensor Save",
      error: "need type and value",
    });
  } else {
    try {
      const result = await saveData(value, type);
      result.reverse();
      res.status(200).json({
        name: "DB Sensor Save",
        result,
      });
    } catch (e) {
      res.status(400).json({
        name: "DB Sensor Save",
        error: e,
      });
    }
  }
};
