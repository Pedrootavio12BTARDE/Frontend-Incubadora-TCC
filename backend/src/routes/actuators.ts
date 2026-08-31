import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET status
router.get('/status', async (req, res) => {
  try {
    // read last logs to infer status
    const lampLog = await prisma.actuatorLog.findFirst({ where: { actuator: 'lamp' }, orderBy: { createdAt: 'desc' } });
    const fanLog = await prisma.actuatorLog.findFirst({ where: { actuator: 'fan' }, orderBy: { createdAt: 'desc' } });
    res.json({ lamp: lampLog?.action || 'unknown', fan: fanLog?.action || 'unknown' });
  } catch (err) {
    res.status(500).json({ error: 'failed to get actuators status' });
  }
});

// PATCH lamp
router.patch('/lamp', async (req, res) => {
  try {
    const { on } = req.body;
    const payload = { actuator: 'lamp', action: on ? 'on' : 'off', payload: JSON.stringify({ on }) };
    const created = await prisma.actuatorLog.create({ data: payload });
    const io = req.app.get('io');
    if (io) io.emit('actuator:update', { actuator: 'lamp', action: on ? 'on' : 'off' });
    res.json({ ok: true, created });
  } catch (err) {
    res.status(500).json({ error: 'failed to update lamp' });
  }
});

// PATCH fan
router.patch('/fan', async (req, res) => {
  try {
    const { state } = req.body; // expected 'on'|'off'|'auto' etc
    const payload = { actuator: 'fan', action: state, payload: JSON.stringify({ state }) };
    const created = await prisma.actuatorLog.create({ data: payload });
    const io = req.app.get('io');
    if (io) io.emit('actuator:update', { actuator: 'fan', action: state });
    res.json({ ok: true, created });
  } catch (err) {
    res.status(500).json({ error: 'failed to update fan' });
  }
});

export default router;
