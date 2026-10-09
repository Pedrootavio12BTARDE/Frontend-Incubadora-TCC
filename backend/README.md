# EcoIncubadora - Backend

This backend is a TypeScript + Express API with Prisma and Socket.io designed to integrate with the React frontend and ESP32 devices.

Quick start:

```bash
cd backend
npm install
cp .env.example .env
# adjust .env if needed
npm run prisma:generate
npm run dev
```

APIs live under `/api/v1/*` and WebSocket events are emitted on connect for `sensor:update` and `actuator:update`.

## ESP32 integration

Send each sensor reading to `POST /api/v1/sensors/data`. Temperature and humidity
may be sent together or separately:

```json
{ "temperature": 37.5 }
```

```json
{ "humidity": 60 }
```

The soil/manure sensor is stored as a percentage in `soilHumidity`:

```json
{ "soilHumidity": 58.2 }
```

The ESP32 can poll `GET /api/v1/actuators/state` for the desired lamp state.
The response is `{ "lamp": "on" }` or `{ "lamp": "off" }`; treat the initial
state as off. The cooler is not managed by this API.

To rotate the motor, the site should enqueue a command with
`POST /api/v1/actuators/motor/rotate`, optionally sending `{ "durationMs": 1000 }`.
The duration must be between 100 and 10000 milliseconds. The ESP32 polls
`GET /api/v1/actuators/commands/pending`, runs each returned command once, then
confirms it with `PATCH /api/v1/actuators/commands/:id/ack`. Keep the command ID
locally until acknowledged; persist/deduplicate processed IDs on the ESP32 so a
repeated poll does not cause a second rotation.

In the current dashboard, **Ativar Rolagem** requests a 3000 ms rotation. The
firmware drives the motor relay on GPIO23, active LOW, and stops it with
`millis()` rather than blocking delays. Connect the DC motor through the relay
contacts and its 5 V supply; do not power it from an ESP32 GPIO.

Use the backend's reachable LAN address while testing locally, then its HTTPS
domain in production. Do not expose the database port to the ESP32; only the API
should be reachable from the device. The API routes currently do not enforce
authentication, so protect them before exposing the backend publicly.

Apply the new database migration before restarting the backend:

```bash
cd backend
npm run prisma:migrate:deploy
npm run prisma:generate
```
