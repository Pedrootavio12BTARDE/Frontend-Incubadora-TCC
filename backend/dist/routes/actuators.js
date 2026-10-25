"use strict";
/**
 * ====================================================================
 * ROTAS DE ATUADORES
 * ====================================================================
 *
 * Arquivo: src/routes/actuators.ts
 * Função: Controlar e monitorar atuadores (lâmpada, ventilador)
 *
 * Atuadores Controláveis:
 * ├─ Lâmpada (Aquecimento): liga/desliga para manter temperatura
 * └─ Ventilador: circula ar e evita umidade excessiva
 *
 * Endpoints:
 * ├─ GET   /status  → retorna estado atual de lâmpada e ventilador
 * ├─ PATCH /lamp    → controla lâmpada (on/off)
 * └─ PATCH /fan     → controla ventilador (on/off/auto)
 *
 * Fluxo de Controle:
 * 1. Frontend (ou ESP32) envia PATCH com novo estado
 * 2. Backend registra ação em ActuatorLog (histórico)
 * 3. Backend emite Socket.io "actuator:update" em tempo real
 * 4. ESP32/Frontend recebe e executa a ação (se aplicável)
 * ====================================================================
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_crypto_1 = require("node:crypto");
const prisma_1 = __importDefault(require("../lib/prisma"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
/**
 * GET /api/v1/actuators/status
 *
 * Retorna o status ATUAL de lâmpada e ventilador
 * (baseia-se no último registro em ActuatorLog)
 *
 * Resposta (200):
 * {
 *   "lamp": "on" | "off" | "unknown",
 *   "fan": "on" | "off" | "auto" | "unknown"
 * }
 */
router.get('/status', async (req, res) => {
    try {
        // Busca último log de lâmpada e ventilador para inferir status
        const lampLog = await prisma_1.default.actuatorLog.findFirst({
            where: { actuator: 'lamp' },
            orderBy: { createdAt: 'desc' }
        });
        const fanLog = await prisma_1.default.actuatorLog.findFirst({
            where: { actuator: 'fan' },
            orderBy: { createdAt: 'desc' }
        });
        const coolerLog = await prisma_1.default.actuatorLog.findFirst({
            where: { actuator: 'cooler' },
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            lamp: lampLog?.action || 'unknown',
            fan: fanLog?.action || 'unknown',
            cooler: coolerLog?.action || 'unknown'
        });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to get actuators status' });
    }
});
router.post('/cooler/report', async (req, res) => {
    const configuredToken = process.env.ESP32_DEVICE_TOKEN;
    const providedToken = req.header('x-device-token');
    if (!configuredToken || configuredToken.length < 32) {
        return res.status(503).json({ error: 'device authentication is not configured' });
    }
    if (!providedToken)
        return res.status(401).json({ error: 'invalid device token' });
    const received = Buffer.from(providedToken);
    const expected = Buffer.from(configuredToken);
    if (received.length !== expected.length || !(0, node_crypto_1.timingSafeEqual)(received, expected)) {
        return res.status(401).json({ error: 'invalid device token' });
    }
    if (typeof req.body?.on !== 'boolean') {
        return res.status(400).json({ error: 'on must be a boolean' });
    }
    try {
        const action = req.body.on ? 'on' : 'off';
        const previous = await prisma_1.default.actuatorLog.findFirst({
            where: { actuator: 'cooler' },
            orderBy: { createdAt: 'desc' },
        });
        if (previous?.action !== action) {
            const created = await prisma_1.default.actuatorLog.create({
                data: { actuator: 'cooler', action, payload: JSON.stringify({ on: req.body.on }) },
            });
            req.app.get('io')?.emit('actuator:update', { actuator: 'cooler', action, timestamp: created.createdAt.toISOString() });
        }
        res.json({ ok: true, cooler: action });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to report cooler state' });
    }
});
router.get('/state', async (_req, res) => {
    try {
        const lampLog = await prisma_1.default.actuatorLog.findFirst({
            where: { actuator: 'lamp' },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ lamp: lampLog?.action === 'on' ? 'on' : 'off' });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to get actuator state' });
    }
});
router.get('/commands/pending', async (req, res) => {
    try {
        const commands = await prisma_1.default.actuatorCommand.findMany({
            where: { status: 'pending', ...(typeof req.query.actuator === 'string' ? { actuator: req.query.actuator } : {}) },
            orderBy: { createdAt: 'asc' },
            take: 20,
        });
        res.json({ commands });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to get pending actuator commands' });
    }
});
router.patch('/commands/:id/ack', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'command id must be a positive integer' });
        }
        const updated = await prisma_1.default.actuatorCommand.updateMany({
            where: { id, status: 'pending' },
            data: { status: 'completed', acknowledgedAt: new Date() },
        });
        if (updated.count === 0) {
            return res.status(404).json({ error: 'pending command not found' });
        }
        res.json({ ok: true, id, status: 'completed' });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to acknowledge actuator command' });
    }
});
/**
 * PATCH /api/v1/actuators/lamp
 *
 * Liga ou desliga a LÂMPADA (aquecimento)
 *
 * Body JSON (esperado):
 * { "on": true | false }
 *
 * Exemplo de Requisição:
 * PATCH /api/v1/actuators/lamp
 * { "on": true }
 *
 * Resposta (200):
 * {
 *   "ok": true,
 *   "created": {
 *     "id": 1,
 *     "actuator": "lamp",
 *     "action": "on",
 *     "payload": "{\"on\":true}",
 *     "createdAt": "2026-08-31T00:30:00Z"
 *   }
 * }
 *
 * Efeito Colateral:
 * - Emite Socket.io "actuator:update" → { actuator: 'lamp', action: 'on'|'off' }
 * - ESP32 pode ouvir e ativar/desativar GPIO da lâmpada
 */
router.patch('/lamp', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const { on } = req.body;
        if (typeof on !== 'boolean') {
            return res.status(400).json({ error: 'on must be a boolean' });
        }
        if (on) {
            const thermalState = await prisma_1.default.actuatorLog.findFirst({
                where: { actuator: 'thermal_safety' },
                orderBy: { createdAt: 'desc' },
            });
            if (thermalState?.action === 'CRITICAL_OVERHEAT') {
                return res.status(423).json({ error: 'lamp disabled by thermal safety protection' });
            }
        }
        // Cria registro de log
        const payload = {
            actuator: 'lamp',
            action: on ? 'on' : 'off',
            payload: JSON.stringify({ on })
        };
        const created = await prisma_1.default.actuatorLog.create({ data: payload });
        // Emite evento para clientes conectados (tempo real)
        const io = req.app.get('io');
        if (io)
            io.emit('actuator:update', { actuator: 'lamp', action: on ? 'on' : 'off' });
        res.json({ ok: true, created });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to update lamp' });
    }
});
router.get('/motor/mode', async (_req, res) => {
    try {
        const modeLog = await prisma_1.default.actuatorLog.findFirst({
            where: { actuator: 'motor_mode' },
            orderBy: { createdAt: 'desc' },
        });
        const autoRoll = modeLog?.action === 'on';
        res.json({ autoRoll, intervalHours: 4 });
    }
    catch (error) {
        res.status(500).json({ error: 'failed to load motor mode' });
    }
});
router.patch('/motor/mode', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const { autoRoll } = req.body;
        if (typeof autoRoll !== 'boolean') {
            return res.status(400).json({ error: 'autoRoll must be a boolean' });
        }
        await prisma_1.default.actuatorLog.create({
            data: {
                actuator: 'motor_mode',
                action: autoRoll ? 'on' : 'off',
                payload: JSON.stringify({ autoRoll, intervalHours: 4 }),
            },
        });
        const mode = { autoRoll, intervalHours: 4 };
        req.app.get('io')?.emit('actuator:update', {
            actuator: 'motor_mode',
            action: autoRoll ? 'on' : 'off',
            ...mode,
        });
        res.json({ ok: true, ...mode });
    }
    catch (error) {
        res.status(500).json({ error: 'failed to update motor mode' });
    }
});
router.post('/motor/rotate', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const durationMs = req.body?.durationMs === undefined ? 1000 : Number(req.body.durationMs);
        if (!Number.isInteger(durationMs) || durationMs < 100 || durationMs > 10000) {
            return res.status(400).json({ error: 'durationMs must be an integer between 100 and 10000' });
        }
        const command = await prisma_1.default.actuatorCommand.create({
            data: { actuator: 'motor', action: 'rotate', durationMs },
        });
        const io = req.app.get('io');
        if (io) {
            io.emit('actuator:update', {
                actuator: 'motor',
                action: 'rotate',
                commandId: command.id,
                durationMs: command.durationMs,
            });
        }
        res.status(201).json({ ok: true, command });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to queue motor rotation' });
    }
});
/**
 * PATCH /api/v1/actuators/fan
 *
 * Controla o VENTILADOR (circulação de ar)
 *
 * Body JSON (esperado):
 * { "state": "on" | "off" | "auto" | ... }
 *
 * Exemplo de Requisição:
 * PATCH /api/v1/actuators/fan
 * { "state": "auto" }
 *
 * Resposta (200):
 * {
 *   "ok": true,
 *   "created": {
 *     "id": 2,
 *     "actuator": "fan",
 *     "action": "auto",
 *     "payload": "{\"state\":\"auto\"}",
 *     "createdAt": "2026-08-31T00:30:00Z"
 *   }
 * }
 *
 * Efeito Colateral:
 * - Emite Socket.io "actuator:update" → { actuator: 'fan', action: 'on'|'off'|'auto' }
 * - ESP32 pode ajustar velocidade ou modo do ventilador
 */
router.patch('/fan', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const { state } = req.body; // expected 'on'|'off'|'auto' etc
        // Cria registro de log
        const payload = {
            actuator: 'fan',
            action: state,
            payload: JSON.stringify({ state })
        };
        const created = await prisma_1.default.actuatorLog.create({ data: payload });
        // Emite evento para clientes conectados (tempo real)
        const io = req.app.get('io');
        if (io)
            io.emit('actuator:update', { actuator: 'fan', action: state });
        res.json({ ok: true, created });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to update fan' });
    }
});
exports.default = router;
