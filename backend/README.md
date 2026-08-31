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
