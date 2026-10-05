"use strict";
/**
 * ====================================================================
 * ROTAS DE SENSORES
 * ====================================================================
 *
 * Arquivo: src/routes/sensors.ts
 * Função: Receber e gerenciar leituras de sensores (ESP32)
 *
 * Sensores Monitorados:
 * ├─ DHT22: temperatura e umidade (obrigatório)
 * ├─ Contador de Ovos: contagem de ovos (opcional)
 * └─ Sensor de Adubo: nível do coletor orgânico (opcional)
 *
 * Endpoints:
 * ├─ GET  /latest → retorna última leitura
 * └─ POST /data   → recebe nova leitura do ESP32
 *
 * Fluxo:
 * 1. ESP32 faz POST JSON para /api/v1/sensors/data
 * 2. Backend valida e salva no banco via Prisma
 * 3. Backend emite evento Socket.io "sensor:update" para frontend
 * 4. Frontend recebe em tempo real e atualiza dashboard
 * ====================================================================
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
async function getLatestReading() {
    const [latest, latestTemperature, latestHumidity, latestSoilHumidity] = await Promise.all([
        prisma_1.default.sensorReading.findFirst({ orderBy: { createdAt: 'desc' } }),
        prisma_1.default.sensorReading.findFirst({
            where: { temperature: { not: null } },
            orderBy: { createdAt: 'desc' },
        }),
        prisma_1.default.sensorReading.findFirst({
            where: { humidity: { not: null } },
            orderBy: { createdAt: 'desc' },
        }),
        prisma_1.default.sensorReading.findFirst({
            where: { soilHumidity: { not: null } },
            orderBy: { createdAt: 'desc' },
        }),
    ]);
    if (!latest)
        return null;
    return {
        ...latest,
        temperature: latestTemperature?.temperature ?? null,
        humidity: latestHumidity?.humidity ?? null,
        soilHumidity: latestSoilHumidity?.soilHumidity ?? null,
        temperatureCreatedAt: latestTemperature?.createdAt ?? null,
        humidityCreatedAt: latestHumidity?.createdAt ?? null,
        soilHumidityCreatedAt: latestSoilHumidity?.createdAt ?? null,
    };
}
/**
 * GET /api/v1/sensors/latest
 *
 * Retorna a ÚLTIMA leitura de sensor no banco
 *
 * Resposta de Sucesso (200):
 * {
 *   "id": 1,
 *   "temperature": 37.8,
 *   "humidity": 60,
 *   "eggs": 245,
 *   "fertilizer": 75,
 *   "createdAt": "2026-08-31T00:30:00Z"
 * }
 *
 * Resposta de Erro (500):
 * { "error": "failed to get latest reading" }
 */
router.get('/latest', async (req, res) => {
    try {
        const latest = await getLatestReading();
        res.json(latest);
    }
    catch (err) {
        res.status(500).json({ error: 'failed to get latest reading' });
    }
});
/**
 * POST /api/v1/sensors/data
 *
 * Recebe NOVA LEITURA do ESP32 e salva no banco
 *
 * Body JSON (esperado):
 * {
 *   "temperature": 37.8,        // obrigatório (float)
 *   "humidity": 60,             // obrigatório (float)
 *   "eggs": 245,                // opcional (int)
 *   "fertilizer": 75,           // opcional (int)
 *   "timestamp": "2026-08-31T00:30:00Z"  // opcional (ISO 8601)
 * }
 *
 * Resposta de Sucesso (200):
 * {
 *   "ok": true,
 *   "created": {
 *     "id": 1,
 *     "temperature": 37.8,
 *     ...
 *   }
 * }
 *
 * Resposta de Erro:
 * - 400: temperatura/umidade ausentes
 * - 500: erro ao salvar
 *
 * Efeito Colateral:
 * - Emite evento Socket.io "sensor:update" para todos os clientes
 *   (frontend conectado recebe atualização em tempo real)
 */
router.post('/data', async (req, res) => {
    try {
        const { temperature, humidity, soilHumidity, eggs, fertilizer, timestamp } = req.body ?? {};
        const hasTemperature = temperature !== undefined && temperature !== null;
        const hasHumidity = humidity !== undefined && humidity !== null;
        const hasSoilHumidity = soilHumidity !== undefined && soilHumidity !== null;
        if (!hasTemperature && !hasHumidity && !hasSoilHumidity) {
            return res.status(400).json({ error: 'at least one sensor reading is required' });
        }
        const data = {};
        if (hasTemperature) {
            const value = Number(temperature);
            if (!Number.isFinite(value)) {
                return res.status(400).json({ error: 'temperature must be a finite number' });
            }
            data.temperature = value;
        }
        if (hasHumidity) {
            const value = Number(humidity);
            if (!Number.isFinite(value) || value < 0 || value > 100) {
                return res.status(400).json({ error: 'humidity must be a number between 0 and 100' });
            }
            data.humidity = value;
        }
        if (hasSoilHumidity) {
            const value = Number(soilHumidity);
            if (!Number.isFinite(value) || value < 0 || value > 100) {
                return res.status(400).json({ error: 'soilHumidity must be a number between 0 and 100' });
            }
            data.soilHumidity = value;
        }
        if (eggs !== undefined && eggs !== null)
            data.eggs = Number(eggs);
        if (fertilizer !== undefined && fertilizer !== null)
            data.fertilizer = Number(fertilizer);
        if (timestamp) {
            const parsedTimestamp = new Date(timestamp);
            if (Number.isNaN(parsedTimestamp.getTime())) {
                return res.status(400).json({ error: 'timestamp must be a valid date' });
            }
            data.createdAt = parsedTimestamp;
        }
        const created = await prisma_1.default.sensorReading.create({ data });
        const io = req.app.get('io');
        if (io)
            io.emit('sensor:update', await getLatestReading());
        res.json({ ok: true, created });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to save sensor data' });
    }
});
exports.default = router;
