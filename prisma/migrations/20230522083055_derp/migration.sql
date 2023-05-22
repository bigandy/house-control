/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "accounts";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- RedefineIndex
DROP INDEX "sessions.access_token_unique";
CREATE UNIQUE INDEX "sessions_access_token_key" ON "sessions"("access_token");

-- RedefineIndex
DROP INDEX "sessions.session_token_unique";
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- RedefineIndex
DROP INDEX "users.email_unique";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
