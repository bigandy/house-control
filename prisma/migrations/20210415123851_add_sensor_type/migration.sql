-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sensor_values" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "temperature" REAL,
    "humidity" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL DEFAULT 'inside'
);
INSERT INTO "new_sensor_values" ("id", "temperature", "humidity", "created_at", "updated_at") SELECT "id", "temperature", "humidity", "created_at", "updated_at" FROM "sensor_values";
DROP TABLE "sensor_values";
ALTER TABLE "new_sensor_values" RENAME TO "sensor_values";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
