/*
  Warnings:

  - You are about to drop the `verification_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "verification_requests";
PRAGMA foreign_keys=on;
