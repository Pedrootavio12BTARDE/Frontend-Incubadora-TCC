import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET latest sensor reading
router.get('/latest', async (req, res) => {
  try {
    const latest = await prisma.sensorReading.findFirst({ orderBy: { createdAt: 'desc' } });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'failed to get latest reading' });
  }
});

// POST sensor data (from ESP32)
router.post('/data', async (req, res) => {
  try {
    const { temperature, humidity, eggs, fertilizer, timestamp } = req.body;
    // Basic validation
    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({ error: 'temperature and humidity are required' });
    }

    const data: any = {
      temperature: Number(temperature),
      humidity: Number(humidity),
    };
    if (eggs !== undefined && eggs !== null) data.eggs = Number(eggs);
    if (fertilizer !== undefined && fertilizer !== null) data.fertilizer = Number(fertilizer);
    if (timestamp) data.createdAt = new Date(timestamp);

    const created = await prisma.sensorReading.create({ data });

    // emit socket event
    const io = req.app.get('io');
    if (io) io.emit('sensor:update', created);

    res.json({ ok: true, created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to save sensor data' });
  }
});

export default router;
