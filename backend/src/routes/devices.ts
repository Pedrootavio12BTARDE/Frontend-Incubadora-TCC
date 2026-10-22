import { Router } from 'express';
import { timingSafeEqual } from 'node:crypto';
import rateLimit from 'express-rate-limit';
import prisma from '../lib/prisma';

const router = Router();
const ONLINE_WINDOW_MS = 45_000;
const heartbeatLimiter = rateLimit({
  windowMs: 60_000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/heartbeat', heartbeatLimiter, async (req, res) => {
  const configuredToken = process.env.ESP32_DEVICE_TOKEN;
  const providedToken = req.header('x-device-token');

  if (!configuredToken || configuredToken.length < 32) {
    return res.status(503).json({ error: 'device authentication is not configured' });
  }
  if (!providedToken) return res.status(401).json({ error: 'invalid device token' });

  const received = Buffer.from(providedToken);
  const expected = Buffer.from(configuredToken);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return res.status(401).json({ error: 'invalid device token' });
  }

  const deviceId = typeof req.body?.deviceId === 'string' ? req.body.deviceId.trim() : '';
  if (!/^ESP32-[A-F0-9]{12}$/.test(deviceId)) {
    return res.status(400).json({ error: 'deviceId must contain the ESP32 MAC address' });
  }

  try {
    const device = await prisma.device.upsert({
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
  } catch (error) {
    console.error('Failed to record ESP32 heartbeat:', error);
    return res.status(500).json({ error: 'failed to record device heartbeat' });
  }
});

router.get('/status', async (_req, res) => {
  try {
    const device = await prisma.device.findFirst({ orderBy: { lastSeenAt: 'desc' } });
    if (!device) return res.json({ deviceId: null, online: false, lastSeenAt: null });

    return res.json({
      deviceId: device.deviceId,
      online: Date.now() - device.lastSeenAt.getTime() <= ONLINE_WINDOW_MS,
      lastSeenAt: device.lastSeenAt.toISOString(),
    });
  } catch (error) {
    console.error('Failed to load ESP32 status:', error);
    return res.status(500).json({ error: 'failed to load device status' });
  }
});

export default router;