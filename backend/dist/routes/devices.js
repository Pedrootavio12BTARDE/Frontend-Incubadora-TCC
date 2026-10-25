"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_crypto_1 = require("node:crypto");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
const ONLINE_WINDOW_MS = 45_000;
const heartbeatLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    limit: 12,
    standardHeaders: true,
    legacyHeaders: false,
});
router.get('/safety-status', async (_req, res) => {
    try {
        const latest = await prisma_1.default.actuatorLog.findFirst({
            where: { actuator: 'thermal_safety' },
            orderBy: { createdAt: 'desc' },
        });
        const details = latest?.payload ? JSON.parse(latest.payload) : {};
        return res.json({
            protected: latest?.action === 'CRITICAL_OVERHEAT',
            state: latest?.action ?? null,
            temperature: typeof details.temperature === 'number' ? details.temperature : null,
            deviceId: details.deviceId ?? null,
            updatedAt: latest?.createdAt.toISOString() ?? null,
        });
    }
    catch (error) {
        console.error('Failed to load thermal safety status:', error);
        return res.status(500).json({ error: 'failed to load thermal safety status' });
    }
});
router.post('/thermal-alert', heartbeatLimiter, async (req, res) => {
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
    const deviceId = typeof req.body?.deviceId === 'string' ? req.body.deviceId.trim() : '';
    const state = req.body?.state;
    const temperature = Number(req.body?.temperature);
    if (!/^ESP32-[A-F0-9]{12}$/.test(deviceId)) {
        return res.status(400).json({ error: 'deviceId must contain the ESP32 MAC address' });
    }
    if (!Number.isFinite(temperature) || !['CRITICAL_OVERHEAT', 'THERMAL_PROTECTION_CLEARED'].includes(state)) {
        return res.status(400).json({ error: 'invalid thermal safety event' });
    }
    if (state === 'CRITICAL_OVERHEAT' && temperature < 39.5) {
        return res.status(400).json({ error: 'critical overheat event must be at least 39.5 C' });
    }
    if (state === 'THERMAL_PROTECTION_CLEARED' && temperature > 37.5) {
        return res.status(400).json({ error: 'thermal protection can clear only at or below 37.5 C' });
    }
    try {
        const latest = await prisma_1.default.actuatorLog.findFirst({
            where: { actuator: 'thermal_safety' },
            orderBy: { createdAt: 'desc' },
        });
        if (latest?.action === state)
            return res.json({ ok: true, unchanged: true, state, temperature });
        const payload = JSON.stringify({ deviceId, temperature });
        await prisma_1.default.$transaction(async (transaction) => {
            await transaction.actuatorLog.create({
                data: { actuator: 'thermal_safety', action: state, payload },
            });
            if (state === 'CRITICAL_OVERHEAT') {
                await transaction.actuatorLog.create({
                    data: { actuator: 'lamp', action: 'off', payload: JSON.stringify({ on: false, reason: state }) },
                });
            }
        });
        const event = {
            state,
            temperature,
            deviceId,
            timestamp: new Date().toISOString(),
        };
        const io = req.app.get('io');
        if (state === 'CRITICAL_OVERHEAT') {
            io?.emit('actuator:update', { actuator: 'lamp', action: 'off', protected: true });
            io?.emit('CRITICAL_OVERHEAT', event);
        }
        else {
            io?.emit('actuator:update', { actuator: 'lamp', action: 'off', protected: false });
            io?.emit('THERMAL_PROTECTION_CLEARED', event);
        }
        return res.json({ ok: true, ...event });
    }
    catch (error) {
        console.error('Failed to record thermal safety event:', error);
        return res.status(500).json({ error: 'failed to record thermal safety event' });
    }
});
router.post('/heartbeat', heartbeatLimiter, async (req, res) => {
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
    const deviceId = typeof req.body?.deviceId === 'string' ? req.body.deviceId.trim() : '';
    if (!/^ESP32-[A-F0-9]{12}$/.test(deviceId)) {
        return res.status(400).json({ error: 'deviceId must contain the ESP32 MAC address' });
    }
    try {
        const device = await prisma_1.default.device.upsert({
            where: { deviceId },
            create: { deviceId, lastSeenAt: new Date() },
            update: { lastSeenAt: new Date() },
        });
        const payload = {
            deviceId: device.deviceId,
            online: true,
            lastSeenAt: device.lastSeenAt.toISOString(),
        };
        req.app.get('io')?.emit('device:update', payload);
        return res.json(payload);
    }
    catch (error) {
        console.error('Failed to record ESP32 heartbeat:', error);
        return res.status(500).json({ error: 'failed to record device heartbeat' });
    }
});
router.get('/status', async (_req, res) => {
    try {
        const device = await prisma_1.default.device.findFirst({ orderBy: { lastSeenAt: 'desc' } });
        if (!device)
            return res.json({ deviceId: null, online: false, lastSeenAt: null });
        return res.json({
            deviceId: device.deviceId,
            online: Date.now() - device.lastSeenAt.getTime() <= ONLINE_WINDOW_MS,
            lastSeenAt: device.lastSeenAt.toISOString(),
        });
    }
    catch (error) {
        console.error('Failed to load ESP32 status:', error);
        return res.status(500).json({ error: 'failed to load device status' });
    }
});
exports.default = router;
