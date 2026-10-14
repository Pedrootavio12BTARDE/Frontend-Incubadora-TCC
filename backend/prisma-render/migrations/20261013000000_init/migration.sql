CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'operator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SensorReading" (
    "id" SERIAL NOT NULL,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "soilHumidity" DOUBLE PRECISION,
    "eggs" INTEGER,
    "fertilizer" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SensorReading_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActuatorLog" (
    "id" SERIAL NOT NULL,
    "actuator" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "payload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActuatorLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActuatorCommand" (
    "id" SERIAL NOT NULL,
    "actuator" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    CONSTRAINT "ActuatorCommand_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Production" (
    "id" SERIAL NOT NULL,
    "eggs" INTEGER NOT NULL DEFAULT 0,
    "lastColor" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Production_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "ActuatorCommand_status_createdAt_idx" ON "ActuatorCommand"("status", "createdAt");