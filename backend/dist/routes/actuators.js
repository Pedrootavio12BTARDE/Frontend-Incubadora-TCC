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
const prisma_1 = __importDefault(require("../lib/prisma"));
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
        res.json({
            lamp: lampLog?.action || 'unknown',
            fan: fanLog?.action || 'unknown'
        });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to get actuators status' });
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
router.get('/commands/pending', async (_req, res) => {
    try {
        const commands = await prisma_1.default.actuatorCommand.findMany({
            where: { status: 'pending' },
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
router.patch('/lamp', async (req, res) => {
    try {
        const { on } = req.body;
        if (typeof on !== 'boolean') {
            return res.status(400).json({ error: 'on must be a boolean' });
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
router.post('/motor/rotate', async (req, res) => {
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
router.patch('/fan', async (req, res) => {
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
