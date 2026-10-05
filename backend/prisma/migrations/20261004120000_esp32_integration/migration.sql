-- Make sensor fields nullable so independent sensors can post separately.
CREATE TABLE "new_SensorReading" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "temperature" REAL,
    "humidity" REAL,
    "eggs" INTEGER,
    "fertilizer" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "new_SensorReading" ("id", "temperature", "humidity", "eggs", "fertilizer", "createdAt")
SELECT "id", "temperature", "humidity", "eggs", "fertilizer", "createdAt" FROM "SensorReading";

DROP TABLE "SensorReading";
ALTER TABLE "new_SensorReading" RENAME TO "SensorReading";

CREATE TABLE "ActuatorCommand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actuator" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" DATETIME
);

CREATE INDEX "ActuatorCommand_status_createdAt_idx" ON "ActuatorCommand"("status", "createdAt");