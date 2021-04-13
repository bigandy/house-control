import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Turn on verbose mode of sqlite3
sqlite3.verbose();

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// this is a top-level await
const readData = async () => {
  try {
    // open the database
    const db = await open({
      filename: "./sensor.db",
      driver: sqlite3.Database,
    });

    await db.exec(
      "CREATE TABLE IF NOT EXISTS sensor (created_at TEXT, value INTEGER, type TEXT)"
    );

    const result = await db.all("SELECT * FROM sensor");

    await db.close();

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
